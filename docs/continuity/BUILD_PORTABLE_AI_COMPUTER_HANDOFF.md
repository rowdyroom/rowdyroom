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

Convert Roger's current working main production PC into a portable Rowdy Room AI/show computer. Reuse its existing components, upgrade the graphics card, and move the build into a compatible portable case. The finished system must support portable show operation, AI-assisted workflows, music and karaoke tools, DJ work, TikTok Live Studio, and the existing Rowdy Room environment.

The donor computer is the owned working MSI/custom desktop with:

- AMD Ryzen 7 5700X
- MSI MAG B550 TOMAHAWK MAX WIFI (MS-7C91) motherboard
- 48 GB RAM
- NVIDIA GeForce RTX 3070 8 GB, to be replaced by the planned graphics-card upgrade
- about 2.27 TB total storage
- Windows 11 Pro

An older laptop is not part of the authoritative equipment inventory and is not part of this build plan.

## Critical operating correction

Roger does **not** use OBS. Do not recommend, configure, document, or include OBS anywhere in this project. Use **TikTok Live Studio** where live-streaming software is relevant.

The OBSBOT Tiny 2 Lite is normally Roger's personal home-streaming camera. The projector is primarily for live events. Do not assume the camera is part of a projector feed or reuse the superseded OBS-based projection and AV-package records.

## Verified continuity and equipment baseline

The continuity audit and protected inventory readback establish:

- The authoritative inventory has `66` lines and `91` physical units.
- `45` lines are user-confirmed and `7` are physically verified.
- `14` lines remain recovery-required.
- `61` lines have unknown operating condition.
- `3` lines are confirmed working and `2` need repair.
- The working donor computer is the Ryzen 7 5700X system with 48 GB RAM and an RTX 3070.
- Useful portable components include the ARZOPA A1S portable monitor, Anker 11-in-1 USB-C dock, UGREEN 200 W charger, Yamaha USB mixer/interface, Elgato Stream Deck, and other owned show equipment, subject to their recorded operating status.

Before purchasing or recommending the graphics card or portable case, reload the inventory and verify compatibility with the donor system.

## Confirmed continuity locations

- Project Bible: `docs/ROWDY_ROOM_BIBLE.md` on `main`.
- Current State: `docs/continuity/CURRENT_STATE.md` on `agent/rowdy-room-continuity` until draft pull request #28 is merged.
- Equipment Inventory: `docs/continuity/EQUIPMENT_INVENTORY.md` on the continuity branch; private authority is `public.rr_equipment_inventory`.
- Continuity Changelog: `docs/continuity/CHANGELOG.md` on the continuity branch.
- Continuity Runbook: `docs/continuity/CONTINUITY_RUNBOOK.md` on the continuity branch.
- Protected record keys and recovery evidence are listed in `docs/continuity/START_HERE.md`.

## Recovery required

- Exact replacement graphics-card model.
- Exact portable-case model and desired size/weight/transport configuration.
- Donor-system PSU model, wattage, dimensions, and available GPU power connectors.
- CPU-cooler model and height, current GPU dimensions, drive layout, and other physical fit constraints.
- Physical confirmation of Yamaha `AG06MK` versus `AG06MK2`.
- Fourteen partially identified inventory lines.
- Sixty-one operating-condition tests.
- Original Rowdy Room Progress conversation export.
- Reconciliation of the private server-side `rowdyroom_bible` directory.
- Exact live-event projector source, content, and signal path.

## Exact next product action

Document the donor PC's PSU, CPU cooler, current GPU dimensions, drive layout, and internal clearances, plus Roger's target case size, weight, and transport needs. Use those constraints to select the graphics-card upgrade and a compatible portable case. Do not purchase either part until power, cooling, dimensions, and connector compatibility are verified.
