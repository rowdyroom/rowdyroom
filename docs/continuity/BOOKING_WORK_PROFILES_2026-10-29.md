# Booking and work profiles — 2026-10-29

## Live booking

The public homepage now links to [Request a Booking](https://rowdyroom.site/booking.php).
The form collects event and contact details and sends an inquiry to the business inbox.
The base minimum is $75 per hour; equipment, travel, event scope and availability are confirmed in the quote.
Submitting the form does not reserve a date, accept payment, or create a confirmed calendar event.

## Verification

- PHP syntax check passed before upload.
- Homepage content matched the staged source after excluding the hosting provider's injected telemetry.
- One hosting telemetry block remained; no duplicated injection.
- A clearly labeled system test reached the inbox with SPF and DMARC passing.
- Missing CSRF token returned HTTP 400; incomplete required fields returned HTTP 422.
- The previous homepage and staged files are retained in a private dated recovery folder.
- Source: `tools/server/rowdy-booking.php`. Deployment is the existing shared-hosting PHP site, not the repository's separate application.

## Work profiles

Glassdoor has the selected TikTok portrait, a DJ/karaoke/emcee summary, $75/hour minimum and enabled employer discovery.
LinkedIn has the selected portrait, updated headline, booking website, and a published services page for DJing and Live Events starting at $75/hour.
Indeed onboarding shows Disc Jockey/Emcee and $75/hour; its updated legal terms remain a user action.
Fiverr's onboarding draft contains the DJ/event-host identity, $75/hour bio, English and DJ mixing; publication and portrait persistence remain unverified after its human-verification gate returned.
Upwork is authenticated but editing is disabled by an account payment-method restriction. Its established profile and $26/hour rate have not been overwritten.
ZipRecruiter remains at email-code verification.

Keep Fiverr and Upwork client communication/payment on those platforms. Do not add an external booking solicitation where prohibited.
Upwork requires a qualifying portrait; the selected TikTok image contains sunglasses and branding and is unsuitable for its photo rules.

## Authority and next safe action

Protected record: `rowdy-room/booking-work-profiles-2026-10-29`.
Private recovery locations, delivery evidence, hashes, account gates and version history belong in protected continuity storage.
Resolve the remaining account gates, then verify each saved profile. Do not describe all job profiles as complete.
