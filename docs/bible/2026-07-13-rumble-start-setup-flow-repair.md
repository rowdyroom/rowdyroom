# Rumble Start-to-Setup Flow Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 2 only. No timer, TV, wheel, buzzer, coin-flip, game-rule, or layout changes.

## Defect

Pressing **START RUMBLE** could leave the intro screen visible instead of opening the setup screen.

## Root cause

The start button called `goSetup()`. That function changed `state.page` to `setup`, rendered the team inputs, and saved state. However, saving state only called the content renderer. The function that actually hides the current section and reveals the section matching `state.page` is `renderPage()`. Because `goSetup()` did not call it, the visible page could remain the intro.

## Repair

The repaired flow is:

1. Set `state.page` to `setup`.
2. Clear the host hash so public routing is active.
3. Call `renderPage()` to hide the intro and reveal `setupPage`.
4. Save state with `saveState(false)` so persistence and channel broadcast occur without a redundant second render.

The direct `renderTeamInputs()` call is removed from `goSetup()` because `renderPage()` calls the setup page content renderer, which already renders the team inputs.

## Prerequisite

Repair item 1 must already be installed. The item 2 patcher verifies that the item 1 `saveState(shouldRender = true)` implementation exists. It refuses to change the file if the prerequisite is missing.

## Implementation

- Patcher: `tools/rumble/fix-start-setup-flow.mjs`
- Tests: `tools/rumble/fix-start-setup-flow.test.mjs`
- Test command: `npm run test:rumble-start-setup`
- Result: 5 passed, 0 failed.

Test coverage verifies:

- `START RUMBLE` sets the page to `setup`.
- The host hash is cleared before page rendering.
- `renderPage()` runs before `saveState(false)`.
- The redundant direct setup-input render is removed.
- The patch is idempotent.
- The patch refuses to run before item 1.
- The patch refuses an unexpected `goSetup()` implementation.

## Deployment procedure

The likely live target identified by the server scan is:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply item 1 first and verify it. Then check item 2:

```bash
node tools/rumble/fix-start-setup-flow.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply item 2:

```bash
node tools/rumble/fix-start-setup-flow.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

The command prints the exact timestamped backup path. Record it in the server deployment and rollback logs.

## Verification

1. Load the Rumble intro screen without `#host` in the URL.
2. Press **START RUMBLE**.
3. Confirm the intro section hides immediately.
4. Confirm the setup section becomes visible immediately.
5. Confirm the match-size control and both team input groups are visible.
6. Type full player names into every visible field and confirm focus remains stable.
7. Change match size and confirm the correct number of inputs appears.
8. Reload and confirm the application still starts at the intro according to the current intro-reset rule.
9. Confirm no changes to coin flip, timer, TV mode, wheel, buzzer, layout, scoring, or game rules.

## Rollback

Use the backup path printed during deployment:

```bash
node tools/rumble/fix-start-setup-flow.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Then reload the Rumble intro and confirm the previous start behavior is restored.

## Access and deployment status

GitHub and Supabase write access are confirmed. This session still has no cPanel, SSH, SFTP, or server-files connector, and the repository still has no production deployment workflow. This repair is therefore recorded as code-verified, not live.
