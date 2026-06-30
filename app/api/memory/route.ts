export const runtime = "nodejs";

import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

type MemoryKind = "note" | "decision" | "task" | "error" | "credential-status";

type MemoryEntry = {
  id: string;
  createdAt: string;
  kind: MemoryKind;
  title: string;
  content: string;
  source: string;
};

const dataDir = path.join(process.cwd(), ".rowdyroom");
const memoryFile = path.join(dataDir, "mission-memory.json");

function supabaseConfigured() {
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

async function readLocalMemory(): Promise<MemoryEntry[]> {
  try {
    const text = await readFile(memoryFile, "utf8");
    const parsed = JSON.parse(text) as MemoryEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

async function writeLocalMemory(entries: MemoryEntry[]) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(memoryFile, JSON.stringify(entries.slice(0, 250), null, 2), "utf8");
}

function normalizeKind(value: unknown): MemoryKind {
  if (["note", "decision", "task", "error", "credential-status"].includes(String(value))) return String(value) as MemoryKind;
  return "note";
}

function cleanText(value: unknown, fallback = "") {
  return typeof value === "string" ? value.trim() : fallback;
}

async function saveToSupabase(entry: MemoryEntry) {
  if (!supabaseConfigured()) return { attempted: false, ok: false, error: null };

  const url = `${process.env.SUPABASE_URL}/rest/v1/mission_memory`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      apikey: process.env.SUPABASE_SERVICE_ROLE_KEY!,
      authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      "content-type": "application/json",
      prefer: "return=minimal",
    },
    body: JSON.stringify({
      id: entry.id,
      created_at: entry.createdAt,
      kind: entry.kind,
      title: entry.title,
      content: entry.content,
      source: entry.source,
    }),
  });

  if (!response.ok) {
    return { attempted: true, ok: false, error: await response.text() };
  }
  return { attempted: true, ok: true, error: null };
}

export async function GET() {
  const entries = await readLocalMemory();
  return Response.json({
    ok: true,
    storage: supabaseConfigured() ? "local-plus-supabase" : "local-only",
    supabaseConfigured: supabaseConfigured(),
    entries,
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { kind?: unknown; title?: unknown; content?: unknown; source?: unknown } | null;
  const title = cleanText(body?.title, "Mission note");
  const content = cleanText(body?.content);

  if (!content) {
    return Response.json({ ok: false, error: "Memory content is required." }, { status: 400 });
  }

  const entry: MemoryEntry = {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    kind: normalizeKind(body?.kind),
    title: title || "Mission note",
    content,
    source: cleanText(body?.source, "mission-control") || "mission-control",
  };

  const entries = await readLocalMemory();
  await writeLocalMemory([entry, ...entries]);
  const supabase = await saveToSupabase(entry).catch((error) => ({ attempted: true, ok: false, error: error instanceof Error ? error.message : "Supabase save failed." }));

  return Response.json({
    ok: true,
    entry,
    entries: [entry, ...entries].slice(0, 50),
    storage: supabase.ok ? "local-plus-supabase" : "local-only",
    supabase,
  });
}

export async function DELETE() {
  await writeLocalMemory([]);
  return Response.json({ ok: true, entries: [] });
}
