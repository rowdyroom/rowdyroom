# Lucian Command Center and Rowdy Bot Voice Studio

**Status:** Secure host-side LAN implementation verified  
**Date:** 2026-08-01  
**Owner:** Roger Jamsek

## 2026-08-01 local Chrome Control Center

- Fixed the reusable launcher so it always targets the local RACC service instead of accidentally treating its own script file as the service address.
- Added a local Chrome Control Center with Google search, editable quick favorites, direct Chrome-tab launchers for ChatGPT, Gemini, Claude, and Grok, and full-screen local Lucian and Rowdy Bot views.
- Added one deliberate ComfyUI ON/OFF control. It manages only the fixed local media engine, verifies its state, and does not interrupt queued work.
- Browser proof: ComfyUI had zero running and pending jobs, then stopped cleanly from the dashboard and restarted ready. The full automated suite passed 84/84.
- An unpacked Chrome new-tab extension is prepared but **not installed**. Installing it is Roger's separate choice and may conflict with another extension that already overrides Chrome's new tab page.
- Per-bot Fast/Deep model controls are planned but not activated. The controlled Qwen 27B head-model trial remains the next model decision.

## 2026-08-01 Roger-directed Control Center cleanup

- Removed the Custom Window Desk and its layout code completely.
- Removed the bottom model-next-step panel and the embedded background Rowdy Robots/Lucian chat.
- Preserved the separate round Rowdy Robots popout launcher.
- Roger's final correction removed the entire middle container and its controls, leaving the center column open and unfilled while the AI Rail and Quick Actions remain in place.
- Centered the Rowdy Control Center heading in the top container. A brief search-side-panel iteration was superseded before closeout and is not active.
- Verification passed: focused server test, 86/86 full automated tests, empty center with zero children, unchanged surrounding-column positions, and a zero-pixel heading-center offset.
- Recovery: `Rowdy_Control_Center_Staged_Cleanup_2026-08-01_184028.zip`, 6 entries, SHA-256 `FAE2D46AE24FA49A473029A392673A9D6F80A9CDA3EFD050571E5740106B9F30`; restore-and-rehash passed.

## 2026-08-01 voice-chat control repair

- Spoken Rowdy Robot conversations route through the already-installed local 8B model with one-at-a-time pooling; normal Robot work models and permissions remain unchanged.
- Voice health visibly reports speech-recognition status, the active spoken-conversation route, and recent turn timing.
- Speech-recognition failures now distinguish no detected speech, timeout, unavailable runtime, and generic local recognition failure instead of treating all failures as an unclear input.
- Automated verification passed 82/82. A physical microphone acceptance after the service restart remains **Recovery required**.
- ComfyUI was not changed. Its disconnected audio-preview workflow is a separate repair.

## Verified storage layout

- Active local model, media, voice, and mutable RACC data run from the dedicated SSD for faster loading.
- Generated images, MP4 files, WAV files, and RACC backups write to the separate larger storage drive.
- Private LAN credentials remain in their protected host location and are not published.
- Source, active, and recovery inventories matched exactly; 57 large files totaling 48,783,460,155 bytes passed three-way SHA-256 verification.

## Consent and privacy boundary

- Voice references must belong to Roger or be used with explicit permission.
- Every voice generation requires a separate owner confirmation.
- Voice references, generated audio, local database contents, and machine-specific paths remain private and are not stored in this public repository.
- The local service remains loopback-only. It is not publicly exposed.

## Remaining secure-LAN gate

A physical login from a separately enrolled Roger-approved phone or tablet has not yet been observed. Device certificate enrollment and that second-device smoke test remain **Recovery required**.
