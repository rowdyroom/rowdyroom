"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./LiveLinksPanel.module.css";

type LinkKey = "watch" | "signup" | "vote" | "boost" | "discord" | "book";

type LinkField = {
  key: LinkKey;
  label: string;
  fallback: string;
  hostLine: string;
};

const fields: LinkField[] = [
  { key: "watch", label: "Watch Live", fallback: "https://www.tiktok.com/@rowdyroom/live", hostLine: "Watch live here" },
  { key: "signup", label: "Sign Up to Sing", fallback: "https://rowdyroom.site", hostLine: "Sign up to sing here" },
  { key: "vote", label: "Live Vote", fallback: "https://rowdyroom.site", hostLine: "Vote live here" },
  { key: "boost", label: "Get Boost Points", fallback: "https://rowdyroom.site", hostLine: "Get boost points here" },
  { key: "discord", label: "Discord / Rowdy Bunch", fallback: "", hostLine: "Join the Rowdy Bunch Discord here" },
  { key: "book", label: "Book a Show", fallback: "https://rowdyroom.site", hostLine: "Book Rowdy Room for an event here" },
];

const storageKey = "rowdyroom-live-links";

function defaultLinks(): Record<LinkKey, string> {
  return fields.reduce((next, field) => ({ ...next, [field.key]: field.fallback }), {} as Record<LinkKey, string>);
}

async function saveMemory(content: string) {
  const response = await fetch("/api/memory", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kind: "decision",
      title: "Live Links Updated",
      content,
      source: "live-links",
    }),
  });
  return response.ok;
}

export function LiveLinksPanel() {
  const [links, setLinks] = useState<Record<LinkKey, string>>(defaultLinks());
  const [message, setMessage] = useState("Save the links you use during a live show. Copy one clean block when needed.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setLinks({ ...defaultLinks(), ...(JSON.parse(raw) as Record<LinkKey, string>) });
      } catch {
        setLinks(defaultLinks());
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(links));
  }, [links]);

  const copyBlock = useMemo(() => {
    return fields
      .map((field) => {
        const value = links[field.key]?.trim();
        return value ? `${field.hostLine}: ${value}` : "";
      })
      .filter(Boolean)
      .join("\n");
  }, [links]);

  function update(key: LinkKey, value: string) {
    setLinks((current) => ({ ...current, [key]: value }));
  }

  async function copyAll() {
    await navigator.clipboard.writeText(copyBlock);
    setMessage("Live links copied.");
  }

  async function saveLinks() {
    setBusy(true);
    try {
      const saved = await saveMemory(`Current live links:\n\n${copyBlock || "No links set."}`);
      setMessage(saved ? "Live links saved to Mission Memory." : "Live links save failed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Live links save failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setLinks(defaultLinks());
    setMessage("Live links reset to defaults.");
  }

  return (
    <article className={`panel ${styles.panel}`} id="live-links">
      <div className="panelHeader">
        <p className="eyebrow">Live Operations</p>
        <h2>Live Links</h2>
        <p className="panelIntro">Keep the links you say on stream in one place: watch, sing, vote, boost, Discord, and booking.</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3>Link Setup</h3>
          <div className={styles.fields}>
            {fields.map((field) => (
              <label className={styles.field} key={field.key}>
                <span>{field.label}</span>
                <input value={links[field.key] ?? ""} onChange={(event) => update(field.key, event.target.value)} placeholder={field.fallback || "Paste link here"} />
              </label>
            ))}
          </div>
          <div className={styles.buttons}>
            <button className={styles.button} type="button" onClick={copyAll}>Copy All</button>
            <button className={styles.buttonAlt} disabled={busy} type="button" onClick={saveLinks}>Save Memory</button>
            <button className={styles.buttonAlt} type="button" onClick={reset}>Reset Defaults</button>
          </div>
          <p className={styles.note}>{message}</p>
        </section>

        <section className={styles.card}>
          <h3>Host Copy Block</h3>
          <div className={styles.lineBox}>
            {fields.map((field) => {
              const value = links[field.key]?.trim();
              return value ? (
                <div className={styles.line} key={field.key}>
                  <strong>{field.hostLine}</strong>
                  <span>{value}</span>
                </div>
              ) : null;
            })}
            {!copyBlock ? <p className={styles.note}>No links set yet.</p> : null}
          </div>
        </section>
      </div>
    </article>
  );
}
