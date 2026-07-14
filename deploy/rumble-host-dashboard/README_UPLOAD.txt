ROWDY ROOM RUMBLE HOST DASHBOARD V2
Date: 2026-07-14
Target: /home/ef39cr6m1vih/public_html/game.rowdyroom.site/index.html

WHAT THIS CHANGES
- Replaces the cluttered in-game host dashboard with a focused private dashboard.
- Shows current player, Fire/Ice team, question, answer key, timer, strikes, lifelines, and resurrection tokens.
- Provides only Next Player, Next Question, Lifeline, Resurrection, Open Game Screen, Lock, and Emergency Reset controls.
- Removes manual Wheel and Buzzer controls from the dashboard.
- Makes 0 call the real wrong-answer action exactly once, which triggers the correct strike animation through the game logic.
- Blocks P and O manual Punch Wheel hotkeys.
- Fixes the backtick lifeline shortcut so inventory is deducted only by useLifeline().

SAFE MANUAL INSTALL
1. In cPanel File Manager, open:
   /home/ef39cr6m1vih/public_html/game.rowdyroom.site

2. Create a backup outside the live document root, for example:
   /home/ef39cr6m1vih/rowdyroom_backups/rumble-host-dashboard-v2-2026-07-14/index.html

3. Upload this file into the existing assets folder:
   assets/rumble-host-dashboard-v2.js

4. Edit the live index.html. Immediately before the final </body> tag, add exactly:
   <script id="rowdy-rumble-host-dashboard-v2" src="assets/rumble-host-dashboard-v2.js?v=20260714"></script>

5. Save index.html and hard-refresh the browser.

VERIFY
- Open https://game.rowdyroom.site/#host and unlock the dashboard.
- Confirm the focused dashboard appears.
- Confirm there are no manual Wheel or Buzzer buttons.
- Start a test match and press 0 once. One wrong answer should be recorded and the matching strike animation should fire.
- Press P and O. Neither should manually trigger the Wheel.
- Add one lifeline, press the backtick key once, and confirm only one lifeline is consumed.
- Test Next Player, Next Question, Lifeline, Resurrection, and Emergency Reset.
- Confirm https://game.rowdyroom.site/ still loads normally.

ROLLBACK
- Restore the backed-up index.html.
- Remove assets/rumble-host-dashboard-v2.js.
- Hard-refresh and retest the game.

SECURITY / CLEANUP
- Do not leave the deployment ZIP in public_html after extraction.
- Move the ZIP back to /_cleanup_quarantine or remove it from the public web root immediately.
