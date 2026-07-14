# Rumble Repair Completion Ledger v41

> Historical filename retained so existing references do not break. Version 41 adds the focused private Rumble host dashboard and corrected host keybind contract as repair item 11.

## Status

The active Rumble repair program contains 11 ordered code repairs. The standalone Rowdy Room TV display is a separate product at `tv.rowdyroom.site` and is not part of this ledger, the game file, or the Rumble installer.

Production deployment and browser verification remain separate from source verification.

## Active repair sequence

| # | Repair | Patcher |
|---:|---|---|
| 1 | Setup/player-name focus | `tools/rumble/fix-setup-focus.mjs` |
| 2 | Start Rumble/setup routing | `tools/rumble/fix-start-setup-flow.mjs` |
| 3 | Coin winner and first-player carryover | `tools/rumble/fix-coin-carryover.mjs` |
| 4 | Current player/team display | `tools/rumble/fix-current-turn-display.mjs` |
| 5 | 40-second timer lifecycle | `tools/rumble/fix-timer-lifecycle.mjs` |
| 6 | Automatic player/team advancement | `tools/rumble/fix-turn-advancement.mjs` |
| 7 | Punch Wheel display trigger | `tools/rumble/fix-wheel-trigger.mjs` |
| 8 | Strike/steal buzzer display trigger and strike levels | `tools/rumble/fix-buzzer-trigger.mjs` and `tools/rumble/fix-buzzer-strike-levels.mjs` |
| 9 | Built-in-only non-repeating question bank | `tools/rumble/fix-built-in-question-bank.mjs` |
| 10 | Responsive 9:16 vertical layout | `tools/rumble/fix-vertical-layout.mjs` |
| 11 | Focused private host dashboard and corrected keybinds | `tools/rumble/fix-host-dashboard-v2.mjs` |

The active automated suite determines the current test count. Old totals that included Rumble TV tests are historical and must not be used as the current baseline.

## Responsive layout result

The responsive layer:

- normalizes the mobile viewport and enables safe-area support
- uses dynamic viewport height for mobile browser chrome and orientation changes
- changes portrait/narrow game, setup, and host surfaces to a centered single-column flow
- makes question, answers, scores, timer, current-player, and strike text readable with responsive sizing
- gives buttons and inputs a 44-pixel minimum touch target and at least 16-pixel input text
- prevents horizontal overflow and allows vertical scrolling when content exceeds the screen
- constrains game overlays so they cannot clip outside the viewport
- compresses spacing on short portrait screens
- honors reduced-motion preferences
- preserves existing game logic

Runtime marker:

```javascript
window.ROWDY_LAYOUT_MODE = 'responsive_9_16';
```

## Focused host dashboard result

The private `#host` dashboard now owns the game-host role. The general Rowdy Room Mission Control application does not control Rumble matches.

The focused dashboard shows current player, Fire/Ice team, question, private answer key, timer status, strikes, lifelines, and resurrection inventory. It permits Next Player, Next Question, Lifeline, Resurrection, Open Game Screen, Lock, and confirmed Emergency Reset.

It does not expose manual Wheel, Punch Wheel, Power Punch, or Buzzer controls. The `0` key calls the real wrong-answer action once; `P` and `O` are blocked; backtick delegates once to `useLifeline('hint')`; and `/` delegates once to `useResurrect()`.

Runtime marker:

```javascript
window.ROWDY_RUMBLE_HOST_DASHBOARD_VERSION = '2.0.0';
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
8. buzzer trigger and strike levels
9. built-in question bank
10. vertical layout
11. host dashboard v2 and keybind correction
```

Canonical target:

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
- Wheel video and game effect match
- Strike 1, Strike 2, Strike 3, Steal, and combined buzzer videos match game state
- legacy question uploads are absent and built-in questions do not repeat before exhaustion
- portrait 9:16 screens remain readable with no clipped content or controls
- private `#host` dashboard shows the required match information and limited controls
- one `0` press records one wrong answer and triggers the matching external strike animation without a duplicate generic Buzzer overlay
- `P` and `O` cannot manually activate Wheel effects
- backtick consumes exactly one lifeline and `/` consumes exactly one resurrection token
- no manual Wheel or Buzzer buttons exist in the host dashboard
- no `#tv` route, TV launcher, karaoke queue, signup QR, or standalone-TV dependency exists in Rumble
- rollback is tested before the show window

## Separate standalone TV acceptance

The standalone TV display is governed by `docs/bible/2026-07-14-standalone-tv-display-law.md`. Its signup QR, rotating banner, Now Performing, Up Next, next five performers, and estimated wait time are tested independently from Rumble.

## Stream launch-readiness checkpoint

The Supabase karaoke queue core is the canonical queue source. Full-show readiness requires live verification of:

- public signup
- deterministic queue and rotation
- matching current and next performer across Mission Control, Companion, and the standalone TV display
- complete, skip, remove, requeue, reorder, and line-skip actions
- refresh and reconnect persistence
- host and viewer synchronization
- removal of test records

## Enforcement

GitHub code completion is not live completion. Production status changes only after ordered deployment and browser testing against the actual server files and live queue backend.
