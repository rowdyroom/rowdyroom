# Rumble Responsive 9:16 Layout Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Final ordered Rumble repair. No game-logic changes.

## Objective

Make the compact game readable and operable on vertical phone/stream layouts without rewriting the game or affecting desktop TV mode.

## Repair

The patch adds one isolated responsive CSS/runtime layer and normalizes the viewport to:

```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```

Portrait, narrow, and strongly vertical screens receive:

- safe-area padding for notches and mobile browser edges
- dynamic viewport height updated on resize, orientation, and Visual Viewport changes
- centered single-column game, setup, and host surfaces
- vertical scrolling instead of clipped content
- one-column answer list
- responsive question, answer, score, timer, current-player, and strike text
- 44-pixel minimum touch targets
- minimum 16-pixel form text to prevent mobile zoom
- overlay size/scroll constraints
- compact spacing for short portrait screens
- reduced-motion behavior

The dedicated `#tv` page is not rewritten by this layer.

Runtime marker:

```javascript
window.ROWDY_LAYOUT_MODE = 'responsive_9_16';
```

## Implementation

- Patcher: `tools/rumble/fix-vertical-layout.mjs`
- Tests: `tools/rumble/fix-vertical-layout.test.mjs`
- Test command: `npm run test:rumble-vertical`
- Result: **20 passed, 0 failed**

The tests verify viewport handling, portrait activation, single-column flow, answer layout, responsive text, touch targets, safe areas, dynamic height, overlays, short-screen behavior, reduced motion, TV separation, game-logic preservation, idempotence, prerequisites, and guarded insertion points.

## Deployment

Apply all 11 repairs in order. The likely target from the prior server scan is:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Check and apply the final repair:

```bash
node tools/rumble/fix-vertical-layout.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
node tools/rumble/fix-vertical-layout.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Browser verification

Test at minimum:

- 360 × 640 CSS pixels
- 390 × 844 CSS pixels
- 1080 × 1920 portrait output
- a short portrait viewport
- desktop host layout
- dedicated `#tv` display

Confirm no horizontal clipping, readable answer rows, accessible controls, correct overlays, orientation recovery, and unchanged game behavior.

## Rollback

Use the timestamped backup printed by the apply command:

```bash
node tools/rumble/fix-vertical-layout.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Access status

GitHub and Supabase writes are available. Direct cPanel, SSH, SFTP, and browser control are not available, so production deployment and visual verification remain pending.
