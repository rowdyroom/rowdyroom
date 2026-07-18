// Public-safe Mission Control integration.
(function installMain4MissionControl(global) {
  "use strict";

  let adminKey = "";
  let busy = false;
  const sessionStorageKey = "rowdyRoomMain4MissionSession";

  function sessionToken() {
    let token = sessionStorage.getItem(sessionStorageKey);
    if (!token) {
      token = global.crypto?.randomUUID?.() || `mission-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      sessionStorage.setItem(sessionStorageKey, token);
    }
    return token;
  }

  function setStatus(message, tone) {
    document.querySelectorAll("[data-rr-main4-host-status]").forEach((element) => {
      element.textContent = message;
      element.dataset.tone = tone || "info";
    });
  }

  async function login() {
    if (!adminKey) adminKey = global.prompt("Enter the Rowdy Room host password to use Main 4 controls:") || "";
    if (!adminKey) throw new Error("Host password was not entered.");
    const token = sessionToken();
    await global.RowdyRoomPanelClient.hostLogin({ adminKey, sessionToken: token, lockedBy: "Mission Control" });
    return token;
  }

  async function runHost(label, action) {
    if (busy) return;
    busy = true;
    let token = "";
    setStatus(`${label}â€¦`, "working");
    try {
      token = await login();
      await action(token);
      await global.RowdyRoomPanelClient.refresh();
      setStatus(`${label} complete.`, "ok");
    } catch (error) {
      if (/password/i.test(error.message || "")) adminKey = "";
      setStatus(error.message || `${label} failed.`, "error");
    } finally {
      if (token) {
        await global.RowdyRoomPanelClient.hostLogout(token).catch(() => null);
        sessionStorage.removeItem(sessionStorageKey);
      }
      busy = false;
    }
  }

  function button(label, handler, className) {
    const control = document.createElement("button");
    control.type = "button";
    control.textContent = label;
    if (className) control.className = className;
    control.addEventListener("click", handler);
    return control;
  }

  function displayCard() {
    const card = document.createElement("article");
    card.className = "card span12 rr-main4-mission-card";
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = "Main 4 + Signup Rotation";
    const panel = document.createElement("div");
    panel.setAttribute("data-rowdy-main4", "");
    card.append(label, panel);
    return card;
  }

  function controlsCard() {
    const card = document.createElement("article");
    card.className = "card span12 rr-main4-host-card";
    const label = document.createElement("div");
    label.className = "label";
    label.textContent = "Main 4 Host Controls";
    const copy = document.createElement("p");
    copy.textContent = "The database keeps the first four ranked spots, the four signup-order spots, Rumble protection, and the return to the live formula synchronized.";
    const actions = document.createElement("div");
    actions.className = "actions";
    actions.append(
      button("Start Panel Show", () => runHost("Start panel show", (token) => global.RowdyRoomPanelClient.startShow(token)), "primary"),
      button("Refresh Leaders", () => runHost("Refresh leaders", (token) => global.RowdyRoomPanelClient.refreshLeaders(token))),
      button("Advance Signup Four", () => runHost("Advance signup rotation", (token) => global.RowdyRoomPanelClient.advanceRegularFour(token))),
      button("Activate Rumble", () => {
        const names = (global.prompt("Enter Rumble player names separated by commas:") || "").split(",").map((name) => name.trim()).filter(Boolean);
        if (!names.length) return setStatus("No Rumble players were entered.", "error");
        return runHost("Activate Rumble", (token) => global.RowdyRoomPanelClient.activateRumble(token, names, "mission-control"));
      }, "gold"),
      button("Cancel Active Rumble", () => {
        const reason = global.prompt("Reason for cancelling this Rumble:", "Cancelled by host.");
        if (reason === null) return;
        return runHost("Cancel Rumble", (token) => global.RowdyRoomPanelClient.cancelRumble(token, reason || "Cancelled by host."));
      }, "danger")
    );
    const status = document.createElement("p");
    status.className = "rr-main4-host-status";
    status.setAttribute("data-rr-main4-host-status", "");
    status.textContent = "Main 4 controls ready.";
    const panel = document.createElement("div");
    panel.setAttribute("data-rowdy-main4", "");
    card.append(label, copy, actions, status, panel);
    return card;
  }

  function installStyles() {
    const style = document.createElement("style");
    style.textContent = ".rr-main4-mission-card,.rr-main4-host-card{display:grid;gap:12px}.rr-main4-host-status{font-weight:800;color:#67e8f9}.rr-main4-host-status[data-tone='ok']{color:#20f783}.rr-main4-host-status[data-tone='error']{color:#ff7b8a}.rr-main4-host-status[data-tone='working']{color:#ffd45a}";
    document.head.append(style);
  }

  function mount() {
    if (document.querySelector(".rr-main4-mission-card")) return;
    installStyles();
    const liveGrid = document.querySelector("#live .grid");
    if (liveGrid) liveGrid.insertBefore(displayCard(), liveGrid.children[1] || null);
    const rumbleGrid = document.querySelector("#rumble .grid");
    if (rumbleGrid) rumbleGrid.prepend(controlsCard());
    global.RowdyRoomPanelClient?.refresh().catch((error) => setStatus(error.message || "Panel status could not be loaded.", "error"));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})(window);

