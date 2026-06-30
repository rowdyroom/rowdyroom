"use client";

import { useEffect, useState } from "react";
import styles from "./LocalBridgePanel.module.css";

type BridgeState = {
  ok?: boolean;
  bridge?: string;
  storageRoot?: string;
  desktopRoot?: string;
  approvedRoots?: string[];
  port?: number;
  error?: string;
};

async function bridge(action: string, body: Record<string, unknown> = {}) {
  const response = await fetch("/api/local-bridge", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, ...body }),
  });
  return (await response.json()) as BridgeState;
}

export function LocalBridgePanel() {
  const [state, setState] = useState<BridgeState | null>(null);
  const [message, setMessage] = useState("Checking local bridge...");
  const [busy, setBusy] = useState(false);

  async function check() {
    try {
      const response = await fetch("/api/local-bridge");
      const json = (await response.json()) as BridgeState;
      setState(json);
      setMessage(json.ok ? "Local bridge is connected." : json.error ?? "Local bridge is not ready.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Local bridge check failed.");
    }
  }

  useEffect(() => {
    check();
  }, []);

  async function fixLocalSetup() {
    setBusy(true);
    setMessage("Refreshing code and restarting local app...");
    try {
      await bridge("refreshProject");
      await bridge("stopServer");
      await bridge("startServer", { port: 3000 });
      await check();
      setMessage("Done. Rowdy Room was refreshed from GitHub and restarted on port 3000.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Local setup repair failed.");
    } finally {
      setBusy(false);
    }
  }

  const approved = state?.approvedRoots?.join("\n") ?? "Desktop, D drive, F drive, and RowdyRoom config when available.";

  return (
    <article className={`panel ${styles.panel}`} id="local-bridge">
      <div className="panelHeader">
        <p className="eyebrow">Local Bridge</p>
        <h2>PC Helper</h2>
        <p className="panelIntro">Uses the approved Desktop, D drive, F drive, and RowdyRoom config access so you do not have to keep doing local cleanup manually.</p>
      </div>

      <div className={styles.grid}>
        <div className={styles.stat}><span>Status</span><strong>{state?.ok ? "Connected" : "Not Ready"}</strong></div>
        <div className={styles.stat}><span>Bridge</span><strong>{state?.bridge ?? "Checking"}</strong></div>
        <div className={styles.stat}><span>Port</span><strong>{state?.port ?? "4777"}</strong></div>
        <div className={styles.stat}><span>Storage</span><strong>{state?.storageRoot ?? "D/F fallback"}</strong></div>
      </div>

      <button className={styles.button} disabled={busy} type="button" onClick={fixLocalSetup}>
        {busy ? "Working..." : "Fix Local Setup"}
      </button>

      <p className={message.toLowerCase().includes("fail") || message.toLowerCase().includes("not ready") ? styles.error : styles.note}>{message}</p>
      <p className={styles.note}>Approved roots:\n{approved}\nE drive is intentionally not included.</p>
    </article>
  );
}
