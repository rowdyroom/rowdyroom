# Rowdy Room Continuity Changelog

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



