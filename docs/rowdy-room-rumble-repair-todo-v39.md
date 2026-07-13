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
   - Live order: item 2 must be applied and browser-tested after item 1 and before item 3.

3. **Fix coin flip carryover — CODE FIX VERIFIED**
   - Coin flip winner team and first player carry into the game screen.
   - Root cause: the coin flip chose only a team, hard-coded `currentIndex` to `0`, displayed no player name, and the coin-page **LET’S GO** action bypassed full match initialization.
   - Repair: choose a random player from the winning team, store the selected index, display `TEAM — Player`, route the coin page correctly, preserve/clamp the selected index during initialization, and make `showGame()` delegate to `startMatch()`.
   - Automated tests: 7 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-coin-carryover.mjs`.
   - Safety: the patch requires items 1 and 2, is idempotent, and refuses unexpected coin, start, or game-transition implementations.
   - Live deployment status: **not yet deployed** for the same server-access reason.
   - Live order: apply and verify items 1 → 2 → 3 before item 4 is deployed.

4. **Fix current player/team display — CODE FIX VERIFIED**
   - Keep wording simple: `Turn: Name — Team`.
   - Root cause: the game displayed only `CURRENT: Name`, leaving the active team ambiguous.
   - Repair: read the active team’s selected player without changing state and display `Turn: Player — Red Team` or `Turn: Player — Blue Team`.
   - Missing-name fallback: `Red N` or `Blue N` based on the current index.
   - Automated tests: 7 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-current-turn-display.mjs`.
   - Safety: the patch requires item 3, is idempotent, refuses an unexpected display implementation, and verifies that turn state is unchanged.
   - Live deployment status: **not yet deployed** for the same server-access reason.
   - Live order: apply and verify items 1 → 2 → 3 → 4 before item 5 is deployed.

5. **Fix timer — CODE FIX VERIFIED**
   - 40-second timer starts, ticks, pauses, resumes, resets, and triggers wrong answer at zero.
   - Root cause: the old interval reached zero without calling `wrongAnswer()`, cleared only on a later tick, left a stale interval handle, and was not reliably started by match/question/reset paths.
   - Repair: start on match initialization, new question, round continuation, and match restart; preserve remaining time on pause/resume; reset an expired timer to 40; set zero exactly; null the interval handle; call `wrongAnswer(currentTeam)` once; and keep the timer stopped when a match completes.
   - Automated tests: 8 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-timer-lifecycle.mjs`.
   - Safety: the patch requires item 4, is idempotent, refuses unexpected timer/start/reset implementations, and does not add automatic player advancement.
   - Live deployment status: **not yet deployed** for the same server-access reason.
   - Live order: apply and verify items 1 → 2 → 3 → 4 → 5 before item 6 is deployed.

6. **Fix automatic turn advancement — CODE FIX VERIFIED**
   - Correct answers advance to the next player on the same team unless the board is cleared.
   - Ordinary wrong answers and timer expiry add a strike and advance to the next player on the same team.
   - A third strike resets team strikes and transfers the turn to the opposing team’s first player.
   - Manual next-question actions advance the active team rotation and restart the timer.
   - New rounds alternate the starting team and advance that team’s rotation.
   - Per-team rotation indexes are preserved independently and one-player teams wrap safely.
   - Automated tests: 12 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-turn-advancement.mjs`.
   - Safety: the patch requires item 5, is idempotent, refuses unexpected outcome implementations, and does not modify wheel, buzzer animation, TV mode, question-bank UI, scoring, or layout.
   - Live deployment status: **not yet deployed** for the same server-access reason.
   - Live order: apply and verify items 1 → 2 → 3 → 4 → 5 → 6 before item 7 is deployed.

7. **Fix wheel video/animation trigger — CODE FIX VERIFIED**
   - Root cause: `punchAttack()` applied a random local result but never sent the current player or team to the separate wheel display.
   - Repair: post the active player and Fire/Ice team to `/api/rumble-wheel.php?action=spin`; use the returned `result_key` as the authoritative in-game effect; query `action=state` if the spin response omits its result; and fall back locally without blocking play if the display API is unavailable.
   - Supported result keys include miss, skip turn, five-second timer, and power punch in underscore or hyphen variants.
   - Automated tests: 9 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-wheel-trigger.mjs`.
   - Safety: the patch requires item 6, is idempotent, refuses an unexpected Punch Wheel implementation, records synchronization errors, and does not modify buzzer behavior, TV mode, question-bank UI, scoring, or layout.
   - Live deployment status: **not yet deployed** for the same server-access reason; the live wheel endpoint could not be queried from this environment because the domain did not resolve.
   - Live order: apply and verify items 1 → 2 → 3 → 4 → 5 → 6 → 7 before item 8 is deployed.

8. **Fix buzzer video/animation trigger — CODE FIX VERIFIED**
   - Root cause: strike and steal state changes stayed inside the compact game and never triggered the separate buzzer display.
   - Repair: send player, Fire/Ice team, and normalized buzzer event to `/api/rumble-buzzer.php?action=trigger`; fall back to direct `strike`, `steal`, or `strike_steal` actions if the trigger action is unavailable; and never block game progression when the display is offline.
   - Ordinary first and second strikes remain local. A third strike from a Punch effect triggers the Strike 3 video. A normal third wrong answer that transfers control triggers the combined Strike 3 + Steal Opportunity video. The standalone steal helper triggers the Steal Opportunity video.
   - Supported normalized event keys: `strike`, `steal`, and `strike_steal`, including known aliases.
   - Automated tests: 12 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-buzzer-trigger.mjs`.
   - Safety: the patch requires item 7, preserves item 6 turn logic, is idempotent, refuses unexpected strike logic, records `state.buzzerSyncError`, and does not modify TV mode, scoring, question-bank UI, or layout.
   - Live deployment status: **not yet deployed** for the same server-access reason; the endpoint contract was recovered from prior deployed-source records but could not be queried live because the domain did not resolve.
   - Live order: apply and verify items 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 before item 9 is deployed.

9. **Fix TV mode — CODE FIX VERIFIED**
   - Adds a dedicated `#tv` route that shows only the Rowdy Room title, join QR/URL, current and next player, Fire/Ice player queues, and a rotating banner.
   - The display contains no host controls, answer key, or Rumble rules panel.
   - The existing render path keeps the TV screen synchronized with state and BroadcastChannel/local-storage updates.
   - The host dashboard receives one navigation shortcut that opens TV mode in a separate window; `Alt+T` is also supported.
   - The default QR points to `/companion/`; the join URL, QR image, banners, and rotation interval can be overridden through `window.ROWDY_TV_*` settings.
   - Automated tests: 12 passed, 0 failed.
   - Rollback-safe patcher: `tools/rumble/fix-tv-mode.mjs`.
   - Safety: the patch requires item 8, inserts one isolated script at a guarded closing marker, is idempotent, and does not change game scoring, timer, turn rules, wheel, buzzer, or question bank.
   - Live deployment status: **not yet deployed** for the same server-access reason; the default QR image currently uses an external QR image service unless a local image override is configured.
   - Live order: apply and verify items 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 before item 10 is deployed.

10. **Remove question upload UI**
   - Saved built-in question list.
   - Random question selection.

11. **9:16 cleanup**
   - Clean, simple, large, phone-readable.

## Stream launch-readiness checkpoint

The Supabase karaoke queue core has been hardened and passed transactional tests for sign-up, duplicate rejection, deterministic ordering, one current performer, one open performance, switching, completion, self-removal, line skips, Boost Point movement, wallet accounting, and ledger entries.

The full show is **not yet labeled stream-ready** because the deployed Mission Control/Companion stack appears to use a separate PHP/MySQL queue whose source is not in GitHub and cannot be inspected or live-tested through the current access. GitHub issue #11 tracks that blocker.

Before the full system is called stream-ready, verify the actual production workflow:

- public performer sign-up submits successfully
- duplicate and invalid sign-ups are handled safely
- approved sign-ups enter the active queue
- rotation order is deterministic and preserved
- current performer and next performer agree across host and viewer screens
- complete, skip, remove, requeue, and line-skip actions produce the expected next order
- queue survives refresh/reconnect without losing active state
- host controls and companion/viewer queue remain synchronized

Code inspection alone is not sufficient for the live-ready label. Production endpoint and browser verification are required.

## Enforcement

Do not move to the next item in production until the current item passes live browser testing. Code preparation may continue in GitHub, but deployment must stay ordered. Every fix must update the Bible, Supabase, and GitHub and include a tested rollback path.
