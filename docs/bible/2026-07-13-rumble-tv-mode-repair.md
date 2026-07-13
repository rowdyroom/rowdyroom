# Rumble TV Mode Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 9 only. No scoring, timer, turn, wheel, buzzer, or question-bank changes.

## Locked behavior

TV mode must be a separate full-screen display containing only:

- join QR and readable URL
- current player and team
- next player and team
- Fire and Ice player queues
- rotating Rowdy Room banner

It must not expose:

- host controls
- question or answer key
- Rumble rules panel
- scoring controls
- reset or game-action buttons

## Repair

The patch adds one isolated script and a dedicated hash route:

```text
#tv
```

The TV section is created dynamically under `#app`, so the original game page/host markup is not rebuilt.

### Synchronization

The repair wraps the existing `render()` function. Existing local-storage and BroadcastChannel updates already call `render()`, so the TV view refreshes from the same state without adding a second state store.

### Display contents

The screen renders:

- `NOW PLAYING`: active player from `state.currentTeam` and `state.currentIndex`
- `NEXT PLAYER`: next player in the active team’s rotation
- Fire team queue
- Ice team queue
- active-player highlighting
- rotating banner text

### Join QR

Default destination:

```text
/companion/
```

Configuration overrides:

```javascript
window.ROWDY_TV_JOIN_URL = 'https://rowdyroom.site/signup';
window.ROWDY_TV_QR_IMAGE_URL = '/assets/rowdy-signup-qr.png';
```

Without a local QR image override, the repair generates the image URL through:

```text
https://api.qrserver.com/v1/create-qr-code/
```

A local, deployed QR image is preferred for show reliability and should replace the external default during production deployment.

### Rotating banner

Defaults:

- `LIVE KARAOKE • REAL VOTES • REAL COMMUNITY`
- `ROWDY ROOM RUMBLE • AUDIENCE-POWERED`
- `SING • COMPETE • VOTE • CONNECT`

Overrides:

```javascript
window.ROWDY_TV_BANNERS = ['Banner 1', 'Banner 2'];
window.ROWDY_TV_BANNER_MS = 6500;
```

### Host access

- Host dashboard receives one `OPEN TV MODE` navigation button.
- The display opens in a separate window named `rowdyRoomTvMode`.
- Keyboard shortcut: `Alt+T`.
- No host controls are rendered inside the TV window.

## Implementation

- Patcher: `tools/rumble/fix-tv-mode.mjs`
- Tests: `tools/rumble/fix-tv-mode.test.mjs`
- Test command: `npm run test:rumble-tv`
- Result: 12 passed, 0 failed.

Verified behaviors:

- one guarded script insertion
- display-only TV markup
- full-screen route behavior
- current and next player rendering
- Fire/Ice queue rendering and active highlight
- Companion QR default and overrides
- rotating banner cadence and overrides
- synchronization through the existing render path
- host shortcut opens a separate TV window
- leaving `#tv` clears the TV-active state
- idempotence, prerequisite enforcement, and ambiguous-marker refusal

## Deployment order

Apply the game repairs in this order:

1. setup focus
2. start/setup routing
3. coin carryover
4. current turn display
5. timer lifecycle
6. turn advancement
7. wheel trigger
8. buzzer trigger
9. TV mode

Likely target:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Apply

```bash
node tools/rumble/fix-tv-mode.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
node tools/rumble/fix-tv-mode.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Browser verification

1. Open the host dashboard and click `OPEN TV MODE`.
2. Confirm the new window uses `#tv`.
3. Confirm no host controls, answer key, game buttons, or rules panel appear.
4. Confirm the QR points to the actual production signup/Companion URL.
5. Scan the QR from a separate phone.
6. Confirm the current player and team match the game.
7. Confirm the next player matches the game rotation.
8. Confirm Fire and Ice queues show every configured Rumble player.
9. Advance players and confirm the TV screen updates without reload.
10. Confirm banner rotation.
11. Test a 16:9 display and a narrower/portrait display.
12. Prefer a local QR image and test with internet access disabled.
13. Confirm the main game, host dashboard, wheel, buzzer, scoring, timer, and turn behavior remain unchanged.

## Rollback

Use the timestamped backup printed by the apply command:

```bash
node tools/rumble/fix-tv-mode.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Access limitation

GitHub and Supabase write access are confirmed. Direct cPanel, SSH, SFTP, and live browser control remain unavailable, so the route, QR scan, display dimensions, and synchronization cannot be represented as production-verified from this session.
