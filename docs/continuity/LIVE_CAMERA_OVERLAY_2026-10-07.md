# Rowdy Room live camera overlay — 2026-10-07

Status: read-only web overlay deployed at `https://rowdyroom.site/live-overlay/`; TikTok LIVE Studio scene integration and owner preview remain **Recovery required**.

The page is a transparent 9:16-friendly overlay intended above Roger's camera, not a replacement for the camera. It leaves the middle of the picture open and contains a small Rowdy Room brand at the top, current and next singer cards near the bottom, and the top two live-vote averages. There is no QR code or full-page website capture. The source is `deploy/live-overlay/index.html`; the production copy is `/public_html/live-overlay/index.html` on the existing cPanel host. No existing queue, API, camera, or scene files were modified.

The overlay polls existing public read-only PHP endpoints `/api/queue` and `/api/vote/live-standings` every five seconds. The score list is the rolling 12-hour `live_show` aggregate, **not** a per-show leaderboard, Main 4 authority, or automatic queue-retention control. If either endpoint fails, the overlay shows `DATA UNAVAILABLE` and suppresses stale names/scores. It uses text nodes for user-supplied singer/song data, not HTML insertion. No host credentials are embedded.

Verification: deployed page returned HTTP 200; deployed JavaScript parsed; Chrome rendered `LIVE DATA`, `Between singers`, the actual queued singer, and the top two scores matching both live endpoints. The camera/overlay composite was not tested inside TikTok LIVE Studio because its native scene UI is not available through the current automation surface; browser transparency is specified in the page but TikTok's handling of that transparency is unverified. Do not call it an active stream overlay until a LIVE Studio preview confirms it is above the camera and not covering Roger's face.

Rollback: remove or hide only the overlay source from the LIVE Studio scene. The overlay web page is independent, so no queue/API rollback is needed. Source recovery copy and verification receipt are in the dated local recovery package described by `START_HERE.md`.

Continuity: public branch `codex/queue-host-unified-20260917`, initial source commit `9cb0be0`; protected record `rowdy-room/live-camera-overlay-2026-10-07` version 1/history 2302; verification run `e84c528c-45e0-4b18-accf-3259475f1ef0` (4 pass, 1 warn); local recovery archive SHA-256 `a276bf1e6712fecad5d25d90d5b36461c1b7197ea915d9af134099920e263ad4`.
