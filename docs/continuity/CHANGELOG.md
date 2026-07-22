# Rowdy Room Continuity Changelog

## 2026-07-22 — TV display access correction

Status: Existing live TV display verified; homepage and Mission Control access repair staged, not deployed.

- Live readback corrected the historical domain-pending claim: `https://tv.rowdyroom.site/` now returns HTTP 200 and serves the Rowdy Room Live Rotation display.
- Its existing queue/performance requests return HTTP 200. The defect is discoverability: homepage and Mission Control currently contain no TV Display link.
- Added `deploy/tv-display-access-repair/rowdy-install-tv-display-links.php`. It is backup-first, exact-marker guarded, idempotent, and adds only the homepage sticky TV Display action and Mission Control Setup → Displays link.
- The earlier `deploy/tv-display/` source candidate is retained unmerged for recovery only and is not authorized to replace the current live TV implementation.
- Access-repair source commit: `797ac8ae4ddbe78a5fc2ae6e9fec5f9fcb9d1df8`. Protected recovery package: `Rowdy_Room_TV_Display_Link_Repair_2026-07-22_PRIVATE_RECOVERY.zip`, SHA-256 `779743A35715BCAF8F6FBCF8A355F242DE9D4690208DF27A2D0D2544D7B345CE`.
- Remaining blocker: cPanel write access is not available in this task. Run the installer against the verified public_html targets, then delete it and smoke-test both links.

## 2026-07-22 — Standalone TV display source staged

Status: Source-ready; not live until the reserved cPanel subdomain exists and passes deployment gates.

- Added the independent `deploy/tv-display/` release: a 16:9 public karaoke display, a same-origin PHP queue adapter, and an exact deployment manifest.
- Preserved product separation: no Rumble route, score, team, wheel, buzzer, game control, or Mission Control content is present.
- The adapter uses the fixed existing Companion bootstrap endpoint, exposes only display-safe queue fields, accepts no user input, and makes no queue changes.
- JavaScript syntax, a 16:9 no-overflow visual layout, a neutral queue-unavailable fallback, and the Companion QR target passed. PHP lint is unavailable locally; live PHP/queue/television verification remains pending.
- Public-safe source is on branch `agent/standalone-tv-display-2026-07-22`; source commit `8cec95eff3f3c38c5ce762661e760ea8a71e7dc0`.
- Protected record: `rowdy-room/standalone-tv-display`, v1, SHA-256 `03e100829d7c8d9421d1521102575103f11bf1abb2f639c9a1f8386cf7e348cd`.
- Recovery package: `Rowdy_Room_TV_Display_2026-07-22_PRIVATE.zip`, SHA-256 `F9EAE3CC3736685F98BE47D1F1580D03240816CCC60072E0BCDF8202A6994EFE`, six entries.
- Remaining blocker: create and verify `tv.rowdyroom.site` with document root `/home/ef39cr6m1vih/public_html/tv.rowdyroom.site`, then back up, deploy, and live-smoke-test it.

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



