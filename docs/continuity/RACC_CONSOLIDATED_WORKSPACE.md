# RACC Consolidated Workspace

**Status:** Source verified; backup-first Windows installer built; live installation pending  
**Recorded:** 2026-08-07  
**Owner:** Roger Jamsek  
**Source surface:** ChatGPT Work / Codex

## Approved outcome

Roger authorized consolidation and refinement of the Rowdy AI Command Center while preserving every function, ability, use-case scenario, compatibility route, approval boundary, and recovery path.

The user-facing system now has two primary workspaces and one shared communication component:

1. **Rowdy Control Center** — front door, status, customization, external services, and high-level task choices.
2. **Rowdy Operations Workspace** — the single unified work surface for all original RACC tools.
3. **Rowdy Companion / RR Chat** — the one internal voice and text communication component, available from every direct page and inherited from the parent when a tool is embedded.

The 18 original page routes remain available. The 15 original tool pages remain directly openable and are also loaded as modules inside Operations Workspace. Nothing is deleted or merged destructively.

## Four task flows

- **Run & Approve:** Mission Control, Lucian work controls, Robot memory/corrections, and ChatGPT Team Handoff.
- **Build & Manage the Team:** Guided Builder, Robot Team Lab, Model Library, and Training Console.
- **Connect & Verify:** API/device connectors, Website Connections, Terminal Tools, and Private Fact Checker.
- **Create Voice, Characters & Media:** Voice Studio, Character Studio, 3-Camera Motion Editor, and Animation Pose Guide.

## New workspace abilities

- Plain-language multi-word search with `Ctrl+K` or `/`
- Favorites and recent tools stored locally in the browser
- Guided “I want to…” recipes for the established operating cheat-sheet scenarios
- Hash deep links to an exact flow or tool
- Reload, full-screen, and open-separately module controls
- Responsive desktop, tablet, and phone layouts
- Control Center embeds only the unified workspace instead of six competing tool tabs
- Embedded tools inherit RR Chat from their parent and do not create nested launchers
- Direct standalone pages still load the one shared RR Chat launcher
- ChatGPT Team Handoff includes this architecture and the current install boundary

## Compatibility and security boundaries

- All 18 original local routes remain present.
- All 15 original tool pages remain available as direct compatibility endpoints.
- Rowdy Companion is intentionally not duplicated in the module registry.
- ChatGPT Team Handoff remains an explicit external handoff, not an internal chat replacement.
- Secure LAN pages and external account pages retain their separate authentication boundaries.
- Customizer v2 remains available on every direct page; embedded modules use **Edit Panel** and the embedded companion uses **Edit Voice**.

## Verification

Verified against the supplied source snapshot before delivery:

- JavaScript syntax: passed for the registry, Operations Workspace, and Customizer
- Inline JavaScript syntax: passed across all HTML pages
- Focused integration tests: 13 passed, 0 failed
- Operations Workspace interaction smoke: passed for groups, guides, deep links, embedded routing, favorites, multi-word search, and RR Chat event
- Customizer DOM smoke: 18 direct pages passed
- Embedded voice/panel modes and core edit actions: passed
- HTTP compatibility smoke: 18 of 18 routes passed
- Shared workspace asset HTTP smoke: passed
- ZIP integrity and internal package hashes: passed
- Installer artifact: `ROWDY_RACC_CONSOLIDATED_WORKSPACE_V1_20260807.zip`
- Installer SHA-256: `e136249ae22c72265b53a4922ec92c373b5b2690b668cd87e949d7d8191edf0a`
- Installer Library file: `libfile_d2c83f65b4fc819186d7182ce931c00e`, version 0

The supplied source snapshot is incomplete for the unrelated historical full `npm test` suite: 26 pre-existing runtime/config modules are absent. The focused consolidation and Customizer suites are complete and passed. No missing runtime module was invented or replaced.

## Installer and recovery behavior

The backup-first installer:

1. Finds the authoritative Windows RACC checkout.
2. Hash-verifies every package file.
3. Creates and hash-verifies a pre-install backup of all ten changed/new files.
4. Installs the consolidated workspace files.
5. Runs JavaScript syntax and the focused integration tests.
6. Starts or reuses the RACC server.
7. Verifies all 18 HTTP routes, embedded workspace, served workspace assets, and shared-chat rules.
8. Creates a manual rollback script.
9. Automatically restores the pre-install state if any required check fails.

## Previous voice/shared-chat correction

Roger reported that the earlier 2026-08-07 voice/shared-chat installer displayed **installed and verified**. The exact Windows backup/report paths and a complete live cross-page browser readback were not supplied in this session and remain **Recovery required**.

## Protected continuity record

- Record key: `rowdy-room/racc-consolidated-workspace`
- Version: 2
- SHA-256: `bd52cc4350ea436a74a9de95fa76f23e279ed48747a91f49fda1cbbbf26de19d`
- History versions: 2
- Status: active / source verified / install pending
- Recovery artifact: `ROWDY_RACC_CONSOLIDATION_CONTINUITY_20260807.zip`, SHA-256 `50585d61af63a2f793379d8723dafd95e0cdc775b34d490f248d0c1705792d80`, Library `libfile_505989d37e788191bc0494166ecc18fa` v0; ZIP integrity passed
- Prior Customizer record corrected to Roger-reported installed-and-verified: `rowdy-room/racc-customizer-communication-hub` v4, SHA-256 `98f51cdf5d8158c4ed2b85c595b6f9c7d94db5c0dfd6d720f13f0c7b030ef000`

## Recovery required

- The consolidated-workspace installer has not yet been run on Roger's Windows RACC checkout.
- Live browser readback of the consolidated Control Center and Operations Workspace remains pending.
- The exact Windows backup, report, and rollback paths will be created by the installer.
- The source snapshot's 26 missing historical runtime/config modules remain outside this consolidation package.

## Exact next safe action

Extract `ROWDY_RACC_CONSOLIDATED_WORKSPACE_V1_20260807.zip`, run `INSTALL_CONSOLIDATED_WORKSPACE.cmd`, wait for **Consolidated Rowdy Workspace installed and verified**, then open Control Center and confirm the four task flows plus one RR Chat.
