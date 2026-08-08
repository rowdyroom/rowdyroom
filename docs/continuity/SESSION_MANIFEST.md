# Rowdy Room Session Manifest

**Manifest version:** 13  
**Updated:** 2026-08-07  
**Branch:** `agent/rowdy-room-continuity`  
**Authority checkpoint commit:** `7a5daad95ebd68d5525fb54bb6e49fb2679329ab`

Use this compact file for ordinary continuations in a verified session. If the manifest version and applicable authority versions match the session state, do not reload unchanged full documents. Load only new mission events and task-relevant records.

Force a full applicable reload for a new session, compaction, reconstruction, contradiction, missing authority, manifest change, or material/high-risk work.

| Authority | Version | Git blob SHA |
|---|---:|---|
| `docs/ROWDY_ROOM_OPERATOR_LAW.md` | 2.0 | `024f0af02bc3c8e7ac7abe4b638363ebe4981dc5` |
| `docs/ROWDY_ROOM_BIBLE.md` | 1.1 | `a9fde5c6f17e88b63ab390a6e839cfb6b7bce214` |
| `docs/continuity/START_HERE.md` | 3.2 | `3d670c20bde60b9bfd5b740ae1b3ccf59ef312d6` |
| `docs/continuity/CURRENT_STATE.md` | 2026-08-07.4 | `1c087a3ef3ecf2269b3ef14605ae752fe1a0a86c` |
| `docs/continuity/CHANGELOG.md` | 2026-08-07.8 | `3940c9cf0443448ddadd818890547c87b9abed19` |
| `docs/continuity/CONTINUITY_RUNBOOK.md` | 2.0 | `d785f58138df8a5e5fd92903f78de422aa594670` |
| `docs/continuity/ASSISTANT_FOUNDRY_LEARNING_LAW.md` | 1.1 | `9ae444c431a1076206c0fcad60c265bf0d609194` |
| `docs/continuity/RACC_CUSTOMIZER_AND_COMMUNICATION_HUB.md` | 2026-08-07.7 | `6248f0aa3a3977f3616ac37738377744d3b78d5d` |
| `docs/continuity/RACC_CONSOLIDATED_WORKSPACE.md` | 2026-08-07.1 | `b57a04f560d0e1c096b969da2ef58aa5adf7ba3d` |
| `docs/continuity/RACC_CONTROL_CENTER_SHELL_AND_LAUNCHERS.md` | 2026-08-07.2 | `1e8cdd171270220089598bce8e8ac6d9080e0e4e` |
| `docs/continuity/AI_START_DISPATCHER_CONTRACT.md` | 1.0 | `43860200a4790ffc32281c53a003d6bb0a147e74` |

## Compact compliance checklist

- Use the latest explicit correction.
- Confirm the action is authorized and proportional.
- Load only task-relevant changed records.
- Verify attempted actions by readback.
- Preserve privacy and approval gates.
- Mark missing or contradictory authority `Recovery required`.
- Use the full final Law audit when the work is material, mutating, high-risk, contradictory, reconstructed, or manifest-changed.

## Approved coordination defaults

- Deterministic code handles routing, status, locks, leases, heartbeat, queue polling, and idle decisions.
- Models exchange compact mission packets and delta events.
- Complete durable history stays outside the active prompt until needed.
- One primary worker is the default.
- Cloud ChatGPT and Work sessions are not treated as self-waking without a verified trigger or adapter.
