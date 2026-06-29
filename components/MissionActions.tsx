"use client";

import { useState } from "react";
import styles from "./MissionActions.module.css";

type TaskKind = "planning" | "coding" | "review" | "research" | "streamHost" | "vision" | "voice" | "privateLocal";

type ActionTask = TaskKind | "status" | "diagnostics";

type ActionDefinition = {
  id: string;
  label: string;
  detail: string;
  task: ActionTask;
  prompt: string;
};

type DiagnosticCheck = {
  name: string;
  ok: boolean;
  detail: string;
};

type MissionLogEntry = {
  id: string;
  createdAt: string;
  title: string;
  kind: string;
  content: string;
};

type ActionResult = {
  ok: boolean;
  provider?: string;
  model?: string;
  text?: string;
  error?: string;
  hint?: string;
  providers?: Array<{ id: string; name: string; env: string; configured: boolean }>;
  configuredProviders?: Array<{ name: string; env: string; configured: boolean }>;
  checks?: DiagnosticCheck[];
  cwd?: string;
  node?: string;
  summary?: string;
  entries?: MissionLogEntry[];
};

const actions: ActionDefinition[] = [
  {
    id: "diagnostics",
    label: "Local Diagnostics",
    detail: "Check files, Node, scripts, lockfiles, and local keys.",
    task: "diagnostics",
    prompt: "",
  },
  {
    id: "analyze",
    label: "Analyze System",
    detail: "Find weak spots, missing pieces, and next fixes.",
    task: "planning",
    prompt: "Analyze the Rowdy Room Enterprise Engine and list the top problems, missing pieces, and next fixes in priority order.",
  },
  {
    id: "fix-error",
    label: "Fix Error",
    detail: "Paste an error and get a direct repair plan.",
    task: "coding",
    prompt: "Act as the Rowdy Room developer. Diagnose this error and give exact steps and code-level fixes.",
  },
  {
    id: "repair-commands",
    label: "Repair Commands",
    detail: "Turn the current problem into exact Windows commands.",
    task: "coding",
    prompt: "Create exact Windows Command Prompt repair commands for this Rowdy Room problem. Keep it short and avoid explaining unless necessary.",
  },
  {
    id: "build-next",
    label: "Build Next",
    detail: "Plan the next feature without guessing.",
    task: "planning",
    prompt: "Decide the next Rowdy Room feature to build and break it into direct implementation steps.",
  },
  {
    id: "provider-check",
    label: "Check Keys",
    detail: "See which AI providers are configured locally.",
    task: "status",
    prompt: "",
  },
  {
    id: "stream-host",
    label: "Stream Host",
    detail: "Create live room lines, hype, and flow.",
    task: "streamHost",
    prompt: "Create Rowdy Room stream-host ideas, live lines, audience prompts, and ways to keep singers and viewers engaged.",
  },
  {
    id: "review-ui",
    label: "Review UI",
    detail: "Critique the dashboard and website direction.",
    task: "review",
    prompt: "Review the Rowdy Room Mission Control UI. Give direct improvements for layout, clarity, user flow, and missing controls.",
  },
  {
    id: "memory-plan",
    label: "Memory Plan",
    detail: "Design the Supabase memory layer.",
    task: "research",
    prompt: "Design the Rowdy Room Supabase memory layer for users, songs, scores, queue history, agent memory, and audit logs.",
  },
  {
    id: "emergency-repair",
    label: "Emergency Repair",
    detail: "Get out of a broken local setup fast.",
    task: "coding",
    prompt: "Create a minimal emergency repair plan for a broken local Next.js app on Windows. Prioritize exact commands and likely causes.",
  },
];

function statusText(result: ActionResult): string {
  if (!result.providers) return "No provider status returned.";
  return result.providers
    .map((provider) => `${provider.name}: ${provider.configured ? "configured" : `missing ${provider.env}`}`)
    .join("\n");
}

function diagnosticsText(result: ActionResult): string {
  const lines = [
    result.summary ?? "Diagnostics complete",
    result.cwd ? `Folder: ${result.cwd}` : "",
    result.node ? `Node: ${result.node}` : "",
    "",
    ...(result.checks ?? []).map((check) => `${check.ok ? "PASS" : "FIX"} - ${check.name}: ${check.detail}`),
    "",
    "Provider keys:",
    ...(result.configuredProviders ?? []).map((provider) => `${provider.configured ? "PASS" : "FIX"} - ${provider.name}: ${provider.configured ? "configured" : `missing ${provider.env}`}`),
  ];

  return lines.filter(Boolean).join("\n");
}

function resultText(result: ActionResult | null): string {
  if (!result) return "";
  if (result.checks) return diagnosticsText(result);
  if (result.providers) return statusText(result);
  return result.text ?? result.error ?? "No result text.";
}

export function MissionActions() {
  const [context, setContext] = useState("Paste errors, goals, or notes here before clicking a button.");
  const [running, setRunning] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ActionDefinition | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [logEntries, setLogEntries] = useState<MissionLogEntry[]>([]);
  const [logMessage, setLogMessage] = useState<string | null>(null);

  async function runAction(action: ActionDefinition) {
    setRunning(action.id);
    setActiveAction(action);
    setResult(null);
    setLogMessage(null);

    try {
      if (action.task === "status") {
        const response = await fetch("/api/status");
        setResult((await response.json()) as ActionResult);
        return;
      }

      if (action.task === "diagnostics") {
        const response = await fetch("/api/diagnostics");
        setResult((await response.json()) as ActionResult);
        return;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          task: action.task,
          message: `${action.prompt}\n\nContext from Mission Control:\n${context}`,
        }),
      });

      setResult((await response.json()) as ActionResult);
    } catch (error) {
      setResult({
        ok: false,
        error: error instanceof Error ? error.message : "Action failed.",
        hint: "Make sure the launcher window is still running.",
      });
    } finally {
      setRunning(null);
    }
  }

  async function copyResult() {
    const text = resultText(result);
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setLogMessage("Copied result to clipboard.");
  }

  async function saveResult() {
    const text = resultText(result);
    if (!text) return;

    const response = await fetch("/api/mission-log", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        title: activeAction?.label ?? "Mission result",
        kind: activeAction?.id ?? "result",
        content: text,
      }),
    });
    const json = (await response.json()) as ActionResult;
    setLogEntries(json.entries ?? []);
    setLogMessage(json.ok ? "Saved to Mission Log." : json.error ?? "Save failed.");
  }

  async function loadLog() {
    const response = await fetch("/api/mission-log");
    const json = (await response.json()) as ActionResult;
    setLogEntries(json.entries ?? []);
    setLogMessage("Mission Log loaded.");
  }

  async function clearLog() {
    const response = await fetch("/api/mission-log", { method: "DELETE" });
    const json = (await response.json()) as ActionResult;
    setLogEntries(json.entries ?? []);
    setLogMessage("Mission Log cleared.");
  }

  const visibleResultText = resultText(result);

  return (
    <article className={`panel ${styles.actionsPanel}`} id="action-center">
      <div className="panelHeader">
        <p className="eyebrow">Action Center</p>
        <h2>One-Click Fix, Analyze, Build</h2>
        <p className="panelIntro">Use these buttons instead of typing the same command prompts over and over.</p>
      </div>

      <div className={styles.contextBox}>
        <label htmlFor="action-context">Context / error / goal</label>
        <textarea id="action-context" value={context} onChange={(event) => setContext(event.target.value)} />
      </div>

      <div className={styles.buttonGrid}>
        {actions.map((action) => (
          <button
            className={styles.actionButton}
            key={action.id}
            type="button"
            disabled={Boolean(running)}
            onClick={() => runAction(action)}
          >
            <strong>{running === action.id ? "Running..." : action.label}</strong>
            <span>{action.detail}</span>
          </button>
        ))}
      </div>

      {result ? (
        <div className={`${styles.resultBox} ${result.ok === false ? styles.error : ""}`}>
          <div className={styles.resultHead}>
            <span>{activeAction?.label ?? "Result"}</span>
            {result.provider ? <strong>{result.provider} / {result.model}</strong> : null}
          </div>
          <p className={`${styles.resultText} ${result.ok === false ? styles.errorText : ""}`}>{visibleResultText}</p>
          {result.hint ? <small>{result.hint}</small> : null}
          <div className={styles.resultTools}>
            <button className={styles.toolButton} type="button" onClick={copyResult}>Copy Result</button>
            <button className={styles.toolButton} type="button" onClick={saveResult}>Save to Mission Log</button>
            <button className={styles.toolButton} type="button" onClick={loadLog}>Load Mission Log</button>
          </div>
        </div>
      ) : null}

      <div className={styles.resultTools}>
        <button className={styles.toolButton} type="button" onClick={loadLog}>View Saved Log</button>
        <button className={styles.toolButton} type="button" onClick={clearLog}>Clear Saved Log</button>
        {logMessage ? <span className={styles.resultText}>{logMessage}</span> : null}
      </div>

      {logEntries.length ? (
        <div className={styles.logBox}>
          <div className={styles.logHeader}>
            <span>Saved Mission Log</span>
            <span>{logEntries.length} shown</span>
          </div>
          <div className={styles.logList}>
            {logEntries.map((entry) => (
              <div className={styles.logEntry} key={entry.id}>
                <strong>{entry.title}</strong>
                <span>{entry.content.slice(0, 700)}{entry.content.length > 700 ? "..." : ""}</span>
                <small>{new Date(entry.createdAt).toLocaleString()} / {entry.kind}</small>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}
