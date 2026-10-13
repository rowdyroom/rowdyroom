# TikFinity active-viewer BP — 2026-10-12

Roger approved replacing Companion-page viewing rewards with **active TikTok viewer rewards**. Each named viewer earns **1 BP per five-minute interval containing a comment or likes**, capped at **12 BP/hour**, without opening the Companion App. The first qualifying event credits that interval; it is not proof of five elapsed watch minutes.

TikFinity's API identifies interactions; its room statistics expose viewer counts and top gifters, not continuous watch time for every silent viewer. Silent viewing and join-only events are excluded. Sources: [TikFinity Event API](https://tikfinity.zerody.one/tiktok/dapi), [upstream event documentation](https://github.com/zerodytrash/TikTok-Live-Connector#events).

Implementation: a local background bridge receives TikFinity Desktop events, coalesces each viewer's chat/likes into five-minute intervals, signs delivery to the server, retries short outages and persists delivery state. Shared wallet credits are deduplicated and capped server-side. It forwards follows/shares using the recovered10/15 BP rules. Gift/game actions are not changed. The Companion timer is disabled, including its legacy endpoint, and the live page explains the new rule. Existing2 BP/position skips and5 BP playback requests remain host-approved.

Runtime: TikFinity Desktop is open; its Event API is reachable and the bridge is connected with no queued events or errors. The bridge starts at Windows sign-in and reconnects when TikFinity opens. TikFinity must remain running and connected to the actual stream on the show PC.

Validation: eight normalization checks, SQL duplicate/credential/stale-interval/cap tests, live signed receiver tests, and a full synthetic WebSocket-to-wallet pipeline passed. Four deployed files and four protected originals matched. Synthetic wallet credits were reversed; the queue remained empty, with no artificial votes. The restored page had no console errors.

Remaining acceptance: the first genuine audience interaction during an actual LIVE. Desktop/API connection and synthetic pipeline success do not establish genuine live-event delivery. The paid Pro subscription was not independently verified in the logged-out browser; no billing or subscription settings changed.

Authority: this record on `codex/queue-host-unified-20260917` (not merged); protected `rowdy-room/tikfinity-active-bp-2026-10-12`. Local recovery: `Rowdy_Room_TikFinity_BP_Recovery_2026-10-12/RECOVERY.md`, hashes and readback evidence. Exact private runtime and rollback paths remain protected.

Next safe action: during the next LIVE, have a viewer comment or tap likes, then confirm the credited BP under the same TikTok handle. They can keep the Companion App closed.
