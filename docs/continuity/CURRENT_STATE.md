# Rowdy Room Current State

**Status:** Active handoff record  
**Last updated:** 2026-07-20  
**Owner:** Roger Jamsek

Read this file after the Operator Law, `docs/continuity/START_HERE.md`, and the Project Bible. It summarizes what is known, what is protected, and what still requires recovery. It is public-safe and intentionally excludes secrets and private infrastructure details.

## Product and show context

Rowdy Room is a live karaoke, audience-participation, competition, community, and local entertainment system. Its documented operating surfaces include:

- the public website
- Mission Control
- the Companion App
- live karaoke signup, queue, scoring, and voting
- Main 4
- Boost Points
- Rowdy Room Rumble
- digital karaoke memories
- the Project Engine
- DJ, karaoke, hosting, and interactive event booking

The detailed product decisions, production map, architecture, and known risks remain in `docs/ROWDY_ROOM_BIBLE.md`.

## Authoritative Main 4 formula

The eight panel spots are divided into four protected Main 4 positions and four regular rotation positions.

- Before a Rumble changes the incumbents, the protected order is the two best live-vote averages followed by the two largest gift contributors.
- The remaining eligible people rotate through the other four spots in signup order, four at a time.
- Each panel cycle keeps or reinserts the same Main 4 and advances to the next four regular queue members.
- After an activated Rumble is challenged and completed, the four protected positions are assigned by game score from highest through fourth-highest.
- The Rumble winners have a guaranteed 30-minute protection window during which another Rumble cannot be activated.
- At the end of exactly 30 minutes, the protected spots automatically return to the original live-standing formula using the current top two live-vote averages followed by the current top two gift contributors.
- A Rumble winner remains protected after the guarantee only by qualifying under that recalculated live-standing formula.
- The regular four-person rotation resumes where it stopped before the Rumble and keeps its saved signup-order position through the 30-minute handoff.
- One centralized authority applies every position change to the Companion App, host-control dashboards, public displays, and database.

The detailed formula and example are maintained in section 5.3 of `docs/ROWDY_ROOM_BIBLE.md`.

Central edge rules are now fixed: score qualifiers are selected first, gift qualifiers skip anyone already in a score spot, score ties break by vote count then signup order, gift ties break by gift count then signup order, and a Rumble requires four distinct final results. An unfilled live-score or gift category remains visibly open rather than borrowing a different rule. The Rumble winners' 30-minute clock begins only when the host finalizes the game results.

## Main 4 implementation state

As of 2026-07-18, the public-safe implementation and the production database authority are verified:

- Mission Control renders all eight authoritative positions and the Rumble protection countdown
- host controls cover show start, live-leader refresh, the next regular four, Rumble activation, score finalization, and cancellation
- Rumble finalization accepts every player's score and orders the protected four from highest through fourth-highest
- versioned Companion, Mission Control, and Rumble adapters are implemented and syntax-checked
- contract tests, TypeScript checks, and a production Next.js build pass
- the live Supabase rotation engine is installed and its rollback-only production smoke test passes
- live readback confirms eight active panel assignments, a clean live state, no retained smoke-test rows, service-only mutations, and read-only public status access
- the engine-specific missing-index advisory was corrected and rechecked
- a pre-deployment server backup was created before any live-surface file work
- the versioned Companion, Mission Control, and Rumble bundles were uploaded to their server asset folders
- the existing live scripts now activate the versioned bundles, with duplicate-safe page fallbacks for clients holding an older cached app script
- live status-only smoke checks confirm exactly one Main 4 bundle per surface, eight ordered positions per mounted view, the Mission Control host actions, the Rumble score container and host actions, and no browser warnings or errors
- the live Rumble bridge was advanced to v3 after the unlock test exposed a dashboard-redraw issue; v3 remounts the Main 4 panel without double-wrapping game functions or starting a second panel-status poller
- the unlocked Rumble dashboard retained one Main 4 panel, one score container, four host actions, eight ordered positions, and the connected host status
- the normal dashboard logout returned to the host-login screen and live database readback confirmed the session token, lock owner, and heartbeat were cleared
- the verified public-safe v2 adapter, three live-surface integrations, logout handoff migration, and live verification record are saved on draft pull request #28, with GitHub readback matched to the local sources

The production database authority and the three current live surfaces are active and live-smoke verified, including Rumble host unlock, post-unlock panel persistence, logout, and database lock release. No production Rumble was activated or finalized during the smoke test. No public-display domain was created; that remains subject to the separate domain-creation approval rule.

The full private migration and security details are intentionally excluded from this public repository and retained in the protected local recovery package.

## Continuity controls

As of 2026-07-20:

- the Operator Law now requires a full Law read before the first action after every prompt, a Law check after every action, and a final Law audit immediately before responding
- `docs/continuity/START_HERE.md` is the public-safe root breadcrumb map for authoritative files, private record identifiers, recovery copies, known gaps, and next actions
- the Project Bible remains the public-safe master narrative
- this file is the required current-state handoff
- a dedicated public-safe equipment recovery file exists
- a dated continuity changelog exists
- repository-wide agent instructions require these records to be loaded before Rowdy Room work
- private structured records, equipment details, save checks, and history are maintained outside the public repository
- chats are explicitly classified as temporary context rather than permanent records
- the protected Supabase equipment inventory is the private source of truth, with forced row-level security, item-version history, and nightly snapshots
- `Rowdy_Room_Equipment_Inventory_Master.xlsx` is the editable intake copy; workbook rows become authoritative only after Supabase save and readback
- Roger's 2026-07-19 equipment text batch is preserved privately as `rowdy-room/equipment-pending-intake-2026-07-19` and in a dated private recovery package, but remains unprocessed with zero authoritative inventory rows while pictures and additional items are pending
- every material equipment change requires a public-safe summary check, structured private save, history verification, continuity checks, and a dated local recovery copy

## Recovery required

The following information has not been recovered and must not be guessed:

1. The exact physical equipment inventory, including manufacturer and model.
2. The original Rowdy Room Progress conversation.
3. Any decisions or equipment facts present only in the private server-side Bible records.

Recovery sources, in priority order:

1. an export of the original Rowdy Room Progress conversation
2. the private server-side Bible directory
3. Roger's item-by-item physical confirmation

## Required startup behavior

Before answering a Rowdy Room setup, equipment, show, production, or architecture question:

1. read the entire Operator Law before the first substantive action
2. open `docs/continuity/START_HERE.md` and follow the applicable breadcrumbs
3. load the Project Bible
4. load this Current State file
5. load the equipment record when equipment affects the answer
6. check the latest continuity changelog
7. read the continuity runbook before a material change
8. identify any unresolved recovery gap instead of filling it from assumption
9. after every action, compare the actual result with the Operator Law and correct any missed requirement that can be corrected safely
10. read the Operator Law again and complete the final audit immediately before responding

## Next recovery milestone

Recover and verify the physical equipment inventory. Each item must have a source or Roger's confirmation before it is treated as authoritative.



