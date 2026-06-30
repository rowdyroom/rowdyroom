"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./SongfinderGuard.module.css";

type Mode = "normal" | "event" | "safe" | "emergency";
type SongStatus = "pending" | "approved" | "rejected";

type SongEntry = {
  id: string;
  title: string;
  channelTitle: string;
  query: string;
  url: string;
  videoId: string;
  source: string;
  status: SongStatus;
  uses: number;
  requester?: string;
};

type SongfinderState = {
  ok: boolean;
  keyConfigured: boolean;
  config: {
    mode: Mode;
    hostOnlySearch: boolean;
    directLinksAllowed: boolean;
  };
  quota: {
    date: string;
    searchesUsed: number;
    searchDailyLimit: number;
    searchPeakPerMinute: number;
    searchesThisMinute: number;
    searchesRemaining: number;
  };
  entries: SongEntry[];
  results?: SongEntry[];
  source?: string;
  cacheHit?: boolean;
  error?: string;
};

const modeDetails: Record<Mode, string> = {
  normal: "Cache first, then YouTube search if needed.",
  event: "Cache/direct links first. Host-controlled search.",
  safe: "Cached songs and direct links only.",
  emergency: "Lock down live search during a show.",
};

function statusClass(status: SongStatus) {
  if (status === "approved") return styles.approved;
  if (status === "rejected") return styles.rejected;
  return styles.pending;
}

export function SongfinderGuard() {
  const [state, setState] = useState<SongfinderState | null>(null);
  const [query, setQuery] = useState("tennessee whiskey karaoke");
  const [directLink, setDirectLink] = useState("");
  const [requester, setRequester] = useState("host");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function load() {
    const response = await fetch("/api/songfinder");
    setState((await response.json()) as SongfinderState);
  }

  useEffect(() => {
    load().catch(() => setMessage("Songfinder Guard failed to load."));
  }, []);

  async function post(body: Record<string, unknown>, success?: string) {
    setLoading(true);
    setMessage(null);
    try {
      const response = await fetch("/api/songfinder", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = (await response.json()) as SongfinderState;
      setState(json);
      setMessage(json.error ?? success ?? null);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Songfinder action failed.");
    } finally {
      setLoading(false);
    }
  }

  const approvedCount = useMemo(() => state?.entries.filter((entry) => entry.status === "approved").length ?? 0, [state]);
  const pendingCount = useMemo(() => state?.entries.filter((entry) => entry.status === "pending").length ?? 0, [state]);

  const results = state?.results ?? [];
  const entries = state?.entries ?? [];
  const mode = state?.config.mode ?? "normal";

  return (
    <article className={`panel ${styles.panel}`} id="songfinder-guard">
      <div className="panelHeader">
        <p className="eyebrow">Song Requests</p>
        <h2>Songfinder Guard</h2>
        <p className="panelIntro">Cache songs, protect YouTube searches, and keep live shows from breaking when the room gets busy.</p>
      </div>

      <div className={styles.topGrid}>
        <div className={styles.stat}><span>Mode</span><strong>{mode.toUpperCase()}</strong></div>
        <div className={styles.stat}><span>YouTube Key</span><strong>{state?.keyConfigured ? "Ready" : "Missing"}</strong></div>
        <div className={styles.stat}><span>Searches Today</span><strong>{state ? `${state.quota.searchesUsed}/${state.quota.searchDailyLimit}` : "..."}</strong></div>
        <div className={styles.stat}><span>Cache</span><strong>{approvedCount} approved / {pendingCount} pending</strong></div>
      </div>

      <div className={styles.controls}>
        <section className={styles.box}>
          <h3>Host Song Search</h3>
          <label className={styles.field}>
            <span>Requester</span>
            <input className={styles.input} value={requester} onChange={(event) => setRequester(event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Song / artist search</span>
            <input className={styles.input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="song title artist karaoke" />
          </label>
          <div className={styles.buttons}>
            <button className={styles.button} disabled={loading} type="button" onClick={() => post({ action: "search", query, requester, hostSearch: true }, "Search finished.")}>Search Cache / YouTube</button>
            <button className={styles.button} disabled={loading} type="button" onClick={() => load()}>Refresh</button>
          </div>

          <label className={styles.field} style={{ marginTop: 14 }}>
            <span>Direct YouTube link backup</span>
            <input className={styles.input} value={directLink} onChange={(event) => setDirectLink(event.target.value)} placeholder="https://www.youtube.com/watch?v=..." />
          </label>
          <button className={styles.button} disabled={loading} type="button" onClick={() => post({ action: "addDirectLink", url: directLink, requester }, "Direct link saved.")}>Save Direct Link</button>
        </section>

        <section className={styles.box}>
          <h3>Show Mode</h3>
          <div className={styles.modeButtons}>
            {(["normal", "event", "safe", "emergency"] as Mode[]).map((option) => (
              <button
                className={option === mode ? `${styles.modeButton} ${styles.active}` : styles.modeButton}
                disabled={loading}
                key={option}
                type="button"
                onClick={() => post({ action: "setMode", mode: option }, `${option} mode enabled.`)}
              >
                {option.toUpperCase()}
              </button>
            ))}
          </div>
          <p className={styles.notice}>{modeDetails[mode]}</p>
          <p className={styles.notice}>Remaining search budget today: <strong>{state?.quota.searchesRemaining ?? "..."}</strong>. Per-minute guard: <strong>{state?.quota.searchesThisMinute ?? 0}/{state?.quota.searchPeakPerMinute ?? "..."}</strong>.</p>
          <button className={styles.modeButton} disabled={loading} type="button" onClick={() => post({ action: "resetDailyCounter" }, "Local counter reset.")}>Reset Local Counter</button>
        </section>
      </div>

      {message ? <p className={state?.error ? styles.error : styles.notice}>{message}</p> : null}

      {results.length ? (
        <section className={styles.results}>
          <h3>Latest Results</h3>
          {results.map((entry) => (
            <div className={styles.songRow} key={entry.id}>
              <div>
                <strong>{entry.title}</strong>
                <p>{entry.channelTitle} · {entry.source} · <span className={statusClass(entry.status)}>{entry.status}</span></p>
                <small>{entry.url}</small>
              </div>
              <div className={styles.rowActions}>
                <button className={styles.smallButton} type="button" onClick={() => post({ action: "approve", id: entry.id }, "Approved.")}>Approve</button>
                <button className={styles.smallButton} type="button" onClick={() => post({ action: "markUsed", id: entry.id }, "Marked used.")}>Use</button>
              </div>
            </div>
          ))}
        </section>
      ) : null}

      <section className={styles.results}>
        <h3>Approved / Pending Song Cache</h3>
        {entries.slice(0, 20).map((entry) => (
          <div className={styles.songRow} key={entry.id}>
            <div>
              <strong>{entry.title}</strong>
              <p>{entry.channelTitle} · used {entry.uses} times · <span className={statusClass(entry.status)}>{entry.status}</span></p>
              <small>{entry.query} · {entry.url}</small>
            </div>
            <div className={styles.rowActions}>
              <button className={styles.smallButton} type="button" onClick={() => post({ action: "approve", id: entry.id }, "Approved.")}>Approve</button>
              <button className={styles.smallButton} type="button" onClick={() => post({ action: "markUsed", id: entry.id }, "Marked used.")}>Use</button>
              <button className={styles.smallButton} type="button" onClick={() => post({ action: "reject", id: entry.id }, "Rejected.")}>Reject</button>
              <button className={styles.smallButton} type="button" onClick={() => post({ action: "delete", id: entry.id }, "Deleted.")}>Delete</button>
            </div>
          </div>
        ))}
        {!entries.length ? <p className={styles.notice}>No cached songs yet. Search one song or save a direct YouTube link.</p> : null}
      </section>
    </article>
  );
}
