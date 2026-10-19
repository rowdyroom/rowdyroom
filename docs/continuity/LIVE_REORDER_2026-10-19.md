# Live host rearrangement — 2026-10-19

Roger requested rearranging singers while live. Prepared: a visible Rearrange Singers action opens upcoming singers with Move Up / Move Down controls in both Normal Queue and Battle Karaoke. The current singer cannot be moved or ended by reordering. Whole waiting-list identity validation, the existing advisory lock, version guard and transaction prevent lost or stale moves. A manual Battle order updates the remaining turns and waiting backlog, and can bring a waiting singer into this round; already-finished singers cannot get a duplicate turn. Qualifying positions refresh normally at the next round boundary.

Validation: 68 isolated checks passed, including preservation of current performance, manual-next persistence through advancement, backlog promotion, omission/stale-request rejection and no duplicate host turn. Live deployment verification pending. No real audience queue order will be changed just to test controls while Roger is live.

Authority: this file on codex/queue-host-unified-20260917, not merged. Private record key: rowdy-room/live-reorder-2026-10-19. Protected recovery identifier: Rowdy_Room_Nine_Turn_Recovery_2026-10-18/Live_Reorder_2026-10-19.
