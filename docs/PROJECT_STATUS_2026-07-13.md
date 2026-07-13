# Rowdy Room Progress Status — 2026-07-13

## Executive summary

Rowdy Room has moved from a collection of standalone karaoke pages into a multi-surface operating system with a public website, live queue and voting, Companion App, Boost Points, memories, Main 4 competition, Rowdy Room Rumble, Mission Control, booking, and a Supabase-backed Project Engine.

The strongest progress is the breadth of working systems. The largest problem is synchronization: production server files, GitHub, Supabase documentation, older uploaded artifacts, and the new server-side Bible are not yet guaranteed to match.

## Completed or substantially built

### Public website and brand

- public site at `rowdyroom.site`
- royal-purple live-entertainment visual direction
- Watch Live, Discord/Rowdy Bunch, singer signup, Boost Points, live vote, and booking paths
- booking page and Google Calendar flow
- service coverage for karaoke, DJ, hosting, games, weddings, birthdays, corporate, school, and community events
- multiple page variants created during design iteration

### Karaoke operations

- singer signup and queue
- host login/logout and show controls
- drag/reorder and round handling
- current/next/upcoming display behavior
- live voting state
- anonymous 1-5 star voting
- iPhone/Safari fallback behavior
- score and performance records
- panel assignment and logging

### Companion App

- queue and position visibility
- voting
- performer and memory requests
- Rumble actions
- Boost Points actions
- mobile-first visual implementation

### Boost Points

- wallets, ledger, transactions, transfers, and action definitions
- TikFinity/webhook command support
- point-driven memories, line movement, highlights, and game actions

### Memories

- package definitions
- request/order workflow
- editing and delivery fields
- single-source order workflow

### Rumble

- Fire/Ice team model
- Rumble state, sessions, players, wheel, and buzzer
- strike, steal, and strike-steal normalization
- recovered full survey-game logic with rounds, multipliers, strikes, lifelines, knockouts, resurrects, timers, and Rowdy Rush
- latest operating decision: Rumble is activated and audience-shaped, never a fixed timed segment

### Mission Control

- compact live console v14
- queue, songbook, request, wheel, and buzzer integration
- system-check and operations APIs
- host dashboard simplification decision documented

### Project Engine

- registry and feature index
- architecture map and dependencies
- source scanner model
- health analysis
- schema snapshot/diff tooling
- duplicate detection
- broken-dependency detection
- fix plans and approval workflow scaffolding
- release readiness, risk acceptance, and rollback records
- version records

### Change tracking and rollback

Created outside the public web root:

- `/home/ef39cr6m1vih/rowdyroom_bible/`
- `/home/ef39cr6m1vih/rowdyroom_tools/`
- active system index
- contracts
- deployment and rollback logs
- change recorder and file backup tools

## Important current decisions

- Main 4 is authoritative; Main 2 wording is stale.
- Rumble is optional, host-activated, and driven by room energy.
- The live show uses a flexible run sheet.
- The host Rumble panel should remain minimal.
- Website explanations should rely on three one-minute videos instead of repetitive text sections.
- Booking stays separate from the primary live-room calls to action.
- No production patch is valid without Bible and rollback documentation.

## Current technical state

### GitHub

Repository: `rowdyroom/rowdyroom`

- admin access is working
- default branch: `main`
- application package name: `rowdyroom-enterprise-engine`
- Next.js 15, React 19, TypeScript
- workspaces for apps, packages, connectors, and agents
- recent commits added Mission Status, Show Mode, Live Links, Host Console, After-Show Recap, and Run Sheet
- Rumble wording was corrected to audience-shaped in the Run Sheet
- original README was still the generic GitHub profile template before this documentation branch

### Supabase

Authoritative active project:

- name: `Final`
- ref: `szubjgpvlqliyparrnam`
- status: `ACTIVE_HEALTHY`

Old project:

- ref: `dupwuopnpmdsprxxqsle`
- status: `INACTIVE`

The active project has extensive live-app and Project Engine tables. Before this consolidation, its manual contained only one short engine-overview section and no knowledge records.

### Production server

Known production files are under `/home/ef39cr6m1vih/public_html`. The production system is primarily PHP, HTML, CSS, and JavaScript, while GitHub contains a Next.js/TypeScript engine application. That split must be managed explicitly.

## Problems found

1. Documentation did not reflect the size or current behavior of the system.
2. GitHub and production server architectures are different and can drift.
3. Main 2 remains in older database documentation despite the Main 4 decision.
4. Multiple Rumble implementations exist.
5. Temporary scanners were placed in the public web root.
6. YouTube/SongFinder quota limits have interrupted live use.
7. Older artifacts may contain obsolete credentials or contact information.
8. The old Supabase project remains available as a source of accidental configuration drift.
9. Booking and membership variants are not clearly marked active versus legacy.
10. The server-side Bible could not be directly reconciled from this session.

## Work performed in this consolidation

- created a Git branch for rollback-safe documentation changes
- added a consolidated project Bible
- added this progress status
- prepared a reversible Supabase documentation sync
- corrected the documented Main 4 and Rumble operating rules
- recorded the authoritative Supabase project and old inactive project
- documented the production server map and current risks

## Next execution sequence

1. Merge the documentation pull request after review.
2. Reconcile the server-side Bible with the GitHub Bible.
3. Verify every active production route and remove temporary public tools.
4. synchronize production source into a version-controlled repository or deployment mirror.
5. integrate the canonical Rumble game.
6. audit API keys, quotas, RLS, and privileged backend functions.
7. verify booking identity, links, and monetization.
8. run a complete pre-show system check and save the result to the change log.
