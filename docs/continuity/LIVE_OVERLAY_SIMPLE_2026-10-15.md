# Simplified live overlay — 2026-10-15

Deployed to the existing live-overlay URL. Now Singing and Up Next show singer names without song/artist details. Live Vote Leaders displays its label and the current top two names with average scores on one horizontal line; vote counts and the explanatory footer are removed. The bottom information bar and its timer are removed. Long leader names shorten visually while scores remain visible.

Exact production source readback passed; live page displayed LIVE DATA and current singer. Two-leader preview aligned horizontally without clipping; JavaScript syntax passed. Current live standings were empty, so the live page showed No scores yet. TikTok scene refresh and composite appearance remain unverified. Data endpoints, polling interval, score calculation and queue behavior are unchanged.

Protected authority: `rowdy-room/live-camera-overlay-2026-10-07`, v2, SHA-256 `19cbe32bb5a4f9fca64a3e9e3aa9e89b91e6a35eaa589c1a24d06f40ff67bd13`. Public branch `codex/overlay-simple-20261015` is unmerged. Local recovery key `Rowdy_Room_Overlay_Recovery_2026-10-15` contains original/deployed HTML, source readback and screenshot. Deployed SHA-256 `1a56d5d0c8a05b3693ddd93e8bac1ec33e8e1c2f7b07140942ff5d65275793d7`; rollback SHA-256 `1bcd13b5643eed9c9c0d8832e5c2d8308e22fd206061d84688906d286223f107`.

Next: refresh the existing TikTok browser source if it retains the old layout. No source URL replacement is required.
