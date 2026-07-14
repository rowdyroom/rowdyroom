# Rowdy Room Cleanup, Retention, and Deletion Law

**Effective:** 2026-07-14  
**Owner:** Roger Jamsek  
**Authority:** Rowdy Room Bible

## Purpose

This law permits aggressive cleanup without allowing guesses, duplicate-folder assumptions, or convenience deletions to damage a live Rowdy Room product.

Cleanup covers:

- cPanel domains, folders, files, redirects, backups, and installers
- GitHub source, tools, documentation, branches, workflows, and issues
- Supabase projects, tables, views, functions, policies, storage objects, generated Engine data, and historical rows

## Law 1 — Every item receives one status

Before removal, every item must be classified as one of:

- **KEEP** — active, authoritative, legally required, historical source of truth, or needed for rollback.
- **RETIRE** — proven obsolete and approved for removal from active systems.
- **REVIEW** — purpose, owner, dependency, or live usage is not yet proven.
- **QUARANTINE** — removed from active use but retained temporarily for recovery.

An unclassified item may not be deleted.

## Law 2 — Cleanup is not discovery by deletion

Nothing may be deleted merely to see whether the system still works.

Before deletion, record:

1. Exact object name and location.
2. Current purpose or suspected purpose.
3. Evidence that it is obsolete.
4. Dependencies and references.
5. Backup or export location.
6. Rollback method.
7. Verification test.
8. Roger's approval for the exact deletion group.

## Law 3 — Canonical systems are protected

The canonical domain registry, standalone TV law, Companion queue, Mission Control, voting, memories, booking, Boost Points, Rumble, Wheel, Buzzer, Song Finder, Video Maker, Render service, and privacy policy may not be deleted or relocated during cleanup unless their governing law is changed first.

A duplicate-looking folder is not proof that either copy is obsolete.

## Law 4 — cPanel deletion sequence

A cPanel item may be deleted only after this sequence:

1. Confirm the canonical hostname and document root.
2. Create an account or folder backup outside the active document root.
3. Compare files, sizes, timestamps, and identifying markers.
4. Confirm the item is not a cPanel document root, redirect target, shared asset directory, API dependency, or active upload location.
5. Move the item to `_cleanup_quarantine/YYYY-MM-DD/` when practical.
6. Run live smoke tests for affected domains.
7. Retain quarantine for at least 14 days.
8. Delete only after final approval.

Temporary PHP installers must be deleted immediately after successful use, but only after confirming they are not active application files.

## Law 5 — Git history is not clutter

Merged pull requests and commit history remain as audit history. Cleanup removes obsolete files from the current branch; it does not rewrite or erase Git history.

Safe GitHub cleanup includes:

- removing obsolete active tools and tests
- removing stale package scripts and workflows
- marking superseded Bible records clearly
- closing stale issues after resolution
- deleting merged feature branches after the merge is confirmed

The `main` branch, canonical registry, current Bible laws, rollback records for live migrations, and active deployment tools are protected.

## Law 6 — Supabase migrations are immutable history

Applied migration history must not be deleted or edited to make the dashboard look cleaner.

Schema cleanup must be performed with new reversible migrations that:

- archive or export data first
- remove dependencies in a controlled order
- include rollback SQL where technically possible
- pass security, queue, voting, Companion, TV, memories, Boost, and Rumble smoke tests

## Law 7 — Production data is not disposable clutter

Singer history, votes, performances, memory orders, purchased or delivered memory files, Boost transactions, contributor records, and operational updates may have business or audit value.

They require a written retention decision before deletion.

Generated scanner and Engine data may use shorter retention because it can be rebuilt, but only after confirming that no current dashboard, release gate, or knowledge function depends on the rows.

## Law 8 — Security findings are repaired, not hidden

A table, view, function, policy, or bucket may not be deleted solely to make a security-advisor warning disappear.

Security findings must be classified as:

- intended public behavior
- required but incorrectly secured
- obsolete and removable
- false positive with documented justification

## Law 9 — Project deletion is a separate approval

Deleting or pausing an entire Supabase project, domain, repository, or cPanel document root requires a separate explicit approval naming that exact project, domain, repository, or root.

An inactive status is not sufficient proof that a project is safe to delete.

## Law 10 — Baseline-first cleanup order

Cleanup proceeds in this order:

1. Freeze new structural changes.
2. Capture inventories and backups.
3. Remove obvious obsolete GitHub source that contradicts current laws.
4. Audit cPanel duplicate and legacy folders.
5. Audit Supabase generated data and inactive projects.
6. Repair security and permission defects.
7. Remove approved retired items in small batches.
8. Smoke-test after every batch.
9. Update the registry, Bible, and cleanup ledger.

## Required deletion record

Every destructive cleanup batch must record:

- batch name
- approved items
- backup/export location
- deletion time
- operator
- verification results
- rollback status
- final owner acceptance

If any required field is unknown, deletion stops.
