# Rumble Current Turn Display Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 4 only. No timer, automatic turn advancement, scoring, wheel, buzzer, TV, or layout changes.

## Defect

The game status strip displayed:

```text
CURRENT: Player
```

That did not identify the active team and became ambiguous during team changes, steals, and multi-player matches.

## Repair

The readout now uses the required compact format:

```text
Turn: Player — Red Team
```

or:

```text
Turn: Player — Blue Team
```

The renderer:

1. Reads `state.currentTeam`.
2. Selects the matching team array.
3. Reads the player at `state.currentIndex`.
4. Uses a readable `Red N` or `Blue N` fallback if the name is missing.
5. Updates only `currentPlayerBox.textContent`.

It does not change `currentTeam`, `currentIndex`, either team array, or any turn logic.

## Prerequisite

Repair item 3 must already be installed. The patcher verifies the item 3 `showGame(){startMatch();}` implementation and refuses to modify a file that has not received the earlier ordered repairs.

## Implementation

- Patcher: `tools/rumble/fix-current-turn-display.mjs`
- Tests: `tools/rumble/fix-current-turn-display.test.mjs`
- Test command: `npm run test:rumble-turn-display`
- Result: 7 passed, 0 failed.

Test coverage verifies:

- correct red-team display;
- correct blue-team display;
- readable fallback when a player name is missing;
- removal of the ambiguous `CURRENT:` label;
- no mutation of turn state;
- idempotence;
- prerequisite enforcement;
- refusal of an unexpected display implementation.

## Deployment procedure

The likely live target identified by the server scan is:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply and verify repair items 1, 2, and 3 first. Then check item 4:

```bash
node tools/rumble/fix-current-turn-display.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply item 4:

```bash
node tools/rumble/fix-current-turn-display.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

The command prints a timestamped backup path. Record that path in the server deployment and rollback logs.

## Verification

1. Start a Rumble match with distinct player names on both teams.
2. Confirm the status strip shows `Turn: Name — Team`.
3. Confirm the coin-selected first player and team are shown.
4. Advance the selected player using existing controls and confirm the name updates.
5. Switch the active team using existing game behavior and confirm the team label updates.
6. Test a missing/blank name and confirm the readable numbered fallback.
7. Confirm scores, strikes, timer, current index, and current team do not change merely because the display renders.
8. Confirm no visual or behavior changes outside the single turn readout.

## Rollback

Use the backup path printed during deployment:

```bash
node tools/rumble/fix-current-turn-display.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Then reload the game and confirm the previous `CURRENT:` readout returns.

## Access and deployment status

GitHub and Supabase write access are confirmed. This session still has no cPanel, SSH, SFTP, or server-files connector, and the repository still has no production deployment workflow. This repair is therefore recorded as code-verified, not live.
