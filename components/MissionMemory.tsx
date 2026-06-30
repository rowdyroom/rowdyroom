"use client";

import { useEffect, useState } from "react";
import styles from "./MissionMemory.module.css";

type MemoryKind = "note" | "decision" | "task" | "error" | "credential-status";

type MemoryEntry = {
  id: string;
  createdAt: string;
  kind: MemoryKind;
  title: string;
  content: string;
  source: string;
};

type MemoryState = {
  ok: boolean;
  storage?: string;
  supabaseConfigured?: boolean;
  entries?: MemoryEntry[];
  error?: string;
};

export function MissionMemory() {
  const [kind, setKind] = useState<MemoryKind>("note");
  const [title, setTitle] = useState("Mission note");
  const [content, setContent] = useState("");
  const [state, setState] = useState<MemoryState | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Mission Memory stores notes locally now and syncs to Supabase when the table/key are ready.");

  async function load() {
    const response = await fetch("/api/memory");
    const json = (await response.json()) as MemoryState;
    setState(json);
  }

  useEffect(() => {
    load().catch(() => setMessage("Mission Memory could not load."));
  }, []);

  async function save() {
    setBusy(true);
    setMessage("Saving memory...");
    try {
      const response = await fetch("/api/memory", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ kind, title, content, source: "mission-control" }),
      });
      const json = (await response.json()) as MemoryState;
      setState(json);
      setMessage(json.ok ? "Saved to Mission Memory." : json.error ?? "Save failed.");
      if (json.ok) setContent("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  const entries = state?.entries ?? [];

  return (
    <article className={`panel ${styles.panel}`} id="mission-memory">
      <div className="panelHeader">
        <p className="eyebrow">Memory</p>
        <h2>Mission Memory</h2>
        <p className="panelIntro">Capture decisions, tasks, errors, and setup notes so the project stops depending on chat history.</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <label className={styles.field}>
            <span>Kind</span>
            <select className={styles.select} value={kind} onChange={(event) => setKind(event.target.value as MemoryKind)}>
              <option value="note">Note</option>
              <option value="decision">Decision</option>
              <option value="task">Task</option>
              <option value="error">Error</option>
              <option value="credential-status">Credential Status</option>
            </select>
          </label>
          <label className={styles.field}>
            <span>Title</span>
            <input className={styles.input} value={title} onChange={(event) => setTitle(event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Memory content</span>
            <textarea className={styles.textarea} value={content} onChange={(event) => setContent(event.target.value)} placeholder="Save the decision, task, error, or setup note here." />
          </label>
          <button className={styles.button} disabled={busy || !content.trim()} type="button" onClick={save}>{busy ? "Saving..." : "Save Memory"}</button>
          <p className={message.toLowerCase().includes("fail") || message.toLowerCase().includes("could not") ? styles.error : styles.note}>{message}</p>
          <p className={styles.note}>Storage: {state?.storage ?? "checking"}. Supabase: {state?.supabaseConfigured ? "configured" : "not configured or table not ready"}.</p>
        </section>

        <section className={styles.card}>
          <h3>Recent Memory</h3>
          <div className={styles.list}>
            {entries.slice(0, 12).map((entry) => (
              <div className={styles.item} key={entry.id}>
                <strong>{entry.title}</strong>
                <span>{entry.content.slice(0, 260)}{entry.content.length > 260 ? "..." : ""}</span>
                <small>{entry.kind} / {new Date(entry.createdAt).toLocaleString()}</small>
              </div>
            ))}
            {!entries.length ? <p className={styles.note}>No memory entries yet.</p> : null}
          </div>
        </section>
      </div>
    </article>
  );
}
