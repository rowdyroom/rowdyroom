# Live host rearrangement — 2026-10-19

Roger requested rearranging singers while live. Prepared: a visible Rearrange Singers action opens upcoming singers with Move Up / Move Down controls in both Normal Queue and Battle Karaoke. The current singer cannot be moved or ended by reordering. Whole waiting-list identity validation, the existing advisory lock, version guard and transaction prevent lost or stale moves. A manual Battle order updates the remaining turns and waiting backlog, and can bring a waiting singer into this round; already-finished singers cannot get a duplicate turn. Qualifying positions refresh normally at the next round boundary.

Validation: 68 isolated checks passed, including preservation of current performance, manual-next persistence through advancement, backlog promotion, omission/stale-request rejection and no duplicate host turn. Deployed with two exact source readbacks. The actual host page displayed the new button and up/down controls for waiting singers with zero captured browser errors. No real audience queue order was changed to test controls while Roger was live; real host-move acceptance remains pending.

Authority: this file on codex/queue-host-unified-20260917, not merged. Private record key: rowdy-room/live-reorder-2026-10-19. Protected recovery identifier: Rowdy_Room_Nine_Turn_Recovery_2026-10-18/Live_Reorder_2026-10-19.

Private v1 SHA-256: `de28abd8e0876db749f5df9789bac162e8db154fee64304c9d090da12cd351b1`. Recovery instructions SHA-256: `da0fb3326b38c4e53d22e90e0791f3878da1e0aba88f09b82cb15b0fb2001aff`. Preparation commit: `48c15e0`. Next action: refresh the host page, open Rearrange Singers, and use a waiting singer's up/down control.
