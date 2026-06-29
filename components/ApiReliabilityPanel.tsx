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

function providerLine(provider: ProviderStatus) {
  const model = provider.modelEnv ? ` / ${provider.modelEnv}: ${provider.model}` : "";
  return `${provider.configured ? "configured" : `missing ${provider.env}`}${model}`;
}

export function ApiReliabilityPanel() {
  const [health, setHealth] = useState<ApiHealth | null>(null);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(false);

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
          <p>Mission Control should check saved keys first, then run a light live test only when you ask it to.</p>
          <ul>
            <li>Keys stay local in <strong>C:\Users\Roger\RowdyRoom\.env.local</strong>.</li>
            <li>Model names can be overridden with OPENAI_MODEL, ANTHROPIC_MODEL, XAI_MODEL, and GEMINI_MODEL.</li>
            <li>Use live tests before a show, not repeatedly while live.</li>
          </ul>
          <div className={styles.buttons}>
            <button className={styles.button} type="button" disabled={loading} onClick={loadStatus}>Check Saved Keys</button>
            <button className={styles.button} type="button" disabled={loading} onClick={runLiveTests}>Run Live API Tests</button>
          </div>
        </section>

        <section className={styles.box}>
          <h3>YouTube Songfinder Guard</h3>
          <p>The fix is to stop treating every song request as a fresh YouTube search.</p>
          <ul>
            <li>Cache search results during the show.</li>
            <li>Reuse exact song matches.</li>
            <li>Let trusted hosts paste direct YouTube links when search quota is low.</li>
            <li>Keep a backup API key/project only for emergencies.</li>
          </ul>
        </section>
      </div>

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
