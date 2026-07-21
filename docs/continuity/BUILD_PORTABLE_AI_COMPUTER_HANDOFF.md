# Build Portable AI Computer — Verified Handoff

Date: 2026-07-21  
Repository: `rowdyroom/rowdyroom`  
Branch: `main`

## Mandatory startup

Before doing any work:

1. Read [`docs/ROWDY_ROOM_OPERATOR_LAW.md`](../ROWDY_ROOM_OPERATOR_LAW.md).
2. Read [`docs/continuity/START_HERE.md`](START_HERE.md).
3. Verify current GitHub and Supabase access.
4. Load the authoritative equipment inventory from `public.rr_equipment_inventory`.
5. Mark missing or contradictory information **Recovery required** instead of guessing.

## Project objective

Design and build a portable AI computer for Rowdy Room operations using equipment Roger already owns wherever practical. The system must support portable show operation, AI-assisted workflows, music and karaoke tools, TikTok Live Studio, and the existing Rowdy Room environment.

## Critical operating correction

Roger does **not** use OBS. Do not recommend, configure, document, or include OBS anywhere in this project. Use **TikTok Live Studio** where live-streaming software is relevant.

The OBSBOT Tiny 2 Lite is normally Roger's personal home-streaming camera. The projector is primarily for live events. Do not assume the camera is part of a projector feed or reuse the superseded OBS-based projection and AV-package records.

## Verified continuity and equipment baseline

The continuity audit and protected inventory readback establish:

- Supabase `rowdy-room/current-state` was version `22` at the start of the 2026-07-21 reconciliation.
- The authoritative inventory has `66` lines and `91` physical units.
- `45` lines are user-confirmed and `7` are physically verified.
- `14` lines remain recovery-required.
- `61` lines have unknown operating condition.
- `3` lines are confirmed working and `2` need repair.
- The working Windows desktop is a Ryzen 7 5700X system with 48 GB RAM and an RTX 3070.
- Useful portable components include the Anker 11-in-1 USB-C dock, ARZOPA A1S portable monitor, UGREEN 200 W charger, Belkin 20,000 mAh power bank, Yamaha USB mixer/interface, Elgato Stream Deck, and OBSBOT Tiny 2 Lite, but their operating condition is not yet confirmed unless stated otherwise in the inventory.
- No verified portable Windows laptop or mini-PC capable of replacing the desktop is currently present in the authoritative inventory.

Before purchasing or recommending equipment, reload the inventory and compare the proposed design against current owned equipment.

## Confirmed continuity locations

- Project Bible: `docs/ROWDY_ROOM_BIBLE.md` on `main`.
- Current State: `docs/continuity/CURRENT_STATE.md` on `agent/rowdy-room-continuity` until draft pull request #28 is merged.
- Equipment Inventory: `docs/continuity/EQUIPMENT_INVENTORY.md` on the continuity branch; private authority is `public.rr_equipment_inventory`.
- Continuity Changelog: `docs/continuity/CHANGELOG.md` on the continuity branch.
- Continuity Runbook: `docs/continuity/CONTINUITY_RUNBOOK.md` on the continuity branch.
- Protected record keys and recovery evidence are listed in `docs/continuity/START_HERE.md`.

## Recovery required

- Physical confirmation of Yamaha `AG06MK` versus `AG06MK2`.
- Exact identity, specifications, and working condition of the older laptop discussed previously.
- Exact identity, specifications, and working condition of the smaller desktop discussed previously.
- Fourteen partially identified inventory lines.
- Sixty-one operating-condition tests.
- Original Rowdy Room Progress conversation export.
- Reconciliation of the private server-side `rowdyroom_bible` directory.
- Exact live-event projector source, content, and signal path after removal of the OBS assumption.
- Review or merge of draft pull request #28 after its conflict state is reconciled.

## Exact next product action

Locate the older laptop and smaller desktop, record their manufacturer/model, CPU, RAM, storage, ports, Windows version, power requirements, and working condition, and test whether each can run TikTok Live Studio plus the required karaoke/DJ/AI tools. Do not buy a replacement computer until that comparison is complete.
