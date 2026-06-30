"use client";

import { useEffect, useState } from "react";
import styles from "./SupabaseSetup.module.css";

const projectUrl = "https://dupwuopnpmdsprxxqsle.supabase.co";

type EnvStatus = {
  ok?: boolean;
  env?: Record<string, boolean>;
  error?: string;
};

type MemoryHealth = {
  ok: boolean;
  localMemory: boolean;
  supabase?: {
    ok: boolean;
    configured: boolean;
    status?: number;
    error?: string;
  };
};

async function bridge(action: string, body: Record<string, unknown> = {}) {
  const response = await fetch("/api/local-bridge", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action, ...body }),
  });
  return (await response.json()) as EnvStatus;
}

export function SupabaseSetup() {
  const [status, setStatus] = useState<EnvStatus | null>(null);
  const [serviceValue, setServiceValue] = useState("");
  const [memoryHealth, setMemoryHealth] = useState<MemoryHealth | null>(null);
  const [message, setMessage] = useState("Supabase Memory table is created. Save the local URL and service value here, not in chat.");
  const [busy, setBusy] = useState(false);

  async function load() {
    const json = await bridge("envStatus");
    setStatus(json);
  }

  useEffect(() => {
    load().catch(() => setMessage("Local bridge is not ready for Supabase setup."));
  }, []);

  async function saveUrl() {
    setBusy(true);
    try {
      await bridge("setEnv", { name: "SUPABASE_URL", value: projectUrl });
      await load();
      setMessage("Supabase URL saved locally.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function saveService() {
    if (!serviceValue.trim()) {
      setMessage("Paste the Supabase service value into the local field first.");
      return;
    }
    setBusy(true);
    try {
      await bridge("setEnv", { name: "SUPABASE_SERVICE_ROLE_KEY", value: serviceValue.trim() });
      setServiceValue("");
      await load();
      setMessage("Supabase service value saved locally. It was not printed or sent to chat. Restart Mission Control for it to take effect.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function testMemory() {
    setBusy(true);
    try {
      const response = await fetch("/api/memory/health");
      const json = (await response.json()) as MemoryHealth;
      setMemoryHealth(json);
      if (json.supabase?.ok) {
        setMessage("Mission Memory can reach Supabase.");
      } else if (json.supabase?.configured) {
        setMessage(`Supabase values are saved, but the memory check failed: ${json.supabase.error ?? json.supabase.status ?? "unknown error"}`);
      } else {
        setMessage("Local memory works. Supabase values are not loaded by this running server yet. Restart fresh after saving them.");
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Memory health check failed.");
    } finally {
      setBusy(false);
    }
  }

  async function restartFresh() {
    setBusy(true);
    try {
      await bridge("startServer", { port: 3001 });
      setMessage("Fresh Mission Control is starting on port 3001. Opening it now.");
      window.setTimeout(() => {
        window.location.href = "http://localhost:3001/#mission-memory";
      }, 7000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Restart failed.");
    } finally {
      setBusy(false);
    }
  }

  const env = status?.env ?? {};

  return (
    <article className={`panel ${styles.panel}`} id="supabase-setup">
      <div className="panelHeader">
        <p className="eyebrow">Supabase</p>
        <h2>Memory Setup</h2>
        <p className="panelIntro">Save Supabase settings locally through the bridge so Mission Memory can sync without pasting private values into chat.</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <label className={styles.field}>
            <span>Project URL</span>
            <input className={styles.input} value={projectUrl} readOnly />
          </label>
          <label className={styles.field}>
            <span>Service value, paste locally only</span>
            <input className={styles.input} value={serviceValue} onChange={(event) => setServiceValue(event.target.value)} type="password" placeholder="Paste Supabase service value here locally" />
          </label>
          <div className={styles.buttons}>
            <button className={styles.button} disabled={busy} type="button" onClick={saveUrl}>Save URL</button>
            <button className={styles.button} disabled={busy} type="button" onClick={saveService}>Save Service Value</button>
            <button className={styles.buttonAlt} disabled={busy} type="button" onClick={testMemory}>Test Memory</button>
            <button className={styles.buttonAlt} disabled={busy} type="button" onClick={restartFresh}>Restart Fresh</button>
          </div>
          <p className={message.toLowerCase().includes("fail") || message.toLowerCase().includes("not ready") ? styles.error : styles.note}>{message}</p>
        </section>

        <section className={styles.card}>
          <h3>Local Status</h3>
          <div className={styles.status}>
            <div className={styles.statusRow}><span>Bridge</span><strong>{status?.ok ? "Ready" : "Not Ready"}</strong></div>
            <div className={styles.statusRow}><span>SUPABASE_URL</span><strong>{env.SUPABASE_URL ? "Saved" : "Missing"}</strong></div>
            <div className={styles.statusRow}><span>SUPABASE_SERVICE_ROLE_KEY</span><strong>{env.SUPABASE_SERVICE_ROLE_KEY ? "Saved" : "Missing"}</strong></div>
            <div className={styles.statusRow}><span>Memory Sync</span><strong>{memoryHealth?.supabase?.ok ? "Ready" : memoryHealth ? "Not Ready" : "Untested"}</strong></div>
          </div>
          <p className={styles.note}>The service value is written to your local environment file through the bridge. It is not committed to GitHub.</p>
        </section>
      </div>
    </article>
  );
}
