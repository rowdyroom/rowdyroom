# Rowdy Room Continuity Runbook

**Effective:** 2026-07-20

This runbook prevents important Rowdy Room facts from existing only inside a chat.

## Mandatory start and finish gates

For every Rowdy Room prompt, continuation, and action:

1. Read `docs/ROWDY_ROOM_OPERATOR_LAW.md` before the first substantive answer or action.
2. Read `docs/continuity/START_HERE.md` and follow the applicable breadcrumbs before deciding what is known or what access is available.
3. After each action, compare the actual result against the Operator Law and correct any missed requirement that can still be corrected safely.
4. Immediately before the final response, read the Operator Law again and perform a final compliance audit.
5. Do not substitute a statement of compliance for evidence. Preserve paths, commits, record keys, versions, hashes, checks, and recovery locations.

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

## Scheduled checks

The private system keeps nightly snapshots and a visible result for each scheduled run. A failed run must remain visible until investigated. GitHub history provides the public-document rollback path; the dated local package provides an additional recovery copy.


