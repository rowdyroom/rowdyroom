# Rumble Host Dashboard and Keybind Law

**Status:** Active source-of-truth amendment  
**Date:** 2026-07-14  
**Applies to:** Rumble host dashboard, game keybinds, Wheel integration, Buzzer integration, deployment, testing, and rollback

## 1. Dashboard ownership

The Rumble host dashboard is the private `#host` surface inside `game.rowdyroom.site`. The general Rowdy Room Mission Control application is not the Rumble game host dashboard.

## 2. Required live information

The private host dashboard must show:

- current player
- current Fire or Ice team
- current question
- private answer key
- timer value and running/paused status
- Fire and Ice strike counts
- available lifelines
- available resurrection tokens

## 3. Permitted host controls

The focused dashboard may provide:

- Next Player
- Next Question
- one explicit Lifeline action with the selected lifeline type
- Use Resurrection Token
- Open Game Screen
- Lock Dashboard
- confirmed Emergency Match Reset

## 4. Prohibited manual controls

The host dashboard must not provide:

- a Spin Wheel button
- manual Wheel result buttons
- a manual Buzzer button
- Punch Wheel or Power Punch buttons
- separate Wheel or Buzzer control-page launchers

Punch Wheel activation and results are controlled by game events and the Wheel contract. Buzzer animations are controlled by wrong-answer and strike events.

## 5. Canonical keybind behavior

- `1` through `6` reveal the corresponding answer.
- `0` calls `wrongAnswer(currentTeam)` exactly once. It must not first add a generic local “BUZZER” overlay.
- `/` uses one available resurrection token through `useResurrect()`.
- Backtick uses one Hint lifeline through `useLifeline('hint')`; no caller may decrement `state.lifelines` before calling `useLifeline()`.
- `P` and `O` do not manually activate Punch Wheel or Power Punch.

Keyboard actions must be ignored while the user is typing in inputs, textareas, selects, textboxes, or content-editable elements. Repeated keydown events must not duplicate an action.

## 6. Buzzer result

The `0` key is a wrong-answer control, not a standalone animation button. The wrong-answer logic determines Strike 1, Strike 2, Strike 3, and the delayed Strike + Steal sequence through the canonical buzzer contract.

## 7. Verification

The repair is not production-complete until browser testing confirms:

1. the private dashboard loads after host authentication
2. all required status fields update with game state
3. no manual Wheel or Buzzer controls appear
4. one press of `0` records exactly one wrong answer and fires the matching external animation
5. `P` and `O` do not activate the Wheel
6. the backtick shortcut consumes exactly one lifeline
7. `/` consumes exactly one resurrection token
8. Next Player, Next Question, Lifeline, Resurrection, Lock, Open Game Screen, and Emergency Reset behave as labeled
9. the public game remains usable
10. rollback restores the prior file

## 8. Deployment and rollback

Every production write must be preceded by a timestamped backup outside the active document root. A failed verification requires restoring the backup rather than stacking another unverified patch.
