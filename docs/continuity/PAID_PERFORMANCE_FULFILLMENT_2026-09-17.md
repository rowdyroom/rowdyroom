# Paid performance fulfillment — 2026-09-17

Status: live checkout, automatic camera tracking, recording, and fulfillment delivery active.

## Implemented and verified

- Added private payment-event and fulfillment-job records with RLS and no public table grants.
- Added a token-authenticated local worker interface. Wrong-token rejection and correct-token acceptance passed.
- Created the dedicated live PayPal app, registered its capture webhook, and deployed `rowdy-paypal-order` and `rowdy-paypal-webhook` Edge Functions, version 2.
- Stored PayPal server credentials in `rr_private_settings`, protected by RLS with anonymous and authenticated grants revoked; only the Edge Function service role reads them.
- Verified a live, non-paid checkout creation through PayPal. No financial transaction was completed.
- Replaced the Companion's operative static-link/self-attestation behavior with server-created checkout requiring a delivery email and consent.
- Added checksum-verified, chunked package upload from the local worker to the cPanel delivery endpoint.
- Created `delivery@rowdyroom.site` and configured authenticated SMTP over TLS on port 465 in the ignored local worker environment.
- End-to-end delivery acceptance passed: upload, finalize, SHA-256 validation, HTTPS download (200), and real SMTP email to `rowdyroom@gmail.com`.
- Started the local Windows fulfillment worker. It polls the authoritative PHP queue every two seconds and is healthy while idle.
- Recording trigger is the host's existing Start Next transition: a verified paid order waits until its matching singer becomes `current`. End Performance stops capture.
- Capture uses the OBSBOT Tiny 2 Lite video and Yamaha AG06MK2 show mix. Bronze produces photos; Silver adds a highlight; Gold adds the full performance.
- The worker keeps recording, editing, and delivery as separate retryable states so email failure cannot lose the master recording.
- Verified the exact Tiny 2 Lite at firmware `6.2.8.12`, enabled Human Tracking in Group mode, and confirmed a real 1920 x 1080, 30 fps, five-second hardware capture with the performer framed.
- OBSBOT Center must remain closed during fulfillment recording because its preview keeps the DirectShow stream locked. Tracking runs on the camera; the worker now leaves it continuously enabled instead of sending an unverified OSC toggle.
- Corrected the camera's saved output from Portrait 9:16 to Landscape 16:9; the new acceptance frame retains visible headroom.
- Capture uses only the Yamaha AG06MK2 show feed. The Tiny 2 Lite microphone was removed after the full rehearsal proved that mixing it with the Yamaha introduced doubled, delayed audio. Silver and Gold outputs receive EBU-style loudness normalization (`I=-16`, `TP=-1.5`, `LRA=11`).
- The combined 1920 x 1080 acceptance capture contains H.264 video plus stereo AAC audio and decodes successfully. The normalized acceptance output measured a safe `-1.5 dB` maximum.
- Fixed browser checkout CORS preflight: the Edge Function now returns a bodyless `204`; `rowdy-paypal-order` version 3 is active and OPTIONS acceptance passed.
- Completed a no-charge, isolated Gold-package rehearsal for package `RRM-20260917-F2AEAA`. The queue-current transition started recording and performance end stopped it without moving or deleting the live Jason/AJ queue entries.
- Rehearsal output passed full decode: eight photos, a 45-second highlight, and a 4:42 full-performance MP4 with 1920 x 1080 H.264 video and stereo AAC audio.
- Delivery completed to `rowdyroom@gmail.com`; uploaded archive SHA-256 is `dd648164a076db17b76cfce5d0e3eb66d3e8a4059c39777022a1bd192df6ad8c`, and the delivery endpoint returned HTTP 200.
- The temporary rehearsal queue was removed from service and the worker was restored healthy and idle against `https://rowdyroom.site/api/queue`.
- Public-safe implementation commit: `448cdd7`; local recovery archive `rowdyroom-full-fulfillment-rehearsal-448cdd7.zip` has 323 entries and SHA-256 `5997FB8A04E3E4960647E351F6C3A12B2DFE688B5EC7D4AC0A3264716608C23F`.
- Audio acceptance correction: the first rehearsal delivery is superseded because it contains the mixed webcam/AG06 track; the already-mixed master cannot be cleanly separated after capture.
- Replacement AG06-only take passed full decode at 3:11 with 1920 x 1080 H.264 video, one stereo AAC stream, `-20.5 dB` mean audio, and `-1.2 dB` peak. The replacement archive SHA-256 is `031fd4d23b2c50ce3869c36e3f737dfba1c1dc1d9f20a1a9729adc47f0dcb037`; HTTPS HEAD returned 200 with the exact 54,389,372-byte length, and SMTP delivery to `rowdyroom@gmail.com` completed at `2026-09-17T20:51:44.627Z`.
- Corrected source recovery: `rowdyroom-ag06-only-fulfillment-89ab225.zip`, 323 entries, SHA-256 `F90B8F56C3A4BE86F23178F09546A867C89E0442F3C186E71566A675C2BC529D`.
- Final full-song rehearsal supersedes both earlier audio tests. Package `RRM-20260917-F2AEAA-FINAL` recorded the complete Rihanna "Stay" performance through the OBSBOT Tiny 2 Lite and the AG06MK2 LOOPBACK feed, with the webcam microphone excluded.
- Mandatory customer-order routing: Windows/Chrome output `Line (3- Yamaha AG06MK2)`, AG06MK2 `STREAMING OUT` set to `LOOPBACK`, and worker input `Line (3- Yamaha AG06MK2)`. Any separate TikTok desktop-audio capture must be disabled if it duplicates this same loopback mix.
- The clean final master is 4:16.8 at 1920 x 1080. The Gold package contains eight photos, a 45-second highlight, and the full-performance MP4. The full MP4 passed a complete video decode; normalized audio measured `-18.3 dB` mean and `-1.6 dB` maximum.
- Final archive SHA-256 is `7B89E9DA23891FC5DB6B3692C146F4C4F369646DD0AD7753D6B80A6FB735DF99`. Upload and authenticated email delivery to `rowdyroom@gmail.com` completed at `2026-09-17T21:39:04.731Z`.
- The temporary rehearsal queue was removed and the production worker was restored healthy and idle against `https://rowdyroom.site/api/queue` at `2026-09-17T21:40:15.622Z`.

## Safety corrections

- Customer self-attestation (`paid_unverified`) is explicitly not accepted as payment verification by the new pipeline.
- Only a PayPal signature-verified `PAYMENT.CAPTURE.COMPLETED` event with an exact amount/currency match creates a fulfillment job.
- The live signup now redirects to PayPal only after the singer is safely joined to the queue and the exact package order is reserved.

## Recovery required

- Remove the legacy anonymous read/update policies on `rr_memory_orders` only after the host page is moved to the protected host RPC; removing them early would break current host controls.

## Current local paths

- Worker: `scripts/fulfillment/rowdy-fulfillment-worker.mjs`
- Private local configuration: `scripts/fulfillment/.env.local` (ignored; never commit)
- Package output: `C:\Users\Roger\Videos\Rowdy Room Customer Packages`
- Final verified video: `C:\Users\Roger\Videos\Rowdy Room Customer Packages\RRM-20260917-F2AEAA-FINAL\Roger TEST - Rihanna - Stay ft. Mikky Ekko (Karaoke Version) - Full Performance.mp4`
- Edge Functions: `supabase/functions/rowdy-paypal-order/` and `supabase/functions/rowdy-paypal-webhook/`
