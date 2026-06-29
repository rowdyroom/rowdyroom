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

export function MissionChat() {
  const [task, setTask] = useState<TaskKind>("planning");
  const [message, setMessage] = useState("What should Rowdy Room build next?");
  const [result, setResult] = useState<ChatResult | null>(null);
  const [loading, setLoading] = useState(false);

  const selected = useMemo(() => taskOptions.find((option) => option.value === task), [task]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!message.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ message, task }),
      });
      const json = (await response.json()) as ChatResult;
      setResult(json);
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
        <p className={styles.intro}>Type once. Mission Control sends the request to the selected route.</p>
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
          {result.hint ? <small>{result.hint}</small> : null}
        </div>
      ) : null}
    </article>
  );
}
