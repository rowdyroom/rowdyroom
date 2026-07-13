# Rumble Built-In Question Bank Repair

**Date:** 2026-07-13  
**Status:** Code verified; live deployment pending  
**Scope:** Repair item 10 only.

## Defect

The compact Rumble setup still showed the legacy question-import section: its heading, bulk-entry field, count, and load/clear controls. The active game already uses a separate saved `QUESTION_BANK` and a random, non-repeating `pickQuestion()` flow.

## Repair

The patch removes the known legacy controls from the HTML and installs a small guard that removes any equivalent controls recreated later. It sets:

```javascript
window.ROWDY_QUESTION_MODE = 'built_in_only';
```

The repair refuses to run unless the built-in bank and its non-repeating selection logic are present. It preserves the bank and picker byte-for-byte.

Known removed IDs:

- `bulkQuestions`
- `loadQuestionsBtn`
- `clearQuestionsBtn`
- `questionCount`
- `questionFile`
- `questionUpload`

The match-size, player-name, Start Rumble, Next Question, answer reveal, scoring, timer, round, wheel, buzzer, and TV controls remain unchanged.

## Verification

- Patcher: `tools/rumble/fix-built-in-question-bank.mjs`
- Tests: `tools/rumble/fix-built-in-question-bank.test.mjs`
- Command: `npm run test:rumble-questions`
- Result: **15 passed, 0 failed**

Tests verify removal, dynamic re-removal, bank preservation, picker preservation, no repeats before exhaustion, reset after exhaustion, unrelated-control preservation, idempotence, prerequisites, and refusal of an unexpected question engine.

## Deployment

Apply repairs 1 through 10 in order to the confirmed production game file. The likely target from the prior server scan is:

```text
/home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

Check and apply:

```bash
node tools/rumble/fix-built-in-question-bank.mjs --check /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
node tools/rumble/fix-built-in-question-bank.mjs --apply /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Browser verification

Confirm the setup page no longer shows question-import controls. Start a match and use Next Question through the full bank. Questions must not repeat until the bank is exhausted, then a new random cycle may begin. Confirm answers, point values, timer, turns, wheel, buzzer, and TV mode remain unchanged.

## Rollback

Use the timestamped backup printed by the apply command:

```bash
node tools/rumble/fix-built-in-question-bank.mjs --restore <timestamped-backup-path> /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html
```

## Access status

GitHub and Supabase writes are available. Direct cPanel, SSH, SFTP, and live browser control are not available, so production deployment and browser verification remain pending.
