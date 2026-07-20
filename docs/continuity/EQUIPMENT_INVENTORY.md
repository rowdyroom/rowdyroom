# Rowdy Room Equipment Inventory

**Status:** Durable inventory system active; item recovery required  
**Last reviewed:** 2026-07-19  
**Verified items:** 0

The durable equipment system is active. The prior physical equipment list is still not present in the recovered records, so no equipment has been invented or inferred to fill the gap.

## Pending unprocessed intake

On 2026-07-20, Roger's supplied equipment text batch was preserved in the protected private continuity store and a dated private local recovery package after the final Operator Law audit found that the batch still existed only in chat. It remains deliberately unprocessed because Roger said more pictures and items are coming.

- Private pending record: `rowdy-room/equipment-pending-intake-2026-07-19`
- Intake status: `pending-unprocessed`
- Authoritative equipment rows: 0
- Photos and additional items: pending
- Inventory processing: prohibited until Roger explicitly confirms the intake is complete

No private identifiers or raw equipment details from that batch are published in this public file.

This public file records only information that is safe to publish. Exact serial numbers, private storage locations, purchase records, credentials, network details, and other sensitive information belong only in the private inventory.

## Source-of-truth hierarchy

1. `public.rr_equipment_inventory` in the protected Rowdy Room Supabase project is the authoritative private equipment list.
2. `public.rr_equipment_history` preserves every saved version, and the continuity system includes nightly snapshots.
3. `Rowdy_Room_Equipment_Inventory_Master.xlsx` is the editable intake copy. A workbook row is not authoritative until it is saved to Supabase and read back successfully.
4. This GitHub file is the public-safe summary. It must never contain serial numbers, storage locations, private purchase records, credentials, or network secrets.
5. A dated local recovery package is created after material equipment changes.

## Verified public-safe inventory

| Category | Manufacturer | Model | Quantity | Primary show use | Verification |
|---|---|---|---:|---|---|
| _No recovered items yet_ |  |  |  |  | Recovery required |

## Item verification requirements

An item becomes authoritative only when at least one of these sources is recorded:

- the original Rowdy Room Progress conversation
- the private server-side Bible records
- Roger's direct confirmation
- a physical label, receipt, manual, or photograph confirmed by Roger

## Required save workflow

For every added, corrected, replaced, retired, or failed item:

1. capture the known manufacturer, model, quantity, primary use, connectivity, working status, and verification source without guessing
2. keep serial numbers, storage location, purchase details, and private notes only in private storage
3. save the structured item to Supabase and confirm its new version and content hash
4. confirm that the equipment-history trigger preserved the change
5. update this public-safe summary only when the item details are appropriate for a public repository
6. record pass, warning, or failure for Supabase, GitHub, and local recovery
7. create and verify a dated recovery package

If a manufacturer, model, quantity, connection, or condition is uncertain, leave it blank or mark it recovery-required. A plausible guess must never become an inventory fact.

## Recovery worksheet

Use these categories to rebuild the list without overlooking show-critical equipment:

- computers and tablets
- audio interface, mixer, and processing
- microphones and wireless microphone systems
- speakers, subwoofers, and monitors
- cameras and capture devices
- lighting and lighting control
- televisions, projectors, and audience displays
- networking and wireless video equipment
- controllers, keypads, and show-control devices
- stands, mounts, cables, power, cases, and adapters

Every recovered item must also be entered in the private structured inventory so its history and verification state are preserved.



