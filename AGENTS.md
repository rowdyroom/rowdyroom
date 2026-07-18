# Rowdy Room continuity rules

These rules apply to every file in this repository.

## Before Rowdy Room work

1. Read `docs/ROWDY_ROOM_BIBLE.md`.
2. Read `docs/continuity/CURRENT_STATE.md`.
3. Read `docs/continuity/EQUIPMENT_INVENTORY.md` when the work depends on physical gear.
4. Read `docs/continuity/CHANGELOG.md` for recent decisions.
5. Verify that any referenced live system still matches the documented state before changing it.

## After a material change

1. Update the Bible or the appropriate continuity document.
2. Add a dated entry to the continuity changelog.
3. Commit the public-safe record to a branch before production deployment.
4. Mirror private or structured operational facts to the approved private system of record.
5. Read both saved copies back and record whether verification passed, warned, or failed.
6. Create a dated local recovery copy.
7. Do not call the work complete while a required save or verification is failing.

## Non-negotiable safeguards

- Chats are temporary working context and are never the only source of truth.
- Never invent missing equipment, decisions, credentials, or production state.
- Mark missing facts `Recovery required` until Roger or an authoritative record confirms them.
- Never publish secrets, serial numbers, private locations, customer information, credentials, or private infrastructure details.
- The public repository contains public-safe documentation only. Detailed equipment and operational records belong in the private system of record.


