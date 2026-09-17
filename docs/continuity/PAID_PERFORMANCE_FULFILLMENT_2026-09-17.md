# Paid performance fulfillment — 2026-09-17

Status: implementation in progress; not live-payment accepted.

## Implemented and verified

- Added private payment-event and fulfillment-job records with RLS and no public table grants.
- Added a token-authenticated local worker interface. Wrong-token rejection and correct-token acceptance passed.
- Deployed `rowdy-paypal-order` and `rowdy-paypal-webhook` Edge Functions, version 1.
- Started the local Windows fulfillment worker. It polls the authoritative PHP queue every two seconds and is healthy while idle.
- Recording trigger is the host's existing Start Next transition: a verified paid order waits until its matching singer becomes `current`. End Performance stops capture.
- Capture uses the OBSBOT Tiny 2 Lite video and Yamaha AG06MK2 show mix. Bronze produces photos; Silver adds a highlight; Gold adds the full performance.
- The worker keeps recording, editing, and delivery as separate retryable states so email failure cannot lose the master recording.

## Safety corrections

- Customer self-attestation (`paid_unverified`) is explicitly not accepted as payment verification by the new pipeline.
- Only a PayPal signature-verified `PAYMENT.CAPTURE.COMPLETED` event with an exact amount/currency match creates a fulfillment job.
- Existing production signup remains unchanged until PayPal live credentials and webhook registration are available; this avoids breaking tonight's current signup path.

## Recovery required before live acceptance

- Roger must log into the PayPal Developer dashboard tab. A live REST app, client credentials, and webhook registration cannot be created without that account login and the final credential-creation action.
- Configure Edge Function secrets `PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`, and `PAYPAL_WEBHOOK_ID`.
- Replace the Companion's three static PayPal links and `I paid` checkbox with the server-created checkout flow.
- Configure and verify the outbound email sender and private download delivery. A real email requires an action-time send confirmation.
- OBSBOT Center recognizes the Tiny 2 Lite and its OSC setting is enabled, but the listener did not bind after restart. Direct USB controller package 0.7.0 supports Tiny 2 only, not Tiny 2 Lite, so physical automatic-tracking acceptance remains open rather than being falsely claimed.
- Remove the legacy anonymous read/update policies on `rr_memory_orders` only after the host page is moved to the protected host RPC; removing them early would break current host controls.

## Current local paths

- Worker: `scripts/fulfillment/rowdy-fulfillment-worker.mjs`
- Private local configuration: `scripts/fulfillment/.env.local` (ignored; never commit)
- Package output: `C:\Users\Roger\Videos\Rowdy Room Customer Packages`
- Edge Functions: `supabase/functions/rowdy-paypal-order/` and `supabase/functions/rowdy-paypal-webhook/`

