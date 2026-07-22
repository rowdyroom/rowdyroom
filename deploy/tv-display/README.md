# Rowdy Room standalone TV display

This is the standalone viewer-facing karaoke display for `https://tv.rowdyroom.site/`. It is intentionally independent of Rumble, the wheel, the buzzer, and Mission Control.

## What it shows

- Signup QR code for `https://companion.rowdyroom.site/`
- Rotating public information banner
- Now Performing and Up Next
- Five performers on deck
- Estimated wait only when the canonical queue supplies it

## What it does not show

- Rumble rules, teams, scores, strikes, steals, wheel or buzzer events
- Host controls or private queue data
- Mission Control data

## Deployment preflight

1. Create `tv.rowdyroom.site` in cPanel and verify its document root is exactly `/home/ef39cr6m1vih/public_html/tv.rowdyroom.site`.
2. Back up any existing contents of that exact root before writing files.
3. Upload this bundle's `index.html`, `assets/`, and `api/` folders to that root without changing any existing domain mapping or redirect.
4. Open `https://tv.rowdyroom.site/` on a television-sized display, confirm the QR opens `https://companion.rowdyroom.site/`, and confirm the queue refreshes automatically.
5. Confirm that no Rumble content or host controls appear. If the queue source lacks a wait value, the display must stay neutral rather than inventing one.

## Queue adapter

`api/queue-display.php` fetches only the existing public Companion bootstrap response, strips it to display-safe fields, and serves it from the TV domain. This avoids browser cross-origin failures and keeps wallet, request, and user-ID fields out of the display.

The adapter needs PHP cURL enabled on the hosting account. Its only upstream is the fixed canonical queue endpoint. It accepts no parameters and makes no queue changes.

## Rollback

Restore the backup created from the TV document root or remove this new standalone domain. Do not move the display into the Rumble game or substitute an existing domain/path.
