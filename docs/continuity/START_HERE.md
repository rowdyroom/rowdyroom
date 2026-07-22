# Rowdy Room Continuity — START HERE

**Status:** Active public-safe breadcrumb root  
**Last updated:** 2026-07-22  
**Owner:** Roger Jamsek

Start every Rowdy Room task here after reading the complete Operator Law. Do not rely on chat memory. Missing or contradictory facts remain **Recovery required**.

## 2026-07-22 — Live TV display recovered; access repair staged

- Live evidence: `https://tv.rowdyroom.site/` returns HTTP 200 and serves the existing **Rowdy Room Live Rotation** display. Its existing public queue and performance queries returned HTTP 200. The earlier domain-pending record is outdated.
- Actual gap: neither the public homepage nor Mission Control exposes a TV Display link, so the live product is undiscoverable.
- Correct repair: `deploy/tv-display-access-repair/rowdy-install-tv-display-links.php`, source commit `797ac8ae4ddbe78a5fc2ae6e9fec5f9fcb9d1df8`. It backs up and adds only two links: homepage sticky controls and Mission Control → Setup → Displays.
- Superseded candidate: `deploy/tv-display/` remains an unmerged recovery candidate and **must not replace the existing live TV display** without a source-reconciliation review.
- Protected authority: `rowdy-room/standalone-tv-display`, v2 after this correction; deployment remains recovery-required solely because cPanel write access is unavailable in this task.
- Recovery: protected local package `Rowdy_Room_TV_Display_Link_Repair_2026-07-22_PRIVATE_RECOVERY.zip`, SHA-256 `779743A35715BCAF8F6FBCF8A355F242DE9D4690208DF27A2D0D2544D7B345CE`.
- Next safe action: upload the access-repair installer beside `public_html/index.html`, run it once, verify both links open the existing TV display, then delete the installer.

## 2026-07-22 — Standalone TV display source staged (not live)

- Change: staged a standalone viewer-facing karaoke TV display at `deploy/tv-display/`. It shows only the approved QR, rotating banner, Now Performing, Up Next, next five, and queue-supplied wait estimate. It is independent of Rumble, Wheel, Buzzer, and Mission Control.
- Public-safe authority: source commit `8cec95eff3f3c38c5ce762661e760ea8a71e7dc0` on branch `agent/standalone-tv-display-2026-07-22`; source root `deploy/tv-display/`.
- Protected authority: `rowdy-room/standalone-tv-display`, v1, SHA-256 `03e100829d7c8d9421d1521102575103f11bf1abb2f639c9a1f8386cf7e348cd`, status `recovery-required` until live hosting is verified.
- Verification: JavaScript syntax passed; 16:9 desktop layout passed with no vertical overflow; the neutral unavailable-queue state and QR destination passed. PHP lint and a live queue/television smoke test remain blocked by hosting.
- Recovery: protected local package `Rowdy_Room_TV_Display_2026-07-22_PRIVATE_RECOVERY.zip`, SHA-256 `F9EAE3CC3736685F98BE47D1F1580D03240816CCC60072E0BCDF8202A6994EFE`, 6 entries.
- Recovery required: create `tv.rowdyroom.site` in cPanel, verify its reserved document root, back it up, deploy this exact source, confirm PHP cURL, and run the live QR/queue/television smoke test.
- Next safe action: use the reserved standalone TV hostname only; do not put this display into `game.rowdyroom.site` or any Rumble surface.

## 2026-07-22 — Jessica movement revision 2026-07-22.1

- Change: installed three Roger-approved visual pet movements—confident waiting, headset command-mode active work, and skeptical review.
- Public-safe authority: `docs/pets/JESSICA_ASSISTANT.md`, commit `5c18dcdac28f786b422adea25456f12d26373891`; pets breadcrumb `docs/pets/START_HERE.md`, commit `d7704e61c6307e722463e3e7c1f6707ea441194d`; changelog commit `9699ae7c8576530c2adc6e2003312ff80346e4af`.
- Private authority: `pets/jessica-assistant`, version 3, history ID 145, SHA-256 `5ddc3b5e798518f3f9d0b7cd18b31310abdb424fc7a77d0393c7f6d84c7e88c1`.
- Installed sprite: Codex v2, 1536 x 2288, SHA-256 `8494cdd55061652a30f7843fdfa4ca2ac7d374186dafe57247294d44caee2d8e`.
- Verification: run `9590f541-c392-43a9-a8cc-83cddfbe66f8`; checks 178–185 passed; structural and independent visual QA passed; rows 0–5 and 9–10 stayed pixel-exact.
- Recovery: `Jessica_Movement_Update_2026-07-22_PRIVATE.zip`, SHA-256 `fe16bc2bc10b2a53ad72dbaa35b7ba685dd532a5aaab10530863041002ffc19a`, 19 entries.
- Scope: no personality trait, behavior, expert role, workflow, source preference, tool, or permission was activated.
- Remaining Recovery required: all unapproved Jessica draft design areas listed below.
- Next safe action: review one small group of draft personality traits with Roger.

## 2026-07-22 — Yamaha AG06MK2 model confirmation

- Change: Roger confirmed the owned Yamaha mixer is model `AG06MK2`; the prior `AG06MK` / `AG06MK2` conflict is resolved.
- Public-safe authority: `docs/continuity/EQUIPMENT_INVENTORY.md` on `main`, commit `8ba0cad73db12a802d0dae02bb3f5d23c2da9791`; `docs/continuity/CURRENT_STATE.md`, commit `9574973219fa061867e2e13a8722db6b991c5aef`; changelog commit `71853ea2cdbe2a55c977e2b9bb35b0f6e9d206e4`.
- Private authority: equipment key `yamaha-ag06mk2-black`, version `2`, SHA-256 `a235abf0ca31bec473a2b8d5b3e2f73142b739c6a3e0fe52eeab2d40ba290b03`, history ID `213`; `rowdy-room/current-state` version `31`, SHA-256 `06ec8236c06347bc9c92aba643a0dbcdb20d6dc28d170e1810a2f0b3fd288aa8`; `rowdy-room/equipment-recovery` version `15`, SHA-256 `5d7a09e28b3dd544be2187b3ada2abbd617d79750eebb9d758c1020ddbd5973b`.
- Verification: continuity run `89695818-b06d-4ce7-9f20-1e148008175c`, check IDs `171`–`175`, all pass.
- Recovery: `/workspace/scratch/925d103e7b45/outputs/rowdy-room-recovery/Rowdy_Room_AG06MK2_Correction_2026-07-22_PRIVATE.zip`, SHA-256 `c63559fb535e1eb774669e1aff9fcb75d7212bfd4d522de543a977da7fcd1e0c`, two entries.
- Remaining Recovery required: the AG06MK2 operating condition is unknown until tested; all other gaps listed below remain open.
- Next safe action: continue the approved spreadsheet cleanup review; test the AG06MK2 operating condition when practical.

## Required startup order

1. [Operator Law](../ROWDY_ROOM_OPERATOR_LAW.md)
2. [Project Bible](../ROWDY_ROOM_BIBLE.md)
3. [Current State](CURRENT_STATE.md)
4. [Equipment Inventory](EQUIPMENT_INVENTORY.md) when equipment affects the request
5. [Continuity Changelog](CHANGELOG.md)
6. [Continuity Runbook](CONTINUITY_RUNBOOK.md) before a material change
7. [Build Portable AI Computer handoff](BUILD_PORTABLE_AI_COMPUTER_HANDOFF.md) for the active portable-computer project
8. Applicable files under `docs/bible/`

## Current continuation

The active continuation is **Build Portable AI Computer**.

- Donor system: the current working Ryzen 7 5700X / RTX 3070 main production PC.
- Roger confirmed purchase of the Cooler Master QUBE 540 and ASUS Dual GeForce RTX 5060 Ti OC Edition 16GB GDDR7 (DUAL-RTX5060TI-O16G).
- The purchased parts are owned but not yet received, physically inspected, installed, or tested.
- Retain the MSI MAG B550 TOMAHAWK MAX WIFI motherboard and current 48 GB RAM initially.
- No replacement motherboard is currently planned unless a later verified requirement proves it necessary.
- The Corsair RM1200x SHIFT 1200 W PSU is user-confirmed; case side-cable clearance remains to be checked.
- An older laptop is not part of the authoritative inventory and is not part of this plan.
- Roger uses TikTok Live Studio, not OBS.
- The OBSBOT Tiny 2 Lite is normally for personal home streaming.
- The projector is primarily for live events.
- The old OBS-based projection path is recovery-required.
- The approximately $500 AV plan is superseded and must not drive architecture or purchasing.
- Exact next product action: identify the installed CPU cooler and current drive layout, then verify cooler height, PSU cable clearance, drive placement, and the case-fan plan before deciding whether additional parts are needed.
## GitHub authority

- Repository: `rowdyroom/rowdyroom`
- `main` contains the Operator Law, Project Bible, architecture record, portable AI computer handoff, full continuity records, Main 4 source, and pets records.
- PR #28 was merged into `main` on 2026-07-22 at merge commit `8ad1c435ff50a67bb142b6b2bbfeb0e41310812e`.
- `agent/rowdy-room-continuity` is retained only as the historical source branch for PR #28.
- Donor-system handoff correction: `d00605a194a3838af7aba6ff77e3d1fa4233afc8`
- Main donor-plan breadcrumb: `26f22e785bd642e94e45abb02c361c5a1cada016`
- Prior PR conflict-resolution merge: `6b934d5e3d1acfa3beda1c0a7277b1e9eb2b9e4a`

GitHub readback confirms PR #28 is closed and merged. It is no longer a continuity blocker.

## Pets continuity

- Pets root: [`docs/pets/START_HERE.md`](../pets/START_HERE.md)
- Jessica public-safe profile: [`docs/pets/JESSICA_ASSISTANT.md`](../pets/JESSICA_ASSISTANT.md), profile v1.3
- Approved Jessica decisions: optional personalization inheritance is NONE; durable records are required for material Jessica updates
- All proposed personality traits, behaviors, expert roles, workflows, source preferences, and example-command behavior remain inactive working draft
- Public Jessica profile commit: `5c18dcdac28f786b422adea25456f12d26373891`
- Protected record: `pets/jessica-assistant`, v3, history 145, SHA-256 `5ddc3b5e798518f3f9d0b7cd18b31310abdb424fc7a77d0393c7f6d84c7e88c1`
- Verification run: `9590f541-c392-43a9-a8cc-83cddfbe66f8`; no failed checks
- Recovery package: `Jessica_Movement_Update_2026-07-22_PRIVATE.zip`, SHA-256 `fe16bc2bc10b2a53ad72dbaa35b7ba685dd532a5aaab10530863041002ffc19a`
- Exact next Jessica action: review one small group of draft personality traits with Roger and record each item as approved, rejected, revised, or pending

## Protected authority

Supabase project `Final`, ref `szubjgpvlqliyparrnam`:

- `public.rr_continuity_records`
- `public.rr_continuity_history`
- `public.rr_continuity_checks`
- `public.rr_equipment_inventory`
- `public.rr_equipment_history`

Verified protected snapshot:

- `rowdy-room/current-state`: v30, `02a599bdc7b229b089cf781be4aa6adff342b064870c25d722829784b22b8964`, history 141
- `rowdy-room/equipment-recovery`: v14, `df5679c3e908f777a4874294fa526e13a71c6742762b0c2b46e21394e417fad6`, history 125
- `rowdy-room/show-projection-signal-path`: v3, `a9329a679b13d72912f4d4849975a974f165cd4daef2361b8a3996449462d90b`, recovery-required
- `rowdy-room/av-package-budget-2026-07-20`: v4, `e6a16b1f512cf2ca6343d0d912b9f344d833ca3135164f084c2c259c29124f11`, superseded
- `rowdy-room/continuity-protocol`: v7, `38234d1840d117cfd720acd225a933a1104f6d93715d6b7d081d7596e4f53726`, history 140
- `rowdy-room/law-and-breadcrumb-protocol`: v4, `5637ab1c1cd4e15f60031885fc578abdf58f1795194b8ff3970583d87295332b`, history 142
## Equipment truth

- 68 lines / 93 physical units
- 47 user-confirmed / 7 physically verified / 14 recovery-required
- 63 unknown operating statuses / 3 working / 2 needs repair
- donor system: `main-production-pc-ryzen-5700x`, working with its RTX 3070 still installed
- purchased GPU: `asus-dual-rtx5060ti-o16g`, v1, user-confirmed owned, operating status unknown
- purchased case: `cooler-master-qube-540-case`, v1, user-confirmed owned, operating status unknown
- aggregate SHA-256 `a6037fb817234aa509e629c237699c5adbf346d7137d0852c9c392cddd5c7754`
## Recovery evidence

- Previous reconciliation archive: `Rowdy_Room_Continuity_Reconciliation_2026-07-21_PRIVATE.zip`
- archive SHA-256: `5ceb6aef67a46af0e11394ff89ecaef1c7eab23ee8502bd1474a2891dd8d4c2e`
- purchased-part database rows and histories passed exact readback
- public handoff commit: `6e71ebd09077f1d48ade32742910689b11965cd7`
- purchase recovery archive: `Rowdy_Room_Portable_PC_Purchases_2026-07-21_PRIVATE.zip`
- archive SHA-256: `10b9eb55fc361a2b656f9ec0725073c6b75676e1001e46d6f36b551d9fc881c5`
- archive entries: 4; internal hashes: 3/3 passed
- continuity check run: `942cfd79-cd4d-4cb9-b728-f8f803d1cf47` — 7 pass, 2 warn, 0 fail
## Recovery required

- physical receipt and inspection of the purchased QUBE 540 and ASUS Dual RTX 5060 Ti 16GB
- exact installed CPU-cooler model and height
- current drive layout and desired drive retention
- RM1200x SHIFT side-cable clearance in the QUBE 540
- required case-fan plan and post-build temperature tests
- 14 partially identified equipment lines
- 63 operating-condition tests
- exact live-event projector source, content, and routing
- original Rowdy Room Progress export
- private server-side Bible reconciliation
- workbook regeneration before the next equipment intake or workbook-led edit

An older laptop is not part of the authoritative equipment inventory and is not part of this build plan. No further purchase/cart action, production show system change, or Scheduled Task change is authorized by this record.
