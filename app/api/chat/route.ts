import {
  buildDefaultProviderRegistry,
  createRoutedCompletionService,
  defaultRouterPolicy,
  type ModelMessage,
  type TaskKind,
} from "../../../packages/ai-router/src/index";

export const runtime = "nodejs";

const allowedTasks = new Set<TaskKind>([
  "planning",
  "coding",
  "review",
  "research",
  "streamHost",
  "vision",
  "voice",
  "privateLocal",
]);

function normalizeTask(value: unknown): TaskKind {
  if (typeof value === "string" && allowedTasks.has(value as TaskKind)) {
    return value as TaskKind;
  }

  return "planning";
}

function safeMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Unknown provider error.";
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { message?: unknown; task?: unknown } | null;
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  const task = normalizeTask(body?.task);

  if (!message) {
    return Response.json({ ok: false, error: "Message is required." }, { status: 400 });
  }

  const providers = buildDefaultProviderRegistry();
  const service = createRoutedCompletionService(defaultRouterPolicy, providers);

  const messages: ModelMessage[] = [
    {
      role: "system",
      content:
        "You are Rowdy Room Mission Control. Be direct, practical, and focused on helping operate the Rowdy Room AI engine.",
    },
    {
      role: "user",
      content: message,
    },
  ];

  try {
    const response = await service.complete(
      { task },
      {
        messages,
        temperature: 0.35,
        maxTokens: 900,
      }
    );

    return Response.json({
      ok: true,
      task,
      provider: response.provider,
      model: response.model,
      text: response.text,
    });
  } catch (error) {
    const messageText = safeMessage(error);
    const missingKey = messageText.includes("Missing ");

    return Response.json(
      {
        ok: false,
        task,
        error: messageText,
        hint: missingKey
          ? "Add the matching API key to your local .env file, then restart npm run dev."
          : "Check the provider configuration and terminal error output.",
      },
      { status: missingKey ? 400 : 500 }
    );
  }
}
