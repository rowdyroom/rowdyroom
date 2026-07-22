// Public-safe Companion surface integration.
(function installMain4Companion() {
  "use strict";

  function makeCard(description) {
    const card = document.createElement("div");
    card.className = "card rr-main4-companion-card";
    const title = document.createElement("h2");
    title.textContent = "Current Panel Lineup";
    const copy = document.createElement("p");
    copy.className = "small";
    copy.textContent = description;
    const panel = document.createElement("div");
    panel.setAttribute("data-rowdy-main4", "");
    card.append(title, copy, panel);
    return card;
  }

  function mount() {
    if (document.querySelector(".rr-main4-companion-card")) return;
    const queue = document.getElementById("queue");
    if (queue) queue.prepend(makeCard("The first four positions follow live scores and contributions; the other four continue in signup order."));
    const rumble = document.getElementById("rumble");
    if (rumble) rumble.prepend(makeCard("When a Rumble finishes, the top four game scores hold the first four positions for a guaranteed 30 minutes."));
    window.RowdyRoomPanelClient?.refresh().catch((error) => console.error("Rowdy Room panel:", error));
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", mount, { once: true });
  else mount();
})();

