# Rumble Repair Todo v39

## Current priority

Stop rebuilding. Repair one isolated defect at a time.

## Ordered repair list

1. **Fix setup/player name input focus**
   - Typing player names must not lose focus after one character.
   - Do not change timer, TV, wheel, buzzer, or layout while fixing.

2. **Fix Start Rumble/setup flow**
   - Start opens setup.
   - Setup accepts players normally.

3. **Fix coin flip carryover**
   - Coin flip winner team and first player carry into the game screen.

4. **Fix current player/team display**
   - Keep wording simple: `Turn: Name — Team`.

5. **Fix timer**
   - 40-second timer starts, ticks, pauses, resumes, resets, and triggers wrong answer at zero.

6. **Fix automatic turn advancement**
   - Correct/wrong/question outcomes advance to proper next player/team under rules.

7. **Fix wheel video/animation trigger**
   - Game action must actually trigger wheel display/overlay.

8. **Fix buzzer video/animation trigger**
   - Strike, strike 3, steal, and strike+steal states must display correctly.

9. **Fix TV mode**
   - Full-screen QR/queue/banner mode.
   - No host controls.
   - No Rumble rules panel.

10. **Remove question upload UI**
   - Saved built-in question list.
   - Random question selection.

11. **9:16 cleanup**
   - Clean, simple, large, phone-readable.

## Enforcement

Do not move to the next item until the current item passes testing. Every fix must update the Bible, Supabase, and GitHub.
