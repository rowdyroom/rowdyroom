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

## Verification

- Host page: HTTP 200, live sync active, host session restored.
- Host and TV agreed on idle state, next performer, song, queue ordering, and total count.
- Controlled QA Start/End round-trip passed.
- Final verified idle state:
  - Now performing: none.
  - Up next: `@jason` / `Inside out — Third eye blind`.
  - Four active performers.
- No failed Rowdy Room or Supabase network responses remained. GoDaddy-injected analytics produced unrelated browser CORS noise.
- Live page SHA-256: `e229f89858334abd43f47efc7ed45d6dae7cae253e9bee629d71f7c9407c4d4a`.
- Queue action service SHA-256: `7ef8463f9476c57e76f896bfe0de6f30aafcb86f4151aa97873f3045e50465dc`.

## Durable evidence

- Public branch: `codex/queue-host-unified-20260917`.
- Draft pull request: #33; not merged into `main`.
- Private continuity record: `rowdy-room/queue-host-unified-2026-09-17`, version 1, SHA-256 `5c0de7a903e969f952d25c1d571a0dbe7b75d5327a5d9153b4b89ddbc8651720`.
- Continuity check run: `7aeac164-b8b5-4f16-bf39-f6e298030bfa` — five pass, one warning.
- Local recovery record: `rowdyroom-live-repair-2026-09-17.md`, SHA-256 `6b7268eedf6637ae6b00e909581f81c9b8e118de6b13aa935215407c7845dd51`.

## Recovery and limits

Protected pre-change server backups were created and read back before every live overwrite. Their private locations are intentionally omitted from this public repository.

The contributor RPC intentionally follows the existing host-password-validated admin RPC architecture. Supabase's advisor therefore reports the expected anonymous-callable SECURITY DEFINER warning for that RPC, alongside numerous pre-existing advisor findings. Broader advisor remediation was not bundled into this live-show repair.

This document is a public-safe deployment record. The production PHP/static sources still need a deliberate repository synchronization process; production/GitHub drift remains a tracked risk.
