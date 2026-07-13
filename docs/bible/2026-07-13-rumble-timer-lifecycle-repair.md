# Rumble Timer Lifecycle Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 5 only. No automatic player/team advancement, wheel, buzzer-video, TV, scoring-rule, or layout changes.

## Defect

The compact Rumble timer did not meet the required lifecycle:

- match initialization set the timer to 40 but did not reliably start it;
- new questions and match restarts reset the number without reliably starting a fresh interval;
- the timer decremented to zero but called no wrong-answer action;
- the interval was cleared only on a later tick;
- clearing at zero did not null the stored interval handle;
- a stale handle could make pause/resume state unreliable.

## Repair

The timer now:

1. Starts automatically after match initialization.
2. Starts fresh after a new question.
3. Starts fresh when a non-final round continues.
4. Starts fresh after match restart.
5. Counts down from the current remaining value rather than resetting during resume.
6. Pauses by clearing the interval and setting its handle to `null`.
7. Resumes from the remaining value.
8. Resets an expired/invalid value to 40 when manually started.
9. Changes `1` to `0`, stops immediately, and calls `wrongAnswer(state.currentTeam)` exactly once.
10. Remains stopped when the match-complete overlay is reached.

This repair deliberately does not implement automatic turn advancement. That remains repair item 6.

## Prerequisite

Repair item 4 must already be installed. The patcher verifies the `Turn: Name — Team` display implementation before changing timer code.

## Implementation

- Patcher: `tools/rumble/fix-timer-lifecycle.mjs`
- Tests: `tools/rumble/fix-timer-lifecycle.test.mjs`
- Test command: `npm run test:rumble-timer`
- Result: 8 passed, 0 failed.

Test coverage verifies:

- normal countdown;
- pause and resume without losing remaining time;
- exact zero handling;
- interval-handle cleanup;
- one wrong-answer call at expiry;
- expired-timer reset to 40;
- automatic starts from match, question, round, and restart paths;
- match-complete stop behavior;
- idempotence;
- prerequisite enforcement;
- refusal of unexpected timer code.

## Deployment procedure

The likely live target identified by the server scan is:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply and verify repair items 1 through 4 first. Then check item 5:

```bash
node tools/rumble/fix-timer-lifecycle.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply item 5:

```bash
node tools/rumble/fix-timer-lifecycle.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

The command prints a timestamped backup path. Record that path in the server deployment and rollback logs.

## Verification

1. Start a match and confirm the timer begins at 40 and counts down.
2. Pause at a non-round value such as 27 and confirm it stops changing.
3. Resume and confirm it continues from 27 rather than resetting to 40.
4. Start a new question and confirm it resets to 40 and runs.
5. Continue a normal round and confirm the next timer runs.
6. Restart the match and confirm the timer resets to 40 and runs.
7. Allow the timer to expire and confirm it reaches zero exactly.
8. Confirm one wrong answer/strike is recorded for the active team.
9. Confirm the expired interval stops and does not fire additional wrong answers.
10. Complete the final round and confirm the timer remains stopped during match completion.
11. Confirm no automatic player/team advancement was introduced by this repair.

## Rollback

Use the backup path printed during deployment:

```bash
node tools/rumble/fix-timer-lifecycle.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Then reload and confirm the previous timer behavior returns.

## Access and deployment status

GitHub and Supabase write access are confirmed. This session still has no cPanel, SSH, SFTP, or server-files connector, and the repository still has no production deployment workflow. This repair is therefore recorded as code-verified, not live.
