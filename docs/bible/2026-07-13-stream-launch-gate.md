# Rowdy Room Stream Launch Gate

**Date:** 2026-07-13  
**Status:** Rumble source repairs complete; Supabase queue verified; live Mission Control verification blocked by missing server source/access.

## Rumble deployment gate

All 11 ordered Rumble repairs are available through one installer:

```bash
node tools/rumble/apply-all-repairs.mjs --check /path/to/index.html
node tools/rumble/apply-all-repairs.mjs --apply /path/to/index.html
node tools/rumble/apply-all-repairs.mjs --verify /path/to/index.html
```

The installer:

- runs repairs 1 through 11 in the required order
- accepts pristine or partially repaired source
- applies all transformations in memory before touching the target
- verifies every repair is idempotently installed
- creates one timestamped backup of the original file
- writes the completed result atomically
- re-verifies the installed file
- restores the original automatically if post-write verification fails

Manual rollback:

```bash
node tools/rumble/apply-all-repairs.mjs --restore /path/to/original.bak /path/to/index.html
```

Complete automated suite:

```bash
node --test tools/rumble/*.test.mjs
```

GitHub Actions runs that suite on every Rumble-related pull request and main-branch change.

## Queue launch gate

Run the read-only SQL preflight before every stream:

```text
supabase/tests/20260713_stream_launch_preflight.sql
```

It checks:

- no more than one current performer
- no more than one open performance
- current performer and open performance match
- voting state matches performer state
- active queue positions are unique and positive
- no duplicate active singer names
- queued, performing, and completed timestamps are consistent
- required queue integrity indexes exist
- the insecure legacy skip approval is not public
- the host-authorized skip function remains available
- pending skip and Boost requests are surfaced for host review

The preflight is read-only and can be run against production without creating singers or changing the queue.

## Supabase queue verification already completed

The active Supabase project passed transactional tests for:

- public sign-up
- contiguous safe append
- duplicate rejection
- legacy direct-insert append protection
- deterministic host reorder
- one current performer
- voting open/close transitions
- one open performance
- performer switching
- current/next consistency
- completion
- self-removal
- authorized line-skip movement
- Boost Point movement
- wallet debit
- ledger entry

All smoke-test data rolled back. Four stale historical open performances were closed, and the database now enforces one performing singer and one open performance.

## Full stream-ready blocker

The deployed Mission Control and Companion stack appears to use a separate PHP/MySQL queue based on:

- `queue_entries`
- `performances`
- `votes`
- `performer_requests`
- `/mission-control/`
- `/companion/`
- `/api/admin-ops.php`
- `/api/index.php`

That exact deployed source is not in GitHub and no controlled cPanel, SSH, SFTP, or browser connector is available. GitHub issue #11 tracks the required source import and verification.

Do not call the full show stream-ready until the actual live Mission Control/Companion workflow passes:

- public sign-up
- host approval
- deterministic queue and rotation
- matching current/next performer across host and viewer screens
- start, complete, skip, remove, requeue, reorder, and line-skip
- refresh/reconnect persistence
- synchronization between host and Companion
- no leftover test records

## Before-show sequence

1. Confirm the actual production queue backend being used.
2. Run the queue preflight.
3. Resolve all failed checks and pending host actions.
4. Run the complete Rumble test suite.
5. Check the live Rumble file with the atomic installer.
6. Apply during a maintenance window.
7. Verify the installed file.
8. Browser-test the full Rumble acceptance list.
9. Test audience sign-up and host rotation end to end.
10. Keep the printed backup path available throughout the show.

## Status language

- **Code verified:** automated source tests passed.
- **Database verified:** production-safe SQL checks or rolled-back smoke tests passed.
- **Deployed:** server target changed successfully.
- **Browser verified:** actual production pages passed end-to-end interaction tests.
- **Stream-ready:** deployed, browser verified, queue verified, and rollback prepared.

At present, Rumble is code verified and the Supabase queue is database verified. Live deployment, browser verification, and the separate Mission Control queue verification remain pending.
