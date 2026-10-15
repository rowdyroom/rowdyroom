# Simplified live overlay — 2026-10-15

Deployed to the existing live-overlay URL. Now Singing and Up Next show singer names without song/artist details. Live Vote Leaders displays its label and the current top two names with average scores on one horizontal line; vote counts and the explanatory footer are removed. The bottom information bar and its timer are removed. Long leader names shorten visually while scores remain visible.

Exact production source readback passed; live page displayed LIVE DATA and current singer. Two-leader preview aligned horizontally without clipping; JavaScript syntax passed. Current live standings were empty, so the live page showed No scores yet. TikTok scene refresh and composite appearance remain unverified. Data endpoints, polling interval, score calculation and queue behavior are unchanged.

Protected authority: `rowdy-room/live-camera-overlay-2026-10-07`, v2, SHA-256 `19cbe32bb5a4f9fca64a3e9e3aa9e89b91e6a35eaa589c1a24d06f40ff67bd13`. Public branch `codex/overlay-simple-20261015` is unmerged. Local recovery key `Rowdy_Room_Overlay_Recovery_2026-10-15` contains original/deployed HTML, source readback and screenshot. Deployed SHA-256 `1a56d5d0c8a05b3693ddd93e8bac1ec33e8e1c2f7b07140942ff5d65275793d7`; rollback SHA-256 `1bcd13b5643eed9c9c0d8832e5c2d8308e22fd206061d84688906d286223f107`.

Next: refresh the existing TikTok browser source if it retains the old layout. No source URL replacement is required.

## Badge removal and Live Studio follow-up

Removed both top brand/status badges and their script updates. Production source readback and live browser rendering passed; deployed SHA-256 `9f46a8eaa45060a71bbca876044e8d04826dbb2f90b1179ed358712b2c245e21`. Roger reports Live Studio retains the old appearance. Source URL/refresh inspection remains in progress; website verification does not establish the Live Studio scene updated.

## Next-three rotation and inline host BP decisions

The overlay cycles through the next three waiting singers every five seconds, labeled Up Next, Up 2nd and Up 3rd. It includes on-deck queue entries, excludes the current singer, skips missing places, preserves position on unchanged polls and resets when the queue changes. Empty queue shows Queue open. Deployed overlay SHA-256 `050f348d34a3a1a249eef1af430a6a1c7982e66117494b57133232f7010fc623`. Protected overlay record is v5, SHA-256 `7aa9538276651ea3c445ee93a4dea773e903c3ee5ad70cce7df72b08bd1c7ed6`.

Host BP decisions now appear beside the target singer, matched by queue entry ID. A compact inbox above the queue sticks within reach while scrolling and polls independently every three seconds. Approval/denial uses the existing authenticated BP endpoint; the existing server reserves BP and moves the entry on approval, with current/up-next protection. Denial does not reorder. Queue refreshes after decisions; duplicate clicks are guarded and controls disabled while saving. Approved song playback links and Mark Played remain available. The existing authenticated host browser was refreshed.

Host SHA-256 `db082a6aecfae18766b662de11009649d8ed237339ce3bcae9f51aabfc2a4db3`. Protected host authority `rowdy-room/bp-inline-host-20261015` v1, SHA-256 `5d439d4e2830f2ee6754feb39dff322a2cb751c678532e53289b6c836bcd29b0`. Recovery key `Rowdy_Room_BP_Host_Recovery_2026-10-15` contains prior/deployed HTML, checks and offline visual fixture; overlay recovery retains pre-rotation HTML.

Exact production source readbacks, full JavaScript syntax, rotation boundaries, target matching, escaping, duplicate guard, post-decision refresh and logout cleanup passed. Offline fixture verified layout. No live BP transaction was executed; no waiting queue entries or pending requests were available for owner acceptance. Roger resolved extra audio by disabling sound on the overlay browser source. Branch remains unmerged.
