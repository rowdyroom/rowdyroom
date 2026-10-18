# Nine-turn host rotation — 2026-10-18

Roger confirmed this exact cycle: host, top two rated singers, top two distinct contributors, then four regular guests. After turn nine, repeat the host and protected categories with the next four waiting guests. Completed regular guests return to the end of the waiting list. One server-owned cursor and a frozen per-round lineup replace manual host bookkeeping; qualifiers refresh at each round boundary.

The host panel provides one Finish Song / Next Singer action, all nine turn roles, and explicit DROP / BRING UP names. Advanced singer tools are collapsed. Open or absent positions are skipped; the host seat requires a real host signup. Song metadata is retained until a new song is submitted. The host is identified as rowdyroger.

State uses the existing action ledger with version checks, a database advisory lock, and a transaction covering completion, earnings, requeue, ordering, next performance, and cursor save. Refreshing the page does not reset the cycle. Shared anonymous viewer accounts are distinguished by their submitted singer names; rating aggregation also separates those named signups. Existing vote history and the final-minute voting window are preserved. Paid skips cannot cross the reserved round lineup; waiting-list moves remain available.

Validation before deployment: 34 isolated checks passed, including exact two-round order, protected duplicate exclusion, generic viewer separation, absent singers, stale requests, and rollback after injected failure. PHP syntax and all host inline JavaScript syntax checks passed. These isolated tests do not prove production database behavior or real audience acceptance.

Deployment and live readback: pending. Authenticated rollback-only MySQL verification, visible host rendering, and unchanged real-queue comparison are required. Real multi-singer show acceptance remains a separate owner gate. Optional Rumble behavior is outside this change.

Authority: this document on `codex/queue-host-unified-20260917`, not merged into main. Protected record: `rowdy-room/nine-turn-rotation-2026-10-18`. Recovery package identifier: `Rowdy_Room_Nine_Turn_Recovery_2026-10-18`. Private production source and recovery details remain in protected storage.
