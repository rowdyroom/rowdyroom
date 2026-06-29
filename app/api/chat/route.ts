export const runtime = "nodejs";

type TaskKind = "planning" | "coding" | "review" | "research" | "streamHost" | "vision" | "voice" | "privateLocal";
type ProviderId = "openai" | "anthropic" | "xai" | "gemini" | "ollama";

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

type ProviderRoute = {
  provider: ProviderId;
  model: string;
};

const routes: Record<TaskKind, ProviderRoute> = {
  planning: { provider: "openai", model: "gpt-4.1-mini" },
  coding: { provider: "anthropic", model: "claude-opus-4.1" },
  review: { provider: "anthropic", model: "claude-opus-4.1" },
  research: { provider: "gemini", model: "gemini-2.5-pro" },
  streamHost: { provider: "xai", model: "grok-4" },
  vision: { provider: "gemini", model: "gemini-2.5-pro" },
  voice: { provider: "xai", model: "grok-4" },
  privateLocal: { provider: "ollama", model: "llama3.1" },
};

const providerEnv: Record<ProviderId, string | null> = {
  openai: "OPENAI_API_KEY",
  anthropic: "ANTHROPIC_API_KEY",
  xai: "XAI_API_KEY",
  gemini: "GEMINI_API_KEY",
  ollama: null,
};

const allowedTasks = new Set<TaskKind>(Object.keys(routes) as TaskKind[]);

function normalizeTask(value: unknown): TaskKind {
  if (typeof value === "string" && allowedTasks.has(value as TaskKind)) return value as TaskKind;
  return "planning";
}

function getApiKey(provider: ProviderId): string | undefined {
  const envName = providerEnv[provider];
  if (!envName) return undefined;
  return process.env[envName];
}

function missingKeyMessage(provider: ProviderId): string | null {
  const envName = providerEnv[provider];
  if (!envName) return null;
  return `Missing ${envName}. Add it to your local environment file and restart the server.`;
}

function extractOpenAiText(json: any): string {
  const content = json?.choices?.[0]?.message?.content;
  if (typeof content === "string") return content;
  if (Array.isArray(content)) return content.map((part) => part?.text ?? "").filter(Boolean).join("\n");
  return "";
}

function extractAnthropicText(json: any): string {
  if (!Array.isArray(json?.content)) return "";
  return json.content.map((part: { text?: string }) => part.text ?? "").filter(Boolean).join("\n");
}

async function callOpenAiCompatible(args: {
  provider: ProviderId;
  baseUrl: string;
  apiKey: string;
  model: string;
  messages: ChatMessage[];
}) {
  const response = await fetch(`${args.baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      authorization: `Bearer ${args.apiKey}`,
    },
    body: JSON.stringify({
      model: args.model,
      messages: args.messages,
      temperature: 0.35,
      max_tokens: 900,
    }),
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(json?.error?.message ?? text ?? `${args.provider} request failed.`);
  }

  return extractOpenAiText(json);
}

async function callAnthropic(args: { apiKey: string; model: string; messages: ChatMessage[] }) {
  const system = args.messages.filter((message) => message.role === "system").map((message) => message.content).join("\n\n");
  const messages = args.messages
    .filter((message) => message.role !== "system")
    .map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: message.content,
    }));

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": args.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: args.model,
      max_tokens: 900,
      temperature: 0.35,
      system,
      messages,
    }),
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(json?.error?.message ?? text ?? "Anthropic request failed.");
  }

  return extractAnthropicText(json);
}

async function callProvider(route: ProviderRoute, messages: ChatMessage[]) {
  const key = getApiKey(route.provider);
  const missing = missingKeyMessage(route.provider);

  if (missing && !key) {
    throw new Error(missing);
  }

  if (route.provider === "openai") {
    return callOpenAiCompatible({ provider: route.provider, baseUrl: "https://api.openai.com/v1", apiKey: key!, model: route.model, messages });
  }

  if (route.provider === "xai") {
    return callOpenAiCompatible({ provider: route.provider, baseUrl: "https://api.x.ai/v1", apiKey: key!, model: route.model, messages });
  }

  if (route.provider === "gemini") {
    return callOpenAiCompatible({ provider: route.provider, baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai", apiKey: key!, model: route.model, messages });
  }

  if (route.provider === "anthropic") {
    return callAnthropic({ apiKey: key!, model: route.model, messages });
  }

  throw new Error("Ollama chat is not wired yet. Use ChatGPT, Claude, Grok, or Gemini for now.");
}

function safeMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unknown provider error.";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { message?: unknown; task?: unknown } | null;
  const userMessage = typeof body?.message === "string" ? body.message.trim() : "";
  const task = normalizeTask(body?.task);
  const route = routes[task];

  if (!userMessage) {
    return Response.json({ ok: false, error: "Message is required." }, { status: 400 });
  }

  const messages: ChatMessage[] = [
    {
      role: "system",
      content: "You are Rowdy Room Mission Control. Be direct, practical, and focused on helping operate the Rowdy Room AI engine.",
    },
    {
      role: "user",
      content: userMessage,
    },
  ];

  try {
    const text = await callProvider(route, messages);

    return Response.json({
      ok: true,
      task,
      provider: route.provider,
      model: route.model,
      text,
    });
  } catch (error) {
    const errorText = safeMessage(error);
    const missingKey = errorText.includes("Missing ");

    return Response.json(
      {
        ok: false,
        task,
        provider: route.provider,
        model: route.model,
        error: errorText,
        hint: missingKey ? "Create or update your local .env.local file, then restart npm run dev." : "Check the terminal output and provider setup.",
      },
      { status: missingKey ? 400 : 500 }
    );
  }
}
