export const runtime = "nodejs";

type BridgeAction = "health" | "envStatus" | "setEnv" | "refreshProject" | "stopServer" | "startServer";

const bridgeUrl = process.env.ROWDYROOM_BRIDGE_URL || "http://127.0.0.1:4777";
const bridgeToken = process.env.ROWDYROOM_BRIDGE_TOKEN || "";

const allowedEnvNames = new Set([
  "OPENAI_API_KEY",
  "ANTHROPIC_API_KEY",
  "XAI_API_KEY",
  "GEMINI_API_KEY",
  "YOUTUBE_API_KEY",
  "YOUTUBE_SEARCH_DAILY_LIMIT",
  "YOUTUBE_SEARCH_PEAK_PER_MINUTE",
  "SUPABASE_URL",
  "SUPABASE_SERVICE_ROLE_KEY",
  "OPENAI_MODEL",
  "ANTHROPIC_MODEL",
  "XAI_MODEL",
  "GEMINI_MODEL",
  "OLLAMA_BASE_URL",
]);

function pathFor(action: BridgeAction) {
  if (action === "health") return "/health";
  if (action === "envStatus") return "/env/status";
  if (action === "setEnv") return "/env/set";
  if (action === "refreshProject") return "/project/refresh";
  if (action === "stopServer") return "/server/stop";
  if (action === "startServer") return "/server/start";
  return "/health";
}

async function callBridge(action: BridgeAction, body?: Record<string, unknown>) {
  const isGet = action === "health" || action === "envStatus";
  const response = await fetch(`${bridgeUrl}${pathFor(action)}`, {
    method: isGet ? "GET" : "POST",
    headers: {
      "content-type": "application/json",
      "x-rowdyroom-token": bridgeToken,
    },
    body: isGet ? undefined : JSON.stringify(body ?? {}),
  });

  const text = await response.text();
  const json = text ? JSON.parse(text) : {};
  return Response.json(json, { status: response.status });
}

export async function GET() {
  try {
    return await callBridge("health");
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : "Local bridge unavailable." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { action?: unknown; name?: unknown; value?: unknown; port?: unknown } | null;
  const action = typeof body?.action === "string" ? body.action as BridgeAction : "health";

  try {
    if (!bridgeToken && action !== "health") {
      return Response.json({ ok: false, error: "ROWDYROOM_BRIDGE_TOKEN is missing from local .env.local." }, { status: 400 });
    }

    if (action === "setEnv") {
      const name = typeof body?.name === "string" ? body.name.trim() : "";
      const value = typeof body?.value === "string" ? body.value : "";
      if (!allowedEnvNames.has(name)) {
        return Response.json({ ok: false, error: "That environment variable is not approved for bridge updates." }, { status: 400 });
      }
      return await callBridge("setEnv", { name, value });
    }

    if (action === "startServer") {
      const port = typeof body?.port === "number" ? body.port : 3000;
      return await callBridge("startServer", { port });
    }

    if (["health", "envStatus", "refreshProject", "stopServer"].includes(action)) {
      return await callBridge(action);
    }

    return Response.json({ ok: false, error: "Unknown local bridge action." }, { status: 400 });
  } catch (error) {
    return Response.json({ ok: false, error: error instanceof Error ? error.message : "Local bridge request failed." }, { status: 500 });
  }
}
