import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { createHash, randomBytes, randomUUID, timingSafeEqual } from "node:crypto";
import { dirname, join } from "node:path";

const TERMINAL = new Set(["complete", "cancelled"]);
const ACTIVE_LEASE_STATUSES = new Set(["claimed", "working", "revision_requested"]);
const VALID_STATUSES = new Set([
  "queued",
  "claimed",
  "working",
  "waiting_for_roger",
  "blocked",
  "ready_for_review",
  "revision_requested",
  "complete",
  "cancelled",
]);

const TRANSITIONS = {
  queued: new Set(["claimed", "cancelled"]),
  claimed: new Set(["working", "queued", "cancelled"]),
  working: new Set(["waiting_for_roger", "blocked", "ready_for_review", "cancelled"]),
  waiting_for_roger: new Set(["working", "cancelled"]),
  blocked: new Set(["working", "cancelled"]),
  ready_for_review: new Set(["revision_requested", "complete", "cancelled"]),
  revision_requested: new Set(["working", "cancelled"]),
  complete: new Set(),
  cancelled: new Set(),
};

const LEGACY_UPDATE_REQUIRED = [
  "mainCategory",
  "projectCode",
  "botPasscode",
  "currentProject",
  "projectStatus",
  "missionName",
  "missionGoal",
  "missionStepPlan",
  "stepStartedOn",
  "stepCurrentlyOn",
  "stepsLeft",
  "stepsCompleted",
  "completionDefinition",
  "whatChanged",
  "evidence",
  "doNotDoYet",
  "recoveryRequired",
];

export class DispatcherError extends Error {
  constructor(status, code, message, details = undefined) {
    super(message);
    this.name = "DispatcherError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export function hashSecret(value) {
  return createHash("sha256").update(String(value)).digest("hex");
}

function safeEqualHex(left, right) {
  if (!left || !right || left.length !== right.length) return false;
  return timingSafeEqual(Buffer.from(left, "hex"), Buffer.from(right, "hex"));
}

function nowIso(clock) {
  return new Date(clock()).toISOString();
}

function newId(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${randomBytes(6).toString("hex")}`;
}

function cleanString(value, field, max = 2000, required = true) {
  const text = typeof value === "string" ? value.trim() : "";
  if (required && !text) {
    throw new DispatcherError(422, "validation_failed", `${field} is required`, {
      [field]: "Required",
    });
  }
  if (text.length > max) {
    throw new DispatcherError(422, "validation_failed", `${field} is too long`, {
      [field]: `Maximum ${max} characters`,
    });
  }
  return text;
}

function cleanList(value, field, maxItems = 8, maxItemLength = 300) {
  const list = value == null ? [] : value;
  if (!Array.isArray(list) || list.length > maxItems) {
    throw new DispatcherError(422, "validation_failed", `${field} is invalid`, {
      [field]: `Use an array with at most ${maxItems} items`,
    });
  }
  return list.map((item, index) =>
    cleanString(item, `${field}[${index}]`, maxItemLength, true),
  );
}

function defaultData(seed = {}) {
  return {
    schemaVersion: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    updates: Array.isArray(seed.updates) ? seed.updates : [],
    bots: Array.isArray(seed.bots) ? seed.bots : [],
    missions: [],
    events: [],
    idempotency: {},
    inboxAcks: {},
  };
}

export class DispatcherStore {
  constructor({
    dataDir,
    clients = [],
    leaseMs = 30 * 60 * 1000,
    clock = () => Date.now(),
    seed = {},
  }) {
    if (!dataDir) throw new Error("dataDir is required");
    this.dataDir = dataDir;
    this.dataPath = join(dataDir, "ai-start-staging.json");
    this.backupPath = join(dataDir, "ai-start-staging.backup.json");
    this.previousPath = join(dataDir, "ai-start-staging.previous.json");
    this.leaseMs = leaseMs;
    this.clock = clock;
    this.clients = clients.map((client) => ({
      ...client,
      credentialHash:
        client.credentialHash || (client.token ? hashSecret(client.token) : ""),
      token: undefined,
    }));

    mkdirSync(this.dataDir, { recursive: true });
    if (!existsSync(this.dataPath)) {
      this.data = defaultData(seed);
      this.#save(false);
    } else {
      this.data = JSON.parse(readFileSync(this.dataPath, "utf8"));
    }
    this.#validateShape(this.data);
  }

  authenticate(authorization) {
    const match = /^Bearer\s+(.+)$/i.exec(authorization || "");
    if (!match) {
      throw new DispatcherError(401, "unauthorized", "Unauthorized");
    }
    const presented = hashSecret(match[1]);
    const actor = this.clients.find((client) =>
      safeEqualHex(client.credentialHash, presented),
    );
    if (!actor) {
      throw new DispatcherError(401, "unauthorized", "Unauthorized");
    }
    return actor;
  }

  health() {
    return {
      ok: true,
      storage: "isolated staging JSON",
      updatedAt: this.data.updatedAt,
      counts: {
        updates: this.data.updates.length,
        bots: this.data.bots.length,
      },
      dataWritable: this.#probeWritable(this.dataPath),
      backupWritable: this.#probeWritable(this.backupPath),
    };
  }

  dispatcherHealth() {
    this.#expireLeases();
    const counts = {};
    for (const status of VALID_STATUSES) counts[status] = 0;
    for (const mission of this.data.missions) counts[mission.status] += 1;
    return {
      ...this.health(),
      schemaVersion: this.data.schemaVersion,
      missions: counts,
      expiredLeases: this.data.events.filter((event) => event.type === "lease_expired")
        .length,
    };
  }

  listUpdates({ old = false } = {}) {
    const cutoff = this.clock() - 14 * 24 * 60 * 60 * 1000;
    return this.data.updates.filter((update) => {
      const created = Date.parse(update.createdAt || 0);
      return old ? created < cutoff : created >= cutoff;
    });
  }

  listBots() {
    return this.data.bots;
  }

  saveLegacyUpdate(actor, body, idempotencyKey) {
    return this.#mutate("save_update", actor, idempotencyKey, () => {
      const fieldErrors = {};
      for (const field of LEGACY_UPDATE_REQUIRED) {
        if (body[field] === undefined || body[field] === null || body[field] === "") {
          fieldErrors[field] = "Required";
        }
      }
      if (Object.keys(fieldErrors).length) {
        throw new DispatcherError(
          422,
          "validation_failed",
          "Required fields are missing",
          fieldErrors,
        );
      }
      const update = {
        ...body,
        id: newId("upd"),
        createdAt: nowIso(this.clock),
        actorId: actor.actorId,
      };
      this.data.updates.push(update);
      return { ok: true, update };
    });
  }

  saveLegacyBot(actor, body, idempotencyKey) {
    this.#requireRole(actor, ["chat", "roger", "admin"]);
    return this.#mutate("save_bot", actor, idempotencyKey, () => {
      const botPasscode = cleanString(body.botPasscode, "botPasscode", 20);
      const existing = this.data.bots.find((bot) => bot.botPasscode === botPasscode);
      const bot = {
        ...(existing || {}),
        ...body,
        id: existing?.id || newId("bot"),
        botPasscode,
        botName: cleanString(body.botName, "botName", 120),
        updatedAt: nowIso(this.clock),
        updatedBy: actor.actorId,
      };
      if (existing) Object.assign(existing, bot);
      else this.data.bots.push(bot);
      return { ok: true, bot };
    });
  }

  exportData() {
    return structuredClone(this.data);
  }

  exportMarkdown() {
    const lines = [
      "# AI Start Staging Export",
      "",
      `Updated: ${this.data.updatedAt}`,
      `Updates: ${this.data.updates.length}`,
      `Bots: ${this.data.bots.length}`,
      `Missions: ${this.data.missions.length}`,
      "",
    ];
    for (const mission of this.data.missions) {
      lines.push(`- ${mission.missionId}: ${mission.missionName} — ${mission.status}`);
    }
    return `${lines.join("\n")}\n`;
  }

  importData(actor, body, idempotencyKey) {
    this.#requireRole(actor, ["admin"]);
    return this.#mutate("import_json", actor, idempotencyKey, () => {
      const imported = body.data || body;
      this.#validateShape(imported);
      this.data = structuredClone(imported);
      return { ok: true, imported: true };
    });
  }

  createMission(actor, body, idempotencyKey) {
    this.#requireRole(actor, ["chat", "roger"]);
    return this.#mutate("mission_create", actor, idempotencyKey, () => {
      const createdAt = nowIso(this.clock);
      const mission = {
        missionId: newId("mis"),
        version: 1,
        createdAt,
        changedAt: createdAt,
        createdBy: actor.actorId,
        mainCategory: cleanString(body.mainCategory, "mainCategory", 80),
        projectCode: cleanString(body.projectCode, "projectCode", 20),
        currentProject: cleanString(body.currentProject, "currentProject", 120),
        missionName: cleanString(body.missionName, "missionName", 160),
        goal: cleanString(body.goal, "goal", 1000),
        completionDefinition: cleanString(
          body.completionDefinition,
          "completionDefinition",
          1000,
        ),
        requiredCapability: cleanString(
          body.requiredCapability,
          "requiredCapability",
          80,
        ),
        priority: body.priority || "normal",
        status: "queued",
        assignedBot: null,
        requiresRogerApproval: Boolean(body.requiresRogerApproval),
        approvalReason: body.approvalReason
          ? cleanString(body.approvalReason, "approvalReason", 500)
          : null,
        constraints: cleanList(body.constraints, "constraints", 8),
        contextRefs: cleanList(body.contextRefs, "contextRefs", 10, 500),
        currentStep: cleanString(body.currentStep, "currentStep", 500),
        doNotDoYet: cleanList(body.doNotDoYet, "doNotDoYet", 8),
        lastEventId: null,
        lease: null,
      };
      this.data.missions.push(mission);
      const event = this.#appendEvent(mission, actor.actorId, {
        type: "created",
        summary: `Mission created: ${mission.missionName}`,
        recipients: [],
        idempotencyKey,
      });
      return this.#mutationResponse(mission, event);
    });
  }

  nextMission(actor) {
    this.#requireRole(actor, ["work"]);
    this.#expireLeases();
    const activeCount = this.data.missions.filter(
      (mission) =>
        mission.assignedBot === actor.actorId &&
        !TERMINAL.has(mission.status) &&
        mission.status !== "waiting_for_roger" &&
        mission.status !== "ready_for_review",
    ).length;
    if (activeCount >= (actor.maxActiveMissions || 1)) {
      return { ok: true, mission: null };
    }
    const candidates = this.data.missions
      .filter((mission) => mission.status === "queued")
      .filter((mission) => this.#actorMatches(actor, mission))
      .sort((a, b) => {
        const priority = { urgent: 0, high: 1, normal: 2, low: 3 };
        return (
          (priority[a.priority] ?? 2) - (priority[b.priority] ?? 2) ||
          Date.parse(a.createdAt) - Date.parse(b.createdAt)
        );
      });
    return { ok: true, mission: candidates[0] ? this.#missionPacket(candidates[0]) : null };
  }

  claimMission(actor, body, idempotencyKey) {
    this.#requireRole(actor, ["work"]);
    return this.#mutate("mission_claim", actor, idempotencyKey, () => {
      const mission = this.#mission(body.missionId);
      if (mission.status !== "queued" || mission.lease) {
        throw new DispatcherError(409, "mission_unavailable", "Mission is not claimable");
      }
      if (!this.#actorMatches(actor, mission)) {
        throw new DispatcherError(403, "capability_mismatch", "Mission is not compatible");
      }
      const activeCount = this.data.missions.filter(
        (item) =>
          item.assignedBot === actor.actorId &&
          !TERMINAL.has(item.status) &&
          item.missionId !== mission.missionId,
      ).length;
      if (activeCount >= (actor.maxActiveMissions || 1)) {
        throw new DispatcherError(409, "work_limit", "Bot is already at its work limit");
      }
      this.#checkExpectedVersion(mission, body.expectedVersion);
      const leaseToken = randomBytes(24).toString("base64url");
      const now = this.clock();
      mission.status = "claimed";
      mission.assignedBot = actor.actorId;
      mission.lease = {
        missionId: mission.missionId,
        botId: actor.actorId,
        claimedAt: new Date(now).toISOString(),
        expiresAt: new Date(now + this.leaseMs).toISOString(),
        tokenHash: hashSecret(leaseToken),
      };
      this.#bump(mission);
      const event = this.#appendEvent(mission, actor.actorId, {
        type: "claimed",
        summary: `Claimed by ${actor.actorId}`,
        recipients: [mission.createdBy],
        idempotencyKey,
      });
      return { ...this.#mutationResponse(mission, event), leaseToken };
    });
  }

  startMission(actor, body, idempotencyKey, leaseToken) {
    return this.transitionMission(
      actor,
      { ...body, toStatus: "working" },
      idempotencyKey,
      leaseToken,
      "mission_start",
    );
  }

  addMissionEvent(actor, body, idempotencyKey, leaseToken) {
    return this.#mutate("mission_event", actor, idempotencyKey, () => {
      const mission = this.#mission(body.missionId);
      this.#checkExpectedVersion(mission, body.expectedVersion);
      if (actor.role === "work") this.#requireLease(mission, actor, leaseToken);
      else this.#requireRole(actor, ["chat", "reviewer", "roger", "admin"]);

      const type = cleanString(body.type, "type", 40);
      const allowedTypes = new Set([
        "progress",
        "question",
        "approval",
        "blocked",
        "result",
        "review",
        "revision",
      ]);
      if (!allowedTypes.has(type)) {
        throw new DispatcherError(422, "validation_failed", "Invalid event type");
      }
      const recipients =
        type === "question" || type === "approval" || type === "result"
          ? [mission.createdBy, "roger"]
          : type === "review" || type === "revision"
            ? [mission.assignedBot].filter(Boolean)
            : [];
      const event = this.#appendEvent(mission, actor.actorId, {
        type,
        summary: cleanString(body.summary, "summary", 1000),
        evidenceRefs: cleanList(body.evidenceRefs, "evidenceRefs", 10, 500),
        needsResponse: Boolean(body.needsResponse),
        responseFrom: body.responseFrom || null,
        recipients,
        idempotencyKey,
      });
      this.#bump(mission);
      return this.#mutationResponse(mission, event);
    });
  }

  transitionMission(
    actor,
    body,
    idempotencyKey,
    leaseToken,
    actionName = "mission_transition",
  ) {
    return this.#mutate(actionName, actor, idempotencyKey, () => {
      const mission = this.#mission(body.missionId);
      const toStatus = cleanString(body.toStatus, "toStatus", 40);
      if (!VALID_STATUSES.has(toStatus) || !TRANSITIONS[mission.status].has(toStatus)) {
        throw new DispatcherError(
          409,
          "invalid_transition",
          `Cannot transition ${mission.status} to ${toStatus}`,
        );
      }
      this.#checkExpectedVersion(mission, body.expectedVersion);
      this.#authorizeTransition(actor, mission, toStatus, leaseToken);

      const priorStatus = mission.status;
      mission.status = toStatus;
      if (toStatus === "queued") {
        mission.assignedBot = null;
        mission.lease = null;
      } else if (toStatus === "complete" || toStatus === "cancelled") {
        mission.lease = null;
      } else if (
        toStatus === "working" &&
        mission.lease &&
        actor.role !== "work"
      ) {
        mission.lease.expiresAt = new Date(this.clock() + this.leaseMs).toISOString();
      }
      this.#bump(mission);
      const eventType =
        toStatus === "working"
          ? "started"
          : toStatus === "ready_for_review"
            ? "result"
            : toStatus === "revision_requested"
              ? "revision"
              : toStatus === "complete"
                ? "completed"
                : toStatus === "cancelled"
                  ? "cancelled"
                  : toStatus === "blocked"
                    ? "blocked"
                    : toStatus === "waiting_for_roger"
                      ? "question"
                      : "progress";
      const recipients =
        toStatus === "ready_for_review" || toStatus === "waiting_for_roger"
          ? [mission.createdBy, "roger"]
          : toStatus === "revision_requested"
            ? [mission.assignedBot].filter(Boolean)
            : [];
      const event = this.#appendEvent(mission, actor.actorId, {
        type: eventType,
        summary:
          body.summary ||
          `Mission changed from ${priorStatus} to ${toStatus}`,
        recipients,
        needsResponse: toStatus === "waiting_for_roger",
        responseFrom: toStatus === "waiting_for_roger" ? "roger" : null,
        idempotencyKey,
      });
      return this.#mutationResponse(mission, event);
    });
  }

  heartbeat(actor, body, idempotencyKey, leaseToken) {
    this.#requireRole(actor, ["work"]);
    return this.#mutate("mission_heartbeat", actor, idempotencyKey, () => {
      const mission = this.#mission(body.missionId);
      this.#requireLease(mission, actor, leaseToken);
      if (!ACTIVE_LEASE_STATUSES.has(mission.status)) {
        throw new DispatcherError(409, "heartbeat_not_allowed", "Mission is not active");
      }
      mission.lease.expiresAt = new Date(this.clock() + this.leaseMs).toISOString();
      this.#bump(mission);
      return this.#mutationResponse(mission);
    });
  }

  releaseMission(actor, body, idempotencyKey, leaseToken) {
    this.#requireRole(actor, ["work"]);
    return this.transitionMission(
      actor,
      { ...body, toStatus: "queued" },
      idempotencyKey,
      leaseToken,
      "mission_release",
    );
  }

  getMission(actor, missionId, cursor = null) {
    const mission = this.#mission(missionId);
    if (
      actor.role === "work" &&
      mission.assignedBot !== actor.actorId &&
      !this.#actorMatches(actor, mission)
    ) {
      throw new DispatcherError(403, "forbidden", "Mission is not available to this actor");
    }
    const events = this.#eventsAfter(
      this.data.events.filter((event) => event.missionId === missionId),
      cursor,
    );
    return {
      ok: true,
      mission: this.#missionPacket(mission),
      events: events.map(this.#publicEvent),
      nextCursor: events.at(-1)?.eventId || cursor,
    };
  }

  inbox(actor, cursor = null) {
    const acked = new Set(this.data.inboxAcks[actor.actorId] || []);
    const events = this.#eventsAfter(
      this.data.events.filter(
        (event) =>
          event.recipients?.includes(actor.actorId) ||
          (actor.role === "roger" && event.recipients?.includes("roger")),
      ),
      cursor,
    );
    return {
      ok: true,
      events: events.map((event) => ({
        ...this.#publicEvent(event),
        acknowledged: acked.has(event.eventId),
      })),
      nextCursor: events.at(-1)?.eventId || cursor,
    };
  }

  missionsSince(actor, cursor = null) {
    this.#requireRole(actor, ["chat", "reviewer", "roger", "admin"]);
    const events = this.#eventsAfter(this.data.events, cursor);
    const missionIds = [...new Set(events.map((event) => event.missionId))];
    return {
      ok: true,
      missions: missionIds.map((id) => {
        const mission = this.#mission(id);
        return {
          missionId: mission.missionId,
          version: mission.version,
          missionName: mission.missionName,
          status: mission.status,
          assignedBot: mission.assignedBot,
          currentStep: mission.currentStep,
          changedAt: mission.changedAt,
          lastEventId: mission.lastEventId,
        };
      }),
      nextCursor: events.at(-1)?.eventId || cursor,
    };
  }

  acknowledge(actor, body, idempotencyKey) {
    return this.#mutate("message_ack", actor, idempotencyKey, () => {
      const event = this.data.events.find((item) => item.eventId === body.eventId);
      if (!event) throw new DispatcherError(404, "event_not_found", "Event not found");
      const acks = new Set(this.data.inboxAcks[actor.actorId] || []);
      acks.add(event.eventId);
      this.data.inboxAcks[actor.actorId] = [...acks];
      return {
        ok: true,
        requestId: newId("req"),
        eventId: event.eventId,
        acknowledged: true,
      };
    });
  }

  createRecoverySnapshot(snapshotPath) {
    mkdirSync(dirname(snapshotPath), { recursive: true });
    copyFileSync(this.dataPath, snapshotPath);
    return { snapshotPath, sha256: hashSecret(readFileSync(snapshotPath)) };
  }

  restoreRecoverySnapshot(snapshotPath) {
    const restored = JSON.parse(readFileSync(snapshotPath, "utf8"));
    this.#validateShape(restored);
    this.data = restored;
    this.#save(true);
    return { ok: true, restoredAt: nowIso(this.clock) };
  }

  #mutate(action, actor, idempotencyKey, operation) {
    if (!idempotencyKey) {
      throw new DispatcherError(
        422,
        "idempotency_required",
        "Idempotency-Key is required",
      );
    }
    this.#expireLeases();
    const key = `${actor.actorId}:${action}:${idempotencyKey}`;
    if (this.data.idempotency[key]) {
      return structuredClone(this.data.idempotency[key]);
    }
    const before = structuredClone(this.data);
    try {
      const response = operation();
      response.requestId ||= newId("req");
      this.data.idempotency[key] = structuredClone(response);
      this.#save(true);
      return response;
    } catch (error) {
      this.data = before;
      throw error;
    }
  }

  #save(preservePrevious) {
    this.data.updatedAt = nowIso(this.clock);
    const json = `${JSON.stringify(this.data, null, 2)}\n`;
    const nonce = `${process.pid}.${randomUUID()}`;
    const dataTemp = `${this.dataPath}.${nonce}.tmp`;
    const backupTemp = `${this.backupPath}.${nonce}.tmp`;
    let backupReplaced = false;
    writeFileSync(dataTemp, json, { mode: 0o600 });
    writeFileSync(backupTemp, json, { mode: 0o600 });
    try {
      if (preservePrevious && existsSync(this.dataPath)) {
        copyFileSync(this.dataPath, this.previousPath);
      }
      renameSync(backupTemp, this.backupPath);
      backupReplaced = true;
      renameSync(dataTemp, this.dataPath);
    } catch (error) {
      try {
        rmSync(dataTemp);
      } catch {
        // Nothing to remove.
      }
      try {
        rmSync(backupTemp);
      } catch {
        // Nothing to remove.
      }
      if (backupReplaced) {
        if (existsSync(this.dataPath)) copyFileSync(this.dataPath, this.backupPath);
        else rmSync(this.backupPath);
      }
      throw error;
    }
  }

  #probeWritable(targetPath) {
    const probePath = `${targetPath}.${process.pid}.probe`;
    try {
      writeFileSync(probePath, "ok", { mode: 0o600 });
      rmSync(probePath);
      return true;
    } catch {
      try {
        rmSync(probePath);
      } catch {
        // Nothing to remove.
      }
      return false;
    }
  }

  #validateShape(data) {
    const arrayFields = ["updates", "bots", "missions", "events"];
    if (!data || typeof data !== "object") {
      throw new DispatcherError(422, "invalid_import", "Invalid data document");
    }
    for (const field of arrayFields) {
      if (!Array.isArray(data[field])) {
        throw new DispatcherError(422, "invalid_import", `${field} must be an array`);
      }
    }
    if (!data.idempotency || typeof data.idempotency !== "object") {
      throw new DispatcherError(422, "invalid_import", "idempotency must be an object");
    }
    data.inboxAcks ||= {};
    data.schemaVersion ||= 1;
  }

  #expireLeases() {
    const expired = this.data.missions.filter(
      (mission) =>
        ACTIVE_LEASE_STATUSES.has(mission.status) &&
        mission.lease &&
        Date.parse(mission.lease.expiresAt) <= this.clock(),
    );
    if (!expired.length) return;
    for (const mission of expired) {
      const formerBot = mission.assignedBot;
      mission.status = "queued";
      mission.assignedBot = null;
      mission.lease = null;
      this.#bump(mission);
      this.#appendEvent(mission, "dispatcher", {
        type: "lease_expired",
        summary: `Lease expired for ${formerBot}; mission requeued`,
        recipients: [mission.createdBy],
        idempotencyKey: `lease-expired:${mission.version}`,
      });
    }
    this.#save(true);
  }

  #mission(missionId) {
    const mission = this.data.missions.find((item) => item.missionId === missionId);
    if (!mission) throw new DispatcherError(404, "mission_not_found", "Mission not found");
    return mission;
  }

  #bump(mission) {
    mission.version += 1;
    mission.changedAt = nowIso(this.clock);
  }

  #appendEvent(mission, actorId, input) {
    const event = {
      eventId: newId("evt"),
      missionId: mission.missionId,
      createdAt: nowIso(this.clock),
      actorId,
      type: input.type,
      summary: input.summary,
      evidenceRefs: input.evidenceRefs || [],
      needsResponse: Boolean(input.needsResponse),
      responseFrom: input.responseFrom || null,
      idempotencyKey: input.idempotencyKey,
      recipients: input.recipients || [],
    };
    this.data.events.push(event);
    mission.lastEventId = event.eventId;
    return event;
  }

  #publicEvent(event) {
    const { recipients: _recipients, ...safe } = event;
    return safe;
  }

  #eventsAfter(events, cursor) {
    if (!cursor) return events;
    const index = events.findIndex((event) => event.eventId === cursor);
    return index === -1 ? events : events.slice(index + 1);
  }

  #missionPacket(mission) {
    const { lease, changedAt, ...packet } = mission;
    return {
      ...packet,
      changedAt,
      lease: lease
        ? {
            missionId: lease.missionId,
            botId: lease.botId,
            claimedAt: lease.claimedAt,
            expiresAt: lease.expiresAt,
          }
        : null,
    };
  }

  #mutationResponse(mission, event = null) {
    return {
      ok: true,
      requestId: newId("req"),
      missionId: mission.missionId,
      missionVersion: mission.version,
      eventId: event?.eventId || mission.lastEventId,
      status: mission.status,
    };
  }

  #checkExpectedVersion(mission, expectedVersion) {
    if (
      expectedVersion !== undefined &&
      Number(expectedVersion) !== Number(mission.version)
    ) {
      throw new DispatcherError(409, "version_conflict", "Mission version conflict", {
        currentVersion: mission.version,
      });
    }
  }

  #requireRole(actor, roles) {
    if (!roles.includes(actor.role)) {
      throw new DispatcherError(403, "forbidden", "Actor is not permitted");
    }
  }

  #actorMatches(actor, mission) {
    const capabilities = actor.capabilities || [];
    const categories = actor.allowedCategories || [];
    const projects = actor.allowedProjects || [];
    return (
      (capabilities.includes("*") ||
        capabilities.includes(mission.requiredCapability)) &&
      (categories.includes("*") || categories.includes(mission.mainCategory)) &&
      (projects.includes("*") || projects.includes(mission.currentProject)) &&
      actor.availability !== "paused" &&
      actor.availability !== "offline" &&
      actor.availability !== "retired"
    );
  }

  #requireLease(mission, actor, leaseToken) {
    if (
      !mission.lease ||
      mission.assignedBot !== actor.actorId ||
      !safeEqualHex(mission.lease.tokenHash, hashSecret(leaseToken || ""))
    ) {
      throw new DispatcherError(409, "invalid_lease", "A valid mission lease is required");
    }
    if (
      ACTIVE_LEASE_STATUSES.has(mission.status) &&
      Date.parse(mission.lease.expiresAt) <= this.clock()
    ) {
      throw new DispatcherError(409, "lease_expired", "Mission lease expired");
    }
  }

  #authorizeTransition(actor, mission, toStatus, leaseToken) {
    if (actor.role === "work") {
      if (toStatus === "complete") {
        throw new DispatcherError(403, "work_cannot_complete", "Work cannot complete missions");
      }
      const allowed = new Set([
        "working",
        "waiting_for_roger",
        "blocked",
        "ready_for_review",
        "queued",
      ]);
      if (!allowed.has(toStatus)) {
        throw new DispatcherError(403, "forbidden", "Work cannot make this transition");
      }
      this.#requireLease(mission, actor, leaseToken);
      return;
    }

    if (toStatus === "complete" || toStatus === "revision_requested") {
      this.#requireRole(actor, ["chat", "reviewer", "roger"]);
      return;
    }
    if (
      mission.status === "waiting_for_roger" ||
      mission.status === "blocked"
    ) {
      this.#requireRole(actor, ["chat", "roger"]);
      return;
    }
    if (toStatus === "cancelled") {
      this.#requireRole(actor, ["chat", "roger", "admin"]);
      return;
    }
    this.#requireRole(actor, ["chat", "reviewer", "roger", "admin"]);
  }
}
