# Rumble Buzzer Law

**Status:** Active source-of-truth amendment  
**Date:** 2026-07-13  
**Updated:** 2026-07-14  
**Applies to:** Rumble game, buzzer API, buzzer display, video assets, tests, deployment, and rollback

> Historical filename retained so existing references do not break. All former TV-mode provisions in this document were superseded and removed. The standalone TV display is governed only by `docs/bible/2026-07-14-standalone-tv-display-law.md` and is independent from Rumble.

This amendment defines the required Rumble buzzer contract. It is part of the Rowdy Room Bible and must be followed by every future Rumble implementation.

## 1. Non-negotiable buzzer sequence

Every wrong answer must trigger the matching external animation:

1. First team strike → `strike_1` → **Strike 1** video.
2. Second team strike → `strike_2` → **Strike 2** video.
3. Third team strike → `strike_3` → **Strike 3** video.
4. When the third strike creates a steal opportunity, the combined `strike_steal` animation follows Strike 3 after the configured display delay.
5. A standalone steal opportunity uses `steal`.

Strike 1 and Strike 2 must never be suppressed as local-only overlays.

## 2. Canonical event keys

The authoritative keys are:

- `strike_1`
- `strike_2`
- `strike_3`
- `steal`
- `strike_steal`

Legacy aliases may remain only for backward compatibility. Legacy `strike` means `strike_3`; it must not erase the distinction between the first three canonical keys.

## 3. Required end-to-end agreement

A buzzer repair is incomplete unless all layers agree:

- the game emits the canonical event and `strike_count`
- the PHP API accepts and stores the canonical event without collapsing it
- the display client maps each event to its own label and video
- the required video asset exists and is readable
- the event includes the affected player and Fire/Ice team
- a display/API failure does not freeze or corrupt game state

Required default assets:

- `videos/strike-1.mp4`
- `videos/strike-2.mp4`
- `videos/strike-3.mp4`
- `videos/steal-opportunity.mp4`
- `videos/strike-steal.mp4`

Alternate filenames are allowed only through an explicit documented configuration override. A deployment must fail closed when a required asset is absent.

## 4. Third-strike ordering

For a normal third wrong answer:

1. capture the struck player and team
2. send `strike_3`
3. perform the game’s third-strike/steal transition
4. send `strike_steal` after the configured delay

This ordering prevents the combined animation from replacing or hiding the Strike 3 animation.

## 5. TV separation law

Rumble does not own, host, route, launch, or control the standalone Rowdy Room TV display.

The following are prohibited in Rumble source and deployment tooling:

- a `#tv` game route
- an `OPEN TV MODE` game control
- karaoke signup or rotation panels embedded in the game
- dependencies on the standalone TV site

Rumble may continue to use its dedicated Wheel and Buzzer displays because those are game effects. They are not the standalone live-show TV display.

## 6. Verification law

No change may be described as working or stream-ready until all applicable levels pass:

1. source tests
2. game/API/display contract tests
3. required video-asset check
4. rollback verification
5. deployment verification
6. browser test of Strike 1, Strike 2, Strike 3, Strike 3 + Steal, and standalone Steal

Code verification alone is not live deployment or browser verification.

## 7. Rollback law

Each modified production file must receive a timestamped backup before any write. A partial multi-file deployment must be rolled back rather than leaving the game, API, and display on different contracts.
