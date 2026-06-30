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

const autoPilotAction: ActionDefinition = {
  id: "autopilot",
  label: "Run Auto Pilot",
  detail: "Analyze the current situation, pick the next move, and save the result.",
  task: "planning",
  prompt: "Follow the Rowdy Room Operator Law. Analyze the current Mission Control context, pick the single best next action, and give a direct implementation plan. Keep it practical and execution-first.",
};

const quickActions: ActionDefinition[] = [
  {
    id: "diagnostics",
    label: "Diagnostics",
    detail: "Check local setup.",
    task: "diagnostics",
    prompt: "",
  },
  {
    id: "provider-check",
    label: "Key Check",
    detail: "Check saved providers.",
    task: "status",
    prompt: "",
  },
  {
    id: "fix-error",
    label: "Fix Error",
    detail: "Paste error first.",
    task: "coding",
    prompt: "Act as the Rowdy Room developer. Diagnose this error and give exact code-level fixes. Prefer actions the assistant can perform through GitHub, Mission Control, or the local bridge.",
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

async function saveToMemory(title: string, kind: string, content: string) {
  const response = await fetch("/api/memory", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kind: kind === "diagnostics" ? "error" : "task",
      title,
      content,
      source: "action-center",
    }),
  });
  return response.ok;
}

export function MissionActions() {
  const [context, setContext] = useState("Paste the current goal, error, or situation here. Then press Auto Pilot.");
  const [running, setRunning] = useState<string | null>(null);
  const [activeAction, setActiveAction] = useState<ActionDefinition | null>(null);
  const [result, setResult] = useState<ActionResult | null>(null);
  const [logEntries, setLogEntries] = useState<MissionLogEntry[]>([]);
  const [logMessage, setLogMessage] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  async function runAction(action: ActionDefinition) {
    setRunning(action.id);
    setActiveAction(action);
    setResult(null);
    setLogMessage(null);

    try {
      let json: ActionResult;

      if (action.task === "status") {
        const response = await fetch("/api/status");
        json = (await response.json()) as ActionResult;
      } else if (action.task === "diagnostics") {
        const response = await fetch("/api/diagnostics");
        json = (await response.json()) as ActionResult;
      } else {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            task: action.task,
            message: `${action.prompt}\n\nContext from Mission Control:\n${context}`,
          }),
        });
        json = (await response.json()) as ActionResult;
      }

      setResult(json);

      const text = resultText(json);
      if (text && json.ok !== false) {
        const saved = await saveToMemory(action.label, action.id, text);
        setLogMessage(saved ? "Saved to Mission Memory." : "Result shown, but memory save failed.");
      }
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

    const saved = await saveToMemory(activeAction?.label ?? "Mission result", activeAction?.id ?? "result", text);
    setLogMessage(saved ? "Saved to Mission Memory." : "Save failed.");
  }

  async function loadLog() {
    const response = await fetch("/api/memory");
    const json = (await response.json()) as ActionResult;
    setLogEntries(json.entries ?? []);
    setLogMessage("Mission Memory loaded.");
  }

  const visibleResultText = resultText(result);

  return (
    <article className={`panel ${styles.actionsPanel}`} id="action-center">
      <div className="panelHeader">
        <p className="eyebrow">Action Center</p>
        <h2>Auto Pilot</h2>
        <p className="panelIntro">One main button. Advanced actions stay hidden unless needed.</p>
      </div>

      <div className={styles.contextBox}>
        <label htmlFor="action-context">Current goal / error / situation</label>
        <textarea id="action-context" value={context} onChange={(event) => setContext(event.target.value)} />
      </div>

      <div className={styles.primaryRow}>
        <button className={styles.primaryAction} type="button" disabled={Boolean(running)} onClick={() => runAction(autoPilotAction)}>
          <strong>{running === autoPilotAction.id ? "Running..." : autoPilotAction.label}</strong>
          <span>{autoPilotAction.detail}</span>
        </button>
        <button className={styles.toolButton} type="button" onClick={() => setShowAdvanced((value) => !value)}>
          {showAdvanced ? "Hide Advanced" : "Show Advanced"}
        </button>
      </div>

      {showAdvanced ? (
        <div className={styles.buttonGrid}>
          {quickActions.map((action) => (
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
      ) : null}

      {result ? (
        <div className={`${styles.resultBox} ${result.ok === false ? styles.error : ""}`}>
          <div className={styles.resultHead}>
            <span>{activeAction?.label ?? "Result"}</span>
            {result.provider ? <strong>{result.provider} / {result.model}</strong> : null}
          </div>
          <p className={`${styles.resultText} ${result.ok === false ? styles.errorText : ""}`}>{visibleResultText}</p>
          {result.hint ? <small>{result.hint}</small> : null}
          <div className={styles.resultTools}>
            <button className={styles.toolButton} type="button" onClick={copyResult}>Copy</button>
            <button className={styles.toolButton} type="button" onClick={saveResult}>Save Memory</button>
            <button className={styles.toolButton} type="button" onClick={loadLog}>View Memory</button>
          </div>
        </div>
      ) : null}

      {logMessage ? <p className={styles.resultText}>{logMessage}</p> : null}

      {logEntries.length ? (
        <div className={styles.logBox}>
          <div className={styles.logHeader}>
            <span>Mission Memory</span>
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
