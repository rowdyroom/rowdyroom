import { mkdirSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

type MissionLogEntry = {
  id: string;
  createdAt: string;
  title: string;
  kind: string;
  content: string;
};

const dataDir = join(process.cwd(), ".rowdyroom");
const logPath = join(dataDir, "mission-log.json");

function readEntries(): MissionLogEntry[] {
  try {
    if (!existsSync(logPath)) return [];
    const raw = readFileSync(logPath, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: MissionLogEntry[]) {
  mkdirSync(dataDir, { recursive: true });
  writeFileSync(logPath, JSON.stringify(entries, null, 2), "utf8");
}

export async function GET() {
  const entries = readEntries().slice(0, 25);
  return Response.json({ ok: true, entries });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { title?: unknown; kind?: unknown; content?: unknown } | null;
  const title = typeof body?.title === "string" && body.title.trim() ? body.title.trim() : "Mission note";
  const kind = typeof body?.kind === "string" && body.kind.trim() ? body.kind.trim() : "note";
  const content = typeof body?.content === "string" ? body.content.trim() : "";

  if (!content) {
    return Response.json({ ok: false, error: "Nothing to save." }, { status: 400 });
  }

  const entry: MissionLogEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    title,
    kind,
    content,
  };

  const entries = [entry, ...readEntries()].slice(0, 100);
  writeEntries(entries);

  return Response.json({ ok: true, entry, entries: entries.slice(0, 25) });
}

export async function DELETE() {
  writeEntries([]);
  return Response.json({ ok: true, entries: [] });
}
