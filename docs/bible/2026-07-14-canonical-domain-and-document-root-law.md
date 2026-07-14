# Rowdy Room Canonical Domain and Document-Root Law

**Effective:** 2026-07-14  
**Owner:** Roger Jamsek  
**Authority:** Rowdy Room Bible  
**Machine-readable registry:** `config/canonical-sites.json`

## Purpose

This law prevents Rowdy Room pages from being renamed, relocated, linked, or deployed according to guesses based on folder names. The cPanel domain map supplied by Roger Jamsek on 2026-07-14 is the approved baseline.

## Law 1 — Public hostnames are canonical

When a hostname exists in cPanel Domains, that hostname is the canonical public address.

Examples:

- `https://companion.rowdyroom.site/` is the canonical public Companion address.
- `https://game.rowdyroom.site/` is the canonical public Rumble address.
- `https://queue.rowdyroom.site/` is the canonical public Queue address.
- `https://vote.rowdyroom.site/` is the canonical public Voting address.

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

## Law 5 — Path-only surfaces remain path-only

Only these path-only surfaces are currently registered:

- Mission Control: `https://rowdyroom.site/mission-control/`
- Rumble Wheel display: `https://rowdyroom.site/rumble-wheel/`
- Rumble Buzzer display: `https://rowdyroom.site/rumble-buzzer/`

A new subdomain must not be invented for them. A new path must not be invented for an existing subdomain.

## Law 6 — Hash routes are modes, not websites

`https://game.rowdyroom.site/#tv` is a browser mode inside the Rumble site. It is not a separate domain, cPanel document root, or independent website.

The `#tv` mode may have a separate visual layout, but it remains owned by `game.rowdyroom.site` and must be deployed through that site's registered document root.

## Law 7 — QR codes and buttons use canonical addresses

All QR codes, navigation buttons, bookmarks, host controls, videos, printed materials, and instructions must use canonical public URLs from the registry.

Specifically, the Rumble TV signup QR must point to:

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

## Current canonical public domain set

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

## Required deployment preflight

Before changing any website file, record:

- Canonical hostname
- Canonical public URL
- Exact document root
- Target file
- Expected identifying marker
- Backup location
- Rollback method
- Verification URL

If any field is unknown, the deployment must stop instead of guessing.
