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
- Corrected silent-delivery risk by mixing the Yamaha AG06MK2 show feed with the Tiny 2 Lite microphone at 35 percent as a backup. Silver and Gold outputs receive EBU-style loudness normalization (`I=-16`, `TP=-1.5`, `LRA=11`).
- The combined 1920 x 1080 acceptance capture contains H.264 video plus stereo AAC audio and decodes successfully. The normalized acceptance output measured a safe `-1.5 dB` maximum.

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
- Edge Functions: `supabase/functions/rowdy-paypal-order/` and `supabase/functions/rowdy-paypal-webhook/`
