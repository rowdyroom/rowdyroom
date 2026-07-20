# Rowdy Room Equipment Inventory

**Status:** Durable inventory active; current intake processed and verified  
**Last reviewed:** 2026-07-20  
**Authoritative inventory lines:** 67  
**Physical units represented:** 92

Roger's current text list and twenty-three preserved equipment photographs have been processed into the protected private equipment inventory. Multiple photographs of the same item were deduplicated, package quantities were preserved, and uncertain identifications were marked recovery-required instead of guessed.

No serial numbers, device identifiers, storage locations, purchase details, private notes, or raw photographs are published in this public file.

The latest equipment-use correction keeps the OBSBOT Tiny 2 Lite connected by USB to the main production PC. The camera is composed inside OBS, and the complete OBS program is sent from the PC by HDMI through a dedicated point-to-point wireless HDMI transmitter/receiver to the projector. Ordinary AirPlay or Miracast screen mirroring is secondary only because protected or restricted content can black out. The planned transmitter/receiver kit is not recorded as owned equipment until it is actually purchased.

Roger also confirmed ownership of two Rockville speakers. Their exact model, active/passive design, rear-panel inputs, built-in Bluetooth capability, stereo-link behavior, and operating condition remain recovery-required. Wireless speaker adapters must not be selected as compatible until those facts are confirmed.

## Current verification state

- 44 lines are Roger-confirmed from the supplied text list.
- 7 lines are physically verified from a readable product or label photograph.
- 16 lines remain recovery-required because a brand, model, rating, connector type, quantity, or operating condition is not fully confirmed.
- 3 lines have a confirmed working status.
- 2 lines have a confirmed needs-repair or partially functional status.
- 62 lines have an unknown operating status until they are tested.
- Future additions are allowed and append to this truth set; they do not replace the current inventory.

## Public-safe category summary

| Category | Inventory lines | Physical units |
|---|---:|---:|
| Audio interfaces, mixers & processing | 4 | 4 |
| Cables & adapters | 17 | 33 |
| Cameras & capture devices | 2 | 2 |
| Computers & tablets | 8 | 8 |
| Controllers, keypads & show control | 3 | 4 |
| Lighting & lighting control | 3 | 3 |
| Microphones & wireless microphone systems | 2 | 3 |
| Networking & wireless video | 1 | 1 |
| Power & battery equipment | 9 | 10 |
| Speakers, subwoofers & monitors | 5 | 6 |
| Stands, mounts & cases | 10 | 15 |
| Televisions, projectors & audience displays | 3 | 3 |
| **Total** | **67** | **92** |

## Source-of-truth hierarchy

1. `public.rr_equipment_inventory` in the protected Rowdy Room Supabase project is the authoritative private equipment list.
2. `public.rr_equipment_history` preserves each saved version and its content hash.
3. `Rowdy_Room_Equipment_Inventory_Master.xlsx` is the private editable working copy generated from the verified inventory.
4. This GitHub file is the public-safe status summary.
5. Dated private local recovery packages preserve the normalized inventory, workbook, source manifests, and readback evidence.

## Current private-save evidence

The protected readback confirms:

- 67 authoritative rows
- 92 physical units
- 67 valid item content hashes
- 67 insert-history records
- one audited quantity correction
- one audited photo-verification update
- one audited OBSBOT show-use and projection-path update
- aggregate inventory SHA-256 `a876cd583d7c87e9ca75dc8ae10b909f698008a62bf03f0e856c4c25d97bbbe7`

The safe intake record key is `rowdy-room/equipment-pending-intake-2026-07-19`. Protected content, versions, hashes, checks, and local recovery locations are recorded in `docs/continuity/START_HERE.md`.

## Required save workflow

For every added, corrected, replaced, retired, or failed item:

1. capture only known manufacturer, model, quantity, primary use, connectivity, working status, and verification source
2. leave uncertain facts blank or mark them recovery-required
3. keep serial numbers, private storage, purchase details, and private notes only in protected storage
4. save the structured item to Supabase and read it back
5. confirm the equipment-history trigger preserved the change
6. update this public-safe summary only with non-sensitive totals or approved facts
7. create and verify a dated private recovery package
8. update the root breadcrumb in `docs/continuity/START_HERE.md`

A plausible guess must never become an inventory fact.
