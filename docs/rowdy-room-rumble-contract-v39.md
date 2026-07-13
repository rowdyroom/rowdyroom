# Rowdy Room Rumble Locked Contract v39

Status: source-of-truth update only. No live site files changed.

## Important correction

The uploaded Game Show Manager file is not the latest final Rumble version. It is a functional-flow clue. The later target version had already moved toward:

- 9:16 portrait format
- no question upload UI
- auto-loaded saved question list
- random question selection
- cleaner simplified interface
- large phone-readable display

## Failed builds

Do not use these as repair bases:

- v31
- v32
- v33
- v34
- v35
- v36

## Final Rumble requirements

- Name: Rowdy Room Rumble / Rowdy Rumble.
- Family Feud-style team gameplay.
- Two teams with flexible match sizes.
- Correct answers reveal and add points to round pool.
- Three team strikes triggers steal opportunity.
- Players have three hearts/lives.
- Knockout choices: stay dead, revive, or replace.
- Each player gets one lifeline.
- Lifeline uses a wheel result.
- Normal turn timer is 40 seconds.
- Rowdy Rush timer is 60 seconds.
- Rowdy Rush unlocks if the winning team scores 250+.
- Rowdy Rush score of 200+ earns +500 bonus.
- Leaderboards: all-time, monthly, weekly, daily.
- Host pause is required.
- Host/dashboard must stay separate from viewer/game screen.
- TV mode must be full-screen QR/queue/banner only.
- TV mode must not show host controls or Rumble rules panel.
- Wheel and buzzer videos/animations must work.
- Everything purchased uses Rowdy Boost Points.
- Do not use old gift labels: Hand Heart, Amped Up, Money Gun, 2X Boost.

## Repair rule

No more all-in-one rebuilds. Fix one isolated defect at a time and update Bible/Supabase/GitHub after each step.

## Immediate repair order

1. Name input focus.
2. Start/setup flow.
3. Coin flip carryover.
4. Current player/team display.
5. Timer.
6. Automatic turn advancement.
7. Wheel trigger.
8. Buzzer trigger.
9. TV full-screen QR/queue/banner mode.
10. Remove question upload UI and verify saved random questions.
11. 9:16 visual cleanup.
