# Current cPanel Site Inventory

**Captured:** 2026-07-14  
**Account home:** `/home/ef39cr6m1vih`  
**Public web root:** `/home/ef39cr6m1vih/public_html`

This inventory is based on Roger Jamsek's cPanel Domains and File Manager screenshots. It records what is known without deleting, merging, or reclassifying folders.

## Registered cPanel domains

| Canonical hostname | cPanel document root | Redirect status | Canonical role |
|---|---|---|---|
| `rowdyroom.site` | `/home/ef39cr6m1vih/public_html` | Not redirected | Main public website |
| `admin.memories.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/admin.memories.rowdyroom.site` | Not redirected | Memories administration |
| `book.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/book.rowdyroom.site` | Not redirected | Booking |
| `companion.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/companion.rowdyroom.site` | Redirects to a `rowdyroom.site/companion...` target | Viewer Companion public identity |
| `game.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/game.rowdyroom.site` | Not redirected | Rumble game only |
| `memories.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/memories.rowdyroom.site` | Not redirected | Memories public site |
| `pickup.memories.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/pickup.memories.rowdyroom.site` | Not redirected | Memories pickup |
| `privacypolicy.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/privacypolicy.rowdyroom.site` | Not redirected | Privacy policy |
| `queue.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/queue` | Not redirected | Queue |
| `render.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/render.rowdyroom.site` | Not redirected | Render service |
| `songfinder.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/songfinder.rowdyroom.site` | Not redirected | Song Finder |
| `videomaker.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/videomaker.rowdyroom.site` | Not redirected | Video Maker |
| `vote.rowdyroom.site` | `/home/ef39cr6m1vih/public_html/vote.rowdyroom.site` | Not redirected | Voting |

## Standalone TV display — approved product, domain pending

The TV display is not part of `game.rowdyroom.site` and must not use `game.rowdyroom.site/#tv`.

Reserved future hostname:

`tv.rowdyroom.site`

Intended future document root:

`/home/ef39cr6m1vih/public_html/tv.rowdyroom.site`

Current cPanel status:

**Not yet present in the supplied Domains list.** It must be created and verified before the TV display is deployed.

Approved display contract:

- Signup QR code
- Rotating information banner
- Now Performing
- Up Next
- Next five performers
- Estimated wait time

The TV display must use canonical queue data and must not depend on the Rumble game.

Forbidden content includes game rules, Rumble teams, scores, strikes, steals, wheel events, buzzer events, answer boards and game controls.

## Confirmed folders under `public_html`

The screenshots show these folders:

- `.well-known`
- `admin`
- `admin-tools`
- `admin.memories.rowdyroom.site`
- `api`
- `assets`
- `book.rowdyroom.site`
- `cgi-bin`
- `companion`
- `companion.rowdyroom.site`
- `game`
- `game-control`
- `game-viewer`
- `game.rowdyroom.site`
- `icons`
- `memories`
- `memories.rowdyroom.site`
- `mission-control`
- `pickup.memories.rowdyroom.site`
- `privacypolicy.rowdyroom.site`
- nested `public_html`
- `queue`
- `render.rowdyroom.site`
- `rowdyroom_mobile_homepage_v7`
- `rumble-buzzer`
- `rumble-wheel`
- `songfinder.rowdyroom.site`
- `src`
- `staging`
- `videomaker.rowdyroom.site`
- `videos`
- `vote.rowdyroom.site`

No `tv.rowdyroom.site` folder is shown in the supplied File Manager screenshots.

The existing `game-viewer` folder is not automatically the TV display. It remains unclassified until audited.

## Confirmed account-home folders relevant to web operations

The account home screenshot shows:

- `public_html`
- `public_ftp`
- `_old_rowdyroom_deployment_files`
- `render`
- `rowdyroom_backups`
- `rowdyroom_bible`
- `rowdyroom_tools`
- `src`
- `ssl`
- `tmp`
- `videomaker`
- `www`

The cPanel domain map does not point the registered `render.rowdyroom.site` or `videomaker.rowdyroom.site` domains to the top-level `render` or `videomaker` folders. Those top-level folders are therefore not canonical deployment targets unless a later audit proves otherwise.

## Registered path-only products

These are not cPanel subdomains in the supplied domain list:

| Product | Canonical URL | Folder |
|---|---|---|
| Mission Control | `https://rowdyroom.site/mission-control/` | `/home/ef39cr6m1vih/public_html/mission-control` |
| Rumble Wheel | `https://rowdyroom.site/rumble-wheel/` | `/home/ef39cr6m1vih/public_html/rumble-wheel` |
| Rumble Buzzer | `https://rowdyroom.site/rumble-buzzer/` | `/home/ef39cr6m1vih/public_html/rumble-buzzer` |

The standalone TV display is not an approved path-only product. It is reserved for `tv.rowdyroom.site` after cPanel creation.

## Duplicate or ambiguous surfaces requiring audit

These pairs or groups may contain current code, legacy copies, tooling, or shared assets. No conclusion is made yet:

- `companion` and `companion.rowdyroom.site`
- `game`, `game-control`, `game-viewer`, and `game.rowdyroom.site`
- `memories` and `memories.rowdyroom.site`
- top-level `render` and `public_html/render.rowdyroom.site`
- top-level `videomaker` and `public_html/videomaker.rowdyroom.site`
- `admin` and `admin.memories.rowdyroom.site`
- nested `public_html/public_html`

## Immediate operational rule

Until the audit is complete:

- Do not delete duplicate-looking folders.
- Do not move files between path and subdomain folders.
- Do not change existing cPanel document roots.
- Do not change redirects.
- Do not use auto-discovery installers.
- Do not deploy the standalone TV display inside any game folder.
- Create and verify `tv.rowdyroom.site` before TV deployment.
- Deploy only to the exact registry path after a marker check and backup.
