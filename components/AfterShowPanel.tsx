"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./AfterShowPanel.module.css";

type AfterShowState = {
  date: string;
  topSinger: string;
  mainFour: string;
  bestMoment: string;
  problems: string;
  fixes: string;
  nextShow: string;
  notes: string;
};

const storageKey = "rowdyroom-after-show";

const defaults: AfterShowState = {
  date: new Date().toLocaleDateString(),
  topSinger: "",
  mainFour: "",
  bestMoment: "",
  problems: "",
  fixes: "",
  nextShow: "",
  notes: "",
};

function buildReport(state: AfterShowState) {
  return [
    "Rowdy Room After-Show Recap",
    `Date: ${state.date || new Date().toLocaleDateString()}`,
    "",
    `Top singer / standout: ${state.topSinger || "Not recorded"}`,
    `Main 4 / leaders: ${state.mainFour || "Not recorded"}`,
    `Best moment: ${state.bestMoment || "Not recorded"}`,
    "",
    "Problems:",
    state.problems || "None recorded",
    "",
    "Fixes for next time:",
    state.fixes || "None recorded",
    "",
    "Next show plan:",
    state.nextShow || "Not recorded",
    "",
    "Extra notes:",
    state.notes || "None",
  ].join("\n");
}

async function saveMemory(content: string) {
  const response = await fetch("/api/memory", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kind: "note",
      title: "After-Show Recap",
      content,
      source: "after-show",
    }),
  });
  return response.ok;
}

export function AfterShowPanel() {
  const [state, setState] = useState<AfterShowState>(defaults);
  const [message, setMessage] = useState("Capture what happened while it is still fresh.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setState({ ...defaults, ...(JSON.parse(raw) as AfterShowState) });
      } catch {
        setState(defaults);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const report = useMemo(() => buildReport(state), [state]);

  function update<K extends keyof AfterShowState>(key: K, value: AfterShowState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  async function copyReport() {
    await navigator.clipboard.writeText(report);
    setMessage("After-show recap copied.");
  }

  async function saveReport() {
    setBusy(true);
    try {
      const saved = await saveMemory(report);
      setMessage(saved ? "After-show recap saved to Mission Memory." : "After-show recap save failed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "After-show recap save failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setState({ ...defaults, date: new Date().toLocaleDateString() });
    setMessage("After-show recap reset.");
  }

  return (
    <article className={`panel ${styles.panel}`} id="after-show">
      <div className="panelHeader">
        <p className="eyebrow">Live Operations</p>
        <h2>After-Show Recap</h2>
        <p className="panelIntro">Close the loop after a live room: winners, Main 4, problems, fixes, and the next show plan.</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3>Show Notes</h3>
          <div className={styles.fields}>
            <label className={styles.field}><span>Date</span><input value={state.date} onChange={(event) => update("date", event.target.value)} /></label>
            <label className={styles.field}><span>Top singer / standout</span><input value={state.topSinger} onChange={(event) => update("topSinger", event.target.value)} /></label>
            <label className={styles.field}><span>Main 4 / leaders</span><input value={state.mainFour} onChange={(event) => update("mainFour", event.target.value)} /></label>
            <label className={styles.field}><span>Best moment</span><textarea value={state.bestMoment} onChange={(event) => update("bestMoment", event.target.value)} /></label>
            <label className={styles.field}><span>Problems</span><textarea value={state.problems} onChange={(event) => update("problems", event.target.value)} /></label>
            <label className={styles.field}><span>Fixes for next time</span><textarea value={state.fixes} onChange={(event) => update("fixes", event.target.value)} /></label>
            <label className={styles.field}><span>Next show plan</span><textarea value={state.nextShow} onChange={(event) => update("nextShow", event.target.value)} /></label>
            <label className={styles.field}><span>Extra notes</span><textarea value={state.notes} onChange={(event) => update("notes", event.target.value)} /></label>
          </div>
          <div className={styles.buttons}>
            <button className={styles.button} type="button" onClick={copyReport}>Copy Recap</button>
            <button className={styles.buttonAlt} disabled={busy} type="button" onClick={saveReport}>Save Memory</button>
            <button className={styles.buttonAlt} type="button" onClick={reset}>Reset</button>
          </div>
          <p className={styles.note}>{message}</p>
        </section>

        <section className={styles.card}>
          <h3>Preview</h3>
          <div className={styles.report}>{report}</div>
        </section>
      </div>
    </article>
  );
}
