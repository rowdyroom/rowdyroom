# RACC Control Center Shell and Movable Launchers

**Status:** Source verified; cumulative backup-first Windows installer built; live installation pending  
**Recorded:** 2026-08-07  
**Owner:** Roger Jamsek  
**Source surface:** ChatGPT Work / Codex

## Roger's approved correction

The Control Center must follow the supplied drawing and preserve the established functions:

1. **Extensions** across the top.
2. **Bookmarks** directly beneath Extensions.
3. A protected **page viewer** in the middle.
4. Circular **left** and **right** popout handles on the page edges.
5. **AI and external services** inside the left popout.
6. **Quick Actions** inside the right popout.
7. The **Private Fact Checker** below the page viewer.
8. Three separate circular controls at the lower right by default: **RR Chat**, **Customizer**, and **FreeTube**.
9. Each of the three circles can be dragged independently anywhere in the viewport and keeps its own saved position.

## Customizer correction

The Control Center was loading two customization systems. The old page-specific launcher remained in the page while shared Customizer v2 injected a purple pill.

The correction:

- retires the older visible Control Center launcher and toolbox;
- keeps shared Customizer v2 as the one visible customization system;
- changes the direct-page Customizer launcher from a pill to a 60-by-60 circular control;
- keeps compact **Edit Voice** and **Edit Panel** controls in embedded views;
- gives the Customizer launcher its own saved drag position;
- protects the top shelves, page viewer, popout handles, and popout shells from accidental deletion or displacement;
- applies a one-time shell revision that restores hidden or displaced required controls without erasing unrelated saved colors, text, themes, or page-specific styling.

## RR Chat and FreeTube correction

- RR Chat remains the one shared RACC voice/text communication source.
- RR Chat and FreeTube now use separate launcher hosts instead of moving as one stack.
- RR Chat and FreeTube each have their own saved drag position.
- A click still opens the intended tool; a drag moves the circle without opening it.
- Embedded RACC tools still inherit RR Chat from the parent workspace and do not create nested launchers.

## Cumulative installer

The new installer includes the verified consolidated Operations Workspace files plus this shell/customizer correction. Roger does not need to run the earlier consolidation installer first.

- Artifact: `ROWDY_CONTROL_CENTER_SHELL_CUSTOMIZER_FIX_V2_20260807.zip`
- SHA-256: `67a5a82ebd93ee1bdf9de8ffd72655c7a74bac07ce2f7b5512baa375cdb4abf7`
- Library: `libfile_f0bc6cdceaec81918950245fea1e599a`, version 0
- Installer: `INSTALL_CONTROL_CENTER_FIX.cmd`

The installer hash-verifies its package, creates and verifies a pre-install backup, installs only the listed source/test files, runs focused tests and HTTP checks, writes a report and manual rollback script, and automatically restores the backup if a required check fails.

## Verification evidence

Verified before delivery:

- Customizer JavaScript syntax: passed
- RR Chat/FreeTube launcher JavaScript syntax: passed
- Operations Workspace and registry JavaScript syntax: passed
- Inline JavaScript syntax across HTML pages: passed
- Focused integration tests: 16 passed, 0 failed
- Control Center unique IDs: passed
- Shell order and required-zone checks: passed
- Staged installer payload overlay: passed
- Package manifest: 14 of 14 files passed
- ZIP integrity: passed

## Install boundary

The code and cumulative installer are verified in the available source/staging environment. The corrected shell is **not claimed live-installed** on Roger's Windows RACC until the new installer reports:

`Control Center shell and Customizer fix installed and verified.`

A cached browser tab may require one `Ctrl+Shift+R`.

## Recovery required

- Run the cumulative installer on Roger's Windows RACC.
- Capture the exact backup, install-report, and rollback-script paths created by the installer.
- Confirm in the live browser that both side handles open their panels.
- Confirm RR Chat, Customizer, and FreeTube are circular, separate, independently draggable, and persist after refresh.
- Confirm the page viewer and Fact Checker remain in the intended order.
- The supplied source snapshot still lacks 26 unrelated historical runtime/config modules; the focused RACC tests do not invent or replace them.

## Exact next safe action

Extract `ROWDY_CONTROL_CENTER_SHELL_CUSTOMIZER_FIX_V2_20260807.zip`, double-click `INSTALL_CONTROL_CENTER_FIX.cmd`, wait for the exact installed-and-verified message, then perform the five live browser checks listed above.

## Durable recovery evidence

- Recovery package: `ROWDY_CONTROL_CENTER_SHELL_CONTINUITY_20260807.zip`
- Recovery SHA-256: `31e6ef186fee66b85794f282fa92d03a31abc6d158bc37f4c0312c794ffe5e4c`
- Recovery Library: `libfile_89c9de844588819192720d4bd61c5ee5`, version 0
- Protected record: `rowdy-room/racc-control-center-shell-launchers`, version 2 at this checkpoint
- Protected SHA-256: `8c147a70e4e2c805139a769ee4bab5f9761a34c7ea7a4126995579d59bbd331c`
- Continuity check run: `7b440b32-c39a-4e54-ba09-1c55f1e2469a`
- Check result: 7 passed, 1 warning, 0 failed
- The warning is intentional: live Windows installation and browser readback remain pending.

## 2026-08-07 refinement: movable side controls and inspector

Roger's live readback found three remaining limitations: the LEFT/RIGHT handles could not be moved or resized, the popout windows could not be moved or resized, and the Selected Item inspector could not be moved.

The V3 correction:

- makes the left and right edge handles selectable, movable, and resizable in shared Customizer v2;
- makes both side popout windows selectable, movable, and resizable;
- keeps these four required shell controls protected from deletion;
- lets a click on a side handle open its panel while a drag moves the handle;
- automatically selects the opened panel during customization;
- keeps panel close controls usable during customization and returns selection to the corresponding handle;
- makes the Selected Item inspector draggable by its header;
- makes the inspector resizable and saves its position and expanded size;
- prevents collapsing the inspector from overwriting its saved expanded size.

V3 cumulative installer:

- Artifact: `ROWDY_CONTROL_CENTER_SHELL_CUSTOMIZER_FIX_V3_20260807.zip`
- SHA-256: `bfeea108bb6b9d54ea8db24e2b79c32e5b3843b52fa38398bab79fcdf93d4d53`
- Library: `libfile_84c4e81ac9c08191b12c35ea6fcc0054`, version 0
- Installer: `INSTALL_CONTROL_CENTER_FIX_V3.cmd`
- Staged integration tests: 18 passed, 0 failed
- Package manifest: 14 of 14 passed
- ZIP integrity: passed

Live installation remains pending until the V3 installer reports: `Control Center movable panels and Customizer fix installed and verified.`
