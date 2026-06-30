"use client";

import { useEffect, useState } from "react";
import styles from "./MissionStatus.module.css";

type StatusItem = {
  name: string;
  ok: boolean;
  detail: string;
  href?: string;
};

type MissionStatusState = {
  ok: boolean;
  overall: "ready" | "usable" | "needs-attention";
  summary: string;
  nextAction: string;
  checks: StatusItem[];
};

function badgeClass(overall?: MissionStatusState["overall"]) {
  if (overall === "ready") return styles.badge;
  if (overall === "usable") return `${styles.badge} ${styles.badgeWarn}`;
  return `${styles.badge} ${styles.badgeBad}`;
}

function scrollToTarget(href?: string) {
  if (!href) return;
  const target = document.querySelector(href);
  target?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export function MissionStatus() {
  const [state, setState] = useState<MissionStatusState | null>(null);
  const [busy, setBusy] = useState(false);

  async function load() {
    setBusy(true);
    try {
      const response = await fetch("/api/mission-status", { cache: "no-store" });
      setState((await response.json()) as MissionStatusState);
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const nextFix = state?.checks.find((check) => !check.ok);

  return (
    <article className={`panel ${styles.panel}`} id="mission-status">
      <div className={styles.top}>
        <div>
          <p className="eyebrow">Command Center</p>
          <h2>Mission Status</h2>
          <p className={styles.summary}>{state?.summary ?? "Checking Mission Control systems..."}</p>
          {nextFix ? <p className={styles.next}>Next fix: {nextFix.name} — {nextFix.detail}</p> : <p className={styles.next}>All tracked systems are ready.</p>}
        </div>
        <div className={styles.controls}>
          <div className={badgeClass(state?.overall)}>{state?.overall ?? "checking"}</div>
          <button className={styles.button} disabled={busy} type="button" onClick={load}>{busy ? "Checking..." : "Refresh"}</button>
          <button className={styles.primaryButton} disabled={!nextFix} type="button" onClick={() => scrollToTarget(nextFix?.href)}>{nextFix ? "Fix Next" : "Ready"}</button>
        </div>
      </div>

      <div className={styles.grid}>
        {(state?.checks ?? []).map((check) => (
          <a className={`${styles.item} ${check.ok ? styles.ok : styles.bad}`} href={check.href ?? "#"} key={check.name}>
            <strong>{check.ok ? "PASS" : "FIX"} · {check.name}</strong>
            <span>{check.detail}</span>
          </a>
        ))}
      </div>
    </article>
  );
}
