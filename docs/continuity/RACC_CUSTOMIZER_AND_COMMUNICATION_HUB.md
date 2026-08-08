# RACC Customizer v2 and Shared Communication Hub

**Status:** RR Chat Repair V6 is source/package verified and awaits live Windows installation  
**Recorded:** 2026-08-08  
**Owner:** Roger Jamsek  
**Source surface:** ChatGPT Work / Codex

## Approved outcome

Roger approved one shared Customizer and one internal voice/text communication hub across the Rowdy AI Command Center.

- All 18 direct RACC pages load the shared Customizer.
- `rowdy-companion.html?embed=1` remains the single internal RACC communication surface.
- RR Chat, Customizer, and FreeTube remain separate movable circles.
- Left/right shell handles, popout windows, and the Selected Item inspector remain movable and resizable.
- The three-seat RR Chat, saved focused-Robot model selector, inner Customizer targets, file paste/drop/picker uploader, privacy rules, and approval-gated commands are preserved.

## RR Chat Repair V6

V6 is cumulative and supersedes V4, V4.1, and V5.

- The three Robot selectors are compact and sit in one row on normal-width screens, reducing wasted height.
- Selector choices use short Robot names; roles remain available as option titles.
- The review panel is never clipped merely because no command is waiting.
- **Approve reply** and **Disapprove reply** stay visible for each new response.
- A disapproved reply can be stored privately as a Roger-owned correction.
- Executable command approval stays separate and continues to require an exact approval before running.
- The full conversation remains visible in a larger scrollable reply box.
- **Read aloud** and **Stop reading** controls are available.
- Typed local chat requests text without bundled speech, then asks the local voice service separately. Voice failure therefore cannot erase a good text answer.
- Robot audio is preferred; browser speech is the local fallback when Robot audio cannot be created or played.
- If Lucian's normal local chat route fails, V6 checks/repairs the existing local runtime once and retries through the existing local Lucian conversation route.
- A failed spoken turn is not automatically repeated; runtime repair prepares the next try, avoiding a duplicate request.
- Generic local-server errors now include a short safe cause while private paths are redacted.
- Presence polling no longer replaces a useful failure cause with `Live presence updated`.
- Microphone speech-recognition failures appear beside the reply box.

## Preserved file uploader

- Paste clipboard files while typing without breaking normal text paste.
- Drop files on the message area or choose them with the round **+** button.
- Send text and files together or files alone.
- Limits remain 12 files, 25 MB each, and 100 MB total.
- Files are stored atomically under the private RACC data root.
- Safe names, exact byte counts, saved paths, and SHA-256 fingerprints are checked.
- Files are saved but never automatically opened or executed.
- Local Robot mode receives the verified path; OpenAI cloud mode receives safe name/type/size only from this uploader.

## V6 evidence

Verified before delivery:

- RR Chat client JavaScript syntax: passed
- RACC server JavaScript syntax: passed
- Static repair smoke: passed
- Clipboard/drop uploader DOM smoke: passed
- Package manifest: 14 passed, 0 failed
- ZIP integrity: passed
- Installer: `ROWDY_RR_CHAT_REPAIR_V6_20260808.zip`
- Installer SHA-256: `6b41d26ac8c40fa0b977923161b0c250287e4e58765048596fb7177116ed50a6`
- Stable Library record: `libfile_029d003d32488191b62e780a7e0b699e`, version 3
- Full historical repository tests cannot run in the supplied source snapshot because its historical `config` and `src/lib` folders are absent. The Windows installer runs them against Roger's complete authoritative checkout and rolls back on any failure.
- The Windows installer also verifies served page/code markers, a same-model save, Lucian runtime readiness, local voice-service readiness, and a tiny real uploader round trip.
- Physical microphone pickup still requires Roger to speak one phrase after installation.

## Earlier failed V4 attempt

The V4 installer stopped because its test expected the removed screen token `voiceRoute`. It restored the exact old files and restarted RACC. V4 and V4.1 remain superseded.

## Recovery required

- Run V6 on Roger's complete Windows RACC checkout.
- Capture the successful backup, install report, and rollback-script paths.
- Confirm the compact selectors and always-visible reply approval choices.
- Type one harmless message and confirm the full reply remains visible and is read aloud.
- Speak one harmless phrase and confirm the selected physical microphone is heard.
- Disapprove one harmless test reply, save a correction, and confirm it appears in Memory System.
- Confirm command approval remains separate.
- Recheck file paste/drop/**+**, three seats, focused-model save, and inner Customizer selection.

## Exact next safe action

Extract `ROWDY_RR_CHAT_REPAIR_V6_20260808.zip`, double-click `INSTALL_RR_CHAT_REPAIR_V6.cmd`, and wait for the exact message **RR Chat repair V6 installed and verified.** Then perform the live checks above.