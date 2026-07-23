# Rowdy Room Current State

**Status:** Active public-safe handoff record  
**Last updated:** 2026-07-23  
**Owner:** Roger Jamsek

Read this after the complete Operator Law, `docs/continuity/START_HERE.md`, and the Project Bible. Missing or contradictory facts remain **Recovery required**.

## Active project continuation

The current product continuation is **Build Portable AI Computer**.

- Donor system: Roger's current working main production PC.
- Current donor baseline: Ryzen 7 5700X, MSI MAG B550 TOMAHAWK MAX WIFI, 48 GB RAM, RTX 3070, about 2.27 TB storage, Windows 11 Pro.
- Roger confirmed purchase of the Cooler Master QUBE 540 and ASUS Dual GeForce RTX 5060 Ti OC Edition 16GB GDDR7 (DUAL-RTX5060TI-O16G).
- The purchased parts are recorded as owned but not yet received, physically inspected, installed, or tested.
- The RTX 3070 remains the installed working GPU until the new card is installed and verified.
- Retain the MSI motherboard and 48 GB RAM initially. A replacement motherboard is not currently planned.
- The existing Corsair RM1200x SHIFT 1200 W PSU is user-confirmed; QUBE 540 side-cable clearance remains to be verified.
- Required workloads: karaoke, DJ work, AI workflows, local video-generation work, Rowdy Room tools, and TikTok Live Studio.
- Roger does **not** use OBS. OBS must not be included in this project.
- The OBSBOT Tiny 2 Lite is normally Roger's personal home-streaming camera.
- The projector is primarily for live events.
- The prior OBS-based projection path and approximately $500 AV-package plan are superseded and must not drive architecture or purchasing.
- The exact live-event projector source, content, and routing remain **Recovery required**.
- An older laptop is not part of the authoritative inventory and is not part of this build plan.
## Assistant Foundry product requirement

- The portable assistant system requires a **conversation-first Assistant Workspace** for daily use and a separate **Guided Builder** application for creating and improving assistants.
- The Workspace should retain the practical feel of ChatGPT/Codex: conversations, project/file context, assistant switching, concise task/status visibility, optional pet presentation, and clear approval gates.
- The Builder must guide Roger with buttons, suggestions, examples, progress, and one obvious next step through purpose, personality, context, permissions, workflows, tests, and approval/package creation.
- The first implementation target is a functional guided prototype that uses the existing portable records. A pixel-perfect ChatGPT clone is not the target.
- Main Assistant, Jessica, and Gwen remain separate assistant packages; neither UI activates a draft or grants permissions by itself.
- Exact UI technology, local model/runtime, voice behavior, connector set, performance, and hardware capability remain **Recovery required** until the portable AI PC is installed and a prototype is evaluated.


## Assistant Foundry learning and creation law

- The active law is [Assistant Foundry Learning and Creation Law](ASSISTANT_FOUNDRY_LEARNING_LAW.md).
- Material Assistant Foundry decisions, prompts/workflows, tests, outputs, failures, corrections, context/permission changes, and portability findings must be captured with a source surface and evidence.
- The system must not claim that ChatGPT, Codex, or OpenAI work was imported automatically without a verified adapter. Outside work is added through **Capture to Foundry**, import, or an approved export.
- The first Guided Builder prototype uses a browser-local Learning Ledger. A connected durable ledger and outside-platform adapters remain **Recovery required**.
- Protected readback: `rowdy-room/assistant-foundry-learning-law` v1 / history 167 / SHA-256 `f9d1369a131d5f1e885f2c826c9db1043a377aa8cc790280603792927ec54eb8`; `rowdy-room/portable-assistant-foundation` v4 / history 168 / SHA-256 `77ff5476182cbd02491138d5c947ffb7f026580eef9fecd4a30074c4d31c00b1`; `rowdy-room/assistant-foundry-guided-builder-prototype` v1 / history 169 / SHA-256 `8f3936a707d4ad777c2a1f000d8d8720dd644be5e83b7346630bef72e1be8e17`.
- Guided Builder version 1 is deployed with custom owner-only access and verified terminal success. Its URL is private and held only in the protected record/recovery package; no public availability is claimed.

## Authoritative equipment state

Protected Supabase readback on 2026-07-21 confirms:

- 68 inventory lines
- 93 physical units
- 47 user-confirmed lines
- 7 physically verified lines
- 14 recovery-required lines
- 63 lines with unknown operating condition
- 3 confirmed working lines
- 2 lines needing repair
- aggregate inventory SHA-256 `a6037fb817234aa509e629c237699c5adbf346d7137d0852c9c392cddd5c7754`

The working donor PC is equipment key `main-production-pc-ryzen-5700x`. The two newly purchased lines are:

- `asus-dual-rtx5060ti-o16g`: version 1, user-confirmed owned, operating status unknown, SHA-256 `7e3c427a9538ecc875cd7af68c508182bee4d719ac79eb19d43383edf86f52fa`
- `cooler-master-qube-540-case`: version 1, user-confirmed owned, operating status unknown, SHA-256 `228e44358f92f3cf3cb303fd89a78e651c92866f3de085a0750be6ef2e5ff570`

Useful owned portable components include the ARZOPA A1S portable monitor, Anker 11-in-1 USB-C dock, UGREEN 200 W charger, Yamaha USB mixer/interface, Elgato Stream Deck, and other recorded show equipment. Their operating condition remains unknown unless the private inventory says otherwise.

The existing private workbook predates the 2026-07-21 purchase and project-plan corrections. Supabase remains authoritative; regenerate the workbook before the next equipment intake or workbook-led edit.
## Production and Main 4 state

Main 4 is already implemented and operational:

- the centralized database authority is installed
- Companion, Mission Control, and Rumble integrations are active
- live surfaces passed smoke testing, including host unlock, logout, and lock release
- no production Rumble was activated or finalized during verification

This project-plan correction does not change production show systems.

## Portable assistant transition

Roger intends to move primary AI work from ChatGPT to the portable AI PC after the hardware is built and verified. The main assistant, Jessica, and Gwen must use the portable-first policy in `docs/continuity/PORTABLE_ASSISTANT_FOUNDATION.md`.

- ChatGPT and Codex remain the current working adapters during the transition.
- The local runtime must be evaluated against realistic tasks before any workflow is retired from ChatGPT/Codex.
- No claim of equivalent local performance, complete feature parity, or completed migration is valid until the portable AI PC is installed and benchmarked.
- Exact local runtime, model choice, local permission map, and cloud/API fallback remain **Recovery required**.

## Continuity authority

- Operator Law: `docs/ROWDY_ROOM_OPERATOR_LAW.md` on `main`
- Project Bible: `docs/ROWDY_ROOM_BIBLE.md` on `main`
- Portable AI computer handoff: `docs/continuity/BUILD_PORTABLE_AI_COMPUTER_HANDOFF.md` on `main`
- Current State, Equipment Inventory, Changelog, Runbook, and full public breadcrumb: branch `agent/rowdy-room-continuity`, draft pull request #28
- Private truth: Supabase project `Final`, ref `szubjgpvlqliyparrnam`
- Draft pull request #28 remains open, draft, and unmerged

## Protected continuity readback

- `rowdy-room/current-state`: version `29`, SHA-256 `79f5ffb49a735f168ce09ece15dd7dcf7f44db4469b95c378565705a54322dcb`, history ID `124`
- `rowdy-room/equipment-recovery`: version `14`, SHA-256 `df5679c3e908f777a4874294fa526e13a71c6742762b0c2b46e21394e417fad6`, history ID `125`
- `rowdy-room/show-projection-signal-path`: version `3`, SHA-256 `a9329a679b13d72912f4d4849975a974f165cd4daef2361b8a3996449462d90b`, status `recovery-required`
- `rowdy-room/av-package-budget-2026-07-20`: version `4`, SHA-256 `e6a16b1f512cf2ca6343d0d912b9f344d833ca3135164f084c2c259c29124f11`, status `superseded`

Purchase-save verification: local recovery archive `Rowdy_Room_Portable_PC_Purchases_2026-07-21_PRIVATE.zip`, SHA-256 `10b9eb55fc361a2b656f9ec0725073c6b75676e1001e46d6f36b551d9fc881c5`, 4 entries, 3/3 internal hashes passed. Check run `942cfd79-cd4d-4cb9-b728-f8f803d1cf47`: 7 pass, 2 warn, 0 fail.

## Recovery required

- physical receipt and inspection of the purchased QUBE 540 and ASUS Dual RTX 5060 Ti 16GB
- exact installed CPU-cooler model and height
- current drive layout and desired drive retention
- RM1200x SHIFT side-cable clearance in the QUBE 540
- required case-fan plan
- post-install GPU, display-output, TikTok Live Studio, local-AI workload, stability, and temperature tests
- Yamaha physical model: `AG06MK` versus `AG06MK2`
- 14 partially identified equipment lines
- 63 operating-condition tests
- exact live-event projector source, content, and signal path
- original Rowdy Room Progress conversation export
- private server-side `rowdyroom_bible` reconciliation
- final PR #28 mergeability/privacy readback after this correction
- workbook regeneration before the next equipment intake or workbook-led edit
## Exact next product action

Identify the CPU cooler currently installed on the Ryzen 7 5700X and document the current drive layout. Then verify cooler height, RM1200x SHIFT side-cable clearance, drive placement, and the QUBE 540 fan plan before deciding whether any additional parts are needed. Do not install the new GPU or move the production system without separate authorization.
