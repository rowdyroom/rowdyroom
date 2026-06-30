"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./RunSheetPanel.module.css";

type RunSheetState = {
  showName: string;
  startTime: string;
  preshow: string;
  opening: string;
  warmup: string;
  mainSet: string;
  rumble: string;
  break: string;
  finalPush: string;
  close: string;
};

const storageKey = "rowdyroom-run-sheet";

const defaults: RunSheetState = {
  showName: "Rowdy Room Live",
  startTime: "",
  preshow: "Check audio, camera, links, queue, TikFinity, and Show Mode gate.",
  opening: "Welcome everyone, explain sing/vote/boost/connect, and pin the key links.",
  warmup: "First singers get the room moving. Keep voting simple and chat active.",
  mainSet: "Run the queue, call next singers early, push votes after each performance.",
  rumble: "Only activate Rumble when ready. Explain rules before starting.",
  break: "Short reset. Remind chat to stay, vote, boost, and sign up.",
  finalPush: "Call out leaders, Main 4 movement, best performances, and last-chance votes.",
  close: "Thank singers, call next show, push Discord/Rowdy Bunch, and save After-Show Recap.",
};

function buildReport(state: RunSheetState) {
  const start = state.startTime.trim() || "set at show time";
  return [
    `${state.showName || "Rowdy Room Live"} Run Sheet`,
    `Start: ${start}`,
    "",
    `Pre-show: ${state.preshow}`,
    `Opening: ${state.opening}`,
    `Warmup: ${state.warmup}`,
    `Main set: ${state.mainSet}`,
    `Rumble: ${state.rumble}`,
    `Break: ${state.break}`,
    `Final push: ${state.finalPush}`,
    `Close: ${state.close}`,
  ].join("\n");
}

function steps(state: RunSheetState) {
  return [
    ["Pre-show", state.preshow],
    ["Opening", state.opening],
    ["Warmup", state.warmup],
    ["Main set", state.mainSet],
    ["Rumble", state.rumble],
    ["Break", state.break],
    ["Final push", state.finalPush],
    ["Close", state.close],
  ];
}

async function saveMemory(content: string) {
  const response = await fetch("/api/memory", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kind: "task",
      title: "Run Sheet",
      content,
      source: "run-sheet",
    }),
  });
  return response.ok;
}

export function RunSheetPanel() {
  const [state, setState] = useState<RunSheetState>(defaults);
  const [message, setMessage] = useState("Build the order of the show before going live.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setState({ ...defaults, ...(JSON.parse(raw) as RunSheetState) });
      } catch {
        setState(defaults);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const report = useMemo(() => buildReport(state), [state]);

  function update<K extends keyof RunSheetState>(key: K, value: RunSheetState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  async function copyReport() {
    await navigator.clipboard.writeText(report);
    setMessage("Run sheet copied.");
  }

  async function saveReport() {
    setBusy(true);
    try {
      const saved = await saveMemory(report);
      setMessage(saved ? "Run sheet saved to Mission Memory." : "Run sheet save failed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Run sheet save failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setState(defaults);
    setMessage("Run sheet reset to default flow.");
  }

  return (
    <article className={`panel ${styles.panel}`} id="run-sheet">
      <div className="panelHeader">
        <p className="eyebrow">Live Operations</p>
        <h2>Run Sheet</h2>
        <p className="panelIntro">Plan the flow of the show so the room does not drift once singers, votes, and chat start moving.</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3>Show Flow</h3>
          <div className={styles.fields}>
            <label className={styles.field}><span>Show name</span><input value={state.showName} onChange={(event) => update("showName", event.target.value)} /></label>
            <label className={styles.field}><span>Start time</span><input value={state.startTime} onChange={(event) => update("startTime", event.target.value)} placeholder="Example: 8:00 PM" /></label>
            <label className={styles.field}><span>Pre-show</span><textarea value={state.preshow} onChange={(event) => update("preshow", event.target.value)} /></label>
            <label className={styles.field}><span>Opening</span><textarea value={state.opening} onChange={(event) => update("opening", event.target.value)} /></label>
            <label className={styles.field}><span>Warmup</span><textarea value={state.warmup} onChange={(event) => update("warmup", event.target.value)} /></label>
            <label className={styles.field}><span>Main set</span><textarea value={state.mainSet} onChange={(event) => update("mainSet", event.target.value)} /></label>
            <label className={styles.field}><span>Rumble</span><textarea value={state.rumble} onChange={(event) => update("rumble", event.target.value)} /></label>
            <label className={styles.field}><span>Break</span><textarea value={state.break} onChange={(event) => update("break", event.target.value)} /></label>
            <label className={styles.field}><span>Final push</span><textarea value={state.finalPush} onChange={(event) => update("finalPush", event.target.value)} /></label>
            <label className={styles.field}><span>Close</span><textarea value={state.close} onChange={(event) => update("close", event.target.value)} /></label>
          </div>
          <div className={styles.buttons}>
            <button className={styles.button} type="button" onClick={copyReport}>Copy Run Sheet</button>
            <button className={styles.buttonAlt} disabled={busy} type="button" onClick={saveReport}>Save Memory</button>
            <button className={styles.buttonAlt} type="button" onClick={reset}>Reset</button>
          </div>
          <p className={styles.note}>{message}</p>
        </section>

        <section className={styles.card}>
          <h3>Live Order</h3>
          <div className={styles.steps}>
            {steps(state).map(([label, detail]) => (
              <div className={styles.step} key={label}>
                <strong>{label}</strong>
                <span>{detail}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
