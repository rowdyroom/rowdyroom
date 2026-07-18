# Rowdy Room Continuity Runbook

**Effective:** 2026-07-18

This runbook prevents important Rowdy Room facts from existing only inside a chat.

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

If any required save fails, the change remains incomplete and the failure must be reported plainly.

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


