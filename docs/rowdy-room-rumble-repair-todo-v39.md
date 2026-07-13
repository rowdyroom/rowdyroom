# Rumble Repair Completion Ledger v39

## Status

All 11 ordered Rumble code repairs are implemented, automated, rollback-safe, and merged or ready for final merge. Production deployment and browser verification remain pending because direct cPanel, SSH, SFTP, and browser access are not available in this session.

## Completed repair sequence

| # | Repair | Tests | Patcher |
|---:|---|---:|---|
| 1 | Setup/player-name focus | 3 | `tools/rumble/fix-setup-focus.mjs` |
| 2 | Start Rumble/setup routing | 5 | `tools/rumble/fix-start-setup-flow.mjs` |
| 3 | Coin winner and first-player carryover | 7 | `tools/rumble/fix-coin-carryover.mjs` |
| 4 | Current player/team display | 7 | `tools/rumble/fix-current-turn-display.mjs` |
| 5 | 40-second timer lifecycle | 8 | `tools/rumble/fix-timer-lifecycle.mjs` |
| 6 | Automatic player/team advancement | 12 | `tools/rumble/fix-turn-advancement.mjs` |
| 7 | Punch Wheel display trigger | 9 | `tools/rumble/fix-wheel-trigger.mjs` |
| 8 | Strike/steal buzzer display trigger | 12 | `tools/rumble/fix-buzzer-trigger.mjs` |
| 9 | Isolated QR/queue/banner TV mode | 12 | `tools/rumble/fix-tv-mode.mjs` |
| 10 | Built-in-only non-repeating question bank | 15 | `tools/rumble/fix-built-in-question-bank.mjs` |
| 11 | Responsive 9:16 vertical layout | 20 | `tools/rumble/fix-vertical-layout.mjs` |

**Automated total: 110 passed, 0 failed.**

## Item 11 result

The responsive layer:

- normalizes the mobile viewport and enables safe-area support
- uses dynamic viewport height for mobile browser chrome and orientation changes
- changes portrait/narrow game, setup, and host surfaces to a centered single-column flow
- makes question, answers, scores, timer, current-player, and strike text readable with responsive `clamp()` sizing
- gives buttons and inputs a 44-pixel minimum touch target and at least 16-pixel input text
- prevents horizontal overflow and allows vertical scrolling when content exceeds the screen
- constrains overlays so they cannot clip outside the viewport
- compresses spacing on short portrait screens
- honors reduced-motion preferences
- leaves the dedicated `#tv` route separate
- preserves existing game logic byte-for-byte

Runtime marker:

```javascript
window.ROWDY_LAYOUT_MODE = 'responsive_9_16';
```

## Required production deployment order

Apply and browser-test each repair in order against the confirmed production Rumble file:

```text
1. setup focus
2. start/setup routing
3. coin carryover
4. current turn display
5. timer lifecycle
6. turn advancement
7. wheel trigger
8. buzzer trigger
9. TV mode
10. built-in question bank
11. vertical layout
```

Likely target from the prior server scan:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Every patcher supports:

```text
--check
--apply
--restore
```

Each apply command creates a timestamped backup before replacement.

## Required live Rumble acceptance test

Do not call Rumble production-ready until the live file passes:

- setup names accept full text without losing focus
- Start Rumble opens setup and setup starts the match
- coin winner and chosen player carry into the game
- current player/team display is correct
- timer starts, pauses, resumes, resets, and handles zero exactly once
- correct, wrong, timeout, third-strike, question, and round transitions advance correctly
- wheel video and game effect match
- Strike 3, Steal, and combined buzzer videos match game state
- `#tv` contains only QR, current/next, team queues, and banner
- legacy question uploads are absent and built-in questions do not repeat before exhaustion
- portrait 9:16 screens remain readable with no clipped content or controls
- rollback is tested before the show window

## Stream launch-readiness checkpoint

The Supabase karaoke queue core is hardened and has passed transactional tests for:

- public sign-up
- duplicate rejection
- deterministic ordering
- one current performer
- one open performance
- performer switching and completion
- self-removal
- line skips and Boost Point movement
- wallet and ledger accounting

The full show is **not yet labeled stream-ready** because the deployed Mission Control/Companion stack appears to use a separate PHP/MySQL queue whose source is not in GitHub and cannot currently be inspected or live-tested. GitHub issue #11 tracks that production blocker.

Before the full system is called stream-ready, the actual live Mission Control/Companion workflow must verify:

- public sign-up and approval
- deterministic queue and rotation
- matching current/next performer across host and viewer screens
- complete, skip, remove, requeue, reorder, and line-skip actions
- refresh/reconnect persistence
- host/Companion synchronization
- removal of all test records

## Enforcement

GitHub code completion is not live completion. Production status changes only after ordered deployment and browser testing against the actual server files and actual live queue backend.
