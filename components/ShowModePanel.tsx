"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./ShowModePanel.module.css";

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

type ManualItem = {
  id: string;
  label: string;
};

const manualItems: ManualItem[] = [
  { id: "mic", label: "Mic, mixer, headphones, and monitoring checked" },
  { id: "live-studio", label: "TikTok LIVE Studio scene and camera checked" },
  { id: "audio", label: "Music audio, vocal audio, and delay checked" },
  { id: "tiktok-chat", label: "TikTok chat visible and readable" },
  { id: "tikfinity", label: "TikFinity connected and overlay screen ready" },
  { id: "queue", label: "Queue link, sign-up flow, and backup direct links ready" },
  { id: "mods", label: "Mods or trusted helpers know tonight’s rules" },
];

const storageKey = "rowdyroom-show-mode-checklist";

function gateClass(overall?: MissionStatusState["overall"], manualReady = false) {
  if (overall === "ready" && manualReady) return styles.gate;
  if (overall === "needs-attention") return `${styles.gate} ${styles.bad}`;
  return `${styles.gate} ${styles.warn}`;
}

export function ShowModePanel() {
  const [status, setStatus] = useState<MissionStatusState | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Run the pre-show check before going live.");

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setChecked(JSON.parse(raw) as Record<string, boolean>);
      } catch {
        setChecked({});
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(checked));
  }, [checked]);

  const manualReady = useMemo(() => manualItems.every((item) => checked[item.id]), [checked]);
  const systemReady = status?.overall === "ready";
  const goLiveReady = manualReady && systemReady;

  async function runCheck() {
    setBusy(true);
    setMessage("Checking Mission Control systems...");
    try {
      const response = await fetch("/api/mission-status", { cache: "no-store" });
      const json = (await response.json()) as MissionStatusState;
      setStatus(json);
      if (json.overall === "ready" && manualReady) {
        setMessage("Go-live gate is clear.");
      } else if (json.overall === "needs-attention") {
        setMessage(`Fix ${json.nextAction} before going live.`);
      } else {
        setMessage("System is usable. Finish the manual show checklist before going live.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pre-show check failed.");
    } finally {
      setBusy(false);
    }
  }

  function toggle(id: string) {
    setChecked((current) => ({ ...current, [id]: !current[id] }));
  }

  function reset() {
    setChecked({});
    setMessage("Checklist reset for the next show.");
  }

  const gateText = goLiveReady ? "READY TO GO LIVE" : status?.overall === "needs-attention" ? "FIX BEFORE LIVE" : "NOT READY YET";
  const gateDetail = goLiveReady ? "Systems and manual show checks are complete." : manualReady ? "Manual checks done. Finish system fixes." : "Finish the checklist and run the system check.";

  return (
    <article className={`panel ${styles.panel}`} id="show-mode">
      <div className={styles.top}>
        <div>
          <p className="eyebrow">Live Operations</p>
          <h2>Show Mode</h2>
          <p className="panelIntro">A single pre-show gate for Rowdy Room live nights. Use it before TikTok LIVE Studio goes live.</p>
        </div>
        <div className={gateClass(status?.overall, manualReady)}>
          <strong>{gateText}</strong>
          <span>{gateDetail}</span>
        </div>
      </div>

      <div className={styles.buttons}>
        <button className={styles.button} disabled={busy} type="button" onClick={runCheck}>{busy ? "Checking..." : "Run Pre-Show Check"}</button>
        <button className={styles.buttonAlt} type="button" onClick={reset}>Reset Checklist</button>
        <a className={styles.buttonAlt} href="#tiktok-control-plan">TikTok Setup</a>
        <a className={styles.buttonAlt} href="#songfinder-guard">Songfinder</a>
      </div>

      <p className={styles.note}>{message}</p>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3>Manual Show Checklist</h3>
          <div className={styles.checklist}>
            {manualItems.map((item) => (
              <label className={styles.check} key={item.id}>
                <input checked={Boolean(checked[item.id])} onChange={() => toggle(item.id)} type="checkbox" />
                <span>{item.label}</span>
              </label>
            ))}
          </div>
        </section>

        <section className={styles.card}>
          <h3>System Gate</h3>
          <div className={styles.statusList}>
            {(status?.checks ?? []).map((check) => (
              <a className={styles.statusRow} href={check.href ?? "#"} key={check.name}>
                <strong>{check.name}</strong>
                <span className={check.ok ? styles.pass : styles.fix}>{check.ok ? "PASS" : "FIX"} · {check.detail}</span>
              </a>
            ))}
            {!status ? <p className={styles.note}>No system check run yet.</p> : null}
          </div>
        </section>
      </div>
    </article>
  );
}
