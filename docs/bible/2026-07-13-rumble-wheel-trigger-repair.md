# Rumble Wheel Display Trigger Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 7 only. No buzzer, TV mode, question-bank, scoring, or layout changes.

## Defect

The compact Rumble game’s `punchAttack()` selected and applied a local effect, but it never notified the separate Punch Wheel display. The wheel screen could wait correctly for state changes while the game continued independently, causing the video and game result to disagree or leaving the wheel idle.

## Repair

The game now uses the deployed wheel API as the primary result source:

1. Resolve the active Rumble player from the current team and player index.
2. Map game teams to the display contract:
   - Red team → `fire`
   - Blue team → `ice`
3. POST the player and team to:

```text
/api/rumble-wheel.php?action=spin
```

Payload:

```json
{
  "player_name": "Active Player",
  "player_user_id": "Active Player",
  "team": "fire"
}
```

4. Read `result_key` from the spin response.
5. If the spin response does not include the key, read the latest state from:

```text
/api/rumble-wheel.php?action=state
```

6. Apply the returned display result to the game so the video and game effect remain synchronized.
7. If the API is unavailable or returns an unknown key, preserve play continuity with the existing local random fallback and record the error in `state.wheelSyncError`.

The endpoint can be overridden before game startup with:

```javascript
window.ROWDY_WHEEL_API_URL = '/custom/path/rumble-wheel.php';
```

## Supported result-key normalization

The integration accepts underscore, hyphen, spacing, and common naming variants for:

- `miss`
- `skip_turn`
- `5_second_timer`
- `five_second_timer`
- `power_punch`

Normalized game effects remain:

- `MISS`
- `SKIP TURN`
- `5 SECOND TIMER`
- `POWER PUNCH`

## Implementation

- Patcher: `tools/rumble/fix-wheel-trigger.mjs`
- Tests: `tools/rumble/fix-wheel-trigger.test.mjs`
- Test command: `npm run test:rumble-wheel`
- Result: 9 passed, 0 failed.

Verified behaviors:

- correct `action=spin` route
- current player payload
- Red → Fire mapping
- Blue → Ice mapping
- all four video-result mappings
- `action=state` response fallback
- local continuity fallback during network failure
- readable fallback player names
- idempotence, prerequisite enforcement, and unexpected-version refusal

## Deployment order

Apply Rumble repairs to the confirmed production game file in order:

1. setup focus
2. start/setup routing
3. coin carryover
4. current turn display
5. timer lifecycle
6. turn advancement
7. wheel trigger

Likely production game target from the prior server scan:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Wheel components identified by the server scan:

```text
/home/ef39cr6m1vih/public_html/api/rumble-wheel.php
/home/ef39cr6m1vih/public_html/rumble-wheel/index.html
/home/ef39cr6m1vih/public_html/rumble-wheel/assets/app.js
/home/ef39cr6m1vih/public_html/rumble-wheel/videos/miss.mp4
/home/ef39cr6m1vih/public_html/rumble-wheel/videos/skip-turn.mp4
/home/ef39cr6m1vih/public_html/rumble-wheel/videos/5-second-timer.mp4
/home/ef39cr6m1vih/public_html/rumble-wheel/videos/power-punch.mp4
```

Confirm the target files and endpoint before applying.

## Apply

```bash
node tools/rumble/fix-wheel-trigger.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
node tools/rumble/fix-wheel-trigger.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Browser verification

1. Open the Punch Wheel display in its browser/OBS source.
2. Start a Rumble with named Red and Blue players.
3. Trigger the Punch Wheel for a Red player.
4. Confirm the wheel shows the correct player and Fire team styling.
5. Confirm the game applies the same effect shown by the wheel video.
6. Trigger the wheel for a Blue player and confirm Ice styling.
7. Exercise all four wheel results.
8. Refresh the wheel display and confirm state polling resumes.
9. Temporarily make the wheel endpoint unavailable and confirm the game continues locally while recording a sync error.
10. Restore the endpoint and confirm the next spin synchronizes normally.
11. Confirm buzzer, TV mode, scoring, question bank, and layout were not changed.

## Rollback

Use the timestamped backup path printed by the apply command:

```bash
node tools/rumble/fix-wheel-trigger.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Access limitation

GitHub and Supabase write access are confirmed. Direct cPanel, SSH, SFTP, and live browser control are unavailable in this session. The public domain also failed DNS resolution from the available inspection environment, so the live wheel API response could not be queried. This repair is therefore code-verified but not represented as deployed or browser-verified.
