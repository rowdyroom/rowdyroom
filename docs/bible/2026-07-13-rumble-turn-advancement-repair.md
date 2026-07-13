# Rumble Automatic Turn Advancement Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 6 only. No wheel, buzzer animation, TV mode, question-bank UI, scoring, or layout changes.

## Defect

Correct answers, wrong answers, timer expiry, manual question changes, and round transitions did not consistently advance the expected player or team. The compact game also stored only one shared player index, which could lose each team’s independent rotation position.

## Repair

The repair introduces independent per-team rotation state and explicit outcome transitions:

- `turnIndexes.red` and `turnIndexes.blue` preserve each team’s position.
- Correct answers rotate to the next player on the same team unless the board is cleared.
- Board-clearing answers pause the timer and hold the current turn for pool award/round resolution.
- Ordinary wrong answers add a strike and rotate within the same team.
- Timer expiry uses the same wrong-answer path.
- Third strike resets team strikes and transfers control to the opposing team’s first player.
- Manual next-question actions rotate the active team’s player and start a fresh timer.
- New rounds alternate the starting team and advance that team’s rotation.
- One-player teams wrap safely at index zero.
- Start and restart initialize rotation state predictably.

## Implementation

- Patcher: `tools/rumble/fix-turn-advancement.mjs`
- Tests: `tools/rumble/fix-turn-advancement.test.mjs`
- Test command: `npm run test:rumble-turn-advancement`
- Result: 12 passed, 0 failed.

The patcher requires repair items 1 through 5, uses exact-match guards, refuses an unexpected file version, creates a timestamped backup, and supports check/apply/restore operations.

## Deployment order

Apply repairs to the confirmed production Rumble file in this order:

1. setup focus
2. start/setup routing
3. coin carryover
4. current turn display
5. timer lifecycle
6. turn advancement

Likely target from the prior server scan:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Confirm before changing it.

## Apply

```bash
node tools/rumble/fix-turn-advancement.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
node tools/rumble/fix-turn-advancement.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Browser verification

1. Use 1v1 and confirm all rotations remain at player 1.
2. Use 2v2 or larger and confirm a correct answer advances to the next player on the same team.
3. Reveal the final board answer and confirm the timer pauses without rotating.
4. Trigger one and two wrong answers and confirm same-team player rotation.
5. Trigger timer expiry and confirm it follows the same wrong-answer rotation.
6. Trigger a third strike and confirm control moves to the opposing team’s first player.
7. Use Next Question and confirm the active team’s player advances with a fresh 40-second timer.
8. End rounds and confirm starting teams alternate while each team retains its own rotation.
9. Restart the match and confirm rotation indexes reset cleanly.
10. Confirm scores, pool, wheel, buzzer animations, TV mode, and layout were not changed by this repair.

## Rollback

Use the backup path printed by the apply command:

```bash
node tools/rumble/fix-turn-advancement.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Stream-readiness dependency

Rumble completion does not by itself make the show stream-ready. Before a live show, the public sign-up, approval, queue ordering, performer rotation, current/next performer synchronization, complete/skip/remove/requeue controls, persistence, and companion display must pass a separate production smoke test.

## Access status

GitHub and Supabase write access are confirmed. Direct cPanel, SSH, SFTP, and live browser control are not available in this session, so this repair is not represented as deployed or live-tested.
