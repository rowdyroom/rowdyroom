# AI Start Dispatcher Staging v1

**Status:** Isolated staging implementation verified; not deployed  
**Date:** 2026-07-26  
**Owner:** Roger Jamsek  
**Contract:** [AI Start Dispatcher Contract v1](AI_START_DISPATCHER_CONTRACT.md)

## Result

The first recoverable dispatcher staging implementation exists at:

`staging/ai-start-dispatcher/`

It uses deterministic application code for mission routing, state transitions,
capability matching, claims, leases, heartbeat, idempotency, inbox reads, cursor
reads, and idle decisions. No model call is used for those mechanical tasks.

This checkpoint does not modify or deploy the live AI Start site.

## Included behavior

- Mission states and server-validated transitions from the approved contract.
- Chat, Work, Reviewer, Roger, and Admin roles.
- Capability, category, project, availability, and work-limit routing.
- Atomic single-worker claims with hashed lease tokens.
- Configurable lease duration and deterministic heartbeat.
- Compact mission packets and delta-only event reads.
- Append-only mission events, actor inboxes, and acknowledgements.
- Required idempotency keys and optimistic version checks.
- Work may submit `ready_for_review` but cannot self-complete.
- Runtime-supplied credentials; no credential is committed or embedded in browser code.
- Existing AI Start-style `health`, `updates14`, `updates_old`, `bots`,
  `save_update`, `save_bot`, `export_json`, `export_markdown`, and `import_json`
  actions in the isolated staging service.
- A minimal **Needs You / Working / Finished** dashboard with advanced/history
  controls kept out of the default view.
- Snapshot and rollback commands.

The staging server preserves the `api.php?action=...` URL shape. It uses a
Node.js standard-library service because PHP is not installed in the current
Work runtime and the authoritative live `api.php` source is not yet represented
in GitHub.

## Verification

| Check | Result |
|---|---|
| Approved contract acceptance checks | 18 / 18 passed |
| Node test runner | 19 passed, 0 failed; one parent suite plus 18 checks |
| Line coverage | 86.55% |
| Branch coverage | 74.75% |
| Function coverage | 91.84% |
| Repository TypeScript check | Passed after installing declared dependencies locally |
| Staging JavaScript syntax checks | Passed |
| Git whitespace/error check | Passed |
| Snapshot CLI | Passed |
| Rollback CLI | Passed |
| Browser credential/private-path scan | Passed |
| Live AI Start health after local work | 6 updates, 1 bot, data and backup writable |

Acceptance coverage includes:

1. stable mission creation;
2. incompatible-worker idle behavior;
3. atomic compatible claim;
4. duplicate-claim rejection;
5. compact packet and cursor reads;
6. start transition;
7. one-question pause;
8. answer and cursor-preserving return;
9. result evidence and review handoff;
10. Work self-completion rejection;
11. Chat result visibility;
12. revision and Chat completion;
13. idempotent retries;
14. expired-lease requeue;
15. legacy actions, exports, import, backup, health, and dashboard;
16. browser security scan;
17. writable primary and backup storage;
18. rollback to the pre-dispatcher seed with existing records intact.

Additional checks inside the suite verify unauthorized-write rejection, version
conflict rejection, and heartbeat renewal.

## Files

- `staging/ai-start-dispatcher/lib/dispatcher-store.mjs`
- `staging/ai-start-dispatcher/server.mjs`
- `staging/ai-start-dispatcher/public/index.html`
- `staging/ai-start-dispatcher/public/app.js`
- `staging/ai-start-dispatcher/public/styles.css`
- `staging/ai-start-dispatcher/scripts/snapshot.mjs`
- `staging/ai-start-dispatcher/scripts/rollback.mjs`
- `staging/ai-start-dispatcher/tests/dispatcher.test.mjs`
- `staging/ai-start-dispatcher/README.md`

## Recovery required

- Recover and reconcile the authoritative live AI Start PHP/static source.
- Convert or port the verified staging behavior to the production-compatible
  PHP/storage implementation.
- Choose the final per-client authentication mechanism and protected
  credential-storage location.
- Confirm authenticated writes from a standard Chat conversation.
- Choose the notification channel and frequency.
- Verify automatic wake behavior through an approved adapter; cloud ChatGPT and
  Work sessions still cannot be described as self-waking.
- Run the suite in a private hosting-equivalent staging path with copied,
  non-public production-shaped data.
- Measure lease and heartbeat behavior with real Work sessions and inactive tabs.

## Exact next safe action

Recover the current live AI Start source into a private, versioned staging
workspace; port this verified behavior to the hosting-compatible stack; then run
the same 18 checks against that private staging deployment. Production remains
blocked until that result passes and Roger gives separate deployment approval.
