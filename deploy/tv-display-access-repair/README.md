# TV Display link repair

`https://tv.rowdyroom.site/` already exists and its live Supabase queue requests return HTTP 200. The missing piece is a visible way to open it from the main website and Mission Control.

This one-use installer adds:

- A **TV Display** action to the homepage’s sticky controls.
- A **TV Display** link in Mission Control → Setup → Displays.

It does not replace or alter the existing TV display, Rumble, Wheel, Buzzer, Companion, or queue data.

Upload `rowdy-install-tv-display-links.php` beside `/public_html/index.html`, run it once from the browser, verify both links open `https://tv.rowdyroom.site/`, then delete the installer. It creates timestamped backups in the account-home `rowdyroom_backups` folder before modifying either target.
