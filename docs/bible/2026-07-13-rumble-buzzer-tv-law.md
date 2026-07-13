# Rumble Buzzer and TV Mode Law

**Status:** Active source-of-truth amendment  
**Date:** 2026-07-13  
**Applies to:** Rumble game, buzzer API, buzzer display, video assets, TV display, installer, tests, deployment, and rollback

This amendment corrects the prior incomplete buzzer contract. It is part of the Rowdy Room Bible and must be followed by every future Rumble implementation.

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

## 5. TV mode law

Rumble must provide one separate viewer-facing TV route:

```text
#tv
```

The host dashboard must include an **OPEN TV MODE** control that opens this route in a separate window.

TV mode must:

- fill the entire display
- hide every other game/host section
- contain no host controls
- contain no answer key
- contain no rules panel
- show current player and team
- show next player and team
- show Fire and Ice player queues with the active player highlighted
- show the rotating Rowdy Room banner
- show a QR code and readable URL for the production Companion page
- update whenever the game state changes
- remain suitable for Window Capture or Browser Capture in TikTok LIVE Studio

The default Companion destination is exactly:

```text
https://rowdyroom.site/companion/
```

It must not inherit the `game.rowdyroom.site` origin.

## 6. Verification law

No change may be described as working or stream-ready until all applicable levels pass:

1. source tests
2. game/API/display contract tests
3. required video-asset check
4. rollback verification
5. deployment verification
6. browser test of Strike 1, Strike 2, Strike 3, Strike 3 + Steal, standalone Steal, and TV mode

Code verification alone is not live deployment or browser verification.

## 7. Rollback law

Each modified production file must receive a timestamped backup before any write. A partial multi-file deployment must be rolled back rather than leaving the game, API, and display on different contracts.
