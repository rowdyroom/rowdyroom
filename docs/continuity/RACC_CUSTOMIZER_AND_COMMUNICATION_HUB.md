# RACC Customizer v2 and Shared Communication Hub

**Status:** Installer package built and locally verified; live Windows installation pending Roger's installer run  
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
- Shared integration tests: 6 passed, 0 failed
- DOM smoke test: all 18 direct pages passed
- Embedded smoke tests: Rowdy Companion **Edit Voice** and another embedded panel **Edit Panel** passed
- Core edit smoke tests: selection, sizing, auto-fit, duplicate, delete, and restore passed
- Installer archive test: passed
- Installer package: `ROWDY_CUSTOMIZER_V2_VOICE_AND_SHARED_CHAT_FIX_20260807.zip`
- Installer package SHA-256: `0b877ba3aa7bb5f164118c4836d986b7e421fa30a8d2a25c990d0ae077b13910`
- Protected record: `rowdy-room/racc-customizer-communication-hub` v2, SHA-256 `715c2c4e047ea561d9f271303d93d72d3e163ec5f0c3031493c0b0e51e9a7f0f`.
- Dated continuity recovery: `ROWDY_CUSTOMIZER_COMMUNICATION_CONTINUITY_20260807.zip`, SHA-256 `5571b951cc0a6b739c44ad3fa8adcb80f57ca362650574c1b1afba2aaf116354`; ZIP integrity passed.
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

## Recovery required

- The delivered 2026-08-07 voice/shared-chat update is not recorded as installed on Roger's Windows PC until its installer reports **installed and verified**.
- Live browser readback after installation remains pending.
- Existing cached browser tabs may require one `Ctrl+Shift+R`.
- The current continuity runtime cannot write the required Windows recovery copy directly. The installer creates it during the local installation.

## Exact next safe action

Roger extracts `ROWDY_CUSTOMIZER_V2_VOICE_AND_SHARED_CHAT_FIX_20260807.zip`, runs `INSTALL_VOICE_AND_SHARED_CHAT_FIX.cmd`, and reports the install result. After a verified success, update this record from **installation pending** to **live installed and verified**.
