// Public-safe Rowdy Room Main 4 browser authority adapter.
(function installRowdyRoomMain4(global) {
  "use strict";

  if (global.RowdyRoomPanelClient) return;

  const config = global.ROWDY_ROOM_PANEL_CONFIG || {};
  const baseUrl = String(config.supabaseUrl || "").replace(/\/$/, "");
  const publishableKey = String(config.publishableKey || "");
  const pollMilliseconds = Math.max(2000, Number(config.pollMilliseconds) || 5000);

  function configured() {
    return Boolean(baseUrl && publishableKey);
  }

  async function rpc(name, parameters) {
    if (!configured()) throw new Error("Rowdy Room panel display is not configured.");
    const headers = {
      apikey: publishableKey,
      "content-type": "application/json",
    };
    if (config.accessToken) headers.authorization = `Bearer ${config.accessToken}`;
    const response = await fetch(`${baseUrl}/rest/v1/rpc/${name}`, {
      method: "POST",
      cache: "no-store",
      headers,
      body: JSON.stringify(parameters || {}),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new Error(body?.message || `Panel request failed (${response.status}).`);
    return body;
  }

  function slotLabel(slot) {
    if (slot.slot_type === "rumble_winner") return `Rumble Winner #${slot.panel_slot}`;
    if (slot.panel_slot === 1) return "Top Live Score";
    if (slot.panel_slot === 2) return "Second Live Score";
    if (slot.panel_slot === 3) return "Top Contributor";
    if (slot.panel_slot === 4) return "Second Contributor";
    return `Signup Rotation ${slot.panel_slot - 4}`;
  }

  function slotDetail(slot) {
    if (!slot.singer_name) return slot.panel_slot <= 4 ? "Waiting for qualifier" : "Waiting for signup";
    if (slot.slot_type === "main_score") return `${Number(slot.qualifying_value || 0).toFixed(2)} average`;
    if (slot.slot_type === "main_gift") return `${Math.round(Number(slot.qualifying_value || 0)).toLocaleString()} tokens`;
    if (slot.slot_type === "rumble_winner") return `${Number(slot.game_score || 0).toLocaleString()} game points`;
    return `Signup position ${slot.signup_rank || "â€”"}`;
  }

  function countdown(endValue) {
    if (!endValue) return "00:00";
    const seconds = Math.max(0, Math.ceil((new Date(endValue).getTime() - Date.now()) / 1000));
    return `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function render(root, panel) {
    root.replaceChildren();
    root.classList.add("rr-main4-panel");

    const header = document.createElement("div");
    header.className = "rr-main4-header";
    const title = document.createElement("strong");
    title.textContent = panel.mode === "rumble_protected" ? "RUMBLE WINNERS â€” GUARANTEED 30" : "ROWDY ROOM MAIN 4 + ROTATION";
    const mode = document.createElement("span");
    mode.textContent = panel.mode === "rumble_protected"
      ? countdown(panel.protection_ends_at)
      : panel.current_rumble_session_id
        ? "Rumble in progress"
        : "Live score + gift formula";
    header.append(title, mode);

    const grid = document.createElement("div");
    grid.className = "rr-main4-grid";
    for (let number = 1; number <= 8; number += 1) {
      const slot = (panel.slots || []).find((item) => Number(item.panel_slot) === number) || { panel_slot: number };
      const card = document.createElement("div");
      card.className = `rr-main4-slot ${number <= 4 ? "main" : "rotation"}`;
      const position = document.createElement("b");
      position.textContent = String(number);
      const label = document.createElement("small");
      label.textContent = slotLabel(slot);
      const name = document.createElement("strong");
      name.textContent = slot.singer_name || "Open";
      const detail = document.createElement("span");
      detail.textContent = slotDetail(slot);
      card.append(position, label, name, detail);
      grid.append(card);
    }

    root.append(header, grid);
  }

  function installStyles() {
    if (document.getElementById("rr-main4-panel-styles")) return;
    const style = document.createElement("style");
    style.id = "rr-main4-panel-styles";
    style.textContent = `
      .rr-main4-panel{display:grid;gap:12px;padding:14px;border:1px solid rgba(250,204,21,.42);border-radius:18px;background:rgba(9,3,22,.96);color:#fff;font-family:Arial,sans-serif}
      .rr-main4-header{display:flex;justify-content:space-between;gap:12px;align-items:center}.rr-main4-header>strong{color:#facc15}.rr-main4-header>span{color:#67e8f9;font-weight:900}
      .rr-main4-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px}.rr-main4-slot{position:relative;display:grid;gap:5px;min-height:105px;padding:13px;border:1px solid rgba(255,255,255,.13);border-radius:13px;background:rgba(255,255,255,.05)}
      .rr-main4-slot.main{border-color:rgba(250,204,21,.34)}.rr-main4-slot.rotation{border-color:rgba(103,232,249,.22)}.rr-main4-slot>b{position:absolute;top:8px;right:9px;color:#facc15}.rr-main4-slot>small{padding-right:20px;color:#c4b5fd;font-weight:900;text-transform:uppercase}.rr-main4-slot>strong{margin-top:9px;font-size:18px}.rr-main4-slot>span{color:#cbd5e1;font-size:13px}
      @media(max-width:760px){.rr-main4-grid{grid-template-columns:repeat(2,minmax(0,1fr))}.rr-main4-header{align-items:flex-start;flex-direction:column}}
    `;
    document.head.append(style);
  }

  let lastStatus = null;
  let timer = null;

  async function refresh() {
    lastStatus = await rpc("rr_get_panel_status");
    document.querySelectorAll("[data-rowdy-main4]").forEach((root) => render(root, lastStatus));
    global.dispatchEvent(new CustomEvent("rowdyroom:panel-status", { detail: lastStatus }));
    return lastStatus;
  }

  function start() {
    installStyles();
    if (timer) clearInterval(timer);
    void refresh().catch((error) => console.error("Rowdy Room panel:", error));
    timer = setInterval(() => void refresh().catch((error) => console.error("Rowdy Room panel:", error)), pollMilliseconds);
  }

  const api = {
    configured,
    refresh,
    getLastStatus: () => lastStatus,
    hostLogin: ({ adminKey, sessionToken, lockedBy }) => rpc("rr_host_login", { p_admin_key: adminKey, p_session_token: sessionToken, p_locked_by: lockedBy || null }),
    hostHeartbeat: (sessionToken) => rpc("rr_host_heartbeat", { p_session_token: sessionToken }),
    hostLogout: (sessionToken) => rpc("rr_host_logout", { p_session_token: sessionToken }),
    startShow: (sessionToken) => rpc("rr_host_start_panel_show", { p_session_token: sessionToken, p_started_at: null }),
    refreshLeaders: (sessionToken) => rpc("rr_host_refresh_panel", { p_session_token: sessionToken }),
    advanceRegularFour: (sessionToken) => rpc("rr_host_advance_panel", { p_session_token: sessionToken }),
    activateRumble: (sessionToken, challengerNames, activatedBy) => rpc("rr_host_activate_rumble", { p_session_token: sessionToken, p_challenger_names: challengerNames || [], p_activated_by: activatedBy || "host" }),
    finalizeRumble: (sessionToken, results, teamResult) => rpc("rr_host_finalize_rumble", { p_session_token: sessionToken, p_results: results, p_team_result: teamResult || null }),
    cancelRumble: (sessionToken, reason) => rpc("rr_host_cancel_rumble", { p_session_token: sessionToken, p_reason: reason || "Cancelled by host." }),
    linkGiftUsername: (sessionToken, singerId, tiktokUsername) => rpc("rr_host_link_panel_identity", { p_session_token: sessionToken, p_singer_id: singerId, p_tiktok_username: tiktokUsername }),
    start,
  };

  global.RowdyRoomPanelClient = api;
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start, { once: true });
  else start();
})(window);

