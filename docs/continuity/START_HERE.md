# Rowdy Room — Start Here

**Status:** Active public-safe breadcrumb root  
**Last updated:** 2026-07-20  
**Owner:** Roger Jamsek

Start every Rowdy Room task here after reading the complete Operator Law. This map is public-safe. It contains no credentials, private equipment details, customer information, serial numbers, private task identifiers, or protected server data.

## Mandatory read order

1. [Operator Law](../ROWDY_ROOM_OPERATOR_LAW.md) — read first after every prompt or continuation and reread immediately before the final response.
2. [Project Bible](../ROWDY_ROOM_BIBLE.md) — public-safe product and system truth.
3. [Current State](CURRENT_STATE.md) — latest verified handoff and recovery gaps.
4. [Equipment Inventory](EQUIPMENT_INVENTORY.md) — equipment status and private/public truth hierarchy when physical gear matters.
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
- Current State commit including private pending-intake breadcrumb: `56be1119239cd5d3cafbcd0d02e2adcb4ad6d9ed`.
- Equipment public-safe pending-intake summary commit: `577a1b499fd62f7c735289574395c7149f56d6f0`.
- Changelog commit including pending-intake preservation: `ee8125c4ad57b7aa41cf7c25f0f50321cf30e091`.
- Branch Operator Law sync commit: `af12d4a1fdd1335514f387cb89c614f3582eb372`.
- Branch Project Bible sync commit: `10503f6d42fa87c87585796de1ac7a6f77bc8cc6`.

Always verify the current branch head and file contents before changing them. A draft-branch record must never be described as merged.

## Private truth-store map

Authoritative project: Supabase `Final`, ref `szubjgpvlqliyparrnam`.

- `public.rr_continuity_records` — current structured continuity records and content hashes.
- `public.rr_continuity_history` — prior continuity versions when present.
- `public.rr_continuity_checks` — pass, warning, and failure evidence.
- `public.rr_equipment_inventory` — authoritative private equipment list.
- `public.rr_equipment_history` — equipment version history.
- Primary record keys: `rowdy-room/current-state`, `rowdy-room/continuity-protocol`, `rowdy-room/equipment-recovery`, and `rowdy-room/law-and-breadcrumb-protocol`.

Do not copy protected content into this public map. Use safe record keys, versions, hashes, and check identifiers only.

Verified 2026-07-20 private record snapshot:

- `rowdy-room/law-and-breadcrumb-protocol`: version `1`, SHA-256 `1e2de42998ee451cb94b1b8c02ffe9513eb83642bcde59df7c975c29000e5602`
- `rowdy-room/continuity-protocol`: version `4`, SHA-256 `f7e29562aff5f07bbaa30e57197bf46bab8ee48d8fc95a34fac802f20913811c`
- `rowdy-room/current-state`: version `13`, SHA-256 `0a861e065606385fae4f4fe33a7d7228a807ef9f1a6c8de555e6e6aae62f27e3`
- `rowdy-room/equipment-recovery`: version `4`, SHA-256 `3662015d8e4380fb3a2403e7f1e530fe02c878b5560d29f488c15350c5fcec14`
- `rowdy-room/equipment-pending-intake-2026-07-19`: version `1`, SHA-256 `e3e4794fb4f7b2ad2afa118aa1de3f912fd7eeef680d6486a0dc04e88770f11e`
- History readback: pass for the Law records and pending-intake preservation

## Local recovery map

A material change must create a dated recovery directory or package under the approved Codex workspace and record its SHA-256 hash in the private continuity checks.

Existing equipment truth-system recovery package:

- `Rowdy_Room_Equipment_Truth_System_2026-07-19.zip`
- SHA-256: `58b07e0500e764c6634be6161006f7cafebba5c911b346b1a4718b6d2ea06311`
- Status: pass
- Verified equipment rows at that snapshot: 0

2026-07-20 Law and breadcrumb recovery package:

- `Rowdy_Room_Law_And_Breadcrumb_2026-07-20.zip`
- bytes: `34937`
- entries: `13`
- SHA-256: `c2cec656e6fa8ccdd27b3c1f74ed2c53805e4e1da810e134dc8c335347d359f7`
- per-file hash manifest: included
- continuity-check run: `1af02b8d-3293-4be6-b16c-6356d884b4b6`

Private pending equipment intake recovery:

- `Rowdy_Room_Equipment_Pending_Intake_2026-07-20_PRIVATE.zip`
- bytes: `5687`
- entries: `3`
- ZIP SHA-256: `0f3a3e42b5350d38439cca4a94f93b0a20b356b4ed6d8ba9f273226c293f7d86`
- raw-file SHA-256: `bcefdbccfbc0840cb4dcbc8c0362e01bde5ae297fcb16b18202ba86ebce580f7`
- privacy: protected local/private record only; not for GitHub publication
- inventory rows after preservation: `0`
- GitHub main save check `53`: pass
- continuity branch check `54`: warning because draft pull request #28 is not merged
- Supabase readback/history check `55`: pass
- local enforcement/recovery check `56`: pass

Pending-intake preservation checks:

- continuity-check run: `28bc7d13-8f99-4b62-8b22-d1985efb1da6`
- Supabase raw preservation/history check `58`: pass
- private local recovery check `59`: pass
- public-safe GitHub breadcrumb check `60`: pass

## Current recovery-required facts

- Roger's raw equipment text batch is now preserved in protected record `rowdy-room/equipment-pending-intake-2026-07-19` and a private local recovery package, but it remains deliberately unprocessed. The authoritative equipment table still contains zero items while pictures and additional items are pending.
- The original Rowdy Room Progress conversation has not been recovered as a durable export.
- The private server-side Bible directory has not been fully reconciled with GitHub and Supabase.
- Draft pull request #28 still needs review or merge before its continuity files exist on `main`.

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
