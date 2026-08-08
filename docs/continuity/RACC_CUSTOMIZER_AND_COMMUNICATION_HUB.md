# RACC Customizer v2 and Shared Communication Hub

**Status:** V4 install attempt failed one obsolete display-label test and rolled back cleanly; corrected V4.1 is source/package verified and awaits live Windows installation  
**Recorded:** 2026-08-07  
**Owner:** Roger Jamsek  
**Source surface:** ChatGPT Work / Codex

## Approved outcome

Roger approved a shared Customizer and one internal communication hub across the Rowdy AI Command Center.

- All 18 direct RACC pages load the same shared Customizer.
- Direct pages show **Customize**; embedded Rowdy Companion shows **Edit Voice**; other embedded panels show **Edit Panel**.
- Saved Rowdy Companion changes follow the same voice popout wherever it opens.
- The central Page Viewer and unrelated shell zones remain protected.
- RR Chat, Customizer, and FreeTube remain separate draggable circles with saved positions.
- The left and right shell handles and their popout windows remain selectable, movable, resizable, and protected from deletion.
- The Selected Item inspector remains movable, resizable, and persistent.
- `rowdy-companion.html?embed=1` is the one internal RACC voice/text communication surface.
- Older duplicate chat forms remain retired from view; approval, work, and ChatGPT Team Handoff controls remain available.

## Three-seat RR Chat

- Three saved Robot dropdown seats prevent duplicate Robot choices.
- Three selected Robot faces appear together and are monitored at the same time.
- A seat number or avatar selects the focused Robot.
- Each seat has an optional **In chat** choice; the focused Robot is always included.
- Text and voice follow-ups can include the joined Robots in one visible conversation.
- One approved-model picker changes and saves the focused Robot's real runtime model.
- Saved model overrides load again when the server starts.
- The old technical header, Bots button, long personality paragraph, duplicate bot strip, and unavailable realtime pill are removed.
- The useful summary shows Robots on screen, Robots in chat, focused Robot, its current model, and voice readiness.
- Header, team summary, Robot seats, individual seats, model panel, avatar lineup, individual avatars, approvals, transcript, voice controls, text form, and attachments are separate Customizer targets.

## V4 failed attempt and automatic recovery

Roger ran V4 on 2026-08-07 at about 23:07 Central time.

- Package and file copying reached the test gate.
- The presence test still expected the removed client text token `voiceRoute`.
- That assertion belonged to the old technical display and did not prove a missing live route.
- The installer stopped, restored the exact pre-install files, restarted RACC on port 4317, and reported automatic rollback complete.
- V4 is superseded and must not be run again.
- The exact Windows report path is retained only in the protected continuity record.

## V4.1 correction and evidence

V4.1 replaces the obsolete screen assertions with checks for:

- the live voice-health endpoint
- the current speech-recognition health result
- the simple **Voice ready** display
- the existing wake listener and voice-wake path

The corrected installer also runs the separate Rowdy voice-chat unit test, where the backend `voiceRoute` behavior belongs.

Verified before delivery:

- JavaScript syntax: passed
- Shared page, consolidated workspace, and Customizer tests: 19 passed, 0 failed
- RR Chat screen, three-seat, model-save, and inner-Customizer checks: 36 passed, 0 failed
- Package manifest: 12 passed, 0 failed
- ZIP integrity: passed
- Corrected installer: `ROWDY_RR_CHAT_THREE_SEAT_CUSTOMIZER_V4_1_20260807.zip`
- Corrected installer SHA-256: `9bf4557442711e2d3186930003178d771599adae6376d4ba0b38e7b5888ec728`
- Stable Library record: `libfile_029d003d32488191b62e780a7e0b699e`, version 1

## Recovery required

- Run the corrected V4.1 installer on Roger's complete Windows RACC checkout.
- Capture the successful backup, install-report, and rollback-script paths.
- Verify the three Robot selectors, three monitored avatars, **In chat** choices, focused model save, and inner Customizer selection in the live browser.
- Perform one deliberate model change and confirm it remains after a server restart.

## Exact next safe action

Extract `ROWDY_RR_CHAT_THREE_SEAT_CUSTOMIZER_V4_1_20260807.zip`, double-click `INSTALL_RR_CHAT_THREE_SEAT_V4_1.cmd`, and wait for the exact message **RR Chat three-seat upgrade installed and verified.** Then perform the live browser checks above.
