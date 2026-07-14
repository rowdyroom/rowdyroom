# Rowdy Room Canonical Domain and Document-Root Law

**Effective:** 2026-07-14  
**Owner:** Roger Jamsek  
**Authority:** Rowdy Room Bible  
**Machine-readable registry:** `config/canonical-sites.json`

## Purpose

This law prevents Rowdy Room pages from being renamed, relocated, linked, assigned to the wrong product, or deployed according to guesses based on folder names or existing routes. The cPanel domain map supplied by Roger Jamsek on 2026-07-14 is the approved baseline.

## Law 1 — Public hostnames are canonical

When a hostname exists in cPanel Domains, that hostname is the canonical public address.

Examples:

- `https://companion.rowdyroom.site/` is the canonical public Companion address.
- `https://game.rowdyroom.site/` is the canonical Rumble game address.
- `https://queue.rowdyroom.site/` is the canonical Queue address.
- `https://vote.rowdyroom.site/` is the canonical Voting address.

No person, assistant, script, installer, document, button, QR code, or deployment may replace a registered subdomain with a path-style address such as `rowdyroom.site/companion`, `rowdyroom.site/game`, `rowdyroom.site/queue`, or `rowdyroom.site/vote` unless this law and the registry are deliberately changed first with Roger's approval.

## Law 2 — Redirects do not redefine canonical URLs

A cPanel redirect is an implementation detail.

`companion.rowdyroom.site` currently redirects to a path under `rowdyroom.site`. That does not make the path the public identity of the Companion App. Links, QR codes, instructions, documentation, and host controls must continue to display and use:

`https://companion.rowdyroom.site/`

The redirect target may change without changing the public address.

## Law 3 — Document roots control deployment

Deployments must use the exact cPanel document root from `config/canonical-sites.json`.

Folder-name similarity is not evidence. For example:

- `queue.rowdyroom.site` deploys to `/home/ef39cr6m1vih/public_html/queue`.
- `game.rowdyroom.site` deploys to `/home/ef39cr6m1vih/public_html/game.rowdyroom.site`.
- `rowdyroom.site` deploys to `/home/ef39cr6m1vih/public_html`.

Installers may not search for a likely target and may not infer a document root from the URL. They must read the registry, target one exact path, verify identifying markers, create a backup, write the change, and verify the result.

## Law 4 — A folder is not automatically a website

Folders visible under `public_html` do not become canonical pages merely because they exist.

The following folders are currently unclassified, duplicated, internal, legacy, or shared infrastructure until audited:

- `admin`
- `admin-tools`
- `api`
- `assets`
- `companion`
- `game`
- `game-control`
- `game-viewer`
- `icons`
- `memories`
- nested `public_html`
- `rowdyroom_mobile_homepage_v7`
- `src`
- `staging`
- `videos`

They must not be deleted, redirected, promoted, or used as canonical deployment targets without a separate audit and registry update.

The presence of `game-viewer` does not prove that it is the approved TV display. It remains unclassified until audited.

## Law 5 — Path-only surfaces remain path-only

Only these path-only surfaces are currently registered:

- Mission Control: `https://rowdyroom.site/mission-control/`
- Rumble Wheel display: `https://rowdyroom.site/rumble-wheel/`
- Rumble Buzzer display: `https://rowdyroom.site/rumble-buzzer/`

A new subdomain must not be invented for them. A new path must not be invented for an existing subdomain.

## Law 6 — The TV display is independent of the game

The Rowdy Room TV display is a standalone live-show and livestream display product.

It is not:

- A Rumble game page
- A Rumble route
- A `#tv` mode under `game.rowdyroom.site`
- A wheel or buzzer display
- A game control surface
- An answer board

`game.rowdyroom.site` is Rumble-only and may not own, host, define, or control the general TV display.

The reserved future public identity is:

`https://tv.rowdyroom.site/`

That hostname is not yet present in the supplied cPanel Domains list. It remains **pending cPanel creation and live deployment**. Until it exists and is verified, no other existing domain or path may be used as a substitute.

The intended document root is:

`/home/ef39cr6m1vih/public_html/tv.rowdyroom.site`

## Law 7 — The TV display has a strict information contract

The standalone TV display may show only the live karaoke information Roger approved:

1. Signup QR code
2. Rotating information banner
3. Now Performing
4. Up Next
5. Next five performers in rotation
6. Estimated wait time

The display must read the live karaoke rotation from the canonical queue system. It must not depend on Rumble game state.

The TV display may not show:

- Game rules
- Fire or Ice teams
- Rumble scores
- Strikes
- Steal status
- Wheel results
- Buzzer events
- Game host controls
- Answer boards

The signup QR must point to:

`https://companion.rowdyroom.site/`

It must not display or encode `https://rowdyroom.site/companion/` as the public address.

## Law 8 — No automatic migration between path and subdomain

No repair, cleanup, redesign, or deployment is allowed to move a product between:

- `subdomain.rowdyroom.site`
- `rowdyroom.site/subdomain`

without all of the following:

1. Roger's explicit approval.
2. Updated `config/canonical-sites.json`.
3. Updated Bible law.
4. Verified cPanel Domains mapping.
5. Backups of the old and new document roots.
6. Redirect plan.
7. Link and QR-code audit.
8. Live browser smoke test.

Without all eight, the change must stop.

## Law 9 — No cleanup until the duplicate-folder audit is complete

The server currently contains duplicate-looking folders and top-level folders, including `/home/ef39cr6m1vih/render` and `/home/ef39cr6m1vih/videomaker`, while the registered domains point to folders under `public_html`.

These must remain untouched until an audit proves whether they are active code, backups, tooling, or abandoned copies.

## Law 10 — Canonical registry wins conflicts

When instructions, old ZIP files, installers, documentation, source code, chat history, folder names, and the registry disagree, the priority order is:

1. Roger's explicit current decision.
2. cPanel Domains mapping verified from the account.
3. `config/canonical-sites.json`.
4. This Bible law.
5. Current live browser behavior.
6. Everything else.

No lower-priority source may silently override a higher-priority source.

## Current registered public domain set

1. `rowdyroom.site`
2. `admin.memories.rowdyroom.site`
3. `book.rowdyroom.site`
4. `companion.rowdyroom.site`
5. `game.rowdyroom.site`
6. `memories.rowdyroom.site`
7. `pickup.memories.rowdyroom.site`
8. `privacypolicy.rowdyroom.site`
9. `queue.rowdyroom.site`
10. `render.rowdyroom.site`
11. `songfinder.rowdyroom.site`
12. `videomaker.rowdyroom.site`
13. `vote.rowdyroom.site`

## Reserved domain pending creation

- `tv.rowdyroom.site` — standalone live-show TV display only

## Required deployment preflight

Before changing any website file, record:

- Canonical hostname
- Canonical public URL
- Exact document root
- Product ownership
- Allowed content contract
- Target file
- Expected identifying marker
- Backup location
- Rollback method
- Verification URL

If any field is unknown, the deployment must stop instead of guessing.
