# Queue Host Controls Unified With Live Signup Queue

**Date:** 2026-09-17  
**Status:** Live repair verified; repository synchronization branch only

## Problem

The Companion App and TV display used the PHP/MySQL queue, while the queue host-control page still read the older Supabase singer queue. The host page could therefore report an empty or stale queue while public signups were active.

## Live repair

- The host-control page now reads `/api/queue`, the same queue authority used by Companion and TV.
- PHP queue rows are mapped to the host display's performer, song, position, and status fields.
- Manual host-page signup now resolves the supplied username and joins the PHP queue.
- The primary controls now expose only the valid action for the current state:
  - `Start Next` for the first waiting performer.
  - `End Performance` only for the active performer.
- Obsolete Supabase queue drag, ban, and per-row start controls are not shown for PHP queue rows.
- Queue normalization no longer marks the next performer as current after the prior performance ends. Idle queues use `next`, `on_deck`, and `waiting` until the host explicitly starts the next performer.
- The Top Contributors panel now uses a host-password-validated RPC instead of a direct RLS-blocked table read.

## Host-action security

- `/queue/start-next` and `/queue/complete-current` now require the host key.
- The PHP API validates that key through the existing Supabase `rr_admin_ping` contract before executing either action.
- The browser sends the host key only for those two host actions.
- Acceptance passed: a request without the key returned HTTP 401; the saved valid host session returned HTTP 200; an authorized idle no-op left the queue unchanged.
- No credential value was printed or committed.

## Verification

- Host page: HTTP 200, live sync active, host session restored.
- Host and TV agreed on idle state, next performer, song, queue ordering, and total count.
- Controlled QA Start/End round-trip passed.
- Final verified idle state:
  - Now performing: none.
  - Up next: `@jason` / `Inside out — Third eye blind`.
  - Four active performers.
- No failed Rowdy Room or Supabase network responses remained. GoDaddy-injected analytics produced unrelated browser CORS noise.
- Final production SHA-256 values:
  - API index: `2a82a86b8ae8d976ecd1f57e2f909e190c1c97e51c093705441139c9c8b31d14`
  - Queue host page: `c08884a14a1975f782faa92ca4c128bf949b43b07289babd4a825e47ebadcfb9`
  - Queue action service: `7ef8463f9476c57e76f896bfe0de6f30aafcb86f4151aa97873f3045e50465dc`

## Durable evidence

- Public branch: `codex/queue-host-unified-20260917`.
- Draft pull request: #33; not merged into `main`.
- Private continuity record: `rowdy-room/queue-host-unified-2026-09-17`.
- Local recovery record: `rowdyroom-live-repair-2026-09-17.md`.
- Exact private record versions, hashes, check IDs, and protected server recovery paths remain in the private continuity store and local recovery record.

## Recovery and limits

Protected pre-change server backups were created and read back before every live overwrite. Their private locations are intentionally omitted from this public repository.

The contributor RPC intentionally follows the existing host-password-validated admin RPC architecture. Supabase's advisor therefore reports the expected anonymous-callable SECURITY DEFINER warning for that RPC, alongside numerous pre-existing advisor findings. Broader advisor remediation was not bundled into this live-show repair.

This document is a public-safe deployment record. The production PHP/static sources still need a deliberate repository synchronization process; production/GitHub drift remains a tracked risk.
