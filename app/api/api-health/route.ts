export const runtime = "nodejs";

type ProviderId = "openai" | "anthropic" | "xai" | "gemini" | "youtube";

type ProviderConfig = {
  id: ProviderId;
  name: string;
  env: string;
  modelEnv?: string;
  testNote: string;
};

const providers: ProviderConfig[] = [
  { id: "openai", name: "ChatGPT / OpenAI", env: "OPENAI_API_KEY", modelEnv: "OPENAI_MODEL", testNote: "Checks the OpenAI models endpoint without sending a chat prompt." },
  { id: "anthropic", name: "Claude / Anthropic", env: "ANTHROPIC_API_KEY", modelEnv: "ANTHROPIC_MODEL", testNote: "Checks the Anthropic models endpoint without sending a chat prompt." },
  { id: "xai", name: "Grok / xAI", env: "XAI_API_KEY", modelEnv: "XAI_MODEL", testNote: "Checks the xAI models endpoint without sending a chat prompt." },
  { id: "gemini", name: "Gemini", env: "GEMINI_API_KEY", modelEnv: "GEMINI_MODEL", testNote: "Checks the Gemini models endpoint without sending a chat prompt." },
  { id: "youtube", name: "YouTube Data API", env: "YOUTUBE_API_KEY", testNote: "Checks a low-cost YouTube endpoint. Do not spam this test during a show." },
];

function keyStatus(provider: ProviderConfig) {
  return {
    id: provider.id,
    name: provider.name,
    env: provider.env,
    configured: Boolean(process.env[provider.env]),
    modelEnv: provider.modelEnv ?? null,
    model: provider.modelEnv ? process.env[provider.modelEnv] ?? "default" : null,
    testNote: provider.testNote,
  };
}

async function parseResponse(response: Response) {
  const text = await response.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { raw: text.slice(0, 500) };
  }
}

async function testProvider(id: ProviderId) {
  const provider = providers.find((item) => item.id === id);
  if (!provider) return { ok: false, id, error: "Unknown provider." };

  const key = process.env[provider.env];
  if (!key) {
    return { ok: false, id, name: provider.name, error: `Missing ${provider.env}.` };
  }

  let response: Response;

  if (id === "openai") {
    response = await fetch("https://api.openai.com/v1/models", {
      headers: { authorization: `Bearer ${key}` },
    });
  } else if (id === "anthropic") {
    response = await fetch("https://api.anthropic.com/v1/models?limit=1", {
      headers: { "x-api-key": key, "anthropic-version": "2023-06-01" },
    });
  } else if (id === "xai") {
    response = await fetch("https://api.x.ai/v1/models", {
      headers: { authorization: `Bearer ${key}` },
    });
  } else if (id === "gemini") {
    response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${encodeURIComponent(key)}`);
  } else {
    response = await fetch(`https://www.googleapis.com/youtube/v3/i18nLanguages?part=snippet&hl=en_US&key=${encodeURIComponent(key)}`);
  }

  const json = await parseResponse(response);
  const errorMessage = json?.error?.message ?? json?.error?.status ?? json?.raw ?? `${provider.name} returned HTTP ${response.status}.`;

  return {
    ok: response.ok,
    id,
    name: provider.name,
    status: response.status,
    statusText: response.statusText,
    error: response.ok ? null : errorMessage,
    checkedAt: new Date().toISOString(),
  };
}

export async function GET() {
  return Response.json({
    ok: true,
    providers: providers.map(keyStatus),
    youtubeQuotaPlan: {
      dailyDefaultUnits: 10000,
      searchListDefaultCallsPerDay: 100,
      searchListCost: 1,
      safeShowRule: "Do not use live YouTube search for every viewer request. Cache and reuse results during shows.",
    },
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { provider?: unknown } | null;
  const provider = typeof body?.provider === "string" ? body.provider : "all";

  if (provider === "all") {
    const results = [];
    for (const item of providers) {
      results.push(await testProvider(item.id));
    }
    return Response.json({ ok: results.every((result) => result.ok), results });
  }

  return Response.json(await testProvider(provider as ProviderId));
}
