# Rowdy Room Continuity — START HERE

## 2026-08-01 — Cross-zone buttons and appearance studio

- Customizable buttons can move among their original area, Extensions bar, main page, left panel, and right panel, with device-local persistence and reliable return to permanent built-in homes.
- Added glass, transparent, almost-invisible, and neon-glass styles; opacity and corner controls; pulse, float, bounce, glow, and spin animations.
- Added page and Extensions/tab colors, solid/glass/transparent bar styling, background darkness and fit, plus device-local photo or muted-looping movie backgrounds stored in IndexedDB and capped at 512 MB.
- Browser acceptance moved one button through every zone and back, verified effect and theme persistence, kept side circles usable during Customize mode, restored the neutral state, and finished at `RACC ready`.
- Focused server test and full suite passed 86/86.
- Public authority: `docs/rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md` on branch `codex/rowdy-control-center-2026-08-01`, feature commit `60dbcc4ac92be679aabecd59a07d768acc10cfe7`.
- Protected authority: `rowdy-room/lucian-command-center-voice-studio`, version 9, history 376, SHA-256 `e246c53b3504fc684c1b9fd863f0aafbc40367da41c41dd4715dad7ce521b1dd`.
- Verification run `33dc62ba-a870-4d31-90a8-a5366572db5b`: checks 391-407, 17 pass, 0 warn, 0 fail.
- Recovery: `Rowdy_Control_Center_Advanced_Customization_2026-08-01_204019.zip`, 6 entries, SHA-256 `F63FEAE83A930D5C436558EE86F8F3DF4D4752CCF4CC7E340025272CCA8F08DB`; restore-and-rehash passed.
- Recovery required remains physical microphone acceptance, optional new-tab extension installation, and the physical approved-device LAN test.
- Next safe action: Roger uses Customize page and Background & effects, then chooses the next two Control Center changes.

## 2026-08-01 — Movable/customizable Control Center and dual side popouts

- Added locally saved customization for 42 remaining headings, descriptions, buttons, extension items, status displays, and side circles. Applicable items can be dragged, renamed, relinked, resized, or recolored; new text and buttons can be added.
- Live RACC and ComfyUI wording remains system-controlled for truthful health reporting, while its position and styling remain customizable.
- Added one independent left popout and one independent right popout; each opens from a customizable circle and collapses back to the circle with X.
- Browser acceptance passed selection, +24-pixel drag, reload persistence, restoration to 0 pixels, independent left/right open-close behavior, final closed-circle state, full-width fact-check geometry, and `RACC ready`.
- Focused server test and full suite passed 86/86.
- Public authority: `docs/rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md` on branch `codex/rowdy-control-center-2026-08-01`, feature commit `0e112ae0c830aafaae2960e75f07f3031771cb6a`.
- Protected authority: `rowdy-room/lucian-command-center-voice-studio`, version 8, history 375, SHA-256 `6aa8dab4130b414fe927200614e809902f52bb36c09489a7a3edbe046f4a68f4`.
- Verification run `e0b13da6-edeb-4cf5-b16c-13f5f8498c68`: checks 375-388, 14 pass, 0 warn, 0 fail.
- Recovery: `Rowdy_Control_Center_Custom_Layout_Side_Popouts_2026-08-01_194740.zip`, 6 entries, SHA-256 `F4DC27DF9ACE03422B19389FE34F1375B89F7A1A3FF5632A8665FA9CA2473FE7`; restore-and-rehash passed.
- Recovery required remains physical microphone acceptance, optional new-tab extension installation, and the physical approved-device LAN test.
- Next safe action: Roger uses Customize page and the two side circles, then chooses the next two Control Center changes.

## 2026-08-01 — Control Center full-width fact checker and bare rails

- Stretched the Private Fact Checker to the exact usable browser width and removed only the visible backgrounds, borders, and shadows around AI Rail, Quick Actions, and Title/RACC status.
- Content, controls, 18-pixel padding, and grid positions stayed unchanged.
- Browser verification: fact checker x=0/right=1265/width=1265, document scroll width=1265, AI Rail x=30, Quick Actions x=915, heading-center offset 0, and status `RACC ready`.
- Focused server test and full suite passed 86/86.
- Public authority: `docs/rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md` on branch `codex/rowdy-control-center-2026-08-01`, feature commit `46ab7dd80ba74ba44f4a4886e33a26413d612987`.
- Protected authority: `rowdy-room/lucian-command-center-voice-studio`, version 7, history 374, SHA-256 `1492ca4d7ecb76357b2cf97a1288592d6ecb6a59cf46ec199224334cf79c291a`.
- Verification run `d04dad4d-fb93-48c9-9607-5719023bc50d`: checks 365-374, 10 pass, 0 warn, 0 fail.
- Recovery: `Rowdy_Control_Center_Fact_Check_Layout_2026-08-01_185711.zip`, 6 entries, SHA-256 `7DC8B94C905CAB6A2105680D6D4890B3633DA52A6943FCA8CBB871C124CAF421`; restore-and-rehash passed.
- Recovery required remains physical microphone acceptance, optional new-tab extension installation, and the physical approved-device LAN test.
- Next safe action: Roger chooses the next two Control Center changes; apply and verify only that pair.

## 2026-08-01 — Roger-directed Control Center staged cleanup

- Removed the Custom Window Desk, model-next-step panel, embedded background chat, and the entire middle container with its controls.
- The middle column is intentionally open and unfilled. AI Rail and Quick Actions remain in place, the round popout launcher remains active, and the Rowdy Control Center heading is centered.
- A temporary search-side-panel iteration was superseded before closeout and is not active.
- Verification: focused server test passed, full suite passed 86/86, empty center has zero children and 625 px width, heading-center offset is zero, and surrounding-column positions are unchanged.
- Public authority: `docs/rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md` on branch `codex/rowdy-control-center-2026-08-01`, feature commit `b25edfd37cae917770c06c42b94a4b7dc58588c1`.
- Protected authority: `rowdy-room/lucian-command-center-voice-studio`, version 6, history 373, SHA-256 `5f2c29ccd011d6d4cac238cddc751590773d4a2fc97d0e4ef3c9f06b7953ea34`.
- Verification run `361ae4ca-363a-44bd-8b70-9f1d287d06e8`: checks 356-363, 8 pass, 0 warn, 0 fail.
- Recovery: `Rowdy_Control_Center_Staged_Cleanup_2026-08-01_184028.zip`, 6 entries, SHA-256 `FAE2D46AE24FA49A473029A392673A9D6F80A9CDA3EFD050571E5740106B9F30`; restore-and-rehash passed.
- Recovery required remains physical microphone acceptance, optional new-tab extension installation, and the physical approved-device LAN test.
- Next safe action: Roger chooses the next two Control Center changes; apply and verify only that pair.

## 2026-08-01 — Rowdy Robots full-team mission completion

- All twenty-two local Robot packages are configured, commissioned through bounded real tasks, and active; dispatcher readback shows 22 available and zero paused.
- Dave completed loopback-only model-backed routing with deterministic fail-closed fallback; 11/11 local model tags launched and 73/73 automated tests passed.
- Live health, deterministic backup routing to Sampson, and the reusable Lucian launcher passed.
- Google Drive and Supabase were intentionally not changed during commissioning. No cloud deletion or Supabase table/SQL change occurred.
- Public authority: `docs/rowdy-robots/ROWDY_ROBOTS_LOCAL_FIRST_2026-08-01.md`.
- Completion point: operational team commissioning is complete; cloud restore proof and optional visual/voice personalization are separate future missions.

## 2026-07-31 — Lucian verified F/D storage migration

- Active local model, media, voice, and mutable RACC data run from the dedicated SSD; generated media and recovery copies write to the separate larger storage drive.
- Private LAN credentials remain protected in their existing host location; no credentials or private machine paths are published here.
- Source, active, and recovery inventories matched exactly. Fifty-seven large files totaling 48,783,460,155 bytes passed three-way SHA-256 verification.
- Acceptance passed 61/61 automated tests, exact `STORAGE_OK` and secure-LAN `LAN_STORAGE_OK` replies, real neural WAV, real PNG, H.264 MP4, and a verified post-migration database backup.
- Superseded C-drive AI payloads were removed only after acceptance, reclaiming approximately 48.8 GB.
- Public authority: `docs/rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md`, commit `308b273d86198de2ddaee08be50c69fea2dc28ff`.
- Protected authority: `rowdy-room/lucian-command-center-voice-studio`, version 3, history 341, SHA-256 `003e6fca2557f65f3fa7f406463104e55719a8a7336734f65bf917c70c48ec12`.
- Verification run `3aebb941-e937-4d2c-8be9-d4e8bf3ab8e3`: 12 pass, 0 warn, 0 fail.
- Recovery source archive: `RACC_Source_e461b33_Storage_Migration_2026-07-31.zip`, 160 entries, SHA-256 `1abce8b6b80072211f014531fbee2fd50ae5f87bed3de377228c5337d001c050`.
- Recovery required remains the physical approved-device smoke test and Roger's personalized Lucian voice choice.
- Next safe action: complete the approved-device login/reply test, then return to the voice choice and Reviewer v0.1.


## 2026-07-31 — Lucian secure private-network access

- Host-side authenticated HTTPS access is implemented and verified without exposing RACC's raw loopback ports.
- Windows Firewall scope is Private profile plus `LocalSubnet`; there is no router, port-forward, Public-profile, or public-internet change.
- Acceptance passed trusted TLS, owner login, session/origin controls, exact `LAN_OK`, browser rendering, zero console errors, and 61/61 automated tests.
- Public authority: `docs/rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md`, commit `dde3057d91f2f9ab82df59b1c55c82afb19f22d3`.
- Recovery: `RACC_Lucian_Secure_LAN_v0.6_2026-07-31.zip`, SHA-256 `77f27604c4ed34575ec80169c65904716e2afc0808e87290199ba26cb8c7769b`.
- Recovery required: install the public Lucian CA certificate on one Roger-approved second device and observe a real login/reply.
- Next safe action: complete that physical device smoke test, then return to the authorized voice choice and Reviewer v0.1.


## 2026-07-31 — Lucian Command Center and Rowdy Bot Voice Studio

- Compact local Lucian chat, spoken replies, and a reusable floating launcher are verified on the same computer as RACC.
- The private Voice Studio uses a local CUDA neural engine, supports future Rowdy bot profiles, and requires voice ownership/permission plus separate confirmation for each generation.
- Primary acceptance WAV: 4.52 seconds, 217,004 bytes, SHA-256 `a1e8bb5bc15eabd324e9e1ceb77cbf9fcce08f8099a5b0de7cd558bcb70ba2ec`.
- Verification: 58/58 automated tests; compact chat, spoken reply, Voice Studio, and floating launcher browser checks passed with zero console errors.
- Public authority: `docs/rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md`, commit `b33f4683469926864928d4a310c293f942091a8d`.
- Recovery: `RACC_Lucian_Command_Center_Voice_Studio_v0.5_2026-07-31.zip`, SHA-256 `3129172ad946947d17df0e26a8315e14f93cd9f317ee23eddfb38704405c855f`.
- Recovery required: authenticated HTTPS access for other LAN devices and Roger's final personalized Lucian reference choice.
- Next safe action: audition the built-in voice or record an authorized 4-30 second reference, then return to Reviewer v0.1.

## 2026-07-30 — Portable computer cooler fixed and system operational

- Roger confirmed that he fixed the CPU cooler, the Ryzen 7 5700X computer is operational, and temperatures observed in Radiograph look good.
- The report is user-confirmed and does not include exact temperature values.
- Public authority: `docs/continuity/CURRENT_STATE.md` commit `e6aa9771775f5027a7f8f959561db3f02d50e684`; `docs/continuity/EQUIPMENT_INVENTORY.md` commit `afc114cb59d1579b284485f33ff7459e35617c95`; `docs/continuity/BUILD_PORTABLE_AI_COMPUTER_HANDOFF.md` commit `27d917113e5c5631de41b06c9008f664b3ffc8f0`; changelog commit `3c27f771603b88cff0757df39db7d46890f66fc0`.
- Protected equipment authority: `main-production-pc-ryzen-5700x`, version 2, history ID 758, status `working`, SHA-256 `970db8a70a84a8681d446685dd1d1b723c799fe12feb986fd2f732dcc9429808`.
- Protected current-state authority: `rowdy-room/current-state`, version 33, history ID 313, SHA-256 `e3322a8dca403b77f371e8bc07df84c99346693e58eecaa9132418e01740c82f`.
- Protected recovery authority: `rowdy-room/equipment-recovery`, version 18, history ID 315, SHA-256 `bb8ecbfa3918308edba94c18e84e3b3cbc54bdf77ddcb4179ddcbed8e5d17c44`.
- Verification run: `687169e8-b4b5-4974-8e42-f74207e49c2b`.
- Recovery: `C:\\Users\\Roger\\Documents\\Codex\\2026-07-30\\build-4\\outputs\\Rowdy_Room_Portable_PC_Operational_Update_2026-07-30.zip`, SHA-256 `66acdd78a4fcc0b4fae38dd47f6a34a239413900a15908f5e730fa546ec1ba42`, one verified entry; source record SHA-256 `3ed4364b27d8d50d8f9fd6cd2ae38efd52456dc8be899876e58643767af7871d`.
- Recovery required: exact temperature readings; currently installed case and GPU; exact CPU-cooler model; drive layout; fan plan; RM1200x SHIFT clearance; representative GPU, display-output, TikTok Live Studio, local-AI, stability, and extended temperature tests.
- Exact next action: confirm the installed case, GPU, cooler model, drive layout, fan/PSU-clearance state, and exact Radiograph readings under representative workloads before closing the build.

## 2026-07-28 — Bob Rowdy Robot Lucian v2 retrospective training

- Bob was omitted from the original Lucian v2 build despite Roger's instruction; the record does not claim otherwise.
- Bob completed a retrospective audit, workflow reconstruction, fresh-validator review, and his own visual inspection of the completed animation and direction sheets.
- Public authority: `docs/rowdy-robots/BOB_TRAINING.md`, commit `31ae64b3b68281d71359e0c6f445b008f2c74acd`.
- Installed Lucian atlas remained v2, 1536 x 2288, SHA-256 `9fd0ecd64ab9b09513cbf25b039bfb3e6bcdf90cc401858b9209ace455ad7e79`.
- Strict validator and Bob visual inspection passed; all four cardinal gates and the 16-direction clockwise loop read correctly.
- Scope boundary: training record only; no new Bob behavior, tool, permission, or production automation was activated.
- Bob's visual-pet continuity record is merged into `main` through PR #29 at commit `3cafbd9e70b0525d3ee26324078d7956bbf8d5e2`.
- Protected authority: `rowdy-robots/bob-training`, version 1, history ID 270, SHA-256 `8a91e3b5bc0e6462a27abe241f824af9bf7be802dc25fd11490efc6b1e8557a7`.
- Verification: run `3b2e5141-b4e4-4079-b00a-d24977f3182d`, checks 259–267: 7 pass, 2 warn, 0 fail.
- Recovery: `outputs/Bob_Lucian_v2_Retrospective_Training_Recovery_2026-07-28.zip`, SHA-256 `ecef60030da48d4e5c483c3ea2e0ab780280ef0351144f559c08dc9300132dc3`, 15/15 entries verified.
- AI Start: submission `pending_20260728_145319_3cf4289a` saved as pending review; proposed passcode `0003` is not registered or official until approved.
- Recovery required: live Lucian rendering after reload or wake remains unobserved.
- Next safe action: approve or reject the pending AI Start registration, then reload or wake Lucian and observe live rendering.

**Status:** Active public-safe breadcrumb root  
**Last updated:** 2026-08-01  
**Owner:** Roger Jamsek

Start every Rowdy Room task here after reading the complete Operator Law. Do not rely on chat memory. Missing or contradictory facts remain **Recovery required**.

## 2026-07-28 — Lucian v2 visual pet upgrade

- Installed Lucian's Codex visual pet as v2 with 9 standard animation rows and 16 clockwise look directions.
- Public authority: `docs/pets/LUCIAN_PET.md`, commit `a92e2f9411774a75adcda6f167c8e6c2c21ba630`.
- Installed sprite: 1536 x 2288, SHA-256 `9fd0ecd64ab9b09513cbf25b039bfb3e6bcdf90cc401858b9209ace455ad7e79`.
- Protected authority: `pets/lucian`, version 1, history ID 269, SHA-256 `1d92fa93c30939870c78efbfba5f9a9e00fc24c33c41379a234822c18e34682b`.
- Verification: run `3358596a-e81b-40c9-a676-6b82ffb7059f`, checks 250–258: 8 pass, 1 warn, 0 fail. Cardinal direction gates and independent visual QA passed; 067.5, 112.5, and 337.5 were documented as minor blind-size ambiguity only.
- Recovery: `Lucian_v2_Recovery_2026-07-28.zip`, SHA-256 `f9fc131860f478b74fc5be6c146fef15150f4a1ee97194e7aec256028187d23b`, 14 entries.
- Scope boundary: visual package only. No behavior, tool, permission, Bob Rowdy Robot runtime, or worker runtime was activated.
- Recovery required: live in-app rendering after reload or wake remains to be observed.
- Next safe action: reload or wake Lucian and visually confirm idle, active-work, and pointer-following directions.
## 2026-07-28 — Bob v2 looking-direction upgrade

- Change: upgraded installed Codex pet `bob` to sprite version 2 with an 8 x 11 atlas and 16 clockwise looking directions.
- Public-safe authority: `docs/pets/BOB_PET.md` and `docs/pets/START_HERE.md` on `main`, merged through PR #29 at commit `3cafbd9e70b0525d3ee26324078d7956bbf8d5e2`.
- Installed sprite: 1536 x 2288 WebP with alpha, SHA-256 `6d48c593f1fdd90c584cd3c1864aa60865c96cbd655af14103ae40f1ebe557b4`.
- Verification: installed atlas passed with zero errors, zero warnings, and zero transparent-RGB residue; cardinal direction hard gates and labeled loop review passed.
- Recovery: `Bob_v2_Look_Directions_Recovery_2026-07-28.zip`, SHA-256 `23e3a41b7e90e6280fcc41bd5fe86e8085a0bcf554b161187e268e68c160f29d`.
- Continuity recovery: `Bob_v2_Continuity_Update_2026-07-28.zip`, SHA-256 `dbe0973724a55875fca371663a5455125c0ca7e70d17d3fb8e4fa24400b8a6c9`.
- AI Start: submission `pending_20260728_170702_fa2a792b` saved as pending review under proposed Bob passcode `0003`; it is not official until approved.
- Private authority: not applicable; this record contains only public-safe visual-package facts and activates no behavior or permissions.
- Remaining Recovery required: live Codex runtime animation smoke test.
- Next safe action: visually verify Bob when next displayed in Codex; retain the validated package unless a specific runtime defect appears.

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
- Bob public-safe visual record: [`docs/pets/BOB_PET.md`](../pets/BOB_PET.md), installed sprite version 2 with 16 looking directions
- Bob installed spritesheet SHA-256: `6d48c593f1fdd90c584cd3c1864aa60865c96cbd655af14103ae40f1ebe557b4`
- Bob recovery archive: `Bob_v2_Look_Directions_Recovery_2026-07-28.zip`, SHA-256 `23e3a41b7e90e6280fcc41bd5fe86e8085a0bcf554b161187e268e68c160f29d`
- Bob continuity recovery: `Bob_v2_Continuity_Update_2026-07-28.zip`, SHA-256 `dbe0973724a55875fca371663a5455125c0ca7e70d17d3fb8e4fa24400b8a6c9`
- Bob AI Start mission submission: `pending_20260728_170702_fa2a792b`, pending review under proposed passcode `0003`
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
