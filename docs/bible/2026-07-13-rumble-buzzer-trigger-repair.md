# Rumble Buzzer Display Trigger Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 8 only. No TV mode, scoring, question-bank, or layout changes.

## Defect

The compact Rumble game tracked strikes and steal transitions internally but never triggered the separate buzzer video display. The game could advance correctly while the Strike 3, Steal Opportunity, or combined Strike 3 + Steal Opportunity video remained idle.

## Recovered display contract

Prior deployed-source records identify:

```text
/api/rumble-buzzer.php?action=<action>
```

The control client uses POST with a JSON body. The deployed normalizer accepts three canonical buzzer keys:

- `strike`
- `steal`
- `strike_steal`

Known aliases include:

- `strike3`, `strike_3`
- `stealopportunity`, `steal_opportunity`
- `strike-steal`, `strikesteal`, `combo`

The display package uses these videos:

```text
rumble-buzzer/videos/strike-3.mp4
rumble-buzzer/videos/steal-opportunity.mp4
rumble-buzzer/videos/strike-steal.mp4
```

Teams use Fire/Ice display values.

## Repair

The compact game now includes a nonblocking buzzer-display client:

1. Resolve the affected player before any team transfer.
2. Normalize the requested event to `strike`, `steal`, or `strike_steal`.
3. Map game teams:
   - Red → `fire`
   - Blue → `ice`
4. POST to the configurable primary action, defaulting to:

```text
/api/rumble-buzzer.php?action=trigger
```

5. Include compatible payload fields:

```json
{
  "buzzer": "strike_steal",
  "buzzer_key": "strike_steal",
  "result_key": "strike_steal",
  "event": "strike_steal",
  "player_name": "Affected Player",
  "player_user_id": "Affected Player",
  "team": "fire"
}
```

6. If the primary `trigger` action is unavailable, retry once using the canonical event as the action name.
7. Record failures in `state.buzzerSyncError` and continue the game without delaying timer, strikes, or turn advancement.

The endpoint/action can be overridden before startup:

```javascript
window.ROWDY_BUZZER_API_URL = '/custom/path/rumble-buzzer.php';
window.ROWDY_BUZZER_API_ACTION = 'trigger';
```

## Event behavior

### Ordinary strikes

First and second wrong answers remain local game overlays. The external display has no ordinary-strike video in the recovered three-video package.

### Standalone third strike

A Punch Wheel MISS or other standalone strike that raises the team strike count to three triggers:

```text
strike
```

This plays the Strike 3 video without changing the item 6 turn rules.

### Steal opportunity

The `showStealOpportunity(team)` helper triggers:

```text
steal
```

and displays the local steal overlay.

### Combined third strike and steal

A normal third wrong answer immediately transfers control to the opposing team under item 6. Before that transfer, the repair captures the struck player/team and triggers:

```text
strike_steal
```

The player/team payload therefore describes the player who received the third strike, while the game proceeds to the stealing team.

## Implementation

- Patcher: `tools/rumble/fix-buzzer-trigger.mjs`
- Tests: `tools/rumble/fix-buzzer-trigger.test.mjs`
- Test command: `npm run test:rumble-buzzer`
- Result: 12 passed, 0 failed.

Verified behaviors:

- event alias normalization
- primary trigger endpoint and payload
- Red → Fire and Blue → Ice mapping
- direct-action compatibility fallback
- ordinary wrong-answer behavior remains unchanged
- combined third-strike/steal event
- standalone third-strike event
- standalone steal event
- display failure does not block game state
- idempotence, prerequisite enforcement, and unexpected-version refusal

## Deployment order

Apply repairs to the confirmed production game file in order:

1. setup focus
2. start/setup routing
3. coin carryover
4. current turn display
5. timer lifecycle
6. turn advancement
7. wheel trigger
8. buzzer trigger

Likely game target:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Buzzer components identified by the prior server scan:

```text
/home/ef39cr6m1vih/public_html/api/rumble-buzzer.php
/home/ef39cr6m1vih/public_html/rumble-buzzer/index.html
/home/ef39cr6m1vih/public_html/rumble-buzzer/assets/app.js
/home/ef39cr6m1vih/public_html/rumble-buzzer/videos/strike-3.mp4
/home/ef39cr6m1vih/public_html/rumble-buzzer/videos/steal-opportunity.mp4
/home/ef39cr6m1vih/public_html/rumble-buzzer/videos/strike-steal.mp4
```

Confirm exact targets before changing them.

## Apply

```bash
node tools/rumble/fix-buzzer-trigger.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
node tools/rumble/fix-buzzer-trigger.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Browser verification

1. Open the buzzer display in its browser/OBS source.
2. Trigger first and second wrong answers and confirm no Strike 3 video plays.
3. Trigger a normal third wrong answer and confirm the combined video plays for the struck player/team while the game transfers to the stealing team.
4. Trigger a Punch Wheel MISS when the current team already has two strikes and confirm the standalone Strike 3 video.
5. Trigger `showStealOpportunity()` and confirm the Steal Opportunity video.
6. Verify Fire styling for Red and Ice styling for Blue.
7. Disconnect the buzzer endpoint and confirm the game still advances and stores a synchronization error.
8. Reconnect and confirm the next event clears the synchronization error.
9. Confirm TV mode, scoring, question bank, wheel behavior, and layout were not changed.

## Rollback

Use the backup path printed by the apply command:

```bash
node tools/rumble/fix-buzzer-trigger.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Access limitation

GitHub and Supabase write access are confirmed. Direct cPanel, SSH, SFTP, and live browser control are unavailable. The public domain did not resolve from the inspection environment, so the endpoint could not be exercised live. The API contract was recovered from prior deployed-source records. This repair is code-verified but not represented as deployed or browser-verified.
