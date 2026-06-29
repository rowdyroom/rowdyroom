import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

export const runtime = "nodejs";

type Check = {
  name: string;
  ok: boolean;
  detail: string;
};

function fileExists(path: string): boolean {
  return existsSync(join(process.cwd(), path));
}

function readJson(path: string): any | null {
  try {
    return JSON.parse(readFileSync(join(process.cwd(), path), "utf8"));
  } catch {
    return null;
  }
}

function lockfiles(): string[] {
  try {
    return readdirSync(process.cwd()).filter((file) => ["package-lock.json", "pnpm-lock.yaml", "yarn.lock", "bun.lockb"].includes(file));
  } catch {
    return [];
  }
}

export async function GET() {
  const packageJson = readJson("package.json");
  const locks = lockfiles();
  const nodeMajor = Number(process.versions.node.split(".")[0]);

  const checks: Check[] = [
    {
      name: "Project folder",
      ok: fileExists("package.json") && fileExists("app/page.tsx"),
      detail: fileExists("package.json") ? "package.json found" : "package.json missing. You are in the wrong folder.",
    },
    {
      name: "Next app",
      ok: fileExists("app/page.tsx") && fileExists("app/layout.tsx"),
      detail: "Checks that the dashboard entry files exist.",
    },
    {
      name: "Mission Actions",
      ok: fileExists("components/MissionActions.tsx") && fileExists("components/MissionActions.module.css"),
      detail: "Checks the one-click action center files.",
    },
    {
      name: "Chat API",
      ok: fileExists("app/api/chat/route.ts"),
      detail: "Checks the provider chat endpoint.",
    },
    {
      name: "Provider Status API",
      ok: fileExists("app/api/status/route.ts"),
      detail: "Checks the local key status endpoint.",
    },
    {
      name: "Environment file",
      ok: fileExists(".env.local"),
      detail: fileExists(".env.local") ? ".env.local found" : ".env.local missing. Provider buttons will show missing keys.",
    },
    {
      name: "Node version",
      ok: nodeMajor >= 20,
      detail: `Node ${process.versions.node}. Recommended: 20 or newer.`,
    },
    {
      name: "NPM scripts",
      ok: Boolean(packageJson?.scripts?.dev && packageJson?.scripts?.build),
      detail: packageJson?.scripts ? Object.keys(packageJson.scripts).join(", ") : "No scripts found.",
    },
    {
      name: "Lockfiles",
      ok: locks.length <= 1,
      detail: locks.length ? locks.join(", ") : "No lockfile found yet. npm install will create one.",
    },
  ];

  const configuredProviders = [
    { name: "ChatGPT", env: "OPENAI_API_KEY", configured: Boolean(process.env.OPENAI_API_KEY) },
    { name: "Claude", env: "ANTHROPIC_API_KEY", configured: Boolean(process.env.ANTHROPIC_API_KEY) },
    { name: "Grok", env: "XAI_API_KEY", configured: Boolean(process.env.XAI_API_KEY) },
    { name: "Gemini", env: "GEMINI_API_KEY", configured: Boolean(process.env.GEMINI_API_KEY) },
    { name: "Supabase", env: "SUPABASE_URL", configured: Boolean(process.env.SUPABASE_URL) },
  ];

  return Response.json({
    ok: checks.every((check) => check.ok),
    cwd: process.cwd(),
    node: process.versions.node,
    checks,
    configuredProviders,
    summary: `${checks.filter((check) => check.ok).length}/${checks.length} checks passed`,
  });
}
