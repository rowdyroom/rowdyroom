# Rowdy Room Current State

**Status:** Active handoff record  
**Last updated:** 2026-07-18  
**Owner:** Roger Jamsek

This is the first file to read after the Project Bible. It summarizes what is known, what is protected, and what still requires recovery. It is public-safe and intentionally excludes secrets and private infrastructure details.

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

As of 2026-07-18, the public-safe implementation is prepared and locally verified:

- Mission Control renders all eight authoritative positions and the Rumble protection countdown
- host controls cover show start, live-leader refresh, the next regular four, Rumble activation, score finalization, and cancellation
- Rumble finalization accepts every player's score and orders the protected four from highest through fourth-highest
- a reusable browser adapter is prepared for the Companion App, host dashboard, Rumble game, and public display
- contract tests, TypeScript checks, and a production Next.js build pass

The live Supabase installation has not been applied. Supabase's production safeguard requires Roger's explicit approval because the installation changes schema, access permissions, automatic triggers, the scheduled expiry check, and Realtime publication. No production database state changed during the rejected attempt.

The full private migration and security details are intentionally excluded from this public repository and retained in the protected local recovery package.

## Continuity controls

As of 2026-07-18:

- the Project Bible remains the public-safe master narrative
- this file is the required current-state handoff
- a dedicated public-safe equipment recovery file exists
- a dated continuity changelog exists
- repository-wide agent instructions require these records to be loaded before Rowdy Room work
- private structured records, equipment details, save checks, and history are maintained outside the public repository
- chats are explicitly classified as temporary context rather than permanent records

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

1. load the Project Bible
2. load this Current State file
3. load the equipment record when equipment affects the answer
4. check the latest continuity changelog
5. identify any unresolved recovery gap instead of filling it from assumption

## Next recovery milestone

Recover and verify the physical equipment inventory. Each item must have a source or Roger's confirmation before it is treated as authoritative.



