// Public-safe Rumble game integration.
(function installMain4RumbleBridge(global) {
  "use strict";

  if (global.__ROWDY_ROOM_MAIN4_RUMBLE_BRIDGE_VERSION__ === "3") return;
  global.__ROWDY_ROOM_MAIN4_RUMBLE_BRIDGE_VERSION__ = "3";

  const sessionKey = "rowdyRoomMain4RumbleSession";
  let heartbeatTimer = null;
  let main4Busy = false;
  let gameFunctionsWrapped = typeof global.hostLoginAttempt === "function" && global.hostLoginAttempt.name === "wrappedHostLogin";
  let dashboardObserver = null;
  let remountScheduled = false;

  function token() {
    let value = sessionStorage.getItem(sessionKey);
    if (!value) {
      value = global.crypto?.randomUUID?.() || `rumble-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(sessionKey, value);
    }
    return value;
  }

  function hostKey() {
    return typeof HOST_PASSWORD !== "undefined" ? HOST_PASSWORD : "";
  }

  function setMain4Status(message, tone) {
    const status = document.getElementById("rrMain4RumbleStatus");
    if (!status) return;
    status.textContent = message;
    status.dataset.tone = tone || "info";
  }

  function names() {
    if (typeof state === "undefined") return [];
    const combined = [...(state.redTeam || []), ...(state.blueTeam || [])];
    const seen = new Set();
    return combined.map((name) => String(name || "").trim()).filter((name) => {
      const key = name.toLowerCase();
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function results() {
    if (typeof state === "undefined") return [];
    const scoreMap = state.playerScores || {};
    const rows = [];
    const seen = new Set();
    for (const [team, roster] of [["red", state.redTeam || []], ["blue", state.blueTeam || []]]) {
      for (const rawName of roster) {
        const singerName = String(rawName || "").trim();
        const key = singerName.toLowerCase();
        if (!key || seen.has(key)) continue;
        seen.add(key);
        rows.push({ singer_name: singerName, team, game_score: Math.max(0, Math.round(Number(scoreMap[key] || 0))) });
      }
    }
    return rows;
  }

  function renderScores() {
    const box = document.getElementById("rrMain4PlayerScores");
    if (!box) return;
    const rows = results().sort((a, b) => b.game_score - a.game_score || a.singer_name.localeCompare(b.singer_name));
    box.replaceChildren();
    if (!rows.length) {
      box.textContent = "Player scores will appear after setup.";
      return;
    }
    rows.forEach((row, index) => {
      const line = document.createElement("div");
      line.className = "rr-main4-score-row";
      line.innerHTML = `<b>${index + 1}. ${escapeHtml(row.singer_name)}</b><span>${row.team.toUpperCase()} Â· ${row.game_score} points</span>`;
      box.append(line);
    });
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[character]));
  }

  async function acquireHost() {
    if (!hostKey()) throw new Error("The Rumble host password is unavailable.");
    const sessionToken = token();
    await global.RowdyRoomPanelClient.hostLogin({ adminKey: hostKey(), sessionToken, lockedBy: "Rumble Host Dashboard" });
    if (!heartbeatTimer) {
      heartbeatTimer = global.setInterval(() => {
        global.RowdyRoomPanelClient.hostHeartbeat(sessionToken).catch((error) => setMain4Status(error.message || "Main 4 host lock was lost.", "error"));
      }, 45000);
    }
    return sessionToken;
  }

  async function releaseHost() {
    if (heartbeatTimer) global.clearInterval(heartbeatTimer);
    heartbeatTimer = null;
    const sessionToken = sessionStorage.getItem(sessionKey);
    if (sessionToken) await global.RowdyRoomPanelClient.hostLogout(sessionToken).catch(() => null);
    sessionStorage.removeItem(sessionKey);
  }

  async function activateMain4Rumble() {
    if (main4Busy) return;
    const playerNames = names();
    if (playerNames.length < 4) {
      setMain4Status("This match has fewer than four distinct players, so it is an exhibition and will not replace the four protected panel positions.", "warning");
      return;
    }
    main4Busy = true;
    setMain4Status("Activating the Main 4 Rumbleâ€¦", "working");
    try {
      const sessionToken = await acquireHost();
      const current = await global.RowdyRoomPanelClient.refresh();
      if (current.mode === "rumble_protected") throw new Error("The previous Rumble winners are still inside their guaranteed 30 minutes.");
      if (!current.current_rumble_session_id) await global.RowdyRoomPanelClient.activateRumble(sessionToken, playerNames, "rumble-game");
      if (typeof state !== "undefined") {
        state.rrMain4Activated = true;
        state.rrMain4Finalized = false;
        if (typeof saveStateSilent === "function") saveStateSilent();
      }
      await global.RowdyRoomPanelClient.refresh();
      setMain4Status("Main 4 Rumble active. Individual game points will rank the four protected winners.", "ok");
    } catch (error) {
      setMain4Status(error.message || "The Main 4 Rumble could not be activated.", "error");
    } finally {
      main4Busy = false;
    }
  }

  async function finalizeMain4Rumble() {
    if (main4Busy) return;
    const playerResults = results();
    if (playerResults.length < 4) {
      setMain4Status("At least four distinct Rumble players are required before panel positions can be finalized.", "error");
      return;
    }
    main4Busy = true;
    setMain4Status("Ranking the Rumble players and starting the guaranteed 30 minutesâ€¦", "working");
    try {
      const sessionToken = await acquireHost();
      const current = await global.RowdyRoomPanelClient.refresh();
      if (!current.current_rumble_session_id) await global.RowdyRoomPanelClient.activateRumble(sessionToken, names(), "rumble-game-finalize");
      const winner = typeof winningTeam === "function" ? winningTeam() : null;
      await global.RowdyRoomPanelClient.finalizeRumble(sessionToken, playerResults, winner);
      if (typeof state !== "undefined") {
        state.rrMain4Finalized = true;
        if (typeof saveStateSilent === "function") saveStateSilent();
      }
      await global.RowdyRoomPanelClient.refresh();
      renderScores();
      setMain4Status("Top four game scores are now protected for exactly 30 minutes.", "ok");
      await releaseHost();
    } catch (error) {
      setMain4Status(error.message || "Rumble results could not be finalized.", "error");
    } finally {
      main4Busy = false;
    }
  }

  async function cancelMain4Rumble() {
    if (main4Busy) return;
    main4Busy = true;
    setMain4Status("Cancelling the active Main 4 Rumbleâ€¦", "working");
    try {
      const sessionToken = await acquireHost();
      await global.RowdyRoomPanelClient.cancelRumble(sessionToken, "Cancelled from the Rumble host dashboard.");
      await global.RowdyRoomPanelClient.refresh();
      setMain4Status("Main 4 Rumble cancelled; the live formula and signup rotation are restored.", "ok");
      await releaseHost();
    } catch (error) {
      setMain4Status(error.message || "The Rumble could not be cancelled.", "error");
    } finally {
      main4Busy = false;
    }
  }

  function wrapGameFunctions() {
    if (gameFunctionsWrapped) return;
    gameFunctionsWrapped = true;

    if (global.__rowdyMain4RumbleWrapped) return;
    global.__rowdyMain4RumbleWrapped = true;

    const originalStartMatch = global.startMatch;
    if (typeof originalStartMatch === "function") {
      global.startMatch = function wrappedStartMatch(...args) {
        if (typeof state !== "undefined") {
          state.playerScores = {};
          state.rrMain4Activated = false;
          state.rrMain4Finalized = false;
        }
        const result = originalStartMatch.apply(this, args);
        renderScores();
        void activateMain4Rumble();
        return result;
      };
    }

    const originalAwardPool = global.awardPool;
    if (typeof originalAwardPool === "function") {
      global.awardPool = function wrappedAwardPool(team, ...args) {
        if (typeof state !== "undefined") {
          state.playerScores = state.playerScores || {};
          const roster = team === "blue" ? state.blueTeam || [] : state.redTeam || [];
          const activeName = team === state.currentTeam && typeof currentPlayerName === "function" ? currentPlayerName() : roster[0];
          const key = String(activeName || "").trim().toLowerCase();
          if (key) state.playerScores[key] = Number(state.playerScores[key] || 0) + Math.max(0, Number(state.pool || 0));
        }
        const result = originalAwardPool.call(this, team, ...args);
        renderScores();
        return result;
      };
    }

    const originalRestartMatch = global.restartMatch;
    if (typeof originalRestartMatch === "function") {
      global.restartMatch = function wrappedRestartMatch(...args) {
        if (typeof state !== "undefined") {
          state.playerScores = {};
          state.rrMain4Finalized = false;
        }
        const result = originalRestartMatch.apply(this, args);
        renderScores();
        return result;
      };
    }

    const originalEndRound = global.endRound;
    if (typeof originalEndRound === "function") {
      global.endRound = function wrappedEndRound(...args) {
        const matchComplete = typeof state !== "undefined" && Number(state.round || 0) >= Number(state.maxRounds || 0);
        const result = originalEndRound.apply(this, args);
        renderScores();
        if (matchComplete && !(typeof state !== "undefined" && state.rrMain4Finalized)) void finalizeMain4Rumble();
        return result;
      };
    }

    const originalHostLogin = global.hostLoginAttempt;
    if (typeof originalHostLogin === "function") {
      global.hostLoginAttempt = function wrappedHostLogin(...args) {
        const result = originalHostLogin.apply(this, args);
        global.setTimeout(() => {
          mount();
          connectIfUnlocked();
        }, 0);
        return result;
      };
    }

    const originalHostLogout = global.hostLogout;
    if (typeof originalHostLogout === "function") {
      global.hostLogout = function wrappedHostLogout(...args) {
        void releaseHost();
        return originalHostLogout.apply(this, args);
      };
    }
  }

  function connectIfUnlocked() {
    if (typeof isHostUnlocked !== "function" || !isHostUnlocked()) return;
    acquireHost()
      .then(() => global.RowdyRoomPanelClient?.refresh())
      .then(() => setMain4Status("Main 4 host controls connected.", "ok"))
      .catch((error) => setMain4Status(error.message || "Main 4 host controls could not connect.", "error"));
  }

  function watchDashboard() {
    if (dashboardObserver || !document.body || typeof global.MutationObserver !== "function") return;
    dashboardObserver = new global.MutationObserver(() => {
      if (!document.getElementById("hostDashboard") || document.getElementById("rrMain4HostPanel") || remountScheduled) return;
      remountScheduled = true;
      global.setTimeout(() => {
        remountScheduled = false;
        mount();
        connectIfUnlocked();
      }, 0);
    });
    dashboardObserver.observe(document.body, { childList: true, subtree: true });
  }

  function makeButton(label, handler, className) {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = label;
    if (className) button.className = className;
    button.addEventListener("click", handler);
    return button;
  }

  function mount() {
    watchDashboard();
    if (document.getElementById("rrMain4HostPanel")) return;
    const dashboard = document.getElementById("hostDashboard");
    if (!dashboard) return;
    const panel = document.createElement("div");
    panel.id = "rrMain4HostPanel";
    panel.className = "hostPanel rr-main4-rumble-host";
    const title = document.createElement("h2");
    title.textContent = "Main 4 + Rotation";
    const copy = document.createElement("p");
    copy.className = "small";
    copy.textContent = "Rumble player points are tracked individually. At match completion, the four highest scores take the protected positions for exactly 30 minutes.";
    const status = document.createElement("div");
    status.id = "rrMain4RumbleStatus";
    status.className = "small rr-main4-rumble-status";
    status.textContent = "Unlock the host dashboard to connect Main 4 controls.";
    const scoreBox = document.createElement("div");
    scoreBox.id = "rrMain4PlayerScores";
    scoreBox.className = "rr-main4-player-scores";
    const actions = document.createElement("div");
    actions.className = "hostBtns three";
    actions.append(
      makeButton("Activate Main 4 Rumble", activateMain4Rumble, "gold"),
      makeButton("Finalize Top Four", finalizeMain4Rumble, "green"),
      makeButton("Cancel Main 4 Rumble", cancelMain4Rumble),
      makeButton("Refresh Panel", () => global.RowdyRoomPanelClient.refresh().then(() => setMain4Status("Panel status refreshed.", "ok")).catch((error) => setMain4Status(error.message, "error")))
    );
    const lineup = document.createElement("div");
    lineup.setAttribute("data-rowdy-main4", "");
    panel.append(title, copy, status, scoreBox, actions, lineup);
    dashboard.append(panel);

    const style = document.createElement("style");
    style.textContent = ".rr-main4-rumble-host{display:grid;gap:12px}.rr-main4-rumble-status{font-weight:900;color:#67e8f9}.rr-main4-rumble-status[data-tone='ok']{color:#20f783}.rr-main4-rumble-status[data-tone='error']{color:#ff6b7a}.rr-main4-rumble-status[data-tone='warning']{color:#ffd45a}.rr-main4-rumble-status[data-tone='working']{color:#67e8f9}.rr-main4-player-scores{display:grid;gap:6px}.rr-main4-score-row{display:flex;justify-content:space-between;gap:12px;padding:8px 10px;border-radius:10px;background:rgba(255,255,255,.06)}";
    document.head.append(style);
    renderScores();
    wrapGameFunctions();
    global.RowdyRoomPanelClient?.refresh().catch((error) => setMain4Status(error.message || "Panel status could not be loaded.", "error"));
  }

  function start() {
    mount();
    connectIfUnlocked();
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})(window);

