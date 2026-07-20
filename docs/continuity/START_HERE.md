# Rowdy Room — Start Here

**Status:** Active public-safe breadcrumb root  
**Last updated:** 2026-07-20  
**Owner:** Roger Jamsek

Start every Rowdy Room task here after reading the complete Operator Law. This map is public-safe. It contains no credentials, private equipment details, customer information, serial numbers, private task identifiers, or protected server data.

## Mandatory read order

1. [Operator Law](../ROWDY_ROOM_OPERATOR_LAW.md) — read first after every prompt or continuation and reread immediately before the final response.
2. [Project Bible](../ROWDY_ROOM_BIBLE.md) — public-safe product and system truth.
3. [Current State](CURRENT_STATE.md) — latest verified handoff and recovery gaps.
4. [Equipment Inventory](EQUIPMENT_INVENTORY.md) — public-safe equipment summary and private/public truth hierarchy.
5. [Continuity Changelog](CHANGELOG.md) — newest durable decisions and changes.
6. [Continuity Runbook](CONTINUITY_RUNBOOK.md) — required save, verification, privacy, breadcrumb, and recovery procedure.
7. Applicable files under `docs/bible/` — specialized standing laws and verified repair records.

## Current GitHub authority map

Repository: `rowdyroom/rowdyroom`

- `docs/ROWDY_ROOM_OPERATOR_LAW.md` is on `main`; mandatory Law gate commit: `86bab5f0299d0aa4502e2270968e9a560ca2707f`.
- `docs/ROWDY_ROOM_BIBLE.md` is on `main`; Law and breadcrumb source-rule commit: `ffb517a8c95f8dbc99b3e4c5c2623b1b265969c9`.
- The continuity files and repository-wide `AGENTS.md` are on `agent/rowdy-room-continuity`, represented by draft pull request #28. They are **not merged into `main`**.
- Law-aware repository instructions commit: `e35f4f7e4ba996219b74b448e1530fe4561cf688`.
- Law-aware runbook commit: `189a285f333bce6584b729c45df66e4b6c81d4de`.
- Processed equipment public-safe inventory commit: `6d278739bff4d3d61542a080862f5e886eec5dad`.
- Current State commit recording processed equipment counts: `0268650e3c8d34f78a9632950d7fc156a8d6a563`.
- Continuity Changelog commit recording processed equipment: `8d37a0cc2c4cc38c3f255e3057e054fac58ea833`.
- Branch Operator Law sync commit: `af12d4a1fdd1335514f387cb89c614f3582eb372`.
- Branch Project Bible sync commit: `10503f6d42fa87c87585796de1ac7a6f77bc8cc6`.

Always verify the current branch head and file contents before changing them. A draft-branch record must never be described as merged.

## Private truth-store map

Authoritative project: Supabase `Final`, ref `szubjgpvlqliyparrnam`.

- `public.rr_continuity_records` — current structured continuity records and content hashes.
- `public.rr_continuity_history` — prior continuity versions.
- `public.rr_continuity_checks` — pass, warning, and failure evidence.
- `public.rr_equipment_inventory` — authoritative private equipment inventory.
- `public.rr_equipment_history` — equipment version history.
- Primary record keys: `rowdy-room/current-state`, `rowdy-room/continuity-protocol`, `rowdy-room/equipment-recovery`, `rowdy-room/equipment-pending-intake-2026-07-19`, and `rowdy-room/law-and-breadcrumb-protocol`.

Do not copy protected content into this public map. Use safe record keys, versions, hashes, and check identifiers only.

Verified 2026-07-20 private record snapshot:

- `rowdy-room/law-and-breadcrumb-protocol`: version `1`, SHA-256 `1e2de42998ee451cb94b1b8c02ffe9513eb83642bcde59df7c975c29000e5602`
- `rowdy-room/continuity-protocol`: version `4`, SHA-256 `f7e29562aff5f07bbaa30e57197bf46bab8ee48d8fc95a34fac802f20913811c`
- `rowdy-room/current-state`: version `16`, SHA-256 `529ba2cd4ec3b99f76c63c1fb879aac991396d435524a8d6761ff55d7d8092d1`
- `rowdy-room/equipment-recovery`: version `7`, SHA-256 `274e4e5c37072a8fb1434314d0db76606e776ad9d24e9131b45ffebfb150d2a9`
- `rowdy-room/equipment-pending-intake-2026-07-19`: version `4`, SHA-256 `e001020d27dfaed9602ff7170f1b12f4632b4f5c103491e4c715b5dead9d7299`
- History entries `72`, `73`, and `74` verify the three processed-intake updates.

## Authoritative equipment snapshot

Roger authorized processing of the current text and photo batch on 2026-07-20.

- Inventory lines: `65`
- Physical units: `89`
- User-confirmed lines: `45`
- Physically verified photo lines: `6`
- Recovery-required photo lines: `14`
- Working lines: `3`
- Needs-repair lines: `2`
- Operating status not yet confirmed: `60`
- Aggregate inventory SHA-256: `94259543098240bded10666857748f708f11cff120361a9533afb4211e232cfa`
- Equipment history: `65` inserts and `1` audited quantity correction
- Retry-safe second synchronization: no additional history rows

Public GitHub stores only this safe summary. Names, private source evidence, condition notes, and any identifiers remain in the private truth system and recovery package.

## Local recovery map

Material changes create dated recovery material under the approved Codex workspace, with SHA-256 evidence recorded in private continuity checks.

Processed equipment recovery:

- `Rowdy_Room_Equipment_Processed_2026-07-20_PRIVATE.zip`
- bytes: `84250`
- entries: `12`
- SHA-256: `a327707613bda964db12fac5edef664e9fb2d689216428b20b064be44844f787`
- internal hashes: `11/11` passed
- includes the normalized private JSON and CSV, master workbook, readbacks, manifests, and source-evidence pointers
- raw photos are not duplicated; they remain in the separate private raw-photo archive

Private raw-photo recovery:

- `Rowdy_Room_Equipment_Pending_Intake_2026-07-20_PRIVATE_v3.zip`
- bytes: `33004908`
- entries: `25`
- photos: `20`
- SHA-256: `344672ceeddd27db89752a78e2e4f6ebb73987d9d8293052391d16b7cd6d9c25`
- content hashes: `24/24` passed

Private master workbook:

- `Rowdy_Room_Equipment_Inventory_Master.xlsx`
- sheets: `4`
- SHA-256: `e72db523d216118d1b1763e4942fcc6a52b1ebf234f60e4a6cea70ec86820dd5`
- formula errors: `0`
- all sheets rendered; inventory top and bottom visually checked

Processed-equipment continuity checks:

- run: `bdef7c7d-cccc-4fdb-a632-039a7b72535e`
- check `71`: authoritative Supabase inventory/readback — pass
- check `72`: continuity record history readback — pass
- check `73`: workbook formula and visual QA — pass
- check `74`: public-safe GitHub readback and privacy check — pass
- check `75`: processed local recovery archive readback — pass
- check `76`: branch is not merged to `main` — warning

## Current recovery-required facts

- Fourteen photo-derived inventory lines still need exact identification or additional evidence.
- Sixty inventory lines still need an operating-status test or confirmation.
- The original Rowdy Room Progress conversation has not been recovered as a durable export.
- The private server-side Bible directory has not been fully reconciled with GitHub and Supabase.
- Draft pull request #28 still needs review or merge before its continuity files exist on `main`.
- Future equipment additions are allowed and must be appended through the same private inventory, history, workbook, recovery, and breadcrumb procedure.

## Breadcrumb required after every material change

Record:

1. what changed and why
2. the public-safe path, branch, and commit
3. safe private record keys, versions, and content hashes
4. continuity-check run identifiers and status
5. the dated local recovery path, SHA-256, and contents summary
6. remaining `Recovery required` facts
7. the exact next safe action

Before completion, verify that a future task can begin with this file, find the authoritative truth, distinguish live from draft and private from public, and recover without depending on chat history.
