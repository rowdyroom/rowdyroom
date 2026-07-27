const $ = (selector) => document.querySelector(selector);
const tokenInput = $("#token");
const message = $("#message");

tokenInput.value = sessionStorage.getItem("aiStartStagingToken") || "";

function headers(write = false) {
  const result = {};
  const token = sessionStorage.getItem("aiStartStagingToken");
  if (token) result.Authorization = `Bearer ${token}`;
  if (write) {
    result["Content-Type"] = "application/json";
    result["Idempotency-Key"] = crypto.randomUUID();
  }
  return result;
}

async function api(action, options = {}) {
  const response = await fetch(`api.php?action=${encodeURIComponent(action)}`, options);
  const body = await response.json();
  if (!response.ok || !body.ok) throw new Error(body.message || body.error || "Request failed");
  return body;
}

function card(mission) {
  const node = document.createElement("div");
  node.className = "card";
  const title = document.createElement("strong");
  title.textContent = mission.missionName;
  const status = document.createElement("span");
  status.className = "status";
  status.textContent = mission.status.replaceAll("_", " ");
  const step = document.createElement("p");
  step.textContent = mission.currentStep || "No current step";
  const actions = document.createElement("div");
  actions.className = "card-actions";
  if (mission.status === "waiting_for_roger") {
    actions.append(actionButton("Answer", () => answerMission(mission)));
  }
  if (mission.status === "ready_for_review") {
    actions.append(
      actionButton("Request Revision", () => reviseMission(mission), "secondary"),
      actionButton("Accept Complete", () => transition(mission, "complete")),
    );
  }
  if (!["complete", "cancelled"].includes(mission.status)) {
    actions.append(
      actionButton("Cancel", () => transition(mission, "cancelled"), "danger"),
    );
  }
  node.append(title, status, step, actions);
  return node;
}

function actionButton(label, handler, className = "") {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.className = className;
  button.addEventListener("click", handler);
  return button;
}

async function post(action, body) {
  return api(action, {
    method: "POST",
    headers: headers(true),
    body: JSON.stringify(body),
  });
}

async function transition(mission, toStatus, summary) {
  try {
    await post("mission_transition", {
      missionId: mission.missionId,
      expectedVersion: mission.version,
      toStatus,
      summary,
    });
    await refresh();
  } catch (error) {
    message.textContent = error.message;
  }
}

async function answerMission(mission) {
  const answer = window.prompt("Answer or approval for Work:");
  if (!answer) return;
  try {
    const event = await post("mission_event", {
      missionId: mission.missionId,
      expectedVersion: mission.version,
      type: "approval",
      summary: answer,
    });
    await post("mission_transition", {
      missionId: mission.missionId,
      expectedVersion: event.missionVersion,
      toStatus: "working",
      summary: "Roger answered; return to assigned Work bot.",
    });
    await refresh();
  } catch (error) {
    message.textContent = error.message;
  }
}

async function reviseMission(mission) {
  const reason = window.prompt("What specific correction is needed?");
  if (!reason) return;
  await transition(mission, "revision_requested", reason);
}

function render(missions) {
  const areas = {
    needsYou: $("#needsYou"),
    working: $("#working"),
    finished: $("#finished"),
  };
  Object.values(areas).forEach((area) => area.replaceChildren());
  for (const mission of missions) {
    const target =
      mission.status === "waiting_for_roger"
        ? areas.needsYou
        : ["ready_for_review", "complete", "cancelled"].includes(mission.status)
          ? areas.finished
          : areas.working;
    target.append(card(mission));
  }
  Object.values(areas).forEach((area) => {
    if (!area.children.length) {
      const empty = document.createElement("p");
      empty.className = "empty";
      empty.textContent = "Nothing here.";
      area.append(empty);
    }
  });
}

async function refresh() {
  try {
    const health = await api("dispatcher_health");
    $("#health").textContent =
      health.dataWritable && health.backupWritable
        ? "Storage + backup writable"
        : "Storage check failed";
    if (!sessionStorage.getItem("aiStartStagingToken")) {
      render([]);
      return;
    }
    const changed = await api("missions_since", { headers: headers() });
    render(changed.missions);
    message.textContent = "";
  } catch (error) {
    render([]);
    message.textContent = error.message;
  }
}

$("#saveToken").addEventListener("click", () => {
  sessionStorage.setItem("aiStartStagingToken", tokenInput.value.trim());
  refresh();
});

$("#refresh").addEventListener("click", refresh);

$("#missionForm").addEventListener("submit", async (event) => {
  event.preventDefault();
  const form = new FormData(event.currentTarget);
  const lines = (name) =>
    String(form.get(name) || "")
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean);
  const body = {
    mainCategory: form.get("mainCategory"),
    projectCode: form.get("projectCode"),
    currentProject: form.get("currentProject"),
    missionName: form.get("missionName"),
    goal: form.get("goal"),
    completionDefinition: form.get("completionDefinition"),
    requiredCapability: form.get("requiredCapability"),
    priority: "normal",
    constraints: lines("constraints"),
    contextRefs: [],
    currentStep: form.get("currentStep"),
    doNotDoYet: lines("doNotDoYet"),
  };
  try {
    await post("mission_create", body);
    event.currentTarget.reset();
    message.textContent = "Mission queued.";
    await refresh();
  } catch (error) {
    message.textContent = error.message;
  }
});

refresh();
