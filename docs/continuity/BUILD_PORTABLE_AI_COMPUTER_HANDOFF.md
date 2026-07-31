# Build Portable AI Computer — Verified Handoff

Date: 2026-07-30  
Repository: `rowdyroom/rowdyroom`  
Branch: `main`

## 2026-07-30 operational update

Roger confirmed that he fixed the CPU cooler, the computer is operational, and current temperatures observed in Radiograph look good. This closes the prior cooler-failure blocker at the system level. Exact readings and representative show, TikTok Live Studio, local-AI, stability, and extended thermal tests remain **Recovery required**. The currently installed case, GPU, exact cooler model, drive layout, fan plan, and RM1200x SHIFT clearance were not confirmed by this update.

## Mandatory startup

Before doing any work:

1. Read [`docs/ROWDY_ROOM_OPERATOR_LAW.md`](../ROWDY_ROOM_OPERATOR_LAW.md).
2. Read [`docs/continuity/START_HERE.md`](START_HERE.md).
3. Verify current GitHub and Supabase access.
4. Load the authoritative equipment inventory from `public.rr_equipment_inventory`.
5. Mark missing or contradictory information **Recovery required** instead of guessing.

## Project objective

Convert Roger's current working main production PC into a portable Rowdy Room AI/show computer. Reuse its existing compatible components, install the purchased graphics card, and move the build into the purchased portable case. The finished system must support portable show operation, AI-assisted workflows, music and karaoke tools, DJ work, TikTok Live Studio, and the existing Rowdy Room environment.

Current decisions:

- Retain the AMD Ryzen 7 5700X.
- Retain the MSI MAG B550 TOMAHAWK MAX WIFI (MS-7C91) motherboard unless a later verified requirement proves it inadequate.
- Retain the current 48 GB RAM initially.
- Replace the installed NVIDIA GeForce RTX 3070 8 GB with the purchased ASUS Dual GeForce RTX 5060 Ti OC Edition 16GB GDDR7 (DUAL-RTX5060TI-O16G) after delivery and testing.
- Move the system into the purchased Cooler Master QUBE 540 after physical fit checks.
- Reuse the user-confirmed Corsair RM1200x SHIFT 1200 W PSU if its side-cable clearance is verified in the QUBE 540.

An older laptop is not part of the authoritative equipment inventory and is not part of this build plan.
## Critical operating correction

Roger does **not** use OBS. Do not recommend, configure, document, or include OBS anywhere in this project. Use **TikTok Live Studio** where live-streaming software is relevant.

The OBSBOT Tiny 2 Lite is normally Roger's personal home-streaming camera. The projector is primarily for live events. Do not assume the camera is part of a projector feed or reuse the superseded OBS-based projection and AV-package records.

## Verified continuity and equipment baseline

The protected inventory readback on 2026-07-21 establishes:

- The authoritative inventory has `68` lines and `93` physical units.
- `47` lines are user-confirmed and `7` are physically verified.
- `14` lines remain recovery-required.
- `63` lines have unknown operating condition.
- `3` lines are confirmed working and `2` need repair.
- The working donor computer remains the Ryzen 7 5700X system with 48 GB RAM and the currently installed RTX 3070.
- Roger confirmed purchase of the Cooler Master QUBE 540 and ASUS Dual RTX 5060 Ti 16GB. They are recorded as owned but not yet received, physically inspected, installed, or tested.
- No replacement motherboard is currently planned.
- Useful portable components include the ARZOPA A1S portable monitor, Anker 11-in-1 USB-C dock, UGREEN 200 W charger, Yamaha USB mixer/interface, Elgato Stream Deck, and other owned show equipment, subject to their recorded operating status.

No further purchase should be recommended until the remaining physical fit and cooling details are confirmed.
## Confirmed continuity locations

- Project Bible: `docs/ROWDY_ROOM_BIBLE.md` on `main`.
- Current State: `docs/continuity/CURRENT_STATE.md` on `main`.
- Equipment Inventory: `docs/continuity/EQUIPMENT_INVENTORY.md` on `main`; private authority is `public.rr_equipment_inventory`.
- Continuity Changelog: `docs/continuity/CHANGELOG.md` on `main`.
- Continuity Runbook: `docs/continuity/CONTINUITY_RUNBOOK.md` on `main`.
- Protected record keys and recovery evidence are listed in `docs/continuity/START_HERE.md`.

## Recovery required

- Receipt and physical verification of the purchased Cooler Master QUBE 540 and ASUS Dual RTX 5060 Ti 16GB.
- Exact installed CPU-cooler model; the cooler is fixed and the computer is operational by Roger confirmation.
- Current drive layout and desired drive retention.
- Currently installed case and GPU.
- QUBE 540 clearance for the RM1200x SHIFT side-mounted cables.
- Required case-fan plan and post-build temperature targets.
- Exact Radiograph readings and representative GPU, display-output, TikTok Live Studio, local-AI workload, stability, and extended temperature tests.
- Physical confirmation of Yamaha `AG06MK` versus `AG06MK2`.
- Fourteen partially identified inventory lines.
- Sixty-three operating-condition tests.
- Original Rowdy Room Progress conversation export.
- Reconciliation of the private server-side `rowdyroom_bible` directory.
- Exact live-event projector source, content, and signal path.
## Exact next product action

Confirm the currently installed case, GPU, CPU-cooler model, drive layout, fan plan, and RM1200x SHIFT clearance. Then record exact Radiograph readings during representative show, TikTok Live Studio, and local-AI workloads before closing the build. Do not infer component installation from the system-level operational report.
