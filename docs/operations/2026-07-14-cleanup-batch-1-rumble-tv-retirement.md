# Cleanup Batch 1 — Retire Obsolete Rumble-Owned TV Source

**Date:** 2026-07-14  
**Owner approval:** Roger Jamsek — `APPROVE BATCH 1`  
**Operator:** OpenAI assistant through the connected GitHub account  
**Scope:** GitHub current branch only  
**Live cPanel changes:** None  
**Supabase schema/data changes:** None

## Purpose

Remove the obsolete implementation that made the Rumble game own a TV route. The approved standalone TV product is `tv.rowdyroom.site` and is governed separately from Rumble.

## Approved retired items

Deleted from the active branch:

- `tools/rumble/fix-tv-mode.mjs`
- `tools/rumble/fix-tv-mode.test.mjs`
- `tools/rumble/fix-tv-mode-hardening.mjs`
- `tools/rumble/fix-tv-mode-hardening.test.mjs`
- `docs/bible/2026-07-13-rumble-tv-mode-repair.md`
- `supabase/seed/20260713_rumble_tv_mode_repair.sql`
- `supabase/rollback/20260713_rumble_tv_mode_repair_rollback.sql`

Removed from active configuration:

- Rumble TV commands in `package.json`
- Rumble TV imports, composed repair, and repair step in `tools/rumble/apply-all-repairs.mjs`

## Dependency repairs

- The built-in question-bank repair now requires the completed buzzer strike-level repair instead of the obsolete TV marker.
- The responsive layout repair is renumbered as item 10 and contains no `#tvPage` exception.
- Rumble tests now validate a 10-step repair sequence.
- The Buzzer law no longer contains TV-mode requirements.
- The Rumble completion ledger now treats the standalone TV display as a separate product.

## Backup and rollback

Git history is the immutable backup.

Pre-cleanup `main` rollback reference:

```text
1b841a2b8a388694d65cda641523c44275d6ef77
```

Rollback requires a normal Git revert or restoration of selected files from that commit. Git history and the original merged pull requests are not rewritten or deleted.

## Verification gate

This batch may merge only after:

1. The complete Rumble test workflow passes.
2. The canonical domain registry workflow passes.
3. The pull-request diff contains no standalone TV files or cPanel changes.
4. `tools/rumble/apply-all-repairs.mjs` contains exactly 10 active repairs and no TV repair.
5. The deleted TV patchers are absent from the PR head.

## Effective deletion time

The GitHub merge timestamp for the cleanup pull request is the authoritative effective deletion time from `main`.

## Final owner acceptance

Owner approval for this exact batch was provided before implementation. Final acceptance is confirmed when the merged result is reported back to Roger Jamsek with the merge commit and verification outcome.
