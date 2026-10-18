# Nine-turn host rotation — 2026-10-18

## Follow-up: show modes and stable absent-singer control

Roger requested a saved Normal Queue / Battle Karaoke switch and reported the absent-singer disclosure collapsing during polling. The prepared fix avoids rebuilding unchanged controls and preserves the disclosure state when data changes. Normal Queue advances in queue order and returns completed singers to the bottom; Battle Karaoke retains the nine-turn cycle. Switching modes leaves the current performance and queue unchanged. Enabling Battle starts at the host after the current song; disabling it clears the battle lineup. Mode updates use the same version and transaction guards. Sixty-one isolated checks passed, including a full normal queue cycle and a switch back to Battle during a non-host song. Live deployment verification pending for this follow-up.

Protected restore package: `Rowdy_Room_Nine_Turn_Recovery_2026-10-18/Mode_Switch_2026-10-18`. The earlier verified v1 record below describes the first deployment; the mode follow-up will supersede it after live verification.

Roger confirmed this exact cycle: host, top two rated singers, top two distinct contributors, then four regular guests. After turn nine, repeat the host and protected categories with the next four waiting guests. Completed regular guests return to the end of the waiting list. One server-owned cursor and a frozen per-round lineup replace manual host bookkeeping; qualifiers refresh at each round boundary.

The host panel provides one Finish Song / Next Singer action, all nine turn roles, and explicit DROP / BRING UP names. Advanced singer tools are collapsed. Open or absent positions are skipped; the host seat requires a real host signup. Song metadata is retained until a new song is submitted. The host is identified as rowdyroger.

State uses the existing action ledger with version checks, a database advisory lock, and a transaction covering completion, earnings, requeue, ordering, next performance, and cursor save. Refreshing the page does not reset the cycle. Shared anonymous viewer accounts are distinguished by their submitted singer names; rating aggregation also separates those named signups. Existing vote history and the final-minute voting window are preserved. Paid skips cannot cross the reserved round lineup; waiting-list moves remain available.

Validation before deployment: 38 isolated checks passed, including exact two-round order, protected duplicate exclusion, generic viewer separation, absent singers, stale requests, and rollback after injected failure. PHP syntax and all host inline JavaScript syntax checks passed. These isolated tests do not prove production database behavior or real audience acceptance.

Deployed with six exact source readbacks. Authenticated rollback-only MySQL checks passed advisory locking, state insert/upsert/readback/rollback, ratings, contributors and the nine-slot plan. The real queue remained unchanged. The compact host panel rendered with restored host access and the primary advancement button. Preparation commit: `42d0d53`. Real multi-singer show acceptance remains a separate owner gate. Optional Rumble behavior is outside this change.

Authority: this document on `codex/queue-host-unified-20260917`, not merged into main. Protected record: `rowdy-room/nine-turn-rotation-2026-10-18`. Recovery package identifier: `Rowdy_Room_Nine_Turn_Recovery_2026-10-18`. Private production source and recovery details remain in protected storage.

Verified private record v1, history 2776, SHA-256 `25823990326871fe41d16c4184f68bc78d80cef85d1694614ab859f2dd369d7f`. Recovery instructions SHA-256 `5b8db114751eca5d3a08cf077fab4c6bce99d53a80938a94ddeb49eefd747f5d`. Verification run `93b07065-34fe-4574-b109-c12fae562c64`: four pass, one warning for real-show acceptance. Next action: use Finish Song / Next Singer during the next actual round and confirm panel handoff with real singers.
