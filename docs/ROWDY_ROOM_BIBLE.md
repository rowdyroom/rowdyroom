# Rowdy Room Project Bible

**Status:** Active source of truth  
**Last consolidated:** 2026-07-20  
**Owner:** Roger Jamsek  
**Public brand:** Rowdy Room  
**Location:** Rolla, Missouri  
**Primary domain:** `rowdyroom.site`

This document consolidates the authoritative decisions, current systems, progress, operating rules, technical architecture, and unresolved risks from the Rowdy Room Progress work. It is documentation only: it does not authorize production changes by itself.

## 1. Source-of-truth rules

1. The Bible, active-system index, endpoint map, contracts, deployment record, and rollback record must be updated with every valid patch.
2. Production changes must have a recoverable backup or a Git branch/commit before deployment.
3. Do not make untracked edits inside `public_html`.
4. Small changes are acceptable only when the previous state can be restored.
5. The live system, GitHub, and Supabase documentation must describe the same behavior. Any mismatch is a defect.
6. Secrets, host passwords, private tokens, service-role keys, and API credentials must never be committed to GitHub or copied into this Bible.
7. `docs/ROWDY_ROOM_OPERATOR_LAW.md` must be read as the first substantive action after every Rowdy Room prompt or continuation and audited again immediately before the final response.
8. After every action, compare the actual result with the Operator Law and correct any missed requirement before continuing when it is safe to do so.
9. `docs/continuity/START_HERE.md` is the root breadcrumb map. Every material change must update the applicable durable records, verification evidence, and recovery breadcrumbs so another task can reconstruct the current state without depending on chat history.

The server-side tracking system created outside the web root is the operational record:

- `/home/ef39cr6m1vih/rowdyroom_bible/`
- `/home/ef39cr6m1vih/rowdyroom_tools/`
- `00_ACTIVE_SYSTEM_INDEX.md`
- contracts and endpoint documentation
- deployment and rollback logs
- `rowdy-record-change.php`
- `rowdy-backup-file.php`

These locations are intentionally outside `public_html` so the documentation and rollback records are not publicly exposed.

## 2. Product definition

Rowdy Room is a live karaoke, audience-participation, competition, community, and local entertainment system. It combines:

- TikTok live karaoke and panel participation
- viewer-operated signup and queue visibility
- host-controlled show rotation
- anonymous 1-5 star live voting
- Main 4 standings and position defense
- Boost Points and audience actions
- Rowdy Room Rumble game-show mode
- digital karaoke memories
- local DJ, karaoke, hosting, and interactive event booking
- a Mission Control operating dashboard
- a Project Engine for documentation, architecture, health, release, and rollback tracking

The core public promise is:

> Live Karaoke. Real Votes. Real Community.

The core participation loop is:

> Sing • Compete • Vote • Connect.

## 3. Non-negotiable product decisions

### 3.1 The room is audience-shaped

The live show must not feel like a rigid timed broadcast. The host uses a flexible run sheet and adjusts to singer flow, voting, chat energy, and audience participation.

### 3.2 Rumble is optional and activated

Rowdy Room Rumble is **not** scheduled every 30 minutes and does not have a fixed slot. It becomes available when activated by the host and should be used only when the room and audience create the right moment.

### 3.3 Main 4 is the current model

The current concept is **Main 4**, not Main 2. Main 4 positions are earned through top contribution and top singer scores. Members must hold and defend those positions. Any code, database description, or marketing copy that still says Main 2 is stale and needs review.

### 3.4 Host controls stay compact

The host dashboard should expose only the controls needed during a live game:

- question and answer key
- next player
- next question
- lifeline
- resurrect
- punch wheel
- emergency reset

Normal game flow should run through keybinds and game logic rather than a crowded control screen.

### 3.5 Website content must not repeat itself

The website should use three short explanation videos for:

1. Rowdy Room
2. Rowdy Room Rumble
3. Companion App

Text sections should support those videos, not repeat the same explanation in multiple cards.

## 4. Brand and public website

### 4.1 Visual direction

- deep royal purple neon as the primary identity
- cyan, gold, white, and selective red/green status accents
- no pink as a dominant brand color
- crisp, sharp text rather than fuzzy glow-heavy typography
- strong stage, spotlight, curtain, singer, DJ, judge, dancer, and live-show imagery
- Gotham-style sweeping searchlights around the main title were requested as a hero inspiration
- buttons need clear hover/click motion and strong contrast
- avoid generic floating microphone art outside the hero

### 4.2 Current public hierarchy

Top actions:

- Watch Live
- Discord / Rowdy Bunch

Mobile sticky actions:

- Sign Up to Sing
- Get Boost Points
- Live Vote

Booking belongs in its own section rather than competing with live-room actions at the top.

### 4.3 Content structure

Retain or support:

- hero and live-room entry
- three one-minute explanation videos
- Main 4
- Companion App
- activated Rumble
- Book a Show
- Google reviews inside the booking section

Remove or avoid as redundant:

- duplicate “What Is Rowdy Room?” card grids
- separate “Sing, Vote, Boost, Connect” cards when the videos already explain them
- duplicate queue explanations outside the Companion App
- duplicate “Watch the room live” sections
- redundant join/review/social blocks
- excessive footer button rows

### 4.4 Companion App description

The Companion App is the audience and performer participation surface. It is intended to support:

- signup and queue position
- estimated wait time
- song selection and requests
- anonymous 1-5 star voting
- live room information
- competition access
- Rumble participation
- Boost Points balance and actions
- moving in line where permitted
- gifting boosts to friends
- memory requests and delivery
- saved photos/videos, scores, and show memories

The queue can accept an unlimited performer list, but the host remains responsible for the actual live rotation and fairness.

## 5. Live karaoke operating model

### 5.1 Queue and rotation

- viewers can join from their phone
- performers can track position and wait time
- the host controls who is now, next, and upcoming
- top contributors can receive priority panel placement
- top live-voted performers can retain positions
- remaining panel positions rotate fairly
- queue operations include host login/logout, add singer, drag/reorder, round controls, and status controls

### 5.2 Voting

- anonymous viewer voting
- 1-5 star score
- one vote limited by browser/device token rather than verified identity
- voting is controlled by the active performance and room voting state
- voting remains available for the defined post-performance window; the current documented target is one minute
- iPhone users may need Safari instead of TikTok's in-app browser

### 5.3 Main 4 and eight-person panel rotation

The panel has eight spots. Four are protected Main 4 spots and four are regular rotation spots.

Before a Rumble changes the incumbents, Main 4 is ordered as:

1. highest average performer score from live votes
2. second-highest average performer score from live votes
3. highest gift contributor
4. second-highest gift contributor

The other four spots are filled by the remaining eligible people in signup order. The regular rotation advances four people at a time while the Main 4 remain in their protected positions. With 24 total people, the initial panel is Main 4 followed by the first four remaining signups. The next panel cycle is the same Main 4 followed by remaining signups five through eight, then the same Main 4 followed by remaining signups nine through twelve, and so on.

A Rowdy Rumble occurs only after it is activated and a challenger enters. When the game ends, the four protected spots are reassigned by Rumble score, from highest to fourth-highest. Those four Rumble winners are guaranteed the protected positions for 30 minutes, and another Rumble cannot be activated during that protection window.

At the exact end of the 30-minute guarantee, the protected positions automatically return to the original live-standing formula using the values current at that moment: the two highest average performer scores from live votes, followed by the two highest gift contributors. A Rumble winner remains in a protected position only if that person qualifies under the recalculated live-standing formula.

The regular four-person signup rotation is independent of that protected-position handoff. It resumes where it stopped for the Rumble and continues from its saved signup-order position; it does not restart when the Rumble ends or when the 30-minute guarantee expires.

One centralized rotation authority must control the current protected four, the next regular group, the saved regular-rotation position, the Rumble protection/cooldown, and the timed return to live standings. Every automatic change must update the same authoritative state used by the Companion App, host-control dashboards, public displays, and database so they all show the same current and upcoming panel positions.

Tie handling, a person qualifying in both rating and contribution categories, fewer than four valid Rumble finishers, and absent or declined panelists must be resolved by one centralized rule before implementation; they must not be handled differently by separate surfaces.

### 5.4 Show projection and wireless video

- The OBSBOT Tiny 2 Lite remains USB-connected to the main production PC and supplies camera video to OBS; it does not connect directly to the projector.
- During most shows, the projector should receive the complete OBS program feed containing the OBSBOT camera, overlays, game or dashboard content, and other selected sources.
- The required primary wireless path is a dedicated point-to-point wireless HDMI transmitter and receiver between the production PC video output and the projector's HDMI input.
- AirPlay, Miracast, and other app-level screen-mirroring methods are convenience fallbacks only because protected content, operating-system behavior, or application changes can produce a black image.
- A wired HDMI path remains the emergency fallback.
- The owned OREI 1x2 HDMI splitter may feed a local display and the wireless-HDMI transmitter at the same time after EDID, HDCP, resolution, and frame-rate compatibility are tested.
- A wireless-HDMI transmitter/receiver kit is a purchase requirement, not owned inventory, until it is bought and verified.
- Minimum purchase criteria are explicit 1080p60 support, low enough latency for live camera use, stable range for the actual room, reliable external power, and compatible HDMI/HDCP/EDID behavior. A link must have an explicit encryption specification before it is described as private or secure.

## 6. Boost Points and TikFinity

Boost Points connect TikTok audience activity to Rowdy Room actions.

Known interaction model:

- `!points` and `!boost` return or reference the viewer's Boost Points
- Boost Points can support highlights, memories, line movement, game actions, and friend transfers
- TikFinity/webhook activity is recorded and must be protected against replay and duplicate processing
- the public client must never have a service-role key
- all action costs and permissions need one authoritative configuration source

Mission Control AI/API integrations are expected to remain available during shows. A prior YouTube/SongFinder failure occurred when search limits were reached, so quota monitoring, caching, fallback search behavior, and visible provider health are operational requirements.

## 7. Rowdy Room Rumble

### 7.1 Core identity

Rumble is a portrait-stream, audience-shaped Fire Team versus Ice Team game-show mode.

### 7.2 Known mechanics

The recovered/earlier game code includes:

- red/fire and blue/ice teams
- first player and current team selection
- question and ranked answers
- points pool
- rounds and score multipliers
- strikes
- steal opportunities
- player contributions
- player hits and knockouts
- resurrect/revive tracking
- lifelines
- a 40-second normal timer
- Rowdy Rush final mode with two players, five questions, and a 60-second timer
- correct-answer, buzzer, and round sounds

The current production Rumble surfaces include a wheel and buzzer. Strike, steal, and strike-steal/combo events are normalized by the backend.

### 7.3 Current rule

The original game logic should be integrated into the compact host workflow rather than replaced by a second, simplified game. Multiple competing Rumble implementations are a major maintenance risk.

## 8. Mission Control and production server map

Known production account root:

- `/home/ef39cr6m1vih`

Known live web root:

- `/home/ef39cr6m1vih/public_html`

Known current surfaces:

- `/public_html/index.html` — public website
- `/public_html/mission-control/index.html` — Mission Control live console
- `/public_html/mission-control/queue-requests/index.html` — queue/request operations
- `/public_html/companion/index.html` — Companion App
- `/public_html/companion/assets/app.js`
- `/public_html/companion/assets/style.css`
- `/public_html/rumble-wheel/index.html`
- `/public_html/rumble-buzzer/index.html`
- `/public_html/rumble-buzzer/control.html`
- `/public_html/rumble-buzzer/assets/app.js`
- `/public_html/api/index.php`
- `/public_html/api/system-check.php`
- `/public_html/api/admin-ops.php`
- `/public_html/api/admin-cleanup.php`
- `/public_html/api/songbook.php`
- `/public_html/api/rumble-wheel.php`
- `/public_html/api/rumble-buzzer.php`
- `/public_html/api/VERSION_REAL_MISSION_CONTROL_V14.txt`

The v14 version marker describes a compact live console integrating queue, songbook, requests, Rumble wheel, and Rumble buzzer.

A temporary survey-game finder was also created:

- `/public_html/find-rowdy-game-v19.php`

Temporary scanners/finders should not remain publicly accessible after their job is complete.

## 9. Supabase

### 9.1 Authoritative project

Current active project:

- project name: `Final`
- project ref: `szubjgpvlqliyparrnam`
- region: `us-east-1`
- current status at consolidation: `ACTIVE_HEALTHY`

Old/inactive project:

- project ref: `dupwuopnpmdsprxxqsle`
- status at consolidation: `INACTIVE`

Production code and documentation should not silently mix these two projects.

### 9.2 Core live tables and systems

The active project includes live karaoke, game, and engine tables such as:

- `rr_state`
- `rr_scoreboard`
- `rr_singers`
- `rr_votes`
- `rr_performances`
- `rr_host_sessions`
- `rr_panel_assignments`
- `rr_panel_log`
- `rr_public_panel_status`
- `rr_boost_wallets`
- `rr_boost_ledger`
- `rr_boost_transactions`
- `rr_boost_transfers`
- `rr_boost_actions`
- `rr_memory_packages`
- `rr_memory_orders`
- `rr_rumble_state`
- `rr_rumble_sessions`
- `rr_rumble_players`
- `rr_skip_requests`

The database also contains the Project Engine registry, architecture, scan, health, release, version, documentation, and fix-workflow tables.

### 9.3 Security requirements

- RLS must remain enabled on exposed tables
- public clients use only publishable/anon credentials
- service-role or secret keys never belong in browser code
- privileged functions require explicit review
- backend-only engine tables should not be exposed to public roles
- voting identity tokens are anti-duplicate controls, not verified identity
- schema changes require advisor checks and verification

## 10. Project Engine

The Rowdy Room Project Engine is intended to become the development and operations control layer. It includes:

- project registry
- manual/Bible sections
- whole-project search
- architecture nodes and edges
- source-file scans
- symbols, imports, references, routes, and environment references
- duplicate-code detection
- dependency integrity checks
- health findings and fix plans
- schema snapshots and diffs
- release readiness and rollback plans
- versions and changelogs
- approval-first fix workflow

The GitHub application is a Next.js 15 / React 19 / TypeScript monorepo named `rowdyroom-enterprise-engine` with workspace areas for apps, packages, connectors, and agents.

## 11. Booking and local services

Rowdy Room offers:

- karaoke shows
- DJ services
- live event hosting
- crowd games and interaction
- weddings
- birthdays
- corporate events
- festivals/community events
- school events

Booking uses a Google appointment calendar opened as a normal external link rather than an embedded calendar when embedding is blocked.

Intake should collect:

- name
- phone
- email
- event date and location
- estimated attendance
- event type
- indoor/outdoor
- start/end time
- sound-equipment needs
- karaoke/DJ/hosting/game needs
- special announcements or event-flow needs

Older PayPal membership-page variants with $5, $10, and $25 tiers exist. They are not automatically authoritative and should be treated as legacy/experimental until the current monetization plan is confirmed.

## 12. Current contradictions and risks

1. **Main 2 vs Main 4:** the engine feature index still described Main 2; current product decision is Main 4.
2. **Production/GitHub drift:** the live PHP/static system under `public_html` is not fully represented by the Next.js GitHub repository.
3. **Bible drift:** Supabase previously had only one short manual section despite a large engine schema.
4. **Multiple Rumble versions:** compact wheel/buzzer logic and the recovered full survey game are not yet one verified implementation.
5. **Temporary public tools:** scanners/finders can expose system structure if left in the web root.
6. **API quota risk:** YouTube/SongFinder limits can interrupt live operation.
7. **Old Supabase project:** inactive project references can cause accidental writes or broken clients.
8. **Secrets in historical files:** old uploaded HTML/code may contain credentials; they must not be copied into GitHub or documentation.
9. **Booking identity drift:** older page variants may use different contact/monetization details.
10. **No verified server sync in this consolidation:** the server-side Bible files were not directly writable from this session and must be reconciled with this document before the next production patch.

## 13. Immediate priority order

1. Reconcile this Bible with the server-side `rowdyroom_bible` directory.
2. Mark `szubjgpvlqliyparrnam` as the single active Supabase project in every environment file.
3. Align all Main 4 wording and ranking logic.
4. Inventory production endpoints and remove temporary public scanners.
5. Choose the canonical Rumble implementation and integrate the recovered full game mechanics into the compact host control model.
6. Establish a production-to-GitHub sync process for live PHP/static files.
7. Add quota/provider health and fallback behavior for YouTube/SongFinder and other AI/API integrations.
8. Run a security and performance advisor review after any database change.
9. Verify booking links, contact identity, and monetization status.
10. Require backup, change record, verification, and rollback notes for every deployment.
