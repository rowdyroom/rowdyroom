export const runtime = "nodejs";

type StatusItem = {
  name: string;
  ok: boolean;
  detail: string;
  href?: string;
};

async function localJson(path: string) {
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const response = await fetch(`${base}${path}`, { cache: "no-store" });
  if (!response.ok) throw new Error(`${path} returned ${response.status}`);
  return response.json();
}

async function safeCheck(name: string, href: string, run: () => Promise<{ ok: boolean; detail: string }>): Promise<StatusItem> {
  try {
    const result = await run();
    return { name, href, ok: result.ok, detail: result.detail };
  } catch (error) {
    return { name, href, ok: false, detail: error instanceof Error ? error.message : "Check failed." };
  }
}

export async function GET() {
  const checks = await Promise.all([
    safeCheck("PC Helper", "#local-bridge", async () => {
      const json = await localJson("/api/local-bridge");
      return { ok: Boolean(json.ok), detail: json.ok ? `${json.bridge ?? "Bridge"} on port ${json.port ?? 4777}` : json.error ?? "Bridge not ready" };
    }),
    safeCheck("Mission Memory", "#mission-memory", async () => {
      const json = await localJson("/api/memory");
      const count = Array.isArray(json.entries) ? json.entries.length : 0;
      return { ok: Boolean(json.ok), detail: `${json.storage ?? "local"} / ${count} saved entries` };
    }),
    safeCheck("Supabase Memory", "#supabase-setup", async () => {
      const json = await localJson("/api/memory/health");
      const ready = Boolean(json.supabase?.ok);
      return { ok: ready, detail: ready ? "Supabase sync ready" : json.supabase?.error ?? "Local memory only" };
    }),
    safeCheck("Songfinder", "#songfinder-guard", async () => {
      const json = await localJson("/api/songfinder");
      const entries = Array.isArray(json.entries) ? json.entries.length : 0;
      const quota = json.quota ? `${json.quota.searchesUsed}/${json.quota.searchDailyLimit}` : "quota unknown";
      return { ok: Boolean(json.ok), detail: `${entries} cached songs / searches ${quota}` };
    }),
    safeCheck("Diagnostics", "#action-center", async () => {
      const json = await localJson("/api/diagnostics");
      return { ok: Boolean(json.ok), detail: json.summary ?? "Diagnostics complete" };
    }),
  ]);

  const okCount = checks.filter((check) => check.ok).length;
  const overall = okCount === checks.length ? "ready" : okCount >= 3 ? "usable" : "needs-attention";

  return Response.json({
    ok: overall !== "needs-attention",
    overall,
    summary: `${okCount}/${checks.length} systems ready`,
    checks,
    nextAction: checks.find((check) => !check.ok)?.name ?? "Keep building",
  });
}
