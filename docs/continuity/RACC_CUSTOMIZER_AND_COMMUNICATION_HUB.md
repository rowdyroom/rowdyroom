# RACC Customizer v2 and Shared Communication Hub

**Status:** Roger reported installer completed with installed and verified; exact Windows paths and complete cross-page readback pending  
**Recorded:** 2026-08-07  
**Owner:** Roger Jamsek  
**Source surface:** ChatGPT Work / Codex

## Approved outcome

Roger approved a shared Customizer v2 and one internal communication hub across the 18 Rowdy AI Command Center pages.

- All 18 direct RACC pages load the same Customizer v2 CSS and JavaScript.
- Direct pages show **Customize**.
- Embedded Rowdy Companion voice chat shows **Edit Voice**.
- Other embedded RACC panels show **Edit Panel**.
- The Rowdy Companion uses the same pathname-based saved customization state in standalone and embedded views, so voice-popout layout changes follow that popout wherever it opens.
- **Use on all pages** stores the shared global page theme, and same-origin open pages react to its storage update.
- Item-level changes remain page-specific unless the item is the shared Rowdy Companion. Unrelated page elements are not cloned blindly across different pages.
- Every non-companion RACC page loads the same Rowdy Robots voice/text launcher.
- `rowdy-companion.html?embed=1` is the single internal RACC communication surface.
- The companion page does not load another launcher inside itself.
- Older Guided Builder and Lucian Command Center chat forms are retired from view to prevent competing internal communication paths. Their approval and work controls remain available.
- ChatGPT Team Handoff remains an explicit external handoff tool; it is not treated as a second internal RACC chat hub.

## Customizer v2 capabilities retained

- Direct click selection
- Drag movement and eight resize handles
- Exact width/height and automatic sizing
- Duplicate, cross-page clipboard, copy/paste style
- Soft deletion with Trash restore
- Undo and redo
- Page themes and local background media
- Exported page layout
- Dynamic registration for page content created after load

## Evidence

Verified against the source package before delivery:

- JavaScript syntax checks: passed
- Shared integration tests: 7 passed, 0 failed
- ChatGPT Team Handoff packet: current Customizer, single-hub communication law, layout authorization, consolidated-workspace boundary, and install status passed.
- DOM smoke test: all 18 direct pages passed
- Embedded smoke tests: Rowdy Companion **Edit Voice** and another embedded panel **Edit Panel** passed
- Core edit smoke tests: selection, sizing, auto-fit, duplicate, delete, and restore passed
- Installer archive test: passed
- Installer package: `ROWDY_CUSTOMIZER_V2_VOICE_AND_SHARED_CHAT_FIX_20260807.zip`
- Installer package SHA-256: `1c47f58c6a6e4fb1e6dbf3113d9b733978d205d6814d7ddb463348be90fdc7dd`
- Protected record: `rowdy-room/racc-customizer-communication-hub` v3, SHA-256 `0c751d5434dd85458e27169ec64f85311db3bfa7be041bed76ff384e22f5d183`.
- Dated continuity recovery: `ROWDY_CUSTOMIZER_COMMUNICATION_CONTINUITY_20260807.zip`, SHA-256 `247181da5cbd1c05a08410a50f115c8367e7acb68052f2f10802d8ec63b113ef`; ZIP integrity passed.
- Continuity check run: `cacdf030-abfa-4073-9289-d6a2baa2e5f9` — 6 pass, 1 warning, 0 fail. The warning is the pending live Windows install/readback.

## Installation and recovery behavior

The update installer:

1. Finds the authoritative local RACC checkout.
2. Hash-verifies its own package.
3. Creates and hash-verifies a pre-install backup.
4. Installs only the shared Customizer JavaScript, CSS, and integration test.
5. Runs syntax and integration tests.
6. Starts or reuses the local RACC server.
7. Verifies all 18 HTTP pages plus the embedded voice URL and served shared script.
8. Creates a manual rollback script.
9. Automatically restores the pre-install files if any required check fails.

## Installation report and remaining recovery

Roger explicitly reported that the installer displayed **installed and verified**. This supersedes the previous install-pending statement.

**Recovery required:**

- Exact Windows backup, install-report, and rollback-script paths were not supplied in this session.
- The provided browser screenshot confirms the voice popout appears in Control Center, but a complete cross-page live browser readback was not captured.
- Existing cached browser tabs may require one `Ctrl+Shift+R`.

## Exact next safe action

Preserve the installer-success report as current. During the next live Windows verification, capture the exact backup/report paths and confirm **Edit Voice**, **Edit Panel**, and the one RR Chat launcher across representative direct and embedded pages.
