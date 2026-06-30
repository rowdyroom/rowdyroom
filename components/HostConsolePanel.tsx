"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./HostConsolePanel.module.css";

type HostState = {
  roomName: string;
  currentSinger: string;
  nextSinger: string;
  song: string;
  prize: string;
  theme: string;
  command: string;
  customNote: string;
};

type HostLine = {
  id: string;
  title: string;
  text: string;
};

const storageKey = "rowdyroom-host-console";

const defaults: HostState = {
  roomName: "Rowdy Room",
  currentSinger: "",
  nextSinger: "",
  song: "",
  prize: "",
  theme: "Live Karaoke. Real Votes. Real Community.",
  command: "!boost",
  customNote: "",
};

function buildLines(state: HostState): HostLine[] {
  const currentSinger = state.currentSinger.trim() || "our current singer";
  const nextSinger = state.nextSinger.trim() || "the next singer";
  const song = state.song.trim() || "their song";
  const prize = state.prize.trim() || "bragging rights and the spotlight";
  const command = state.command.trim() || "!boost";

  return [
    {
      id: "opening",
      title: "Opening",
      text: `Welcome to ${state.roomName}. ${state.theme} If you want in, get signed up, stay active in chat, and help pick who owns the room tonight.`,
    },
    {
      id: "singer-intro",
      title: "Singer Intro",
      text: `Up now: ${currentSinger} with ${song}. Chat, give them a clean count-in and let them know you are listening.`,
    },
    {
      id: "vote",
      title: "Voting Push",
      text: `Lock in your vote now. Do not just watch the room happen. Vote, react, and help decide who climbs tonight.`,
    },
    {
      id: "boost",
      title: "Boost Push",
      text: `Use ${command} if you want to boost the energy. Boosts help the room move, help singers stand out, and keep the show alive.`,
    },
    {
      id: "next-up",
      title: "Next Up",
      text: `${nextSinger}, you are coming up next. Make sure your mic, lyrics, and track are ready so we keep the room moving.`,
    },
    {
      id: "prize",
      title: "Prize / Stakes",
      text: `Tonight we are playing for ${prize}. Sing clean, bring energy, and let the room decide who earns the moment.`,
    },
    {
      id: "break",
      title: "Quick Break",
      text: `Quick reset. Stay in the room, check the queue, get your votes ready, and do not disappear. We are coming right back.`,
    },
    {
      id: "close",
      title: "Close",
      text: `That is the Rowdy Room for tonight. Follow, join the Rowdy Bunch, and come back ready to sing, vote, boost, and connect.`,
    },
  ];
}

async function saveMemory(content: string) {
  const response = await fetch("/api/memory", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      kind: "note",
      title: "Host Console Lines",
      content,
      source: "host-console",
    }),
  });
  return response.ok;
}

export function HostConsolePanel() {
  const [state, setState] = useState<HostState>(defaults);
  const [message, setMessage] = useState("Set tonight’s names and copy host lines while live.");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(storageKey);
    if (raw) {
      try {
        setState({ ...defaults, ...(JSON.parse(raw) as HostState) });
      } catch {
        setState(defaults);
      }
    }
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
  }, [state]);

  const lines = useMemo(() => buildLines(state), [state]);
  const allLines = useMemo(() => lines.map((line) => `${line.title}: ${line.text}`).join("\n\n"), [lines]);

  function update<K extends keyof HostState>(key: K, value: HostState[K]) {
    setState((current) => ({ ...current, [key]: value }));
  }

  async function copy(text: string, label: string) {
    await navigator.clipboard.writeText(text);
    setMessage(`${label} copied.`);
  }

  async function saveLines() {
    setBusy(true);
    try {
      const saved = await saveMemory(`Current host setup:\n${JSON.stringify(state, null, 2)}\n\nHost lines:\n\n${allLines}`);
      setMessage(saved ? "Host lines saved to Mission Memory." : "Host line save failed.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Host line save failed.");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    setState(defaults);
    setMessage("Host Console reset.");
  }

  return (
    <article className={`panel ${styles.panel}`} id="host-console">
      <div className="panelHeader">
        <p className="eyebrow">Live Operations</p>
        <h2>Host Console</h2>
        <p className="panelIntro">Fast host lines for intros, voting, boosts, next singer calls, breaks, and closing the room.</p>
      </div>

      <div className={styles.grid}>
        <section className={styles.card}>
          <h3>Tonight</h3>
          <div className={styles.fields}>
            <label className={styles.field}><span>Room name</span><input value={state.roomName} onChange={(event) => update("roomName", event.target.value)} /></label>
            <label className={styles.field}><span>Current singer</span><input value={state.currentSinger} onChange={(event) => update("currentSinger", event.target.value)} placeholder="Singer on now" /></label>
            <label className={styles.field}><span>Song</span><input value={state.song} onChange={(event) => update("song", event.target.value)} placeholder="Song / artist" /></label>
            <label className={styles.field}><span>Next singer</span><input value={state.nextSinger} onChange={(event) => update("nextSinger", event.target.value)} placeholder="Up next" /></label>
            <label className={styles.field}><span>Prize / stakes</span><input value={state.prize} onChange={(event) => update("prize", event.target.value)} placeholder="Prize, points, Main 4, etc." /></label>
            <label className={styles.field}><span>Boost command</span><input value={state.command} onChange={(event) => update("command", event.target.value)} /></label>
            <label className={styles.field}><span>Theme line</span><textarea value={state.theme} onChange={(event) => update("theme", event.target.value)} /></label>
          </div>
          <div className={styles.buttons}>
            <button className={styles.button} type="button" onClick={() => copy(allLines, "All host lines")}>Copy All Lines</button>
            <button className={styles.buttonAlt} disabled={busy} type="button" onClick={saveLines}>Save Memory</button>
            <button className={styles.buttonAlt} type="button" onClick={reset}>Reset</button>
          </div>
          <p className={styles.note}>{message}</p>
        </section>

        <section className={styles.card}>
          <h3>Copy Lines</h3>
          <div className={styles.lineGrid}>
            {lines.map((line) => (
              <div className={styles.line} key={line.id}>
                <strong>{line.title}</strong>
                <p>{line.text}</p>
                <button className={styles.buttonAlt} type="button" onClick={() => copy(line.text, line.title)}>Copy</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </article>
  );
}
