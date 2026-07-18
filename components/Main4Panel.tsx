"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  formatPanelCountdown,
  normalizePanelStatus,
  panelSlotLabel,
  validateRumbleResults,
} from "../lib/panel-contract.js";
import styles from "./Main4Panel.module.css";

type PanelSlot = {
  panel_slot: number;
  slot_type: string;
  singer_id: string | null;
  singer_name: string | null;
  source: string;
  locked_until: string | null;
  game_score: number;
  signup_rank: number | null;
  qualifying_value: number | null;
  qualifying_detail: Record<string, number>;
  assignment_version: number;
};

type PanelState = {
  mode: "live" | "rumble_protected";
  show_started_at: string | null;
  regular_cursor_rank: number;
  regular_cycle: number;
  current_rumble_session_id: string | null;
  protection_started_at: string | null;
  protection_ends_at: string | null;
  protection_seconds_remaining: number;
  state_version: number;
  slots: PanelSlot[];
};

type RumbleRow = {
  id: string;
  singer_name: string;
  team: string;
  game_score: string;
};

const sessionStorageKey = "rowdyroom-main4-host-session";

function newRumbleRow(index: number): RumbleRow {
  return {
    id: crypto.randomUUID(),
    singer_name: "",
    team: index % 2 === 0 ? "red" : "blue",
    game_score: "0",
  };
}

function slotHeading(slot: PanelSlot) {
  if (slot.slot_type === "rumble_winner") return `Rumble Winner #${slot.panel_slot}`;
  return panelSlotLabel(slot.panel_slot);
}

function slotDetail(slot: PanelSlot) {
  if (!slot.singer_name) return slot.panel_slot <= 4 ? "Waiting for a qualifier" : "Waiting for the next signup";
  if (slot.slot_type === "main_score") {
    return `${Number(slot.qualifying_value ?? 0).toFixed(2)} average Â· ${slot.qualifying_detail.vote_count ?? 0} votes`;
  }
  if (slot.slot_type === "main_gift") {
    return `${Math.round(Number(slot.qualifying_value ?? 0)).toLocaleString()} gift tokens`;
  }
  if (slot.slot_type === "rumble_winner") return `${slot.game_score.toLocaleString()} game points`;
  return `Signup position ${slot.signup_rank ?? "â€”"}`;
}

async function readResponse(response: Response) {
  const json = await response.json().catch(() => null);
  if (!response.ok || !json?.ok) throw new Error(json?.message || `Panel request failed (${response.status}).`);
  return json;
}

export function Main4Panel() {
  const [panel, setPanel] = useState<PanelState | null>(null);
  const [message, setMessage] = useState("Connecting to the panel authority...");
  const [busy, setBusy] = useState(false);
  const [hostPassword, setHostPassword] = useState("");
  const [hostName, setHostName] = useState("Roger");
  const [sessionToken, setSessionToken] = useState("");
  const [challengers, setChallengers] = useState("");
  const [teamResult, setTeamResult] = useState("");
  const [rumbleRows, setRumbleRows] = useState<RumbleRow[]>(() => Array.from({ length: 4 }, (_, index) => newRumbleRow(index)));
  const [now, setNow] = useState(() => Date.now());

  const loadPanel = useCallback(async (quiet = false) => {
    try {
      const response = await fetch("/api/panel", { cache: "no-store" });
      const json = await readResponse(response);
      setPanel(normalizePanelStatus(json.panel) as PanelState);
      if (!quiet) setMessage("Panel positions are synchronized.");
    } catch (error) {
      if (!quiet) setMessage(error instanceof Error ? error.message : "Panel connection failed.");
    }
  }, []);

  useEffect(() => {
    const stored = window.localStorage.getItem(sessionStorageKey);
    if (stored) setSessionToken(stored);
    void loadPanel();
    const panelTimer = window.setInterval(() => void loadPanel(true), 5_000);
    const clockTimer = window.setInterval(() => setNow(Date.now()), 1_000);
    return () => {
      window.clearInterval(panelTimer);
      window.clearInterval(clockTimer);
    };
  }, [loadPanel]);

  useEffect(() => {
    if (!sessionToken) return;
    const heartbeat = async () => {
      try {
        await readResponse(await fetch("/api/panel", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ action: "heartbeat", sessionToken }),
        }));
      } catch {
        window.localStorage.removeItem(sessionStorageKey);
        setSessionToken("");
        setMessage("Host control lock expired. Log in again.");
      }
    };
    void heartbeat();
    const timer = window.setInterval(heartbeat, 45_000);
    return () => window.clearInterval(timer);
  }, [sessionToken]);

  const secondsRemaining = useMemo(() => {
    if (!panel?.protection_ends_at) return 0;
    return Math.max(0, Math.ceil((new Date(panel.protection_ends_at).getTime() - now) / 1000));
  }, [now, panel?.protection_ends_at]);

  const rumbleActive = Boolean(panel?.current_rumble_session_id && panel.mode === "live");
  const protectedMode = panel?.mode === "rumble_protected";

  async function panelAction(action: string, payload: Record<string, unknown> = {}) {
    if (!sessionToken) throw new Error("Log in to use host panel controls.");
    const response = await fetch("/api/panel", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ action, sessionToken, ...payload }),
    });
    const json = await readResponse(response);
    if (json.panel) setPanel(normalizePanelStatus(json.panel) as PanelState);
    return json;
  }

  async function runAction(label: string, action: string, payload: Record<string, unknown> = {}) {
    setBusy(true);
    setMessage(`${label}...`);
    try {
      await panelAction(action, payload);
      setMessage(`${label} complete. All panel views now use the same positions.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : `${label} failed.`);
    } finally {
      setBusy(false);
    }
  }

  async function login() {
    setBusy(true);
    try {
      const token = `${crypto.randomUUID()}-${crypto.randomUUID()}`;
      await readResponse(await fetch("/api/panel", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ action: "login", adminKey: hostPassword, sessionToken: token, lockedBy: hostName }),
      }));
      window.localStorage.setItem(sessionStorageKey, token);
      setSessionToken(token);
      setHostPassword("");
      setMessage("Host controls unlocked for this browser.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Host login failed.");
    } finally {
      setBusy(false);
    }
  }

  function updateRumbleRow(id: string, key: keyof Omit<RumbleRow, "id">, value: string) {
    setRumbleRows((current) => current.map((row) => row.id === id ? { ...row, [key]: value } : row));
  }

  async function finalizeRumble() {
    const prepared = rumbleRows.map((row) => ({
      singer_name: row.singer_name,
      team: row.team,
      game_score: Number(row.game_score),
    }));
    const validated = validateRumbleResults(prepared);
    if (!validated.ok) {
      setMessage(validated.message || "Check the Rumble results and try again.");
      return;
    }
    await runAction("Finalizing Rumble and starting the 30-minute guarantee", "finalize-rumble", {
      results: validated.results,
      teamResult,
    });
  }

  return (
    <article className={`panel ${styles.panel}`} id="main-four">
      <div className={styles.header}>
        <div>
          <p className="eyebrow">Authoritative Live Rotation</p>
          <h2>Main 4 + Signup Rotation</h2>
          <p className="panelIntro">The same eight positions feed Mission Control, the Companion App, host dashboards, and public displays.</p>
        </div>
        <div className={`${styles.mode} ${protectedMode ? styles.protected : ""}`}>
          <strong>{protectedMode ? "RUMBLE WINNERS PROTECTED" : rumbleActive ? "RUMBLE IN PROGRESS" : "LIVE FORMULA"}</strong>
          <span>{protectedMode ? `${formatPanelCountdown(secondsRemaining)} remaining` : rumbleActive ? "Enter the game results below" : "Scores and gifts update automatically"}</span>
        </div>
      </div>

      <div className={styles.slotGrid}>
        {(panel?.slots ?? Array.from({ length: 8 }, (_, index) => ({ panel_slot: index + 1 } as PanelSlot))).map((slot) => (
          <section className={`${styles.slot} ${slot.panel_slot <= 4 ? styles.mainSlot : styles.rotationSlot}`} key={slot.panel_slot}>
            <span className={styles.slotNumber}>{slot.panel_slot}</span>
            <div>
              <small>{slotHeading(slot)}</small>
              <strong>{slot.singer_name || "Open"}</strong>
              <p>{slotDetail(slot)}</p>
            </div>
          </section>
        ))}
      </div>

      <div className={styles.statusLine}>
        <span>Rotation cycle {panel?.regular_cycle ?? 1}</span>
        <span>Cursor {panel?.regular_cursor_rank ?? 0}</span>
        <span>Version {panel?.state_version ?? 0}</span>
      </div>

      <p className={styles.message}>{message}</p>

      {!sessionToken ? (
        <section className={styles.controlCard}>
          <h3>Unlock Host Controls</h3>
          <div className={styles.inlineFields}>
            <label><span>Host name</span><input value={hostName} onChange={(event) => setHostName(event.target.value)} /></label>
            <label><span>Host password</span><input type="password" value={hostPassword} onChange={(event) => setHostPassword(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") void login(); }} /></label>
            <button disabled={busy} type="button" onClick={() => void login()}>Unlock</button>
          </div>
        </section>
      ) : (
        <div className={styles.controls}>
          <section className={styles.controlCard}>
            <h3>Live Rotation</h3>
            <div className={styles.buttons}>
              <button disabled={busy} type="button" onClick={() => {
                if (window.confirm("Start a new show rotation now? Current panel positions will be recalculated, but vote and gift history will be preserved.")) {
                  void runAction("Starting the panel show", "start-show");
                }
              }}>Start New Show</button>
              <button disabled={busy || protectedMode} type="button" onClick={() => void runAction("Refreshing live leaders", "refresh")}>Refresh Main 4</button>
              <button disabled={busy} type="button" onClick={() => void runAction("Advancing the regular four", "advance")}>Next Regular Four</button>
            </div>
            <p>â€œNext Regular Fourâ€ advances signup slots 5â€“8. Rumbles and leader changes never reset that cursor.</p>
          </section>

          <section className={styles.controlCard}>
            <h3>Rowdy Rumble</h3>
            {!rumbleActive && !protectedMode ? (
              <>
                <label><span>Challenger names (comma separated)</span><input value={challengers} onChange={(event) => setChallengers(event.target.value)} placeholder="Challenger 1, Challenger 2" /></label>
                <button disabled={busy} type="button" onClick={() => void runAction("Activating the Rowdy Rumble", "activate-rumble", {
                  challengers: challengers.split(",").map((name) => name.trim()).filter(Boolean),
                  activatedBy: hostName || "host",
                })}>Activate Rumble</button>
              </>
            ) : null}

            {rumbleActive ? (
              <div className={styles.rumbleResults}>
                <p>Enter every playerâ€™s final game score. The four highest scores take Main 4 in order for exactly 30 minutes.</p>
                {rumbleRows.map((row, index) => (
                  <div className={styles.resultRow} key={row.id}>
                    <span>#{index + 1}</span>
                    <input aria-label={`Player ${index + 1} name`} value={row.singer_name} onChange={(event) => updateRumbleRow(row.id, "singer_name", event.target.value)} placeholder="Player name" />
                    <select aria-label={`Player ${index + 1} team`} value={row.team} onChange={(event) => updateRumbleRow(row.id, "team", event.target.value)}><option value="red">Red</option><option value="blue">Blue</option><option value="unassigned">Other</option></select>
                    <input aria-label={`Player ${index + 1} score`} min="0" step="1" type="number" value={row.game_score} onChange={(event) => updateRumbleRow(row.id, "game_score", event.target.value)} />
                    <button disabled={rumbleRows.length <= 4} type="button" onClick={() => setRumbleRows((current) => current.filter((item) => item.id !== row.id))}>Remove</button>
                  </div>
                ))}
                <div className={styles.buttons}>
                  <button disabled={rumbleRows.length >= 32} type="button" onClick={() => setRumbleRows((current) => [...current, newRumbleRow(current.length)])}>Add Player</button>
                </div>
                <label><span>Team result (optional)</span><input value={teamResult} onChange={(event) => setTeamResult(event.target.value)} placeholder="Red wins, Blue wins, tie, etc." /></label>
                <div className={styles.buttons}>
                  <button disabled={busy} type="button" onClick={() => void finalizeRumble()}>Finalize Scores + Start 30:00</button>
                  <button disabled={busy} type="button" onClick={() => void runAction("Cancelling the Rumble", "cancel-rumble")}>Cancel Rumble</button>
                </div>
              </div>
            ) : null}

            {protectedMode ? <p>The live score/gift leaders automatically retake Main 4 at 00:00. The regular four continue from the saved cursor.</p> : null}
          </section>
        </div>
      )}
    </article>
  );
}

