# Battle fairness and fresh scoring — 2026-10-19

Status: deployed with verified source readback, rollback-only MySQL check and host rendering. Actual audience handoff remains unverified.

This decision supersedes the contributor-protected, immediate-start and rolling twelve-hour ranking rules for Battle Karaoke. Host remains in the repeated cycle. The two highest singers by the existing live-vote average remain protected; six other spots rotate in waiting order. Contributions no longer earn a permanent panel slot.

Selecting Battle queues it without changing the current song or waiting order. Every singer already waiting gets their turn before Battle starts on Roger's next turn. Later signups join the backlog without postponing that start. Host manual reordering remains available; paid skips cannot cross the pending line. Cancelling pending Battle keeps the queue intact.

At the actual Battle start, standings begin fresh at zero. Historical votes and performances stay saved. Qualifiers develop from new Battle votes, then update at round boundaries. Scores do not expire after twelve hours; the next actual Battle start creates the next fresh window. Until new votes establish qualifiers, protected slots remain open and are skipped.

Deployed rotation, scoring, pending-line paid-skip protection and host status text after reconciling fresh production sources and preserving originals. All four source readbacks matched. The authenticated rollback-only MySQL check passed advisory locking, state upsert/readback/rollback, score query and host + two rated + six regular slot planning. The visible host page rendered the new score text. Current performer, complete singer list and rotation state remained unchanged. Normal Queue remains selected; no real singer was advanced and Battle was not armed by the agent.

Local checks: 31 rotation/transaction checks and 6 actual scoring-query checks passed; PHP and both inline JavaScript scripts parse. Actual pending-to-battle audience handoff and paid-skip production behavior remain owner-acceptance gates. Existing active old Battle state must be rearmed through Normal Queue then Battle; deployment was observed in Normal Queue.

Authority: this file on `codex/queue-host-unified-20260917`, not merged into main. Private record: `rowdy-room/battle-fairness-2026-10-19`. Recovery package: `Rowdy_Room_Battle_Fairness_2026-10-19`; recovery instructions SHA-256: `28301a6d2fb271dc65cfef906dbe1ac8bee373e0b0c2383fee6204b49ca7827a`. Next action: refresh the host page, queue Battle Karaoke when desired, and confirm the actual audience handoff after the waiting line finishes.
