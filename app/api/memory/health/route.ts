export const runtime = "nodejs";

function configured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function testSupabase() {
  if (!configured()) {
    return { ok: false, configured: false, error: "Supabase local env values are missing." };
  }

  const url = `${process.env.SUPABASE_URL}/rest/v1/mission_memory?select=id,created_at&limit=1`;
  const response = await fetch(url, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
    },
  });

  if (!response.ok) {
    return { ok: false, configured: true, status: response.status, error: await response.text() };
  }

  return { ok: true, configured: true, status: response.status, sample: await response.json() };
}

export async function GET() {
  const supabase = await testSupabase().catch((error) => ({
    ok: false,
    configured: configured(),
    error: error instanceof Error ? error.message : "Supabase memory health check failed.",
  }));

  return Response.json({
    ok: true,
    localMemory: true,
    supabase,
  });
}
