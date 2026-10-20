# Battle fairness and fresh scoring — 2026-10-19

Status: Roger-approved rule change; locally tested draft, NOT DEPLOYED.

This decision supersedes the contributor-protected, immediate-start and rolling twelve-hour ranking rules for Battle Karaoke. Host remains in the repeated cycle. The two highest singers by the existing live-vote average remain protected; six other spots rotate in waiting order. Contributions no longer earn a permanent panel slot.

Selecting Battle queues it without changing the current song or waiting order. Every singer already waiting gets their turn before Battle starts on Roger's next turn. Later signups join the backlog without postponing that start. Host manual reordering remains available; paid skips cannot cross the pending line. Cancelling pending Battle keeps the queue intact.

At the actual Battle start, standings begin fresh at zero. Historical votes and performances stay saved. Qualifiers develop from new Battle votes, then update at round boundaries. Scores do not expire after twelve hours; the next actual Battle start creates the next fresh window. Until new votes establish qualifiers, protected slots remain open and are skipped.

Prepared private source changes cover rotation, scoring, pending-line paid-skip protection and host status text. Local checks: 31 rotation/transaction checks, 6 scoring-query checks, PHP syntax and two inline JavaScript parses passed. Production source reconciliation, rollback-only MySQL checks, live browser verification and audience acceptance are outstanding. Prior deployment access was unavailable. No production queue, song, vote, ledger state or live file was changed.

Deployment requires fresh live-source reconciliation and a stopped-show migration; do not overwrite a live performance. Existing Battle state must be deliberately rearmed through Normal Queue then Battle to capture the waiting line under the new rules. Candidate source and restore notes remain in protected local storage.

Authority: this file on `codex/queue-host-unified-20260917`, not merged into main. Private record: `rowdy-room/battle-fairness-2026-10-19`. Recovery package: `Rowdy_Room_Battle_Fairness_2026-10-19`; recovery instructions SHA-256: `1a844ab3c6ac6580b2527b7233f66030128ad3d8aa84094e30b49ea49de99dea`. Next action: restore authenticated deployment access, reconcile source, preserve live state, run MySQL verification and deploy while the show is stopped.
