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

## YouTube-first signup and host track visibility

- Public signup now begins with a single primary action to choose the exact YouTube karaoke video in SongFinder.
- The queue join button remains disabled until SongFinder returns a validated YouTube video.
- Companion passes the selected source name, canonical video URL, and duration metadata through the PHP queue API.
- The PHP/MySQL queue now stores and returns those fields. Only HTTPS YouTube and youtu.be video links are accepted.
- The host page maps the returned metadata and shows `Open Track` on the matching singer row.
- The host page's manual SongFinder path now preserves the same source metadata.
- Cross-window SongFinder messages are accepted only from `https://songfinder.rowdyroom.site`.
- End-to-end live acceptance passed with a fresh public identity: YouTube search returned eight results, a real result was selected, the queue join returned HTTP 200, API readback preserved the same video URL and source, and the host row displayed `Open Track`.
- A non-YouTube source URL was rejected with HTTP 400.
- The temporary QA queue entry was backed up and removed after verification.
- Final production SHA-256 values for this repair:
  - Queue service: `b8c67d6276e3f496856a4ac031104c9a2cb7b380222f1c01adbab1e2df32e0f1`
  - Companion HTML: `28f90315ac19b80c12fe2661aa3efc57ec22c5deb22c0545aafd4a14502e551b`
  - Companion JavaScript: `bf80929e3f7ae0778bab90b6b478985e5676c59bdbf2484c637e6e059b89f272`
  - Queue host page: `14a693f5a67be260527e70b99026f40fc5b208b851e86a2c0bcd19de797b3cc2`

## Guided app-style signup and host usability

- Companion now guides guests through five focused steps: 1-4 singer count, display names, exact SongFinder YouTube selection, optional support, and final confirmation.
- Multi-singer names persist in the PHP/MySQL queue and render together in host controls and TV mode.
- Optional support reuses the established Cash App tip handle and $5/$10/$20 PayPal performance-memory packages. No replacement payment system was introduced.
- Paid performance-memory selections retain contact and delivery details, payment verification state, recording consent, and the existing host memory-order controls.
- Host controls now lead with Voting, TV Mode, Refresh, and More Tools; specialized competition and administration panels remain available under More Tools.
- Live acceptance passed through a real YouTube search, two-person signup, API readback, host `Open Track`, TV rendering, automatic Vote-screen handoff, and exact QA cleanup.
- Phone-width acceptance passed after repairing long-username horizontal overflow. Payment destinations and required confirmation were verified without making a real payment.
- Final production hashes:
  - Companion HTML: `3e1fad944de00a31133e7113aa5e8834cf7e157af1cd85eb2291723e891a3012`
  - Companion JavaScript: `fb4ef9d5ef8d1ba4bec2cb0072f541360a08dbc99377929278228f52f6e60623`
  - Companion CSS: `655c94b5e50c3eb7289f24d25dc67f25cdbb11d9b3e637e34f3519e35be2b882`
  - Queue service: `854e9c7b2d0ea631cb982ec2e8dd6312e8c4f2689cc3cc113fd2ac2ca2f9a5fe`
  - Queue host page: `1220747c57ea2546ed3eb45179b0fa8452b609b64ba0f030680398bc6f0dc993`
  - TV JavaScript: `deadc0999a293560239946daf34d76d8cf012aafb6f2af8444a28646ab306dec`

