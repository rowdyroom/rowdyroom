# Stream Queue Readiness Audit

**Date:** 2026-07-13  
**Status:** Supabase queue core hardened and database-smoke-tested; live Mission Control stack not yet verified  
**Active Supabase project:** `szubjgpvlqliyparrnam`

## Executive result

The Supabase karaoke queue now has tested guarantees for public signup, duplicate rejection, deterministic queue order, one current performer, one open performance, performer switching, completion, removal, authorized line skips, and Boost Point movement.

This does **not** yet justify calling the whole Rowdy Room stream stack ready. The deployed Mission Control and Companion pages appear to use a separate PHP/MySQL queue based on `queue_entries`, `performances`, and `performer_requests`. That live PHP source is not present in the GitHub repository, no cPanel/SSH/SFTP connector is available, and the domain could not be reached from the available HTTP inspection environment. The PHP queue therefore remains unverified and uncontrolled.

## Supabase defects found and repaired

### Unauthorized skip decisions

The legacy function `rr_decide_skip_request(uuid,text)` was executable by anonymous clients and did not require a host key.

Repair:

- anonymous, authenticated, and public execute access revoked
- service-role access retained
- new `rr_admin_decide_skip_request(text,uuid,text)` requires the valid host key
- approved movement uses a locked, deterministic queue rewrite

### Non-serialized signup positions

Concurrent or legacy inserts could calculate or supply conflicting queue positions.

Repair:

- insert trigger obtains an advisory transaction lock
- active signups are appended to `max(queue_position) + 1`
- active queue positions are protected by a unique partial index
- the public insert policy permits only clean `queued` records

### Multiple current performers

There was no database invariant preventing multiple `performing` singers.

Repair:

- unique partial index permits only one `performing` singer
- start/switch function locks performer transitions

### Multiple open performance records

Switching singers requeued the visible performer but did not close the prior performance record. Four historical performance records were still open even though those singers were completed.

Repair:

- performer switching closes previous open performance records and calculates vote totals/average
- four stale historical records were closed
- unique partial index permits only one open performance globally

### Unsafe queue reorder and boost movement

The old boost transfer code contained a target-update ambiguity equivalent to `where id = id`, which could affect every queued row. Reordering also lacked exact-set validation.

Repair:

- exact active-queue ID set required
- duplicate IDs rejected
- advisory locks serialize movement
- two-phase negative/positive position updates avoid uniqueness collisions
- boost wallet debit, ledger entry, and applied-position count remain transactional

## Verification completed

### Core queue smoke test

Passed 11 transactional checks with no test rows persisted:

1. public signup
2. contiguous append positions
3. duplicate active singer rejection
4. safe append for legacy direct insert
5. deterministic host reorder
6. exactly one current performer
7. voting opens with performer start
8. exactly one open performance during switch
9. completion closes singer, performance, and voting
10. current/next performer consistency
11. self-removal and unauthorized-skip rejection

Post-test real state:

- active queue: `0`
- performing singers: `0`
- open performances: `0`
- test rows persisted: `false`

### Movement smoke test

Passed with no test rows persisted:

- host-authorized line-skip movement
- deterministic rewritten positions
- Boost Point movement
- wallet debit
- ledger entry

## Current source-of-truth split

### Supabase queue

Tables and functions include:

- `rr_singers`
- `rr_state`
- `rr_performances`
- `rr_votes`
- `rr_skip_requests`
- `rr_boost_wallets`
- `rr_boost_transfers`
- `rr_boost_ledger`

The older host/viewer pages read the same `rr_singers` ordering and subscribe to Supabase realtime changes.

### PHP/MySQL Mission Control queue

The deployed server scan identifies a separate stack using:

- `queue_entries`
- `performances`
- `votes`
- `performer_requests`
- `/mission-control/`
- `/companion/`
- `/api/admin-ops.php`
- `/api/index.php`

This is likely the newer Mission Control workflow. Its live source must be imported into GitHub or exposed through a controlled server connector before it can receive code review, automated tests, rollback support, or verified deployment.

## Stream-ready acceptance criteria

Do not label the full show stream-ready until the actual production pages pass all of the following using the same backend:

- public signup succeeds from the audience-facing page
- invalid and duplicate signups are rejected clearly
- host approval, when required, enters the correct queue
- host and companion screens show the same order
- current and next performer agree everywhere
- start, complete, skip, remove, requeue, reorder, and line-skip work
- exactly one performer and one performance are active
- voting opens and closes with the correct performance
- refresh/reconnect preserves queue state
- realtime or polling synchronization updates all screens
- no test records remain

## Applied migrations

- `supabase/migrations/20260713_harden_stream_queue_core.sql`
- `supabase/migrations/20260713_fix_performer_transition_integrity.sql`

## Repeatable tests

- `supabase/tests/20260713_stream_queue_smoke_test.sql`
- `supabase/tests/20260713_stream_queue_movement_smoke_test.sql`

## Rollback policy

Do not restore anonymous access to the insecure legacy skip-decision function. If an emergency rollback is required, disable queue writes and restore the prior function bodies from a known database backup while retaining the security revocation. Queue constraints should be removed only after confirming no concurrent signup, performer, or ordering risk exists.
