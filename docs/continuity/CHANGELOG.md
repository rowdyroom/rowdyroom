## 2026-08-01 — Cross-zone buttons and appearance studio

- Added saved button relocation among Original, Extensions, Main, Left, and Right areas, including permanent built-in home mappings and usable side circles during Customize mode.
- Added glass, transparent, almost-invisible, and neon effects; opacity, corner radius, and optional pulse, float, bounce, glow, and spin animations.
- Added page and Extensions/tab colors, solid/glass/transparent bar styling, background darkness and fit, and browser-local photo or looping-movie backgrounds.
- Browser acceptance covered every relocation destination, original-home restoration, effect/theme persistence, neutral-state restoration, and `RACC ready`; focused and full 86/86 tests passed.
- Public feature commit: `60dbcc4ac92be679aabecd59a07d768acc10cfe7`; breadcrumb commit: `2d9c707214dc665af53ff0761009865e1b2eb8f2`.
- Protected record: version 9, history 376, SHA-256 `e246c53b3504fc684c1b9fd863f0aafbc40367da41c41dd4715dad7ce521b1dd`.
- Recovery archive SHA-256: `F63FEAE83A930D5C436558EE86F8F3DF4D4752CCF4CC7E340025272CCA8F08DB`; six restored entries matched.

## 2026-08-01 — Movable/customizable Control Center and dual side popouts

- Added locally saved movement and editing for 42 remaining Control Center items, with new-text/new-button controls and a confirmed reset.
- Preserved system-controlled live health wording while allowing the displays' styling and placement to change.
- Added independent left and right circle-to-popout panels with X-to-collapse behavior.
- Browser interaction, focused server testing, and the full 86/86 suite passed.
- Protected record `rowdy-room/lucian-command-center-voice-studio` advanced to version 8, history 375, SHA-256 `6aa8dab4130b414fe927200614e809902f52bb36c09489a7a3edbe046f4a68f4`.
- Verification run `e0b13da6-edeb-4cf5-b16c-13f5f8498c68`: 14 pass, 0 warn, 0 fail.
- Recovery `Rowdy_Control_Center_Custom_Layout_Side_Popouts_2026-08-01_194740.zip`: 6 entries, SHA-256 `F4DC27DF9ACE03422B19389FE34F1375B89F7A1A3FF5632A8665FA9CA2473FE7`; restore-and-rehash passed.

## 2026-08-01 — Control Center full-width fact checker and bare rails

- Made the Private Fact Checker span the exact usable viewport width without horizontal overflow.
- Removed only the visible wrappers around AI Rail, Quick Actions, and Title/RACC status; all content, controls, padding, and positions stayed in place.
- Browser geometry, focused server testing, and the full 86/86 suite passed.
- Protected record `rowdy-room/lucian-command-center-voice-studio` advanced to version 7, history 374, SHA-256 `1492ca4d7ecb76357b2cf97a1288592d6ecb6a59cf46ec199224334cf79c291a`.
- Verification run `d04dad4d-fb93-48c9-9607-5719023bc50d`: 10 pass, 0 warn, 0 fail.
- Recovery `Rowdy_Control_Center_Fact_Check_Layout_2026-08-01_185711.zip`: 6 entries, SHA-256 `7DC8B94C905CAB6A2105680D6D4890B3633DA52A6943FCA8CBB871C124CAF421`; restore-and-rehash passed.

## 2026-08-01 — Roger-directed Control Center staged cleanup

- Removed the Custom Window Desk and model-next-step panel completely.
- Removed the embedded right-side Rowdy Robots/Lucian chat while preserving the separate round popout launcher.
- Applied Roger's final layout correction: removed the middle container and all its contents, left the center column open, kept the surrounding rails in place, and centered the top heading.
- Recorded that a temporary search-side-panel iteration was superseded before closeout and is not active.
- Passed focused and 86/86 automated tests, live browser geometry, public readback, protected version/history/hash readback, and a 6-entry recovery restore-and-rehash test.

## 2026-08-01 — Local Chrome Control Center and ComfyUI control

- Repaired the reusable launcher’s local-service resolution and added one bounded ComfyUI ON/OFF control.
- Created a local Chrome dashboard with Google search, editable quick favorites, external-AI tab launchers, and full-screen local Rowdy Bot/voice access.
- Verified dashboard state, one real idle ComfyUI stop/start cycle, and 84/84 automated tests.
- Prepared, but did not install, an unpacked Chrome new-tab extension. Its installation and any new-tab replacement remains Roger-controlled.
- Per-bot heavy-model controls remain inactive pending the controlled Qwen 27B test.

# Rowdy Room Continuity Changelog

## 2026-08-01 — Rowdy Robots full-team commissioning complete

- Commissioned every one of the 22 local Robots through a bounded real task before activation.
- Verified dispatcher state at 22 available, zero paused, and no stale mission locks.
- Passed 73/73 automated tests plus live health, deterministic backup routing to Sampson, and Lucian launcher checks.
- Kept local model-pool concurrency at one, paid usage disabled, external providers disabled, and Roger as final authority.
- Preserved a hash-verified recovery package containing committed source, activation and commissioning evidence, all 22 operational-status records, and a database backup.
- Did not change Google Drive or Supabase content, tables, SQL, or operational projects.

## 2026-07-31 — Lucian verified F/D storage migration

- Moved active local AI runtimes and mutable RACC data off C to the dedicated SSD and routed generated media/recovery to the separate larger storage drive.
- Preserved private LAN credentials in their existing protected host location.
- Verified exact source/active/recovery inventories and 57 large-file SHA-256 comparisons covering 48,783,460,155 bytes.
- Passed 61/61 automated tests, exact local and secure-LAN replies, real neural voice, PNG and H.264 MP4 generation, and a hash-verified post-migration database backup.
- Removed superseded C-drive AI payloads only after acceptance and reclaimed approximately 48.8 GB.
- Public record commit: `308b273d86198de2ddaee08be50c69fea2dc28ff`; protected record version 3, history 341, SHA-256 `003e6fca2557f65f3fa7f406463104e55719a8a7336734f65bf917c70c48ec12`; check run `3aebb941-e937-4d2c-8be9-d4e8bf3ab8e3` passed 12/12.


## 2026-07-31 — Lucian secure private-network access

- Added a password-protected HTTPS gateway for Roger-approved local-subnet devices while retaining loopback-only RACC, model, voice, and media services.
- Restricted Windows Firewall access to TCP 8443 on Private networks from `LocalSubnet`; made no public-network or router change.
- Verified TLS trust, access denial before login, cross-origin denial, secure owner session, raw-port isolation, exact `LAN_OK`, logout, browser UI, zero console errors, and 61/61 tests.
- Created a secret-free recovery package with source, verified database backup, public device certificate, and setup instructions; SHA-256 `77f27604c4ed34575ec80169c65904716e2afc0808e87290199ba26cb8c7769b`.
- Left physical second-device enrollment and login `Recovery required` until observed.


## 2026-07-31 — Lucian Command Center and Voice Studio verified

- Added a compact persistent local Lucian communication surface plus a floating launcher for Roger-controlled local pages and extensions.
- Added a private local Rowdy Bot Voice Studio with a built-in Lucian neural profile and permission-gated reference profiles for future bots.
- Verified CUDA generation on the RTX 5060 Ti, two real watermarked WAV outputs, 58/58 automated tests, compact-chat response, spoken-reply playback, Voice Studio rendering, launcher embedding, and zero browser console errors.
- Preserved the public/private split: public records contain only architecture and verification facts; reference recordings, generated voice content, local database contents, and machine paths remain private.
- Kept cross-device LAN access recovery-required pending authenticated HTTPS and device controls.
- Public record: `docs/rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md`.

## 2026-07-30 — Portable computer cooler fixed and system operational

- Roger confirmed that he fixed the CPU cooler and the Ryzen 7 5700X computer is operational.
- Roger is monitoring temperatures with Radiograph and reports that they look good; no exact temperature values were supplied.
- Did not infer the installed case, installed GPU, exact cooler model, drive layout, fan plan, PSU clearance, or completion of representative workload/stability tests.
- Updated protected equipment key `main-production-pc-ryzen-5700x` to version 2, status `working`, history ID 758, SHA-256 `970db8a70a84a8681d446685dd1d1b723c799fe12feb986fd2f732dcc9429808`.
- Updated `rowdy-room/current-state` to version 32, history ID 311, SHA-256 `23566ec376e294b5329a84674f69bfa8d945ccd0479a368a4e2163cf378f05d9`.
- Updated `rowdy-room/equipment-recovery` to version 16, history ID 312, SHA-256 `3b3df81c65874f5cc9bfeaa6af34255c80e02e852b93cb2c15200ffea4e4fba4`.
- Exact Radiograph readings and representative GPU, display-output, TikTok Live Studio, local-AI, stability, and extended temperature tests remain **Recovery required**.

## 2026-07-28 — Bob Rowdy Robot trained from Lucian v2 build

- Corrected the original omission: Bob did not perform the Lucian v2 build and is not credited with it.
- Bob completed retrospective Bot Builder training by reconstructing the build and repair workflow, reviewing a fresh strict validator result, and personally inspecting the final extended animation and 16-direction sheets.
- Added public training record `docs/rowdy-robots/BOB_TRAINING.md` at commit `31ae64b3b68281d71359e0c6f445b008f2c74acd`.
- Lucian's installed atlas remained unchanged at SHA-256 `9fd0ecd64ab9b09513cbf25b039bfb3e6bcdf90cc401858b9209ace455ad7e79`.
- Validator and Bob visual review passed. No new repair was required.
- No new Bob behavior, tool, permission, or production automation was activated.
- Protected authority: `rowdy-robots/bob-training`, version 1, history ID 270, SHA-256 `8a91e3b5bc0e6462a27abe241f824af9bf7be802dc25fd11490efc6b1e8557a7`.
- Verification run `3b2e5141-b4e4-4079-b00a-d24977f3182d`: checks 259–267, 7 pass, 2 warn, 0 fail.
- Recovery archive `Bob_Lucian_v2_Retrospective_Training_Recovery_2026-07-28.zip`: SHA-256 `ecef60030da48d4e5c483c3ea2e0ab780280ef0351144f559c08dc9300132dc3`, 15/15 entries verified.
- AI Start submission `pending_20260728_145319_3cf4289a` was saved for review; proposed passcode `0003` is not official until approved.
- Live Lucian rendering after reload or wake remains Recovery required.

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
## 2026-07-28 — Bob upgraded to Codex pet v2 with looking directions

Status: Installed and structurally verified.

- Upgraded local Codex pet `bob` from a legacy 8 x 9 atlas to sprite version 2.
- Installed an 8 x 11, 1536 x 2288 WebP atlas with all 16 clockwise looking directions.
- Installed spritesheet SHA-256: `6d48c593f1fdd90c584cd3c1864aa60865c96cbd655af14103ae40f1ebe557b4`.
- Standard frame inspection and installed atlas validation passed with zero errors, zero warnings, and zero transparent-RGB residue.
- Cardinal direction hard gates passed; reviewed continuity warnings did not reveal reversal, clipping, identity break, attachment break, or scale pop.
- Preserved the original Bob v1 package and the installed v2 package in `Bob_v2_Look_Directions_Recovery_2026-07-28.zip`, SHA-256 `23e3a41b7e90e6280fcc41bd5fe86e8085a0bcf554b161187e268e68c160f29d`.
- Preserved the public-safe continuity update in `Bob_v2_Continuity_Update_2026-07-28.zip`, SHA-256 `dbe0973724a55875fca371663a5455125c0ca7e70d17d3fb8e4fa24400b8a6c9`.
- Saved AI Start submission `pending_20260728_170702_fa2a792b` for review under the existing proposed Bob passcode `0003`; it is not official until approved.
- Added `docs/pets/BOB_PET.md` and updated both pets and root continuity breadcrumbs.
- No behavior, assistant skill, workflow, tool, external integration, or permission was activated or changed.
- Live Codex runtime animation smoke testing remains Recovery required.

## 2026-07-22 — Jessica movement revision 2026-07-22.1 installed

Status: Roger approved and authorized implementation of three Jessica pet movements.

- Replaced only the waiting, running / active-work, and review animation rows.
- Waiting now uses confident needs-input body language; running uses non-locomotion headset command mode; review uses skeptical quality-control body language.
- Installed profile v1.3 and v2 spritesheet SHA-256 `8494cdd55061652a30f7843fdfa4ca2ac7d374186dafe57247294d44caee2d8e`.
- Preserved idle, directional running, waving, jumping, failed, and both look-direction rows pixel-exact.
- Structural validation and independent visual QA passed with zero repair rows.
- Updated public summary at commit `5c18dcdac28f786b422adea25456f12d26373891`.
- Updated protected record `pets/jessica-assistant` to version 3, history ID 145, SHA-256 `5ddc3b5e798518f3f9d0b7cd18b31310abdb424fc7a77d0393c7f6d84c7e88c1`.
- Verification run `9590f541-c392-43a9-a8cc-83cddfbe66f8`: initial checks 178–185 all passed.
- Recovery archive `Jessica_Movement_Update_2026-07-22_PRIVATE.zip`, SHA-256 `fe16bc2bc10b2a53ad72dbaa35b7ba685dd532a5aaab10530863041002ffc19a`, 19 entries.
- No personality trait, behavior, expert role, workflow, source preference, tool, or permission was activated.

## 2026-07-22 — Yamaha mixer model confirmed as AG06MK2

Status: Roger confirmed the exact Yamaha mixer model, resolving the prior AG06MK-versus-AG06MK2 ambiguity.

- Corrected the authoritative private inventory key to `yamaha-ag06mk2-black` and model to `AG06MK2`.
- Preserved the prior value in append-only equipment history.
- Updated the public-safe equipment summary and Current State recovery list.
- Resolved and removed Conflict Review item `CONFLICT-05` as part of approved cleanup Batch 2.
- Operating condition remains unknown until tested.


## 2026-07-22 - PR #28 merged into main

Status: Roger authorized the merge. GitHub readback confirms PR #28 is closed and merged.

- Resolved the only branch conflict in `docs/continuity/START_HERE.md`, preserving both the current portable-computer handoff and Jessica pets continuity.
- Synchronized current `main` into `agent/rowdy-room-continuity` without a force push.
- Marked PR #28 ready and merged it with merge commit `8ad1c435ff50a67bb142b6b2bbfeb0e41310812e`.
- Moved the full continuity, Main 4 source, and pets records onto authoritative `main`.
- Verified protected merge-state updates: `pets/jessica-assistant` v2/history 139, `rowdy-room/continuity-protocol` v7/history 140, `rowdy-room/current-state` v30/history 141, and `rowdy-room/law-and-breadcrumb-protocol` v4/history 142; all record/history hashes matched.
- No Jessica personality trait, behavior, expert role, workflow, source preference, permission, or limitation was changed.
- No purchase, production deployment, show-system change, database schema change, plugin installation, or automation was performed.

## 2026-07-22 - Pets registry and Jessica durable record established

Status: Jessica remains in design. Only two decisions are approved; all personality, behavior, role, workflow, source-preference, and example-command proposals remain inactive working draft.

- Added `docs/pets/START_HERE.md` as the public-safe pets breadcrumb root and `docs/pets/JESSICA_ASSISTANT.md` as Jessica's public-safe profile summary.
- Updated the installed `$jessica-assistant` profile to version 1.2 so only explicitly approved decisions are active.
- Approved optional personalization inheritance as NONE and required the verified durable-record workflow for every material Jessica update.
- Saved protected record `pets/jessica-assistant` v1, history ID 138, SHA-256 `6a1c5218b78fc6627460770c2c26fe8e4c10844b4ee168247e5f2696583b8506`.
- Public Jessica profile commit: `519c79881cee71a5324f3bf4dcf1676c9c18ff6f`.
- Verification run `f9b2b953-408c-44f5-aae1-f51a99a5eee3` passed local profile, public profile, protected history, recovery, scope, and privacy checks; the missing PyYAML validator dependency and the draft/unmergeable PR state remain warnings.
- Recovery package `outputs/Jessica_Pets_Continuity_2026-07-22_PRIVATE.zip`: SHA-256 `4fdbec2865d7d5e2398332683ec09b78ee0be3cc221ff7113ad1c896cf7cc68c`, 11 entries, 9/9 listed internal hashes passed.
- No personality trait, expert role, workflow, permission, production system, purchase, or external integration was activated by this record.

## 2026-07-21 — Portable AI computer case and graphics card purchased

- Roger confirmed purchase of the Cooler Master QUBE 540 and ASUS Dual GeForce RTX 5060 Ti OC Edition 16GB GDDR7 (DUAL-RTX5060TI-O16G).
- Added two user-confirmed owned inventory lines. Both remain operational-status unknown until received, physically inspected, installed, and tested.
- The existing RTX 3070 remains the working installed graphics card.
- Retained the MSI MAG B550 TOMAHAWK MAX WIFI motherboard and current 48 GB RAM as the initial build plan; no replacement motherboard is currently planned.
- Preserved the Corsair RM1200x SHIFT 1200 W as user-confirmed existing equipment while leaving QUBE 540 side-cable clearance recovery-required.
- Inventory readback: 68 lines, 93 units, 47 user-confirmed, 7 physically verified, 14 recovery-required, 63 unknown operating statuses, aggregate SHA-256 `a6037fb817234aa509e629c237699c5adbf346d7137d0852c9c392cddd5c7754`.
- Protected records finalized at `rowdy-room/current-state` v29 / history 124 / SHA-256 `79f5ffb49a735f168ce09ece15dd7dcf7f44db4469b95c378565705a54322dcb` and `rowdy-room/equipment-recovery` v14 / history 125 / SHA-256 `df5679c3e908f777a4874294fa526e13a71c6742762b0c2b46e21394e417fad6`.
- Exact next product action: identify the installed CPU cooler and current drive layout, then verify QUBE 540 cooler height, RM1200x SHIFT side-cable clearance, drive placement, and the case-fan plan.
- Recovery archive `Rowdy_Room_Portable_PC_Purchases_2026-07-21_PRIVATE.zip`: SHA-256 `10b9eb55fc361a2b656f9ec0725073c6b75676e1001e46d6f36b551d9fc881c5`, 4 entries, 3/3 internal hashes passed.
- Verification run `942cfd79-cd4d-4cb9-b728-f8f803d1cf47`: 7 pass, 2 warn, 0 fail.
- No additional purchase, production show-system change, or Scheduled Task action was performed.

## 2026-07-21 — Portable AI computer donor-system plan corrected

Status: Roger corrected the project plan after an unsupported older-laptop instruction was introduced during continuity reconciliation.

- Confirmed the owned working Ryzen 7 5700X / RTX 3070 main production PC is the donor system for the portable build.
- Confirmed the plan is to upgrade the graphics card and motherboard and move compatible donor components into a portable case.
- Recorded Roger's recollection that the motherboard was the additional intended upgrade; the exact replacement motherboard remains recovery-required.
- Removed the older laptop and smaller desktop from the project plan and recovery instructions. The older laptop is not part of the authoritative equipment inventory.
- Kept the exact graphics-card, motherboard, and case models recovery-required rather than guessing.
- Required compatibility verification for the retained CPU, RAM, storage, PSU, cooling, dimensions, and connectors before purchasing parts.
- Corrected the main handoff, public breadcrumbs, protected current-state record, draft continuity records, and PR description. No equipment was purchased and no production show system was changed.

# Rowdy Room Continuity Changelog

## 2026-07-21 — Portable AI computer continuity reconciliation

Status: The active public and private continuity records were corrected before portable-computer design or purchasing.

- Confirmed the active continuation is Build Portable AI Computer.
- Replaced the OBS assumption with Roger's actual workflow: TikTok Live Studio; OBS is not used.
- Recorded the OBSBOT Tiny 2 Lite as normally used for personal home streaming and removed retained projector-routing fields from its authoritative inventory row.
- Kept the projector primarily associated with live events and marked its exact source, content, and routing recovery-required.
- Superseded the OBS-dependent approximately $500 AV-package plan; no item was ordered and no cart was changed.
- Preserved the transport policy that dedicated point-to-point wireless HDMI is the primary wireless option only if a computer HDMI feed is confirmed; wired HDMI is the emergency fallback and ordinary mirroring is secondary.
- Verified 66 inventory lines / 91 units, 14 recovery-required lines, 61 unknown operating statuses, and aggregate SHA-256 `cfe3cc36e5f8842b4a07df301ac46dc53fdb1bc453ef55730ca581ed82c8d5f2`.
- Verified OBSBOT equipment v4, SHA-256 `0071fa82403f8c212c2a47a4081dd49149bd74746e001b672507652caf73b42e`, history ID 76.
- Verified protected current-state v24, equipment-recovery v11, show-projection v3, and superseded AV-package v4 with history IDs 95–100.
- Corrected the active handoff on `main` at commit `1fc06e3bdbf1abb51c0c4a7d63b2ef1a22730237` and the architecture record at `c03834f68ea05a9e59a65e2629d69c15bf92b3dc`.
- Synchronized current `main` into draft PR #28 to resolve its prior conflict state; the PR remains draft and unmerged.
- Set the exact next product action to identify and test the older laptop and smaller desktop before any replacement purchase.

## 2026-07-20 — Same-chat continuity law and Work Mode enforcement installed

Status: Roger required Rowdy Room work to remain in the same chat until a reliable near-limit warning, followed by a complete reviewed and verified handoff before any continuation elsewhere.

- Added the Same-Chat Continuity Law to the Operator Law and Project Bible.
- Added the limit and handoff procedure to the Continuity Runbook and Current State.
- Installed and validated the persistent Work Mode skill `rowdy-room-continuity`.
- Recorded that the current runtime exposes neither a compaction-disable control nor an exact remaining-context meter; the assistant must not claim otherwise.
- Required automatic compaction to recover in the same chat from verified durable records without making Roger repeat saved facts.
- Required inaccessible chat spans to remain `Recovery required`; an incomplete reconstruction cannot be called a complete handoff.
- Marked the stale OBS-dependent projection records `Recovery required` because Roger's latest correction is that he does not use OBS, uses TikTok LIVE Studio, normally uses the AI camera for personal home streaming, and uses the projector primarily for live events.

## 2026-07-20 — Rockville RPG15 pair confirmed and duplicate repaired

Status: Roger confirmed that both owned Rockville speakers are Power GIG RPG15 active 15-inch PA speakers.

- Recorded the manufacturer-exact model spelling `RPG15`, quantity two, active/powered design, XLR / 1/4-inch / stereo RCA inputs, balanced XLR line output, and lack of built-in Bluetooth.
- Corrected batch-03 photographs 01–02: POWERGIG was previously misread as a separate PowerGis device. The duplicate live row was deleted while its audit history was preserved.
- Verified canonical equipment version `2`, content SHA-256 `b9af4380126d7512f68a596592ee82abadcd94f676314fe98367555f72cef844`, update history ID `73`, and duplicate-delete history ID `74`.
- Read back 66 authoritative lines and 91 physical units: 45 user-confirmed, 7 physically verified, 14 recovery-required, and 61 with operating condition still unknown.
- Regenerated the private workbook with zero formula errors and visual QA; workbook SHA-256 is `3f7a2c6a1e66b8424415fc329bfe7ea120f03c4347b7cf51a8336e29b36c5b1f`.
- Created and internally verified the 11-entry private recovery package `Rowdy_Room_Rockville_RPG15_Correction_2026-07-20_PRIVATE.zip`, SHA-256 `d390027811651b096764f7344705adbeb4dd66163d2719580a642eaed2b80cba`.
- The Alto Bluetooth Total 2 receivers are now physically compatible with the RPG15 XLR inputs, but purchase/show use still requires an operating, stereo-link, and latency test. Show-critical audio remains wired.
- Updated the public-safe equipment and Current State summaries on draft pull request #28; the continuity branch remains unmerged.

## 2026-07-20 — Approximately $500 wireless projection package recorded

Status: Roger set a roughly $500 total budget for the exact TOWOND 120-inch screen and stand, an HDMI projector, point-to-point wireless HDMI, two lights with one remote, and two wireless adapters for the Rockville speakers.

- Recorded the current $455.19 pre-tax package plan: TOWOND B0DKN2MMDZ, HAPPRUN B0DT5VLVL8, Nyrius Orion Prime TDD20, NiceVeedi B0D5LPNF15, and two Alto Bluetooth Total 2 receivers.
- Preserved the correct OBSBOT path: OBSBOT USB to production PC and OBS, then PC HDMI through the dedicated wireless-HDMI link to the projector.
- Recorded the Orion Prime's official 90 ms latency and the absence of a named encryption specification; it is a budget compromise and is not described as private or encrypted.
- Recorded the ARIES Pro NPCS600 as the preferred low-latency upgrade, raising the package subtotal to $570.19 before tax.
- Added the Roger-confirmed pair of Rockville speakers to the protected inventory without guessing the model, power design, inputs, Bluetooth capability, stereo-link behavior, or condition.
- Gated purchase of the two Alto receivers on confirmation that the Rockville speakers are powered and have compatible XLR inputs.
- Confirmed that no item was ordered and no Amazon cart was changed.
- Refreshed the private workbook to 67 lines and 92 physical units, with zero formula errors and visual QA of all four sheets.

## 2026-07-20 — Authoritative show projection path corrected

Status: Roger clarified that “wireless” means a dedicated wireless-HDMI program-feed link, not ordinary screen mirroring.

- Recorded that the OBSBOT Tiny 2 Lite stays USB-connected to the production PC and normally appears inside the complete OBS program feed sent to the projector.
- Set the primary display transport to a dedicated point-to-point wireless HDMI transmitter and receiver connected to the projector's HDMI input.
- Kept wired HDMI as the emergency fallback and AirPlay/Miracast as secondary convenience methods only because screen mirroring can be blacked out or blocked.
- Recorded the owned OREI 1x2 splitter as the available split point for a local display and the wireless transmitter, subject to compatibility testing.
- Kept the transmitter/receiver kit out of owned inventory until it is purchased and verified.
- Required explicit encryption before any future kit is described as private or secure.
- Marked exact kit selection recovery-required pending room-distance, obstruction, latency, compatibility, encryption, and budget-scope confirmation.


## 2026-07-20 — Additional equipment photo batch appended

Status: Three additional photographs were appended to the existing equipment truth set after Roger resumed intake.

- Determined that the first two photographs show the label and control panel of the same PowerGis powered-audio unit and saved one recovery-required inventory line rather than two duplicates.
- Matched the third photograph to the existing onn. 32-inch Roku TV, model 100012589, and raised that record from user-confirmed to physically verified without adding another unit.
- Updated the protected Supabase inventory to 66 lines and 90 physical units: 44 user-confirmed, 7 physically verified, and 15 recovery-required.
- Confirmed the two affected item versions, content hashes, and audited history entries after the save.
- Regenerated the private master workbook with 66 lines, 90 units, live formulas, zero formula errors, and visual checks of every sheet and both changed equipment rows.
- Updated the public-safe equipment and Current State summaries on draft pull request #28; the branch remains unmerged.
- Preserved the three source photographs, updated private dataset, workbook, readbacks, and hashes in a dated private local recovery package.
- Left the PowerGis unit's exact model, electrical rating, complete connector layout, and operating condition recovery-required rather than guessing.

## 2026-07-20 — Current equipment intake processed and verified

Status: Roger confirmed the current upload pause, releasing the preserved intake for processing into the durable equipment truth system.

- Normalized the supplied text list and twenty preserved photographs into 65 deduplicated inventory lines representing 89 physical units.
- Kept package quantities explicit and treated photographs from multiple angles as one item.
- Saved 45 Roger-confirmed lines, 6 physically verified photo lines, and 14 recovery-required photo lines without guessing missing models, ratings, connectors, quantities, or condition.
- Kept serial numbers, device identifiers, private paths, raw photographs, and detailed condition notes out of the public repository.
- Saved the normalized inventory to the protected Supabase table and confirmed 65 valid item hashes, 65 insert-history rows, and one audited quantity correction.
- Repeated the retry-safe synchronization and confirmed that it produced no additional changes.
- Generated and visually verified the private master workbook with 65 lines, 89 units, live summary formulas, private-field warnings, and zero formula errors.
- Updated the public-safe equipment and Current State summaries on draft pull request #28; no merge to `main` was performed.
- Left fourteen photo-derived lines recovery-required and sixty operating conditions unknown until Roger provides clearer labels or tests.
- Preserved the processed dataset, workbook, readback evidence, and source manifests in a dated private local recovery package.


## 2026-07-20 — Mandatory Law gate and breadcrumb enforcement

Status: Roger required the Operator Law to be the first and last audit for every prompt and action after repeated failures to act, preserve context, and verify durable saves.

- Added a mandatory full Operator Law read before the first substantive action after every prompt or continuation.
- Added an after-every-action compliance check and correction requirement.
- Added a mandatory final Law reread and compliance audit immediately before the final response.
- Created `docs/continuity/START_HERE.md` as the root public-safe breadcrumb map.
- Required every material change to record public paths and commits, safe private record identifiers with versions and hashes, continuity-check results, local recovery paths and hashes, unresolved gaps, and the next safe action.
- Updated repository agent instructions, the Project Bible, Current State, and the continuity runbook so future work cannot rely on the old startup order.
- During the final Law audit, found that Roger's raw equipment text batch still existed only in chat because processing was on hold.
- Preserved that raw batch without processing it in protected record `rowdy-room/equipment-pending-intake-2026-07-19` and a hashed private local recovery package.
- Confirmed the authoritative equipment inventory remains at zero rows while pictures and additional items are pending.
- Preserved the privacy split: public GitHub receives only public-safe breadcrumbs; private details remain in protected Supabase records and local recovery copies.
- Recorded that the continuity documents remain on draft pull request #28 and are not yet merged into `main`; the Operator Law and Project Bible are on `main`.

## 2026-07-19 â€” Durable equipment truth system activated

Status: The equipment inventory workflow is active and recoverable; the physical item list remains recovery-required with zero verified items.

- Confirmed the protected Supabase equipment inventory and equipment-history tables use forced row-level security and expose no grants to public application roles.
- Confirmed the prepare and audit triggers preserve item versions and content hashes, with nightly continuity snapshots already active.
- Created `Rowdy_Room_Equipment_Inventory_Master.xlsx` as the editable intake copy with dropdowns, private-field warnings, verification states, sync readiness checks, and a live recovery summary.
- Set Supabase as the authoritative private list, GitHub as the public-safe summary, the workbook as an intake copy, and dated local packages as independent recovery copies.
- Required every equipment addition, correction, replacement, failure, or retirement to be saved and read back from the private truth store before it is treated as authoritative.
- Kept the inventory at zero verified items because no manufacturer, model, quantity, connection, or condition was invented.
- Kept pull request #28 in draft; this equipment continuity update is not merged into `main`.

## 2026-07-18 â€” GitHub continuity sync restored

Status: Public-safe Main 4 sources and the final live verification record are saved to draft pull request #28 and verified by remote readback.

- Confirmed the connected GitHub identity remains the existing `rowdyroom` user account with administrator and push permission on `rowdyroom/rowdyroom`.
- Confirmed an actual write to the existing continuity branch succeeds after the earlier account usage limit.
- Saved the v2 panel adapter, Companion integration, Mission Control integration, v3 Rumble bridge source, public-safe logout handoff migration, and updated deployment notes.
- Saved the final production state and live-smoke verification record without publishing credentials, service-role keys, private infrastructure paths, or the protected recovery package.
- Kept pull request #28 in draft; this continuity save does not merge the branch into `main`.

## 2026-07-18 â€” Main 4 live surfaces activated

Status: Production database authority and all three current live surfaces are active and live-smoke verified.

- Activated the versioned Main 4 bundles in Companion, Mission Control, and the live Rumble game.
- Added duplicate-safe page fallbacks so clients holding an older cached app script still receive the new bundle without loading it twice.
- Verified one versioned Main 4 bundle per surface and no browser warnings or errors.
- Verified Companion renders eight ordered positions in both Queue and Rumble views.
- Verified Mission Control renders eight ordered positions in its live and host-control views, with the guarded host actions present.
- Verified the locked Rumble host dashboard contains one Main 4 panel, one individual-score container, four host actions, and eight ordered positions.
- Found that the game redraw removed the Main 4 panel immediately after host unlock, corrected it in the v3 Rumble bridge, and added duplicate-safe remount behavior.
- Verified the unlocked dashboard retains exactly one Main 4 panel, one individual-score container, four host actions, eight ordered positions, and the connected host status with no browser errors.
- Verified the normal dashboard logout returns to the login screen and clears the active Main 4 session token, lock owner, and heartbeat in the live database.
- Did not activate, finalize, or cancel a production Rumble during the smoke test.
- Cleared the credential field after the logout check and did not store or republish the host password.

## 2026-07-18 â€” Main 4 live surface bundles staged

Status: Server backup complete and versioned surface bundles uploaded; final loader activation and live smoke tests remain pending.

- Created a pre-deployment server backup covering Companion, Mission Control, the live Rumble game, buzzer, and wheel.
- Added a safer publishable-key adapter that does not send a publishable key as a bearer token.
- Added Companion lineup display integration, Mission Control host controls, Rumble individual-score tracking, automatic four-player-or-more activation, top-four finalization, and exhibition handling for smaller matches.
- Hardened the existing host logout handoff so authorized surfaces release the short-lived host lock when an action finishes.
- Uploaded the versioned Companion, Mission Control, and Rumble bundles to their live asset folders.
- Did not alter the TV/public-display domain because creating that domain still requires separate explicit approval.
- Left loader activation pending after the authenticated browser session was blocked before the final three edits; the live pages therefore remain on their previous behavior until those loader lines are added and smoke-tested.

## 2026-07-18 â€” Main 4 production database verified

Status: Production rotation authority installed and verified; live cPanel surface deployment remains pending.

- Installed the centralized Main 4 and regular-four rotation authority in the live database after Roger's explicit production approval.
- Passed a rollback-only production smoke test covering live qualifiers, signup rotation, Rumble score ordering, the exact 30-minute protection window, automatic expiry handoff, saved-cursor continuity, gift deduplication, and the public/service permission contract.
- Confirmed by live readback that the test left no retained test rows and the production state remained clean with all eight panel positions available.
- Corrected the engine-specific missing-index advisory and reran the production advisor checks.
- Kept the private migration, security details, and infrastructure information out of the public repository.
- Left the pull request in draft because the prepared browser adapter still needs deployment to the live cPanel surfaces.

## 2026-07-18 â€” Main 4 authority implementation prepared

Status: Public-safe application implementation verified; production database approval pending.

- Added the Mission Control Main 4 panel with all eight positions, live formula status, regular-rotation cursor, and Rumble protection countdown.
- Added guarded host actions for show start, live refresh, advancing the regular four, Rumble activation, score finalization, and cancellation.
- Added a browser-safe integration adapter for the Companion App, host dashboard, Rumble game, and public displays.
- Resolved duplicate qualification and tie behavior centrally and required four distinct Rumble results before the 30-minute guarantee can begin.
- Preserved vote, gift, and rotation history; the legacy destructive Rumble reset is replaced in the private migration by a history-preserving reset.
- Passed Main 4 contract tests, TypeScript validation, and a production application build.
- Kept the private database migration and security implementation out of the public repository.
- Recorded that Supabase made no production change because its safeguard requires Roger's explicit approval of the schema, permission, trigger, scheduled-expiry, and Realtime changes.

## 2026-07-18 â€” Main 4 post-Rumble handoff clarified

Status: Authoritative product rule confirmed by Roger.

- Set the Rumble winners' protected-position guarantee to end at exactly 30 minutes.
- At expiration, the protected four automatically return to the original formula using the current top two live-vote averages followed by the current top two gift contributors.
- Clarified that Rumble winners remain protected after expiration only if they qualify under the recalculated live standings.
- Confirmed that the other four panel spots retain their saved signup-order position and do not restart during the handoff.
- Required the centralized rotation authority to update the Companion App, host-control dashboards, public displays, and database together.

## 2026-07-18 â€” Main 4 and panel rotation formula confirmed

Status: Authoritative product rule confirmed by Roger.

- Defined all eight panel spots: four protected Main 4 positions and four regular rotation positions.
- Set the pre-Rumble Main 4 order to the top two performers by live-vote average, then the top two gift contributors.
- Set the other four spots to advance through the remaining queue in signup order, four people at a time.
- Confirmed that Main 4 remain in the repeated eight-person panel cycle while each new group of four regular members advances.
- Set post-Rumble protected positions by game score from highest through fourth-highest.
- Added a guaranteed 30-minute protection/cooldown before another Rumble can be activated.
- Confirmed that the regular queue resumes where it stopped before the Rumble rather than restarting.
- Marked tie, duplicate-qualification, short-finisher, and absence edge cases for one centralized implementation rule.

## 2026-07-18 â€” Durable continuity system

Status: Implemented with equipment recovery still open.

- Classified chats as temporary working context, not a permanent record.
- Added a required Current State handoff document.
- Added a public-safe equipment recovery inventory.
- Added repository-wide instructions requiring the Bible and continuity records to be loaded before Rowdy Room work.
- Established a verified save protocol covering GitHub, the private system of record, read-back checks, and dated local recovery copies.
- Established append-only private history and scheduled snapshots.
- Recorded that the exact equipment inventory, original Rowdy Room Progress conversation, and unreconciled private Bible records remain recovery-required.
- Prohibited inventing missing equipment or operational facts.



