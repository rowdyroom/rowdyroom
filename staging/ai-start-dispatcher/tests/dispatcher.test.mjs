import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, readdirSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { createDispatcherServer } from "../server.mjs";

const CHAT_TOKEN = "test-chat-credential";
const WORK_TOKEN = "test-work-credential";
const WORK_TWO_TOKEN = "test-work-two-credential";
const WRONG_WORK_TOKEN = "test-wrong-work-credential";
const ROGER_TOKEN = "test-roger-credential";
const REVIEWER_TOKEN = "test-reviewer-credential";
const ADMIN_TOKEN = "test-admin-credential";

const clients = [
  { actorId: "chat-main", role: "chat", token: CHAT_TOKEN },
  {
    actorId: "work-main",
    role: "work",
    token: WORK_TOKEN,
    capabilities: ["code", "testing"],
    allowedCategories: ["AI Project"],
    allowedProjects: ["AI Start"],
    availability: "available",
    maxActiveMissions: 1,
  },
  {
    actorId: "work-two",
    role: "work",
    token: WORK_TWO_TOKEN,
    capabilities: ["code"],
    allowedCategories: ["AI Project"],
    allowedProjects: ["AI Start"],
    availability: "available",
    maxActiveMissions: 1,
  },
  {
    actorId: "wrong-work",
    role: "work",
    token: WRONG_WORK_TOKEN,
    capabilities: ["audio"],
    allowedCategories: ["DJ Business"],
    allowedProjects: ["Show Audio"],
    availability: "available",
    maxActiveMissions: 1,
  },
  { actorId: "roger", role: "roger", token: ROGER_TOKEN },
  { actorId: "reviewer-main", role: "reviewer", token: REVIEWER_TOKEN },
  { actorId: "admin-main", role: "admin", token: ADMIN_TOKEN },
];

const seed = {
  updates: [
    {
      id: "upd_existing",
      createdAt: "2026-07-26T00:00:00.000Z",
      missionName: "Existing AI Start update",
    },
  ],
  bots: [
    {
      id: "bot_existing",
      botPasscode: "0001",
      botName: "Existing bot",
    },
  ],
};

function missionBody(name = "Dispatcher staging mission") {
  return {
    mainCategory: "AI Project",
    projectCode: "5601",
    currentProject: "AI Start",
    missionName: name,
    goal: "Verify deterministic Chat-to-Work coordination in staging.",
    completionDefinition: "All required mission transitions and evidence are verified.",
    requiredCapability: "code",
    priority: "normal",
    constraints: ["Do not touch production"],
    contextRefs: ["docs/continuity/AI_START_DISPATCHER_CONTRACT.md"],
    currentStep: "Claim the mission",
    doNotDoYet: ["Do not deploy"],
  };
}

test("AI Start Dispatcher Contract v1 — 18 acceptance tests", async (t) => {
  let now = Date.parse("2026-07-26T20:00:00.000Z");
  const dataDir = mkdtempSync(join(tmpdir(), "ai-start-dispatcher-test-"));
  const { server, store } = createDispatcherServer({
    dataDir,
    clients,
    leaseMs: 60_000,
    clock: () => now,
    seed,
  });
  const preDispatcherSnapshot = join(dataDir, "pre-dispatcher-snapshot.json");
  store.createRecoverySnapshot(preDispatcherSnapshot);

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  const address = server.address();
  const base = `http://127.0.0.1:${address.port}`;

  async function request(action, { method = "GET", token, body, key, leaseToken } = {}) {
    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (key) headers["Idempotency-Key"] = key;
    if (leaseToken) headers["X-Lease-Token"] = leaseToken;
    const response = await fetch(`${base}/api.php?action=${action}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();
    return { status: response.status, body: payload };
  }

  let missionId;
  let version;
  let leaseToken;
  let questionCursor;

  try {
    await t.test("1. Chat creates one mission and receives a stable mission ID", async () => {
      const result = await request("mission_create", {
        method: "POST",
        token: CHAT_TOKEN,
        key: "create-primary",
        body: missionBody(),
      });
      assert.equal(result.status, 200);
      assert.match(result.body.missionId, /^mis_/);
      missionId = result.body.missionId;
      version = result.body.missionVersion;
    });

    await t.test("2. An incompatible bot receives no work", async () => {
      const result = await request("mission_next", { token: WRONG_WORK_TOKEN });
      assert.equal(result.status, 200);
      assert.equal(result.body.mission, null);
    });

    await t.test("3. One compatible Work bot claims the mission atomically", async () => {
      const result = await request("mission_claim", {
        method: "POST",
        token: WORK_TOKEN,
        key: "claim-primary",
        body: { missionId, expectedVersion: version },
      });
      assert.equal(result.status, 200);
      assert.equal(result.body.status, "claimed");
      assert.ok(result.body.leaseToken);
      version = result.body.missionVersion;
      leaseToken = result.body.leaseToken;
    });

    await t.test("4. A second bot cannot claim the leased mission", async () => {
      const result = await request("mission_claim", {
        method: "POST",
        token: WORK_TWO_TOKEN,
        key: "claim-primary-second-bot",
        body: { missionId, expectedVersion: version },
      });
      assert.equal(result.status, 409);
      assert.equal(result.body.error, "mission_unavailable");
    });

    await t.test("5. Work receives only the compact mission packet and delta events", async () => {
      const result = await request(
        `mission_get&missionId=${encodeURIComponent(missionId)}`,
        { token: WORK_TOKEN },
      );
      assert.equal(result.status, 200);
      assert.equal(result.body.mission.missionId, missionId);
      assert.equal(result.body.mission.goal, missionBody().goal);
      assert.ok(Array.isArray(result.body.events));
      assert.equal("tokenHash" in (result.body.mission.lease || {}), false);
      assert.equal("idempotency" in result.body.mission, false);
      const cursor = result.body.events.at(-1).eventId;
      const delta = await request(
        `mission_get&missionId=${encodeURIComponent(missionId)}&cursor=${encodeURIComponent(cursor)}`,
        { token: WORK_TOKEN },
      );
      assert.deepEqual(delta.body.events, []);
    });

    await t.test("6. Work moves the mission to working", async () => {
      const result = await request("mission_start", {
        method: "POST",
        token: WORK_TOKEN,
        key: "start-primary",
        leaseToken,
        body: { missionId, expectedVersion: version },
      });
      assert.equal(result.status, 200);
      assert.equal(result.body.status, "working");
      version = result.body.missionVersion;
    });

    await t.test("7. Work pauses with one question in waiting_for_roger", async () => {
      const event = await request("mission_event", {
        method: "POST",
        token: WORK_TOKEN,
        key: "question-primary",
        leaseToken,
        body: {
          missionId,
          expectedVersion: version,
          type: "question",
          summary: "Approve the staging-only verification step?",
          needsResponse: true,
          responseFrom: "roger",
        },
      });
      assert.equal(event.status, 200);
      version = event.body.missionVersion;
      questionCursor = event.body.eventId;
      const transition = await request("mission_transition", {
        method: "POST",
        token: WORK_TOKEN,
        key: "wait-primary",
        leaseToken,
        body: {
          missionId,
          expectedVersion: version,
          toStatus: "waiting_for_roger",
        },
      });
      assert.equal(transition.body.status, "waiting_for_roger");
      version = transition.body.missionVersion;
    });

    await t.test("8. Roger's answer returns the mission to Work without losing the cursor", async () => {
      const answer = await request("mission_event", {
        method: "POST",
        token: ROGER_TOKEN,
        key: "answer-primary",
        body: {
          missionId,
          expectedVersion: version,
          type: "approval",
          summary: "Approved for staging only.",
        },
      });
      assert.equal(answer.status, 200);
      version = answer.body.missionVersion;
      const resumed = await request("mission_transition", {
        method: "POST",
        token: ROGER_TOKEN,
        key: "resume-primary",
        body: {
          missionId,
          expectedVersion: version,
          toStatus: "working",
        },
      });
      assert.equal(resumed.body.status, "working");
      version = resumed.body.missionVersion;
      const delta = await request(
        `mission_get&missionId=${encodeURIComponent(missionId)}&cursor=${encodeURIComponent(questionCursor)}`,
        { token: WORK_TOKEN },
      );
      assert.ok(delta.body.events.some((event) => event.summary.includes("Approved")));
      assert.ok(delta.body.events.some((event) => event.type === "started"));
    });

    await t.test("9. Work submits evidence and moves to ready_for_review", async () => {
      const event = await request("mission_event", {
        method: "POST",
        token: WORK_TOKEN,
        key: "result-primary",
        leaseToken,
        body: {
          missionId,
          expectedVersion: version,
          type: "result",
          summary: "Staging behavior verified.",
          evidenceRefs: ["test-results/dispatcher.tap"],
        },
      });
      assert.equal(event.status, 200);
      version = event.body.missionVersion;
      const transition = await request("mission_transition", {
        method: "POST",
        token: WORK_TOKEN,
        key: "ready-primary",
        leaseToken,
        body: {
          missionId,
          expectedVersion: version,
          toStatus: "ready_for_review",
        },
      });
      assert.equal(transition.body.status, "ready_for_review");
      version = transition.body.missionVersion;
    });

    await t.test("10. Work cannot self-complete", async () => {
      const result = await request("mission_transition", {
        method: "POST",
        token: WORK_TOKEN,
        key: "work-complete-primary",
        leaseToken,
        body: {
          missionId,
          expectedVersion: version,
          toStatus: "complete",
        },
      });
      assert.equal(result.status, 403);
      assert.equal(result.body.error, "work_cannot_complete");
    });

    await t.test("11. Chat sees the result through missions_since and its inbox", async () => {
      const changed = await request("missions_since", { token: CHAT_TOKEN });
      assert.equal(changed.status, 200);
      assert.ok(changed.body.missions.some((mission) => mission.missionId === missionId));
      const inbox = await request("mission_inbox", { token: CHAT_TOKEN });
      assert.equal(inbox.status, 200);
      assert.ok(
        inbox.body.events.some(
          (event) => event.missionId === missionId && event.type === "result",
        ),
      );
    });

    await t.test("12. Chat requests one revision and then closes the mission", async () => {
      const revision = await request("mission_transition", {
        method: "POST",
        token: CHAT_TOKEN,
        key: "revision-primary",
        body: {
          missionId,
          expectedVersion: version,
          toStatus: "revision_requested",
          summary: "Add the rollback evidence.",
        },
      });
      assert.equal(revision.body.status, "revision_requested");
      version = revision.body.missionVersion;
      const resumed = await request("mission_transition", {
        method: "POST",
        token: WORK_TOKEN,
        key: "revision-start-primary",
        leaseToken,
        body: {
          missionId,
          expectedVersion: version,
          toStatus: "working",
        },
      });
      version = resumed.body.missionVersion;
      const resultEvent = await request("mission_event", {
        method: "POST",
        token: WORK_TOKEN,
        key: "revision-result-primary",
        leaseToken,
        body: {
          missionId,
          expectedVersion: version,
          type: "result",
          summary: "Rollback evidence added.",
          evidenceRefs: ["recovery/pre-dispatcher-snapshot.json"],
        },
      });
      version = resultEvent.body.missionVersion;
      const ready = await request("mission_transition", {
        method: "POST",
        token: WORK_TOKEN,
        key: "revision-ready-primary",
        leaseToken,
        body: {
          missionId,
          expectedVersion: version,
          toStatus: "ready_for_review",
        },
      });
      version = ready.body.missionVersion;
      const complete = await request("mission_transition", {
        method: "POST",
        token: CHAT_TOKEN,
        key: "complete-primary",
        body: {
          missionId,
          expectedVersion: version,
          toStatus: "complete",
        },
      });
      assert.equal(complete.status, 200);
      assert.equal(complete.body.status, "complete");
      version = complete.body.missionVersion;
    });

    let duplicateMissionId;
    await t.test("13. Repeated mutation requests do not create duplicates", async () => {
      const first = await request("mission_create", {
        method: "POST",
        token: CHAT_TOKEN,
        key: "create-duplicate-check",
        body: missionBody("Idempotency check"),
      });
      const second = await request("mission_create", {
        method: "POST",
        token: CHAT_TOKEN,
        key: "create-duplicate-check",
        body: missionBody("Idempotency check"),
      });
      assert.equal(first.status, 200);
      assert.deepEqual(second.body, first.body);
      duplicateMissionId = first.body.missionId;
      const exported = await request("export_json");
      assert.equal(
        exported.body.missions.filter(
          (mission) => mission.missionId === duplicateMissionId,
        ).length,
        1,
      );
    });

    await t.test("14. Lease expiry safely requeues an abandoned mission", async () => {
      const claim = await request("mission_claim", {
        method: "POST",
        token: WORK_TOKEN,
        key: "claim-expiry-check",
        body: { missionId: duplicateMissionId },
      });
      assert.equal(claim.body.status, "claimed");
      now += 61_000;
      const health = await request("dispatcher_health");
      assert.ok(health.body.expiredLeases >= 1);
      const next = await request("mission_next", { token: WORK_TOKEN });
      assert.equal(next.body.mission.missionId, duplicateMissionId);
      assert.equal(next.body.mission.status, "queued");
      assert.equal(next.body.mission.assignedBot, null);
    });

    await t.test("15. Existing updates, bots, exports, imports, backups, health, and UI work", async () => {
      const unauthorized = await request("mission_create", {
        method: "POST",
        key: "unauthorized-create",
        body: missionBody("Unauthorized mission"),
      });
      assert.equal(unauthorized.status, 401);
      assert.equal(unauthorized.body.error, "unauthorized");
      const legacyUpdate = {
        mainCategory: "AI Project",
        projectCode: "5601",
        botPasscode: "0001",
        currentProject: "AI Start",
        projectStatus: "Testing",
        missionName: "Legacy compatibility",
        missionGoal: "Verify existing action compatibility.",
        missionStepPlan: "1. Save 2. Read back",
        stepStartedOn: "Step 1",
        stepCurrentlyOn: "Step 2",
        stepsLeft: 0,
        stepsCompleted: "Saved",
        completionDefinition: "Readback passes",
        whatChanged: "Staging only",
        evidence: "Automated test",
        doNotDoYet: "Do not deploy",
        recoveryRequired: "Production reconciliation",
      };
      const update = await request("save_update", {
        method: "POST",
        token: CHAT_TOKEN,
        key: "legacy-update",
        body: legacyUpdate,
      });
      assert.equal(update.status, 200);
      const bot = await request("save_bot", {
        method: "POST",
        token: CHAT_TOKEN,
        key: "legacy-bot",
        body: {
          botPasscode: "0099",
          botName: "Staging Compatibility Bot",
          botType: "Work Thread",
        },
      });
      assert.equal(bot.status, 200);
      assert.ok((await request("updates14")).body.updates.length >= 1);
      assert.ok((await request("bots")).body.bots.length >= 2);
      const exported = await request("export_json");
      assert.ok(exported.body.updates.some((item) => item.id === update.body.update.id));
      const imported = await request("import_json", {
        method: "POST",
        token: ADMIN_TOKEN,
        key: "legacy-import",
        body: { data: exported.body },
      });
      assert.equal(imported.status, 200);
      const health = await request("health");
      assert.equal(health.body.ok, true);
      const markdown = await request("export_markdown");
      assert.match(markdown.body, /AI Start Staging Export/);
      const page = await fetch(base).then((response) => response.text());
      assert.match(page, /Needs You/);
      assert.match(page, /Working/);
      assert.match(page, /Finished/);
      assert.match(page, /Advanced \/ History/);
      const browserCode = await fetch(`${base}/app.js`).then((response) => response.text());
      assert.match(browserCode, /Request Revision/);
      assert.match(browserCode, /Accept Complete/);
      assert.match(browserCode, /Cancel/);
    });

    await t.test("16. No credential or private infrastructure value appears in browser code", () => {
      const publicDir = join(
        process.cwd(),
        "staging",
        "ai-start-dispatcher",
        "public",
      );
      const source = readdirSync(publicDir)
        .map((file) => readFileSync(join(publicDir, file), "utf8"))
        .join("\n");
      for (const secret of [
        CHAT_TOKEN,
        WORK_TOKEN,
        WORK_TWO_TOKEN,
        WRONG_WORK_TOKEN,
        ROGER_TOKEN,
        REVIEWER_TOKEN,
        ADMIN_TOKEN,
      ]) {
        assert.equal(source.includes(secret), false);
      }
      assert.equal(source.includes("tokenHash"), false);
      assert.equal(source.includes("/home/"), false);
    });

    await t.test("17. Primary storage and backup are writable after the test", async () => {
      const claim = await request("mission_claim", {
        method: "POST",
        token: WORK_TOKEN,
        key: "claim-version-heartbeat-check",
        body: { missionId: duplicateMissionId },
      });
      assert.equal(claim.status, 200);
      const conflict = await request("mission_start", {
        method: "POST",
        token: WORK_TOKEN,
        key: "version-conflict-check",
        leaseToken: claim.body.leaseToken,
        body: { missionId: duplicateMissionId, expectedVersion: 99999 },
      });
      assert.equal(conflict.status, 409);
      assert.equal(conflict.body.error, "version_conflict");
      const heartbeat = await request("mission_heartbeat", {
        method: "POST",
        token: WORK_TOKEN,
        key: "heartbeat-check",
        leaseToken: claim.body.leaseToken,
        body: {
          missionId: duplicateMissionId,
          expectedVersion: claim.body.missionVersion,
        },
      });
      assert.equal(heartbeat.status, 200);
      const health = await request("dispatcher_health");
      assert.equal(health.status, 200);
      assert.equal(health.body.dataWritable, true);
      assert.equal(health.body.backupWritable, true);
    });

    await t.test("18. Rollback restores the pre-dispatcher version and existing records", async () => {
      const result = store.restoreRecoverySnapshot(preDispatcherSnapshot);
      assert.equal(result.ok, true);
      const exported = await request("export_json");
      assert.equal(exported.body.missions.length, 0);
      assert.deepEqual(exported.body.updates, seed.updates);
      assert.deepEqual(exported.body.bots, seed.bots);
      assert.equal((await request("health")).body.counts.updates, 1);
      assert.equal((await request("health")).body.counts.bots, 1);
    });
  } finally {
    await new Promise((resolve, reject) =>
      server.close((error) => (error ? reject(error) : resolve())),
    );
  }
});
