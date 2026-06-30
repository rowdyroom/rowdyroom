"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./SongfinderOneButton.module.css";

type Mode = "normal" | "event" | "safe" | "emergency";
type SongEntry = {
  id: string;
  title: string;
  channelTitle: string;
  query: string;
  url: string;
  status: "pending" | "approved" | "rejected";
  uses: number;
  source: string;
};

type SongfinderState = {
  ok: boolean;
  keyConfigured: boolean;
  config: { mode: Mode };
  quota: {
    searchesUsed: number;
    searchDailyLimit: number;
    searchesRemaining: number;
  };
  entries: SongEntry[];
  results?: SongEntry[];
  source?: string;
  cacheHit?: boolean;
  error?: string;
};

async function requestSongfinder(body?: Record<string, unknown>) {
  const response = await fetch("/api/songfinder", body ? {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  } : undefined);
  return (await response.json()) as SongfinderState;
}

export function SongfinderOneButton() {
  const [state, setState] = useState<SongfinderState | null>(null);
  const [song, setSong] = useState("");
  const [link, setLink] = useState("");
  const [requester, setRequester] = useState("host");
  const [lastSong, setLastSong] = useState<SongEntry | null>(null);
  const [message, setMessage] = useState("Paste a direct link when you have one. Otherwise type the song and let Guard check cache first.");
  const [busy, setBusy] = useState(false);

  async function refresh() {
    const json = await requestSongfinder();
    setState(json);
  }

  useEffect(() => {
    refresh().catch(() => setMessage("Songfinder could not load."));
  }, []);

  const approved = useMemo(() => state?.entries.filter((entry) => entry.status === "approved") ?? [], [state]);
  const mode = state?.config.mode ?? "normal";

  async function approveFirst(json: SongfinderState) {
    const first = json.results?.[0];
    if (!first) return json;
    if (first.status === "approved") return json;
    const approvedState = await requestSongfinder({ action: "approve", id: first.id });
    return { ...approvedState, results: [{ ...first, status: "approved" as const }] };
  }

  async function handleMainAction() {
    const cleanSong = song.trim();
    const cleanLink = link.trim();

    if (!cleanSong && !cleanLink) {
      setMessage("Type a song or paste a direct YouTube link first.");
      return;
    }

    setBusy(true);
    try {
      let json: SongfinderState;

      if (cleanLink) {
        json = await requestSongfinder({ action: "addDirectLink", url: cleanLink, requester, query: cleanSong || cleanLink });
        setMessage("Saved. Direct links do not spend search quota.");
      } else {
        json = await requestSongfinder({ action: "search", query: cleanSong, requester, hostSearch: true });
        json = await approveFirst(json);
        setMessage(json.cacheHit ? "Found in approved cache. No search quota spent." : "Found and approved. This used one YouTube search.");
      }

      setState(json);
      setLastSong(json.results?.[0] ?? json.entries?.[0] ?? null);
      setLink("");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Songfinder action failed.");
    } finally {
      setBusy(false);
    }
  }

  async function toggleEventMode() {
    setBusy(true);
    try {
      const nextMode = mode === "event" ? "normal" : "event";
      const json = await requestSongfinder({ action: "setMode", mode: nextMode });
      setState(json);
      setMessage(nextMode === "event" ? "Event Mode is on. Search stays host-controlled." : "Normal Mode is on.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <article className={`panel ${styles.panel}`} id="songfinder-guard">
      <div className="panelHeader">
        <p className="eyebrow">Song Requests</p>
        <h2>Simple Songfinder</h2>
        <p className="panelIntro">One main button. Direct link first, cache second, YouTube search only when needed.</p>
      </div>

      <div className={styles.statusRow}>
        <div className={styles.stat}><span>Mode</span><strong>{mode.toUpperCase()}</strong></div>
        <div className={styles.stat}><span>YouTube Key</span><strong>{state?.keyConfigured ? "Ready" : "Missing"}</strong></div>
        <div className={styles.stat}><span>Searches Today</span><strong>{state ? `${state.quota.searchesUsed}/${state.quota.searchDailyLimit}` : "..."}</strong></div>
        <div className={styles.stat}><span>Approved Cache</span><strong>{approved.length}</strong></div>
      </div>

      <div className={styles.workspace}>
        <section className={styles.card}>
          <h3>Add or Find a Song</h3>
          <label className={styles.field}>
            <span>Requester</span>
            <input className={styles.input} value={requester} onChange={(event) => setRequester(event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Song title / artist</span>
            <input className={styles.input} value={song} onChange={(event) => setSong(event.target.value)} placeholder="Example: Tennessee Whiskey karaoke" />
          </label>
          <label className={styles.field}>
            <span>Direct YouTube link, optional</span>
            <input className={styles.input} value={link} onChange={(event) => setLink(event.target.value)} placeholder="Paste clean YouTube share link" />
          </label>

          <button className={styles.primaryButton} disabled={busy} type="button" onClick={handleMainAction}>
            {busy ? "Working..." : "Save / Find Song"}
          </button>
          <button className={styles.secondaryButton} disabled={busy} type="button" onClick={toggleEventMode}>
            {mode === "event" ? "Turn Event Mode Off" : "Turn Event Mode On"}
          </button>

          <p className={message.includes("failed") || message.includes("could not") ? styles.error : styles.notice}>{message}</p>

          {lastSong ? (
            <div className={styles.result}>
              <strong>{lastSong.title}</strong>
              <span>{lastSong.channelTitle} · {lastSong.source}</span>
              <a href={lastSong.url} target="_blank" rel="noreferrer">{lastSong.url}</a>
            </div>
          ) : null}
        </section>

        <section className={styles.card}>
          <h3>Approved Songs</h3>
          <div className={styles.cacheList}>
            {approved.slice(0, 12).map((entry) => (
              <div className={styles.cacheItem} key={entry.id}>
                <strong>{entry.title}</strong>
                <span>{entry.query} · used {entry.uses}</span>
              </div>
            ))}
            {!approved.length ? <p className={styles.notice}>No approved songs yet.</p> : null}
          </div>
        </section>
      </div>
    </article>
  );
}
