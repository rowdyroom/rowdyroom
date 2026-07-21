# Rowdy Room Equipment Inventory

**Status:** Durable inventory active; 2026-07-21 use correction verified  
**Authoritative inventory lines:** 66  
**Physical units represented:** 91

Supabase `public.rr_equipment_inventory` is the authoritative private inventory. This file is a public-safe summary and contains no serial numbers, private locations, raw photographs, purchase details, or private notes.

## Current verification state

- 45 user-confirmed lines
- 7 physically verified lines
- 14 recovery-required lines
- 3 confirmed working lines
- 2 needs-repair lines
- 61 lines with unknown operating condition
- 66 valid live-item content hashes
- aggregate inventory SHA-256 `cfe3cc36e5f8842b4a07df301ac46dc53fdb1bc453ef55730ca581ed82c8d5f2`

## OBSBOT and streaming correction

The OBSBOT Tiny 2 Lite is owned and normally used as Roger's personal home-streaming AI-tracking camera. Roger uses TikTok Live Studio, not OBS. The camera is not assumed to be part of a projector feed, and projector routing requires a separately confirmed live-event source path.

Protected evidence:

- equipment key `obsbot-tiny-2-lite`
- version `4`
- content SHA-256 `0071fa82403f8c212c2a47a4081dd49149bd74746e001b672507652caf73b42e`
- history ID `76`
- operating condition remains unknown

## Portable-computer baseline

Confirmed useful owned components include:

- working Ryzen 7 5700X Windows 11 Pro desktop, 48 GB RAM, RTX 3070
- working iPad Air M4
- working iPhone 17 Pro Max
- Anker 11-in-1 USB-C docking station
- ARZOPA A1S 14-inch 1080p portable monitor
- UGREEN Nexode 200 W charger
- Belkin 20,000 mAh 30 W USB-C power bank
- Yamaha USB mixer/interface
- Elgato Stream Deck
- OBSBOT Tiny 2 Lite

The protected inventory contains no verified portable Windows laptop or mini-PC capable of replacing the desktop. The older laptop and smaller desktop discussed previously remain **Recovery required** until their exact identity, specifications, and working condition are recorded.

The Yamaha inventory row currently says `AG06MK`; physical confirmation of `AG06MK` versus `AG06MK2` is still required.

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
| Speakers, subwoofers & monitors | 4 | 5 |
| Stands, mounts & cases | 10 | 15 |
| Televisions, projectors & audience displays | 3 | 3 |
| **Total** | **66** | **91** |

## Source-of-truth hierarchy

1. `public.rr_equipment_inventory` is authoritative.
2. `public.rr_equipment_history` preserves versions and hashes.
3. This GitHub file is the public-safe summary.
4. The existing master workbook is a historical intake copy until regenerated from the current Supabase readback.
5. Dated private local recovery packages provide independent restoration evidence.

## Required save workflow

Every equipment addition or correction must preserve the private row, history, readback, public-safe summary when applicable, checks, dated recovery evidence, and root breadcrumb. Unknown facts remain recovery-required.
