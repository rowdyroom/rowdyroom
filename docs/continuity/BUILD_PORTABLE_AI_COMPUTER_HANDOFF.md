# Build Portable AI Computer — Verified Handoff

Date: 2026-07-21  
Repository: `rowdyroom/rowdyroom`  
Branch: `main`

## Mandatory startup

Before doing any work:

1. Read [`docs/ROWDY_ROOM_OPERATOR_LAW.md`](../ROWDY_ROOM_OPERATOR_LAW.md).
2. Read [`docs/continuity/START_HERE.md`](START_HERE.md).
3. Verify current GitHub and Supabase access.
4. Load the authoritative equipment inventory from Supabase table `rr_equipment_inventory`.
5. Mark missing or contradictory information **Recovery required** instead of guessing.

## Project objective

Design and build a portable AI computer for Rowdy Room operations using the equipment Roger already owns wherever practical. The system must support portable show operation, AI-assisted workflows, music and karaoke tools, and the existing Rowdy Room environment.

## Critical operating correction

Roger does **not** use OBS. Do not recommend, configure, document, or include OBS anywhere in this project. Use **TikTok Live Studio** where live-streaming software is relevant.

## Verified equipment source

The authoritative equipment record is the Supabase table:

- `rr_equipment_inventory`

It was successfully queried in the conversation immediately preceding this handoff. Before purchasing or recommending equipment, reload the table and compare the proposed design against current owned equipment.

Known correction requiring verification in the authoritative inventory:

- A Yamaha mixer entry appeared as `AG06MK`; prior project discussions identify the owned/intended model as **Yamaha AG06MK2**. Verify the physical unit and normalize the inventory only when confirmed.

## Known environment

Public-safe facts carried forward from verified project context:

- Rowdy Room uses TikTok Live Studio, not OBS.
- The user operates karaoke, DJ, live-event, and TikTok workflows.
- Existing equipment includes computers/tablets/phones, Yamaha audio hardware, microphones, speakers, displays, hubs, cables, stands, and related production equipment.
- Exact current quantities, models, and condition must come from `rr_equipment_inventory`, not this summary.
- A Windows bootstrap script exists for a local Rowdy Room/Songfinder environment and pulls the `main` branch of `rowdyroom/rowdyroom`.
- Local configuration may contain private API keys and must never be copied into GitHub, chat output, or public documents.

## Required first task in the new conversation

1. Confirm the Operator Law and START_HERE were read.
2. Verify GitHub access to `rowdyroom/rowdyroom`.
3. Query `rr_equipment_inventory`.
4. Produce a concise current-state equipment baseline relevant to the portable AI computer.
5. Identify only the genuinely missing hardware or information.
6. Continue the design from the verified baseline rather than restarting or asking Roger to repeat already-saved facts.

## Access expectations

- GitHub connector access to `rowdyroom/rowdyroom` was verified on 2026-07-21 with admin and push permissions.
- Supabase access was verified by a successful equipment inventory query in the preceding conversation.
- Local Windows actions require an available local connector or a generated script that Roger runs. Do not claim a local action occurred without evidence.

## Recovery gaps

The following remain **Recovery required** until verified through the breadcrumb system:

- authoritative Rowdy Room Bible location;
- authoritative Current State location;
- authoritative Changelog location;
- authoritative Runbook location;
- private continuity record keys and latest versions/hashes;
- latest local recovery package path and hash;
- final physical confirmation of the Yamaha mixer model.

## Next safe action

Open the new conversation, follow the mandatory startup, reload the Supabase equipment inventory, and begin the portable AI computer design using current owned equipment and TikTok Live Studio requirements.