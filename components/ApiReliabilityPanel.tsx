"use client";

import { useState } from "react";
import styles from "./ApiReliabilityPanel.module.css";

type ProviderStatus = {
  id: string;
  name: string;
  env: string;
  configured: boolean;
  modelEnv: string | null;
  model: string | null;
  testNote: string;
};

type TestResult = {
  ok: boolean;
  id: string;
  name: string;
  status?: number;
  statusText?: string;
  error?: string | null;
  checkedAt?: string;
};

type ApiHealth = {
  ok: boolean;
  providers?: ProviderStatus[];
  results?: TestResult[];
};

type KeyField = {
  label: string;
  env: string;
  placeholder: string;
};

const keyFields: KeyField[] = [
  { label: "ChatGPT", env: "OPENAI_API_KEY", placeholder: "Paste OpenAI key locally" },
  { label: "Claude", env: "ANTHROPIC_API_KEY", placeholder: "Paste Anthropic key locally" },
  { label: "Grok", env: "XAI_API_KEY", placeholder: "Paste xAI key locally" },
  { label: "Gemini", env: "GEMINI_API_KEY", placeholder: "Paste Gemini key locally" },
  { label: "YouTube", env: "YOUTUBE_API_KEY", placeholder: "Paste YouTube Data API key locally" },
];

function providerLine(provider: ProviderStatus) {
  const model = provider.modelEnv ? ` / ${provider.modelEnv}: ${provider.model}` : "";
  return `${provider.configured ? "configured" : `missing ${provider.env}`}${model}`;
}

async function setLocalEnv(name: string, value: string) {
  const response = await fetch("/api/local-bridge", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ action: "setEnv", name, value }),
  });
  return response.json();
}

export function ApiReliabilityPanel() {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [setupOpen, setSetupOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<string | null>(null);

  async function loadStatus() {
    setLoading(true);
    try {
      const response = await fetch("/api/api-health");
      setHealth((await response.json()) as ApiHealth);
    } finally {
      setLoading(false);
    }
  }

  async function runLiveTests() {
    setLoading(true);
    try {
      const response = await fetch("/api/api-health", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ provider: "all" }),
      });
      const json = (await response.json()) as ApiHealth;
      setTestResults(json.results ?? []);
    } finally {
      setLoading(false);
    }
  }

  async function saveKey(field: KeyField) {
    const value = values[field.env]?.trim();
    if (!value) {
      setMessage(`Paste the ${field.label} value locally first.`);
      return;
    }

    setLoading(true);
    try {
      await setLocalEnv(field.env, value);
      setValues((current) => ({ ...current, [field.env]: "" }));
      setMessage(`${field.label} value saved locally. It was not printed or committed. Restart fresh before testing.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Save failed.");
    } finally {
      setLoading(false);
    }
  }

  async function restartFresh() {
    setLoading(true);
    setMessage("Starting fresh Mission Control on port 3001...");
    try {
      const response = await fetch("/api/local-bridge", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "startServer", port: 3001 }),
      });
      await response.json();
      window.setTimeout(() => {
        window.location.href = "http://localhost:3001/#api-reliability";
      }, 7000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Restart failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className={`panel ${styles.panel}`} id="api-reliability">
      <div className="panelHeader">
        <p className="eyebrow">Reliability</p>
        <h2>API Health + YouTube Quota Guard</h2>
        <p className="panelIntro">Keep paid AI and songfinder tools checked before a show, not during the panic.</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.box}>
          <h3>AI API Reliability</h3>
          <p>Mission Control checks saved keys first, then runs a light live test only when you ask it to.</p>
          <ul>
            <li>Keys stay local in <strong>C:\Users\Roger\RowdyRoom\.env.local</strong>.</li>
            <li>Use live tests before a show, not repeatedly while live.</li>
          </ul>
          <div className={styles.buttons}>
            <button className={styles.button} type="button" disabled={loading} onClick={loadStatus}>Check Saved Keys</button>
            <button className={styles.button} type="button" disabled={loading} onClick={runLiveTests}>Run Live API Tests</button>
            <button className={styles.buttonAlt} type="button" disabled={loading} onClick={() => setSetupOpen((open) => !open)}>{setupOpen ? "Hide Key Setup" : "Local Key Setup"}</button>
          </div>
        </section>

        <section className={styles.box}>
          <h3>YouTube Songfinder Guard</h3>
          <p>The fix is to stop treating every song request as a fresh YouTube search.</p>
          <ul>
            <li>Cache search results during the show.</li>
            <li>Reuse exact song matches.</li>
            <li>Let trusted hosts paste direct YouTube links when search quota is low.</li>
          </ul>
        </section>
      </div>

      {setupOpen ? (
        <section className={styles.setupBox}>
          <h3>Local Key Setup</h3>
          <p>Paste values here on your PC only. The bridge writes them locally. Nothing here is committed to GitHub.</p>
          <div className={styles.keyGrid}>
            {keyFields.map((field) => (
              <label className={styles.keyField} key={field.env}>
                <span>{field.label}</span>
                <input
                  value={values[field.env] ?? ""}
                  onChange={(event) => setValues((current) => ({ ...current, [field.env]: event.target.value }))}
                  placeholder={field.placeholder}
                  type="password"
                />
                <button className={styles.buttonAlt} type="button" disabled={loading} onClick={() => saveKey(field)}>Save {field.label}</button>
              </label>
            ))}
          </div>
          <div className={styles.buttons}>
            <button className={styles.button} type="button" disabled={loading} onClick={restartFresh}>Restart Fresh</button>
            <button className={styles.buttonAlt} type="button" disabled={loading} onClick={loadStatus}>Recheck Saved Keys</button>
          </div>
          {message ? <p className={styles.note}>{message}</p> : null}
        </section>
      ) : null}

      {health?.providers?.length ? (
        <div className={styles.statusList}>
          {health.providers.map((provider) => (
            <div className={styles.statusRow} key={provider.id}>
              <strong>{provider.name}</strong>
              <span className={provider.configured ? styles.good : styles.bad}>{providerLine(provider)}</span>
            </div>
          ))}
        </div>
      ) : null}

      {testResults.length ? (
        <div className={styles.statusList}>
          {testResults.map((result) => (
            <div className={styles.statusRow} key={result.id}>
              <strong>{result.name}</strong>
              <span className={result.ok ? styles.good : styles.bad}>
                {result.ok ? `live test passed (${result.status})` : result.error ?? `failed (${result.status})`}
              </span>
            </div>
          ))}
        </div>
      ) : null}

      <p className={styles.warn}>
        YouTube search quota is the fragile point. The live-show rule is: search once, cache the result, and never let every viewer hammer the YouTube search API.
      </p>
    </article>
  );
}
