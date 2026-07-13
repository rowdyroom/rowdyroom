# Rumble Repair Todo v39

## Current priority

Stop rebuilding. Repair one isolated defect at a time.

## Ordered repair list

1. **Fix setup/player name input focus — CODE FIX VERIFIED**
   - Typing player names must not lose focus after one character.
   - Root cause: each input keystroke called `saveState()`, which triggered a full render and rebuilt the setup inputs.
   - Repair: setup inputs now persist state without requesting a render; all other state saves keep normal rendering.
   - Automated tests: 3 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-setup-focus.mjs`.
   - Live deployment status: **not yet deployed** because this session has no direct cPanel/server write connector and the repository has no production deployment workflow.
   - Live order: item 1 must be applied and browser-tested before item 2 is applied.
   - Do not change timer, TV, wheel, buzzer, or layout while fixing.

2. **Fix Start Rumble/setup flow — CODE FIX VERIFIED**
   - Start opens setup.
   - Setup accepts players normally after item 1 is installed.
   - Root cause: `goSetup()` changed `state.page` but only called the content renderer. It never called the page router, so the intro could remain visible.
   - Repair: clear the host hash, call `renderPage()` to switch the visible section, then persist state with `saveState(false)` to avoid a second render.
   - Automated tests: 5 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-start-setup-flow.mjs`.
   - Safety: the patch refuses to run until item 1 is present and refuses an unexpected `goSetup()` implementation.
   - Live deployment status: **not yet deployed** for the same server-access reason.
   - Do not begin item 3 live work until items 1 and 2 are applied in order and pass browser testing.

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

Do not move to the next item in production until the current item passes live browser testing. Code preparation may continue in GitHub, but deployment must stay ordered. Every fix must update the Bible, Supabase, and GitHub and include a tested rollback path.
