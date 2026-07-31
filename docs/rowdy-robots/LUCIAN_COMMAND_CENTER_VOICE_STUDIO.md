# Lucian Command Center and Rowdy Bot Voice Studio

**Status:** Secure host-side LAN implementation verified  
**Date:** 2026-07-31  
**Owner:** Roger Jamsek

## What is working

- A compact Lucian Command Center provides persistent local chat, conversation selection, owner action approvals, and spoken replies.
- A reusable floating launcher opens the Command Center in an isolated iframe on Roger-controlled local webpages, web apps, or browser extensions.
- Rowdy Bot Voice Studio provides a built-in Lucian neural voice and a profile library for future Rowdy bots.
- The local Chatterbox engine runs through CUDA on the verified NVIDIA GeForce RTX 5060 Ti and produces watermarked 24 kHz PCM WAV files.
- Two real local neural generations completed. The primary acceptance WAV is 4.52 seconds, 217,004 bytes, SHA-256 `a1e8bb5bc15eabd324e9e1ceb77cbf9fcce08f8099a5b0de7cd558bcb70ba2ec`.
- Browser acceptance proved the compact chat, spoken-reply playback, Voice Studio, and floating launcher with zero console errors.
- The complete automated suite passed 58/58.
- Recovery package: `RACC_Lucian_Command_Center_Voice_Studio_v0.5_2026-07-31.zip`, SHA-256 `3129172ad946947d17df0e26a8315e14f93cd9f317ee23eddfb38704405c855f`.

## Consent and privacy boundary

- Voice references must belong to Roger or be used with explicit permission.
- Every voice generation requires a separate owner confirmation.
- Voice references, generated audio, local database contents, and machine-specific paths remain private and are not stored in this public repository.
- The local service remains loopback-only. It is not publicly exposed.

## Earlier same-computer gate resolved

The authenticated HTTPS gateway and firewall scope described below resolve the earlier host-side LAN design gate. Physical enrollment and use from a separate approved device remain unverified.

## Secure private-network access

- A separate HTTPS gateway now exposes the Command Center only to Roger-approved devices on the active Windows Private network.
- RACC, Voice Studio, the local model, and media engines remain loopback-only behind the gateway.
- Access requires Roger's private password. Sessions use Secure, HttpOnly, SameSite cookies; login attempts are throttled; mutation requests require the exact local origin.
- Windows Firewall permits TCP 8443 only on the Private profile and from `LocalSubnet`. No router, port-forward, public-profile, or public-internet change was made.
- Trusted TLS, unauthenticated denial, cross-origin denial, owner login, loopback isolation, exact `LAN_OK` model response, logout, browser rendering, and zero console errors passed. The automated suite passed 61/61.
- Recovery package: `RACC_Lucian_Secure_LAN_v0.6_2026-07-31.zip`, SHA-256 `77f27604c4ed34575ec80169c65904716e2afc0808e87290199ba26cb8c7769b`.
- Passwords, private certificate keys, machine addresses, and private configuration remain outside this public repository.

## Remaining secure-LAN gate

A physical login from a separately enrolled Roger-approved phone or tablet has not yet been observed. Device certificate enrollment and that second-device smoke test remain **Recovery required**.
