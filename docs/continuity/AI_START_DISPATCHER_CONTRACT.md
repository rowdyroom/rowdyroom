# AI Start Dispatcher Contract v1

**Status:** Approved design checkpoint  
**Approved by:** Roger  
**Date:** 2026-07-26  
**Scope:** Minimal Chat-to-Work coordination contract  
**Implementation status:** Not implemented

## 1. Purpose

AI Start becomes a lightweight dispatcher between Roger, the Chat assistant, and Work/Codex without turning into an uncontrolled autonomous-agent system.

Roger's normal workflow should be:

1. Tell Chat what he wants.
2. Answer only a genuine question or approval request.
3. Review the completed result.

Chat creates and reviews missions. Work claims and executes missions. Deterministic application code handles routing, state, locks, leases, queue checks, and idle decisions without model tokens.

## 2. Non-goals

Version 1 does not:

- make ChatGPT or Work sessions wake themselves without a supported trigger;
- allow bots to create unlimited sub-missions or talk in loops;
- grant new permissions merely because a mission exists;
- deploy production changes without Roger's required approval;
- replace the existing AI Start update log, backup, or bot registry;
- copy full conversations into every mission;
- build a general-purpose multi-agent platform.

## 3. Actors

| Actor | Responsibility |
|---|---|
| Roger | Gives goals, answers necessary questions, approves consequential actions, and accepts final outcomes. |
| Chat | Converts Roger's approved request into a mission, provides compact context, reviews Work results, and asks Roger only when necessary. |
| Work | Claims one compatible mission, performs authorized work, posts evidence and progress events, and stops at the required boundary. |
| Dispatcher | Uses deterministic rules to route missions, enforce transitions, hold leases, prevent duplicate work, and expose compact inbox views. |
| Reviewer | Optional. Used only when independent review is justified by material code, deployment, security, financial, or destructive risk. |

## 4. Mission lifecycle

| Status | Meaning | Next permitted actor |
|---|---|---|
| `queued` | Valid mission waiting for a compatible worker. | Dispatcher or Work |
| `claimed` | A worker owns a live lease but has not reported active execution. | Assigned Work |
| `working` | Assigned Work is executing the mission. | Assigned Work |
| `waiting_for_roger` | One clear question or approval is required. Work must stop. | Chat or Roger |
| `blocked` | Work cannot continue because of an external or technical blocker. | Chat |
| `ready_for_review` | Work produced a result and evidence. | Chat or optional Reviewer |
| `revision_requested` | Review found a specific correction within the original scope. | Assigned Work |
| `complete` | Completion definition and required review passed. | Nobody |
| `cancelled` | Roger or an authorized controller stopped the mission. | Nobody |

Allowed transitions:

```text
queued -> claimed
claimed -> working
claimed -> queued                 lease expiry or safe release
working -> waiting_for_roger
working -> blocked
working -> ready_for_review
waiting_for_roger -> working      after an answer or approval
blocked -> working                after blocker resolution
ready_for_review -> revision_requested
revision_requested -> working
ready_for_review -> complete
any non-terminal status -> cancelled
```

Work may not mark its own mission `complete`. It submits `ready_for_review`; Chat, Reviewer, or Roger closes it after checking evidence.

## 5. When a bot is needed

A Work bot is needed only when all conditions are true:

1. A mission is `queued`.
2. Its required capability matches the bot registry.
3. Its category and project are allowed for that bot.
4. The bot has the required permissions.
5. The bot is active and below its maximum active-mission limit.
6. No other worker holds a valid mission lease.

A bot is not needed when:

- no compatible mission is queued;
- another bot owns the lease;
- the mission is waiting for Roger;
- the mission is ready for Chat review;
- the mission is complete or cancelled;
- the bot is paused, offline, retired, or already at its work limit.

When no mission matches, the API returns an empty result and the model is not invoked.

## 6. Default routing rules

1. One primary worker per mission.
2. One active Work mission per bot unless Roger changes the bot's registry limit.
3. Exact capability match beats a general match.
4. Existing project context beats an unfamiliar bot when permissions are equal.
5. Oldest compatible queued mission wins unless priority is explicitly higher.
6. A reviewer is not assigned automatically for ordinary work.
7. Maximum normal handoffs: Chat to Work, then Work to Chat.
8. A revision returns to the same Work bot unless it is unavailable or lacks the required capability.
9. Bots cannot create new missions outside the parent mission's scope without Roger's approval.

## 7. Compact mission record

Required fields:

```json
{
  "missionId": "mis_...",
  "version": 1,
  "createdAt": "ISO-8601",
  "createdBy": "bot-or-user-id",
  "mainCategory": "AI Project",
  "projectCode": "5601",
  "currentProject": "AI Start",
  "missionName": "Short title",
  "goal": "One concise goal",
  "completionDefinition": "Observable completion test",
  "requiredCapability": "code",
  "priority": "normal",
  "status": "queued",
  "assignedBot": null,
  "requiresRogerApproval": false,
  "approvalReason": null,
  "constraints": [],
  "contextRefs": [],
  "currentStep": "First safe action",
  "doNotDoYet": [],
  "lastEventId": null,
  "lease": null
}
```

Token-control limits:

- `goal`: one short paragraph;
- `completionDefinition`: one short paragraph;
- `constraints`: maximum 8 concise items;
- `contextRefs`: maximum 10 record IDs, paths, URLs, or hashes;
- `doNotDoYet`: maximum 8 concise items;
- full history is excluded from the mission packet;
- default event reads return only events after the caller's cursor.

## 8. Bot registry additions

Each bot record gains:

```json
{
  "capabilities": ["planning", "code", "testing"],
  "allowedCategories": ["AI Project"],
  "allowedProjects": ["AI Start"],
  "permissionLevel": "approved-work",
  "availability": "available",
  "maxActiveMissions": 1,
  "currentMissionId": null,
  "lastSeenAt": "ISO-8601",
  "clientType": "chat|work|local|automation"
}
```

`botPasscode` remains an actor identifier. It is not sufficient authentication.

## 9. Authentication and permissions

Before deployment:

- issue separate per-client API credentials;
- store only credential hashes server-side;
- send credentials through an authorization header, never mission content;
- never expose privileged secrets in public browser JavaScript;
- validate category, project, capability, permission, and transition server-side;
- record actor, request ID, timestamp, prior version, and resulting version for every write;
- rate-limit failed authentication and mutation requests.

Every write includes an idempotency key. Repeating the same successful request returns the original result instead of creating a duplicate.

## 10. Lease and duplicate-work rules

- Default lease: 30 minutes.
- Deterministic client heartbeat: every 5 minutes while active.
- Heartbeat uses no model call.
- The lease contains mission ID, bot ID, claim time, expiry time, and lease token hash.
- Only the current lease holder may post Work transitions.
- A safe explicit release returns the mission to `queued`.
- An expired lease returns the mission to `queued` and records an audit event.
- Two bots can never hold valid leases for one mission.
- Terminal missions cannot be reclaimed.

Lease timing is configuration, not hard-coded business logic.

## 11. Append-only mission events

Events are immutable:

```json
{
  "eventId": "evt_...",
  "missionId": "mis_...",
  "createdAt": "ISO-8601",
  "actorId": "bot-or-user-id",
  "type": "created|claimed|started|progress|question|approval|blocked|result|review|revision|completed|cancelled|lease_expired",
  "summary": "Concise factual delta",
  "evidenceRefs": [],
  "needsResponse": false,
  "responseFrom": null,
  "idempotencyKey": "unique-request-key"
}
```

Events contain changes, not repeated mission history. Large outputs stay in their authoritative file or record and are referenced by ID, path, version, or hash.

## 12. Minimal API contract

The existing `api.php?action=...` pattern is retained.

### Read actions

| Action | Purpose |
|---|---|
| `dispatcher_health` | Counts, storage state, queue health, expired leases, and schema version. |
| `mission_get` | Current mission snapshot plus events after an optional cursor. |
| `mission_next` | Returns the next compatible queued mission for a bot, or an empty result. |
| `mission_inbox` | Returns actor-addressed events after a cursor. |
| `missions_since` | Returns changed mission summaries after a cursor for Chat review. |

### Write actions

| Action | Purpose |
|---|---|
| `mission_create` | Chat creates one validated mission. |
| `mission_claim` | Work atomically claims a queued mission and receives a lease. |
| `mission_start` | Lease holder moves `claimed` to `working`. |
| `mission_event` | Posts a concise progress, question, blocker, result, approval, or review event. |
| `mission_transition` | Performs one server-validated state transition. |
| `mission_heartbeat` | Deterministic lease renewal without invoking a model. |
| `mission_release` | Safely releases a claim back to the queue. |
| `message_ack` | Marks an inbox event as seen without altering mission history. |

All mutation responses return:

```json
{
  "ok": true,
  "requestId": "req_...",
  "missionId": "mis_...",
  "missionVersion": 2,
  "eventId": "evt_...",
  "status": "working"
}
```

## 13. Approval gates

Work must enter `waiting_for_roger` before:

- purchases, payments, subscriptions, or financial commitments;
- production deployment or live hosting changes;
- destructive or difficult-to-reverse actions;
- credential, permission, privacy, or access changes;
- sending messages, invitations, or public posts;
- expanding beyond the approved mission;
- choosing among materially different outcomes when Roger has not already decided.

The question must be one concise decision with the recommended choice first.

## 14. User interface

Roger's default dashboard contains only:

1. **Needs You** — unanswered questions and approvals.
2. **Working** — active missions and current step.
3. **Finished** — results ready for review or recently completed.

The current detailed update form and full history remain under **Advanced / History**. Bots populate audit fields automatically.

Primary actions:

- `Send to Work`
- `Approve`
- `Answer`
- `Request Revision`
- `Accept Complete`
- `Cancel`

## 15. Failure behavior

- Validation failure: save nothing and return field-level errors.
- Authentication failure: save nothing and return a generic unauthorized response.
- Duplicate idempotency key: return the original successful response.
- Version conflict: return current mission version; do not overwrite.
- Expired lease: reject the Work mutation and requeue safely.
- Storage or backup failure: reject mutations that cannot be durably saved.
- Unknown required fact: mark `Recovery required`; do not guess.
- Notification failure: mission state remains authoritative and the failed notification remains visible.

## 16. Acceptance tests

Version 1 implementation is acceptable only when all tests pass:

1. Chat creates one mission and receives a stable mission ID.
2. An incompatible bot receives no work.
3. One compatible Work bot claims the mission atomically.
4. A second bot cannot claim the leased mission.
5. Work receives only the compact mission packet and delta events.
6. Work moves the mission to `working`.
7. Work can pause with one question in `waiting_for_roger`.
8. Roger's answer returns the mission to Work without losing the cursor.
9. Work submits evidence and moves to `ready_for_review`.
10. Work cannot self-complete.
11. Chat sees the result through `missions_since` or its inbox.
12. Chat requests one revision or closes the mission.
13. Repeated mutation requests do not create duplicates.
14. Lease expiry safely requeues an abandoned mission.
15. Existing AI Start updates, bot records, exports, imports, backups, and health checks still work.
16. No credential or private infrastructure value appears in browser code or public records.
17. AI Start reports both primary storage and backup writable after the test.
18. A rollback restores the pre-dispatcher version and existing records.

## 17. Implementation sequence

1. Create a recoverable staging copy of AI Start.
2. Add mission, event, inbox, lease, and idempotency storage structures.
3. Add server-side validation, authentication, permissions, and state transitions.
4. Add the minimal read/write API actions.
5. Add the three-section dashboard and keep detailed fields under Advanced / History.
6. Run contract tests in staging with separate Chat and Work conversations.
7. Review security, backup, rollback, and existing-feature compatibility.
8. Present verified staging evidence to Roger.
9. Deploy only after separate production approval.

## 18. Recovery required

- A supported mechanism for automatically waking cloud ChatGPT or Work sessions.
- Confirmation that a standard Chat conversation can perform authenticated mission writes.
- Final per-client authentication mechanism and secret-storage location.
- Notification channel and trigger frequency.
- Hosting-side storage schema and rollback implementation.
- Measured lease timing under real Work sessions and inactive browser tabs.

## 19. Exact next safe action

Build the dispatcher in a recoverable staging copy using this contract. Do not alter the live AI Start files or production storage until staging passes the acceptance tests and Roger separately approves production deployment.
