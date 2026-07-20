# Rowdy Room continuity rules

These rules apply to every file in this repository.

## Before Rowdy Room work

1. Read all of `docs/ROWDY_ROOM_OPERATOR_LAW.md` as the first substantive action after every prompt or continuation.
2. Read `docs/continuity/START_HERE.md` and follow every breadcrumb applicable to the request.
3. Read `docs/ROWDY_ROOM_BIBLE.md`.
4. Read `docs/continuity/CURRENT_STATE.md`.
5. Read `docs/continuity/EQUIPMENT_INVENTORY.md` when the work depends on physical gear.
6. Read `docs/continuity/CHANGELOG.md` for recent decisions.
7. Read `docs/continuity/CONTINUITY_RUNBOOK.md` before a material change.
8. Verify that any referenced live system still matches the documented state before changing it.
9. Identify every available in-scope tool and do safe work directly when it is available instead of transferring it to Roger.

## After every action

1. Compare the action and its actual result against `docs/ROWDY_ROOM_OPERATOR_LAW.md` before taking the next action.
2. Correct any missed requirement that can still be corrected safely.
3. Record an exact blocker or failed verification instead of claiming completion when it cannot be corrected.
4. Before the final response, read the Operator Law again and complete a final compliance audit.

## After a material change

1. Update the Bible or the appropriate continuity document.
2. Add a dated entry to the continuity changelog.
3. Commit the public-safe record to a branch before production deployment.
4. Mirror private or structured operational facts to the approved private system of record.
5. Read both saved copies back and record whether verification passed, warned, or failed.
6. Create a dated local recovery copy.
7. Update `docs/continuity/START_HERE.md` when the location, branch, commit, private record, recovery path, or unresolved status changes.
8. Leave a dated breadcrumb containing the public path and commit, safe private record identifiers and version/hash, local recovery path and hash, unresolved gaps, and next safe action.
9. Do not call the work complete while a required save, breadcrumb, or verification is failing.

## Non-negotiable safeguards

- Chats are temporary working context and are never the only source of truth.
- Never invent missing equipment, decisions, credentials, or production state.
- Mark missing facts `Recovery required` until Roger or an authoritative record confirms them.
- Never publish secrets, serial numbers, private locations, customer information, credentials, or private infrastructure details.
- The public repository contains public-safe documentation only. Detailed equipment and operational records belong in the private system of record.


