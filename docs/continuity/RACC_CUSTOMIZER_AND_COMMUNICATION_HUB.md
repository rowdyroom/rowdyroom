# RACC Customizer v2 and Shared Communication Hub

**Status:** RR Chat File Uploader V5 is source/package verified and awaits live Windows installation  
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
- Header, team summary, Robot seats, model panel, avatar lineup, approvals, transcript, voice controls, text form, and attachments are separate Customizer targets.

## RR Chat file uploader V5

V5 is cumulative. It includes the three-seat RR Chat and Customizer work plus the new uploader.

- Paste copied pictures, documents, and other files directly into the RR Chat message box while typing.
- Ordinary text-only paste remains ordinary text.
- Clipboard content containing both text and a file keeps the text and attaches the file.
- Files can also be dropped onto the message area or chosen with the round **+** button.
- Pictures, videos, and audio receive previews; documents and other files receive clear file cards.
- A message may contain words and files together or files by themselves.
- Limits are 12 files, 25 MB per file, and 100 MB per message.
- Files are saved atomically under the private RACC data root in `RowdyTeam/chat-uploads`.
- Names, byte counts, paths, and SHA-256 fingerprints are checked; traversal names, broken data, mismatched sizes, and over-limit files are rejected.
- Saving a file does not execute or open it.
- Local Robot mode receives the verified saved local path so the Robot can work with it.
- OpenAI cloud mode receives only the safe name, type, and size from this uploader; it does not receive the file bytes or private local path.
- ChatGPT Team Handoff carries these rules for future chats and models.

## Failed V4 attempt and recovery

Roger ran V4 on 2026-08-07 at about 23:07 Central time. Its presence test still expected the removed client display token `voiceRoute`. The installer stopped, restored the exact pre-install files, restarted RACC on port 4317, and completed automatic rollback. V4 is superseded and must not be run again.

V4.1 corrected the obsolete display assertion and separately retained the real backend voice-routing test. V5 includes that correction and supersedes V4.1, so Roger should run only V5.

## V5 evidence

Verified before delivery:

- JavaScript syntax: passed
- Focused Customizer, Control Center, consolidated-workspace, and uploader tests: 22 passed, 0 failed
- Page-code paste/drop/upload smoke: passed
- Payload-to-source byte comparison: passed for all 11 payload files
- Package manifest: 14 passed, 0 failed
- ZIP integrity: passed
- Installer: `ROWDY_RR_CHAT_FILE_UPLOADER_V5_20260807.zip`
- Installer SHA-256: `24b55eeed2df3fff8e5b572a08c39ecd1acd5e5ccd9ebbc82c6b2db52f60699b`
- Stable Library record: `libfile_029d003d32488191b62e780a7e0b699e`, version 2
- Windows installer performs the focused tests, page/code checks, same-model save check, and one real tiny upload whose path and SHA-256 are verified before that exact test file is removed.
- The browser-engine smoke was not available in the scratch workspace; the complete Windows installer performs the final live server/browser proof.

## Continuity evidence

- Protected record: `rowdy-room/racc-customizer-communication-hub` v8
- Protected SHA-256: `1c3f99abf36b114f08577a009c2225094500c5932e82fa6af8be2b0bc1a68513`
- Continuity check: `913c8dcd-da77-485f-a206-f9c5f666bd19` — 12 pass, 1 warning, 0 fail
- Dated recovery: `ROWDY_RR_CHAT_FILE_UPLOADER_V5_CONTINUITY_20260808.zip`
- Recovery SHA-256: `dbba65755f76b8b2c560772ca7b4d06c344db9aa9214a0ed593819c7c3b3c8c4`
- Stable recovery record: `libfile_0d34aaa642148191a83a938fe46542b4`, version 2
- Recovery ZIP integrity and all internal fingerprints: passed

## Recovery required

- Run V5 on Roger's complete Windows RACC checkout.
- Capture the successful backup, install-report, and rollback-script paths.
- Verify paste from clipboard, text-plus-file paste, drag and drop, **+** selection, preview/removal, and file-only sending in the live RR Chat.
- Verify the three Robot selectors, monitored avatars, **In chat** choices, focused model save, and inner Customizer selection.
- Perform one deliberate model change and confirm it remains after a server restart.

## Exact next safe action

Extract `ROWDY_RR_CHAT_FILE_UPLOADER_V5_20260807.zip`, double-click `INSTALL_RR_CHAT_FILE_UPLOADER_V5.cmd`, and wait for the exact message **RR Chat file uploader V5 installed and verified.** Then perform the live checks above.
