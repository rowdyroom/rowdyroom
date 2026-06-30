"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./MissionChat.module.css";

type TaskKind = "planning" | "coding" | "review" | "research" | "streamHost" | "vision" | "voice" | "privateLocal";

type ChatResult = {
  ok: boolean;
  task?: TaskKind;
  provider?: string;
  model?: string;
  text?: string;
  error?: string;
  hint?: string;
};

const taskOptions: Array<{ value: TaskKind; label: string; detail: string }> = [
  { value: "planning", label: "ChatGPT", detail: "Planning + general work" },
  { value: "coding", label: "Claude", detail: "Code + review" },
  { value: "streamHost", label: "Grok", detail: "Stream host voice" },
  { value: "research", label: "Gemini", detail: "Research + large context" },
];

async function saveChatMemory(args: { task: TaskKind; message: string; result: ChatResult }) {
  if (!args.result.ok || !args.result.text) return false;

  const response = await fetch("/api/memory", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kind: "note",
      title: `AI Router ${args.task}: ${args.message.slice(0, 80)}`,
      content: `User request:\n${args.message}\n\nProvider:\n${args.result.provider ?? "unknown"} / ${args.result.model ?? "unknown"}\n\nResponse:\n${args.result.text}`,
      source: "ai-router-chat",
    }),
  });

  return response.ok;
}

export function MissionChat() {
  const [task, setTask] = useState<TaskKind>("planning");
  const [message, setMessage] = useState("What should Rowdy Room build next?");
  const [result, setResult] = useState<ChatResult | null>(null);
  const [memorySaved, setMemorySaved] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(() => taskOptions.find((option) => option.value === task), [task]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const requestText = message.trim();
    if (!requestText) return;

    setLoading(true);
    setResult(null);
    setMemorySaved(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message: requestText, task }),
      });
      const json = (await response.json()) as ChatResult;
      setResult(json);

      if (json.ok && json.text) {
        const saved = await saveChatMemory({ task, message: requestText, result: json });
        setMemorySaved(saved);
      }
    } catch (error) {
      setResult({
        ok: false,
        error: error instanceof Error ? error.message : "Request failed.",
        hint: "Make sure the local dev server is still running.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className={`panel ${styles.console}`} id="chat-console">
      <div className="panelHeader">
        <p className="eyebrow">Live Console</p>
        <h2>AI Router Chat</h2>
        <p className={styles.intro}>Type once. Mission Control sends the request to the selected route and saves useful answers to Mission Memory.</p>
      </div>

      <form className={styles.form} onSubmit={submit}>
        <div className={styles.tabs} role="tablist" aria-label="AI route selector">
          {taskOptions.map((option) => (
            <button
              type="button"
              className={option.value === task ? `${styles.tab} ${styles.active}` : styles.tab}
              key={option.value}
              onClick={() => setTask(option.value)}
            >
              <strong>{option.label}</strong>
              <span>{option.detail}</span>
            </button>
          ))}
        </div>

        <label className={styles.label} htmlFor="mission-message">
          Message to {selected?.label ?? "AI"}
        </label>
        <textarea
          className={styles.textarea}
          id="mission-message"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          rows={5}
          placeholder="Ask Mission Control something..."
        />

        <button className={styles.send} type="submit" disabled={loading}>
          {loading ? "Routing..." : "Send Through Router"}
        </button>
      </form>

      {result ? (
        <div className={`${styles.result} ${result.ok ? styles.success : styles.error}`}>
          <div className={styles.meta}>
            <span>{result.ok ? "Response" : "Provider Error"}</span>
            {result.provider ? <strong>{result.provider} / {result.model}</strong> : null}
          </div>
          <p>{result.text ?? result.error}</p>
          {memorySaved !== null ? <small>{memorySaved ? "Saved to Mission Memory." : "Response shown, but memory save failed."}</small> : null}
          {result.hint ? <small>{result.hint}</small> : null}
        </div>
      ) : null}
    </article>
  );
}
