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
};

type SongfinderState = {
  ok: boolean;
  keyConfigured: boolean;
  config: { mode: Mode; hostOnlySearch: boolean; directLinksAllowed: boolean };
  quota: {
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
  normal: "Cache first. YouTube search only when no saved match exists.",
  event: "Best live-show mode: cache and direct links first, host-controlled search.",
  safe: "No new YouTube searches. Cached songs and direct links only.",
  emergency: "Lockdown mode for events. Use approved cache/direct links only.",
};

function statusClass(status: SongStatus) {
  if (status === "approved") return styles.approved;
  if (status === "rejected") return styles.rejected;
  return styles.pending;
}

export function SongfinderGuardFinal() {
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

  function saveDirectLink() {
    post({ action: "addDirectLink", url: directLink, requester, query }, "Direct link saved and tied to the current song search.");
  }

  function runSearch() {
    const ok = window.confirm("This may spend 1 YouTube search if the cache does not already have this song. Continue?");
    if (!ok) return;
    post({ action: "search", query, requester, hostSearch: true }, "Search finished.");
  }

  const entries = state?.entries ?? [];
  const results = state?.results ?? [];
  const mode = state?.config.mode ?? "normal";
  const approvedCount = useMemo(() => entries.filter((entry) => entry.status === "approved").length, [entries]);
  const pendingCount = useMemo(() => entries.filter((entry) => entry.status === "pending").length, [entries]);

  return (
    <article className={`panel ${styles.panel}`} id="songfinder-guard">
      <div className="panelHeader">
        <p className="eyebrow">Song Requests</p>
        <h2>Songfinder Guard</h2>
        <p className="panelIntro">Finished control panel for cache-first karaoke search, direct-link backup, event mode, and quota protection.</p>
      </div>

      <div className={styles.topGrid}>
        <div className={styles.stat}><span>Mode</span><strong>{mode.toUpperCase()}</strong></div>
        <div className={styles.stat}><span>YouTube Key</span><strong>{state?.keyConfigured ? "Ready" : "Missing"}</strong></div>
        <div className={styles.stat}><span>Searches Today</span><strong>{state ? `${state.quota.searchesUsed}/${state.quota.searchDailyLimit}` : "..."}</strong></div>
        <div className={styles.stat}><span>Cache</span><strong>{approvedCount} approved / {pendingCount} pending</strong></div>
      </div>

      <div className={styles.controls}>
        <section className={styles.box}>
          <h3>Host Song Control</h3>
          <label className={styles.field}>
            <span>Requester</span>
            <input className={styles.input} value={requester} onChange={(event) => setRequester(event.target.value)} />
          </label>
          <label className={styles.field}>
            <span>Song / artist search</span>
            <input className={styles.input} value={query} onChange={(event) => setQuery(event.target.value)} placeholder="song title artist karaoke" />
          </label>
          <div className={styles.buttons}>
            <button className={styles.button} disabled={loading} type="button" onClick={runSearch}>Search Cache / YouTube</button>
            <button className={styles.button} disabled={loading} type="button" onClick={() => load()}>Refresh</button>
          </div>

          <label className={styles.field}>
            <span>Direct video link backup</span>
            <input className={styles.input} value={directLink} onChange={(event) => setDirectLink(event.target.value)} placeholder="Paste a clean single-video link" />
          </label>
          <button className={styles.button} disabled={loading} type="button" onClick={saveDirectLink}>Save Direct Link To This Song</button>
          <p className={styles.notice}>Direct links do not spend search quota. Use Share → Copy link from the video page for the cleanest result.</p>
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
          <p className={styles.notice}>Remaining today: <strong>{state?.quota.searchesRemaining ?? "..."}</strong>. Per-minute guard: <strong>{state?.quota.searchesThisMinute ?? 0}/{state?.quota.searchPeakPerMinute ?? "..."}</strong>.</p>
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
        {!entries.length ? <p className={styles.notice}>No cached songs yet. Save a direct link or run one controlled search.</p> : null}
      </section>
    </article>
  );
}
