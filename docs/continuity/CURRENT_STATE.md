# Rowdy Room Current State

## Lucian secure private-network access — 2026-07-31

- The secure gateway is active on the host's Windows Private network and proxies only to loopback RACC.
- Authentication, encrypted sessions, origin/host/private-client gates, login throttling, and Private/LocalSubnet firewall scope passed.
- RACC and voice ports remain loopback-only; no router or public-internet exposure was added.
- Host-side HTTPS and browser acceptance passed with exact `LAN_OK`, zero console errors, and 61/61 automated tests.
- Recovery package SHA-256: `77f27604c4ed34575ec80169c65904716e2afc0808e87290199ba26cb8c7769b`.
- Physical second-device certificate enrollment and login remain `Recovery required`.


**Status:** Active public-safe handoff record  
**Last updated:** 2026-07-31  
**Owner:** Roger Jamsek

Read this after the complete Operator Law, `docs/continuity/START_HERE.md`, and the Project Bible. Missing or contradictory facts remain **Recovery required**.

## Active project continuation

### 2026-07-31 Lucian local communication and voice

Roger's priority override is complete: a compact local Lucian Command Center, reusable floating launcher, and private Rowdy Bot Voice Studio are implemented and verified. The Voice Studio runs a local CUDA neural engine, requires ownership/permission for reference voices, and requires separate confirmation for each generation. The primary 24 kHz acceptance WAV is 4.52 seconds, 217,004 bytes, SHA-256 `a1e8bb5bc15eabd324e9e1ceb77cbf9fcce08f8099a5b0de7cd558bcb70ba2ec`. The automated suite passed 58/58, and browser checks passed with zero console errors.

The same-computer launcher is verified. Cross-device LAN access remains **Recovery required** until authenticated HTTPS access, firewall scope, and device enrollment are designed. Public detail: [Lucian Command Center and Rowdy Bot Voice Studio](../rowdy-robots/LUCIAN_COMMAND_CENTER_VOICE_STUDIO.md).

The current product continuation is **Build Portable AI Computer**.

### 2026-07-30 operational confirmation

Roger confirmed that he fixed the CPU cooler, the computer is operational, and temperatures observed in Radiograph look good. This is a user-confirmed operational result; exact temperature readings and representative show, TikTok Live Studio, local-AI, stability, and extended thermal tests remain **Recovery required**. This update does not confirm the currently installed case, GPU, exact CPU-cooler model, drive layout, fan plan, or PSU-clearance result.

- Donor system: Roger's current working main production PC.
- Current donor baseline: Ryzen 7 5700X, MSI MAG B550 TOMAHAWK MAX WIFI, 48 GB RAM, RTX 3070, about 2.27 TB storage, Windows 11 Pro.
- Roger confirmed purchase of the Cooler Master QUBE 540 and ASUS Dual GeForce RTX 5060 Ti OC Edition 16GB GDDR7 (DUAL-RTX5060TI-O16G).
- The purchased parts are recorded as owned but not yet received, physically inspected, installed, or tested.
- The RTX 3070 remains the installed working GPU until the new card is installed and verified.
- Retain the MSI motherboard and 48 GB RAM initially. A replacement motherboard is not currently planned.
- The existing Corsair RM1200x SHIFT 1200 W PSU is user-confirmed; QUBE 540 side-cable clearance remains to be verified.
- Required workloads: karaoke, DJ work, AI workflows, local video-generation work, Rowdy Room tools, and TikTok Live Studio.
- Roger does **not** use OBS. OBS must not be included in this project.
- The OBSBOT Tiny 2 Lite is normally Roger's personal home-streaming camera.
- The projector is primarily for live events.
- The prior OBS-based projection path and approximately $500 AV-package plan are superseded and must not drive architecture or purchasing.
- The exact live-event projector source, content, and routing remain **Recovery required**.
- An older laptop is not part of the authoritative inventory and is not part of this build plan.
## Authoritative equipment state

Protected Supabase readback on 2026-07-21 confirms:

- 68 inventory lines
- 93 physical units
- 47 user-confirmed lines
- 7 physically verified lines
- 14 recovery-required lines
- 63 lines with unknown operating condition
- 3 confirmed working lines
- 2 lines needing repair
- aggregate inventory SHA-256 `a6037fb817234aa509e629c237699c5adbf346d7137d0852c9c392cddd5c7754`

The working donor PC is equipment key `main-production-pc-ryzen-5700x`. The two newly purchased lines are:

- `asus-dual-rtx5060ti-o16g`: version 1, user-confirmed owned, operating status unknown, SHA-256 `7e3c427a9538ecc875cd7af68c508182bee4d719ac79eb19d43383edf86f52fa`
- `cooler-master-qube-540-case`: version 1, user-confirmed owned, operating status unknown, SHA-256 `228e44358f92f3cf3cb303fd89a78e651c92866f3de085a0750be6ef2e5ff570`

Useful owned portable components include the ARZOPA A1S portable monitor, Anker 11-in-1 USB-C dock, UGREEN 200 W charger, Yamaha AG06MK2 USB mixer/interface, Elgato Stream Deck, and other recorded show equipment. Their operating condition remains unknown unless the private inventory says otherwise.

The existing private workbook predates the 2026-07-21 purchase and project-plan corrections. Supabase remains authoritative; regenerate the workbook before the next equipment intake or workbook-led edit.
## Production and Main 4 state

Main 4 is already implemented and operational:

- the centralized database authority is installed
- Companion, Mission Control, and Rumble integrations are active
- live surfaces passed smoke testing, including host unlock, logout, and lock release
- no production Rumble was activated or finalized during verification

This project-plan correction does not change production show systems.

## Continuity authority

- Operator Law: `docs/ROWDY_ROOM_OPERATOR_LAW.md` on `main`
- Project Bible: `docs/ROWDY_ROOM_BIBLE.md` on `main`
- Portable AI computer handoff: `docs/continuity/BUILD_PORTABLE_AI_COMPUTER_HANDOFF.md` on `main`
- Current State, Equipment Inventory, Changelog, Runbook, full public breadcrumb, and pets records: `main`
- Private truth: Supabase project `Final`, ref `szubjgpvlqliyparrnam`
- Pull request #28: closed and merged on 2026-07-22 at `8ad1c435ff50a67bb142b6b2bbfeb0e41310812e`

## Protected continuity readback

- `rowdy-room/current-state`: version `30`, SHA-256 `02a599bdc7b229b089cf781be4aa6adff342b064870c25d722829784b22b8964`, history ID `141`
- `rowdy-room/equipment-recovery`: version `14`, SHA-256 `df5679c3e908f777a4874294fa526e13a71c6742762b0c2b46e21394e417fad6`, history ID `125`
- `rowdy-room/show-projection-signal-path`: version `3`, SHA-256 `a9329a679b13d72912f4d4849975a974f165cd4daef2361b8a3996449462d90b`, status `recovery-required`
- `rowdy-room/av-package-budget-2026-07-20`: version `4`, SHA-256 `e6a16b1f512cf2ca6343d0d912b9f344d833ca3135164f084c2c259c29124f11`, status `superseded`

Purchase-save verification: local recovery archive `Rowdy_Room_Portable_PC_Purchases_2026-07-21_PRIVATE.zip`, SHA-256 `10b9eb55fc361a2b656f9ec0725073c6b75676e1001e46d6f36b551d9fc881c5`, 4 entries, 3/3 internal hashes passed. Check run `942cfd79-cd4d-4cb9-b728-f8f803d1cf47`: 7 pass, 2 warn, 0 fail.

## Recovery required

- physical receipt and inspection of the purchased QUBE 540 and ASUS Dual RTX 5060 Ti 16GB
- exact installed CPU-cooler model; the cooler is fixed and the computer is operational by Roger confirmation
- current drive layout and desired drive retention
- currently installed case and GPU
- RM1200x SHIFT side-cable clearance in the QUBE 540
- required case-fan plan
- exact Radiograph readings and representative GPU, display-output, TikTok Live Studio, local-AI workload, stability, and extended temperature tests
- 14 partially identified equipment lines
- 63 operating-condition tests
- exact live-event projector source, content, and signal path
- original Rowdy Room Progress conversation export
- private server-side `rowdyroom_bible` reconciliation
- workbook regeneration before the next equipment intake or workbook-led edit
## Exact next product action

Confirm the currently installed case, GPU, CPU-cooler model, drive layout, and fan/PSU-clearance state. Then capture exact Radiograph readings during representative show, TikTok Live Studio, and local-AI workloads before closing the portable-computer build. Do not infer any unconfirmed installed part from the system-level operational report.
