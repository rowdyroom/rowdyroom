import { NextRequest, NextResponse } from "next/server";
import { validateRumbleResults } from "../../../lib/panel-contract.js";

export const dynamic = "force-dynamic";

type JsonObject = Record<string, unknown>;

const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function configuration() {
  const url = process.env.SUPABASE_URL?.replace(/\/$/, "");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) return null;
  return { url, serviceKey };
}

function cleanText(value: unknown, maximum = 160) {
  return typeof value === "string" ? value.trim().slice(0, maximum) : "";
}

function requireSessionToken(value: unknown) {
  const token = cleanText(value, 200);
  if (token.length < 16) throw new Error("A valid host session is required.");
  return token;
}

function enforceLoginLimit(request: NextRequest) {
  const address = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const now = Date.now();
  const current = loginAttempts.get(address);
  if (!current || current.resetAt <= now) {
    loginAttempts.set(address, { count: 1, resetAt: now + 10 * 60_000 });
    return;
  }
  if (current.count >= 10) throw new Error("Too many login attempts. Wait ten minutes and try again.");
  current.count += 1;
}

async function callRpc(functionName: string, parameters: JsonObject = {}) {
  const configured = configuration();
  if (!configured) throw new Error("Panel controls are not configured on this Mission Control server.");

  const response = await fetch(`${configured.url}/rest/v1/rpc/${functionName}`, {
    method: "POST",
    cache: "no-store",
    headers: {
      apikey: configured.serviceKey,
      authorization: `Bearer ${configured.serviceKey}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(parameters),
  });
  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message = payload && typeof payload.message === "string" ? payload.message : `Panel request failed (${response.status}).`;
    throw new Error(message);
  }
  return payload;
}

async function currentPanel() {
  return callRpc("rr_get_panel_status");
}

function errorResponse(error: unknown, status = 400) {
  const message = error instanceof Error ? error.message : "Panel request failed.";
  const configurationProblem = message.includes("not configured");
  return NextResponse.json({ ok: false, message }, { status: configurationProblem ? 503 : status });
}

export async function GET() {
  try {
    return NextResponse.json({ ok: true, panel: await currentPanel() });
  } catch (error) {
    return errorResponse(error, 502);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as JsonObject;
    const action = cleanText(body.action, 40);
    let result: unknown;

    switch (action) {
      case "login": {
        enforceLoginLimit(request);
        const adminKey = cleanText(body.adminKey, 256);
        const sessionToken = requireSessionToken(body.sessionToken);
        if (!adminKey) throw new Error("Enter the host password.");
        result = await callRpc("rr_host_login", {
          p_admin_key: adminKey,
          p_session_token: sessionToken,
          p_locked_by: cleanText(body.lockedBy, 120) || null,
        });
        break;
      }
      case "heartbeat":
        result = await callRpc("rr_host_heartbeat", { p_session_token: requireSessionToken(body.sessionToken) });
        break;
      case "start-show":
        result = await callRpc("rr_host_start_panel_show", {
          p_session_token: requireSessionToken(body.sessionToken),
          p_started_at: null,
        });
        break;
      case "refresh":
        result = await callRpc("rr_host_refresh_panel", { p_session_token: requireSessionToken(body.sessionToken) });
        break;
      case "advance":
        result = await callRpc("rr_host_advance_panel", { p_session_token: requireSessionToken(body.sessionToken) });
        break;
      case "activate-rumble": {
        const challengers = Array.isArray(body.challengers)
          ? body.challengers.map((name) => cleanText(name, 120)).filter(Boolean).slice(0, 16)
          : [];
        result = await callRpc("rr_host_activate_rumble", {
          p_session_token: requireSessionToken(body.sessionToken),
          p_challenger_names: challengers,
          p_activated_by: cleanText(body.activatedBy, 120) || "host",
        });
        break;
      }
      case "finalize-rumble": {
        const validated = validateRumbleResults(body.results);
        if (!validated.ok) throw new Error(validated.message);
        result = await callRpc("rr_host_finalize_rumble", {
          p_session_token: requireSessionToken(body.sessionToken),
          p_results: validated.results,
          p_team_result: cleanText(body.teamResult, 120) || null,
        });
        break;
      }
      case "cancel-rumble":
        result = await callRpc("rr_host_cancel_rumble", {
          p_session_token: requireSessionToken(body.sessionToken),
          p_reason: cleanText(body.reason, 240) || "Cancelled by host.",
        });
        break;
      case "link-identity":
        result = await callRpc("rr_host_link_panel_identity", {
          p_session_token: requireSessionToken(body.sessionToken),
          p_singer_id: cleanText(body.singerId, 64),
          p_tiktok_username: cleanText(body.tiktokUsername, 120),
        });
        break;
      default:
        throw new Error("Unknown panel action.");
    }

    const panel = action === "heartbeat" || action === "login" ? undefined : await currentPanel();
    return NextResponse.json({ ok: true, result, ...(panel ? { panel } : {}) });
  } catch (error) {
    return errorResponse(error);
  }
}

