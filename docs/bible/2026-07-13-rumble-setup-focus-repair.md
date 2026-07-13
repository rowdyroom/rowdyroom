# Rumble Setup Input Focus Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 1 only. No timer, TV, wheel, buzzer, game-rule, or layout changes.

## Defect

On the Rumble setup screen, typing a player name caused the field to lose focus after one character.

## Root cause

The red and blue player inputs called `saveState()` on every `input` event. `saveState()` always called `render()`. While the setup page was active, rendering called `renderTeamInputs()`, cleared both input containers, and created new input elements. The browser therefore discarded the focused element after every keystroke.

## Repair

The repair makes state persistence and rendering separable:

- `saveState()` becomes `saveState(shouldRender = true)`.
- Normal game actions keep the existing render behavior.
- Only the red and blue setup-name inputs call `saveState(false)`.
- The values are still saved to local storage and broadcast to the live channel without rebuilding the form.

## Implementation

- Patcher: `tools/rumble/fix-setup-focus.mjs`
- Tests: `tools/rumble/fix-setup-focus.test.mjs`
- Test command: `npm run test:rumble-focus`
- Result: 3 passed, 0 failed.

The patcher uses exact-match guards and refuses to modify an unexpected file version. Applying it creates a timestamped backup beside the target, writes through a temporary file, and then atomically replaces the target.

## Deployment procedure

The likely live target identified by the server scan is:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Confirm the target before applying:

```bash
node tools/rumble/fix-setup-focus.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Apply:

```bash
node tools/rumble/fix-setup-focus.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

The command prints the exact backup path. Record that path in the server deployment and rollback logs.

## Verification

1. Open the Rumble setup screen.
2. Select each supported match size.
3. Type full multi-character names into every Fire/Red and Ice/Blue player field.
4. Confirm focus remains in the same field while typing.
5. Reload the page and confirm the saved names return.
6. Open a second Rumble window and confirm state broadcasting still works.
7. Confirm no changes to timer, TV mode, wheel, buzzer, game layout, or game rules.

## Rollback

Use the backup path printed during deployment:

```bash
node tools/rumble/fix-setup-focus.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Then reload the page and verify the original behavior is restored.

## Access and deployment status

GitHub and Supabase write access were confirmed. This session did not expose a cPanel, SSH, SFTP, or server-files connector, and the repository did not contain a production deployment workflow. Therefore this repair is not represented as live until the server command and browser verification are completed.
