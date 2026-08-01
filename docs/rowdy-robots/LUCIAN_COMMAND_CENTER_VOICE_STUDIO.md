# Lucian Command Center and Rowdy Bot Voice Studio

**Status:** Secure host-side LAN implementation verified  
**Date:** 2026-08-01  
**Owner:** Roger Jamsek

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
