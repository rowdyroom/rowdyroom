# Rumble Coin Flip Carryover Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 3 only. No timer, TV, wheel, buzzer, scoring-rule, turn-advancement, or layout changes.

## Defect

The coin flip did not fully carry its result into the game:

- it selected only the winning team;
- it always assigned player index `0` instead of selecting a first player;
- the coin result screen displayed only the team name;
- the coin screen’s **LET’S GO** action bypassed the full match initialization performed by `startMatch()`;
- page transitions used state/content rendering without explicitly routing the visible section.

This created a mismatch between the coin result, the current player shown during the game, and the initialized match state.

## Root cause

The original `flipForFirst()` set:

```text
firstTeam = random red/blue
currentTeam = firstTeam
currentIndex = 0
```

The original `showGame()` then changed the page and optionally loaded a question, but did not reset scores, rounds, strikes, timer, used questions, revealed answers, or Rowdy Rush bonus state. Those actions existed only in `startMatch()`.

## Repair

The repaired flow now:

1. Randomly chooses the winning team.
2. Reads that team’s current player array.
3. Randomly chooses a valid first-player index.
4. Stores both `currentTeam` and `currentIndex` in state.
5. Displays the result as `TEAM — Player` on the coin screen.
6. Routes the visible page to the coin screen with `renderPage()`.
7. Persists the result with `saveState(false)`.
8. Makes the coin screen’s **LET’S GO** action call `startMatch()`.
9. During match initialization, preserves the coin-selected index when valid and clamps a stale or invalid index into the winning team’s valid range.
10. Routes the initialized game page before persisting without an extra render.

## Prerequisites

Repair items 1 and 2 must already be installed:

- item 1 provides `saveState(shouldRender = true)`;
- item 2 provides the corrected `goSetup()` page routing.

The item 3 patcher verifies both exact prerequisites and refuses to modify the file if either is missing.

## Implementation

- Patcher: `tools/rumble/fix-coin-carryover.mjs`
- Tests: `tools/rumble/fix-coin-carryover.test.mjs`
- Test command: `npm run test:rumble-coin`
- Result: 7 passed, 0 failed.

Test coverage verifies:

- the coin flip selects a player from the winning team;
- the selected player and team are displayed together;
- the selected index carries into match initialization;
- the **LET’S GO** path delegates to full match initialization;
- a stale index is safely clamped to a valid player;
- the patch is idempotent;
- the patch refuses to run without items 1 and 2;
- the patch refuses an unexpected coin-flip implementation.

## Deployment procedure

The likely live target identified by the server scan is:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply and verify items 1 and 2 first. Then check item 3:

```bash
node tools/rumble/fix-coin-carryover.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply item 3:

```bash
node tools/rumble/fix-coin-carryover.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

The command prints the timestamped backup path. Record that path in the server deployment and rollback logs.

## Verification

1. Load the Rumble intro screen and press **START RUMBLE**.
2. Select 1v1, 2v2, 3v3, and 4v4 in separate test runs.
3. Enter distinct names for every player.
4. Press **Flip Coin**.
5. Confirm the coin screen shows both the winning team and one player from that team.
6. Record the displayed player.
7. Press **LET’S GO** on the coin screen.
8. Confirm the game initializes with round 1, timer 40, zero scores, zero strikes, a loaded question, and the same team/player selected by the coin flip.
9. Repeat enough times to observe both teams and multiple non-zero player indexes.
10. Reload or alter saved state with an invalid player index and confirm initialization safely selects a valid player.
11. Confirm no changes to timer behavior, automatic turn advancement, wheel, buzzer, TV mode, scoring rules, or layout.

## Rollback

Use the backup path printed during deployment:

```bash
node tools/rumble/fix-coin-carryover.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Then repeat the intro → setup → coin → game path and confirm the prior behavior is restored.

## Access and deployment status

GitHub and Supabase write access are confirmed. This session still has no cPanel, SSH, SFTP, or server-files connector, and the repository still has no production deployment workflow. This repair is therefore recorded as code-verified, not live.
