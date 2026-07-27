# Rowdy Room Continuity Runbook

**Effective:** 2026-07-20

This runbook prevents important Rowdy Room facts from existing only inside a chat.

## Mandatory start and finish gates

For every Rowdy Room prompt, continuation, and action:

1. On a new, compacted, reconstructed, contradictory, material, high-risk, or manifest-changed session, read `docs/ROWDY_ROOM_OPERATOR_LAW.md` and `docs/continuity/START_HERE.md` before substantive action.
2. On an ordinary continuation in a verified session, read `docs/continuity/SESSION_MANIFEST.md`. If the manifest and applicable authority versions are unchanged, retrieve only new mission events or task-relevant records.
3. After each action, compare the actual result against the verified Operator Law version and correct any missed requirement that can still be corrected safely.
4. Before an ordinary non-mutating final response with an unchanged manifest, perform the compact compliance checklist. Before material, mutating, high-risk, contradictory, reconstructed, or manifest-changed work, reread the complete Operator Law and perform the full audit.
5. Do not substitute a statement of compliance for evidence. Preserve paths, commits, record keys, versions, hashes, checks, and recovery locations.

## Session Manifest and delta-loading rule

1. Treat `docs/continuity/SESSION_MANIFEST.md` as the compact version gate for verified sessions.
2. Increment its manifest version whenever a listed authority changes.
3. Record the manifest version and applicable authority versions in session state after a full load.
4. If those versions remain unchanged, reuse the verified rules and fetch only events or records newer than the session cursor.
5. Force a full applicable reload after compaction, reconstruction, a new session, a contradiction, missing authority, manifest change, or a material/high-risk task.
6. Keep complete durable history outside the active prompt and retrieve it by record ID, path, version, or evidence reference only when needed.
7. Use deterministic code rather than model calls for routing, status, locks, leases, heartbeat, queue polling, and idle decisions.
8. Token reduction never overrides correctness, recovery, privacy, authorization, or verification requirements.

## The verified save rule

A material Rowdy Room change is complete only after all applicable steps pass:

1. Update the appropriate public-safe Bible or continuity document.
2. Add a dated changelog entry that explains what changed and why.
3. Save the public-safe record to a GitHub branch or commit.
4. Save structured or private operational facts to the private system of record.
5. Read the GitHub copy back.
6. Read the private copy back.
7. Compare the values that are supposed to match.
8. Record a pass, warning, or failure for each target.
9. Create a dated local recovery copy that contains no exposed secrets.
10. Update `docs/continuity/START_HERE.md` and add a dated breadcrumb that lets a future task find the saved result and its verification evidence.

If any required save fails, the change remains incomplete and the failure must be reported plainly.

## Required breadcrumb record

Every material change must leave a public-safe breadcrumb containing:

- the date and a short description of the change
- the authoritative public-safe file path, branch, and commit
- safe identifiers for private records, including record key, version, and content hash
- the continuity-check run identifiers and pass, warning, or failure status
- the dated local recovery path, file hash, and package contents summary
- any remaining `Recovery required` facts or unverified surfaces
- the exact next safe action

The root map is `docs/continuity/START_HERE.md`. Chat history and task titles may help with discovery, but they are never authoritative breadcrumbs.

## What counts as a material change

- equipment additions, replacements, removals, or failures
- show-flow, game-rule, scoring, or Main 4 decisions
- production code, database, endpoint, or deployment changes
- booking, pricing, contact, or public-brand changes
- credentials status without recording the credential itself
- new risks, incidents, recovery discoveries, or unresolved contradictions

## Privacy split

The connected GitHub repository is public. It may contain:

- public product decisions
- public-safe current state
- public-safe equipment descriptions approved for publication
- continuity rules and changelog entries

It must not contain:

- passwords, API keys, tokens, or private URLs
- customer or performer personal information
- equipment serial numbers or private storage locations
- detailed private infrastructure or security information
- private purchase and insurance records

Those details remain in the private system of record and the protected local backup.

## Recovery procedure

When an important fact is missing:

1. Mark it `Recovery required`.
2. Search the durable records and approved backups.
3. Ask Roger only after the available records are exhausted.
4. Record the source used to recover the fact.
5. Save and read back both applicable copies.
6. Keep the previous version in history.

Never turn a plausible guess into an authoritative record.

## Same-chat limit and handoff procedure

1. Stay in the current Rowdy Room conversation unless Roger explicitly authorizes a move.
2. Do not claim compaction is disabled or an exact remaining-context count is known unless the current runtime exposes that control or meter.
3. When a reliable near-limit warning appears, pause new substantive work and notify Roger.
4. Review the entire accessible chat plus every applicable durable record.
5. Build a handoff covering decisions, corrections, requirements, exclusions, equipment facts and test status, budgets, selections, rejections, evidence, unresolved questions, current task, and exact next action.
6. Save the handoff publicly and privately as appropriate; read it back; verify history, checks, hashes, breadcrumbs, and a dated recovery package.
7. Review the handoff plan with Roger before a deliberate move.
8. If any part of the conversation is inaccessible, mark it `Recovery required`; never describe the handoff as complete.

## Scheduled checks

The private system keeps nightly snapshots and a visible result for each scheduled run. A failed run must remain visible until investigated. GitHub history provides the public-document rollback path; the dated local package provides an additional recovery copy.


