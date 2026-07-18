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


