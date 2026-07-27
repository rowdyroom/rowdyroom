# AI Start Dispatcher — Isolated Staging

This is the recoverable staging implementation authorized by Roger on 2026-07-26.
It does not modify or deploy to the live AI Start site.

## What it includes

- deterministic mission routing and state transitions;
- capability/category/project matching;
- one-worker atomic claims and configurable leases;
- compact mission packets and cursor-based event reads;
- actor inboxes and acknowledgements;
- idempotent writes and optimistic version checks;
- separate Chat, Work, Reviewer, Roger, and Admin roles;
- legacy AI Start update, bot, export, import, backup, and health actions;
- a three-section Needs You / Working / Finished dashboard;
- local snapshot and rollback commands;
- an 18-test acceptance suite matching the approved contract.

The staging server retains the `api.php?action=...` URL shape, but uses a Node.js
standard-library server because the current Work runtime does not include PHP and
the authoritative live `api.php` source is not yet in version control.

## Authentication

No credentials are committed. Supply client definitions at runtime:

```json
[
  {
    "actorId": "chat-main",
    "role": "chat",
    "token": "set-at-runtime"
  },
  {
    "actorId": "work-main",
    "role": "work",
    "token": "set-at-runtime",
    "capabilities": ["code", "testing"],
    "allowedCategories": ["AI Project"],
    "allowedProjects": ["AI Start"],
    "availability": "available",
    "maxActiveMissions": 1
  }
]
```

Set the JSON as `AI_START_CLIENTS_JSON`; the server hashes credentials in memory
and persists neither the raw token nor its hash in mission data.

## Run

```bash
AI_START_CLIENTS_JSON='[...]' node server.mjs
```

The server listens on `127.0.0.1:8787` by default. Set `PORT`,
`AI_START_DATA_DIR`, or `AI_START_LEASE_MS` to override staging defaults.

## Test

From the repository root:

```bash
node --test staging/ai-start-dispatcher/tests/dispatcher.test.mjs
```

## Recovery

```bash
node scripts/snapshot.mjs DATA_DIR SNAPSHOT_PATH
node scripts/rollback.mjs DATA_DIR SNAPSHOT_PATH
```

Production remains blocked until the staging tests pass, the live PHP source is
recovered and reconciled, final client authentication/secret storage is chosen,
hosting behavior is measured, and Roger separately approves deployment.
