# Continuous booking mission — 2026-10-29

## Current authority
This supersedes the research-only process for mission tracking, while retaining the prior contact-discovery and free-report foundations. The private authoritative record is `psyche/booking-mission-2026-10-29`. Individual contacts, mailbox details, infrastructure paths and outreach copy remain protected.

## Observed end-to-end execution
- A real mission was initiated in the existing normal ChatGPT conversation in Vivaldi. It reused five retained venues, checked the correct booking mailbox, searched the exact known venue addresses for previous correspondence and reconfirmed twelve existing recurring bookings.
- The baseline found no prior correspondence on those exact addresses. This does not cover calls, social messages, other addresses or deleted mail.
- A second normal-chat mission used workflow v3, acquired and finished a run lease, saved five local introductions and repeated the same preparation payload. The same five IDs were reused: five drafts, zero sends, zero human replies.
- The ChatGPT UI showed 2m 3s for the baseline and 1m 54s for acceptance. Shorter internal checkpoint timings exclude model/preflight time and are not full request duration.
- Final loaded module hash was read through the live connector and matched the saved implementation. The final connector reload preserved app, hub, workers and Vivaldi.
- Forty-nine integration tests passed across the pipeline, contact research, report publisher and existing connector suites. They are not forty-nine real customer interactions.

## Improvements now in place
- Persistent local outbox and evidence receipts. One introduction per venue/purpose; repeated preparation does not silently revise or duplicate a campaign.
- Run leases exclude overlapping scheduled/manual work and completed-slot reruns.
- Follow-ups become due only after an actual send receipt: five days after introduction, seven days after first follow-up, maximum two. Human replies stop the sequence; automatic replies pause for review. Opt-out, bounce and decline suppress the route.
- Matching mailbox, sender, thread, chronology and content hashes are required for corresponding receipt types. Receipts are coordinator attestations, not independently fetched mail-provider proof.
- Readiness checks require fresh, complete all-event calendar results, explicit timezones, one-hour setup/travel buffers, minimum rate and supported event/agreement details. This never creates a booking.
- Relevant existing leads and real replies take priority over new discovery. Specialist AIs are optional, used for a distinct contribution.
- A thread-attached heartbeat is active at 08:00, 12:00, 16:00 and 20:00 Central. It stays quiet on unchanged/non-actionable runs, limits runs to ten minutes/five source reads and applies a coordinator policy of at most two new qualified venues per day.

## Limits and outstanding gates
- No outbound messages, Gmail drafts, applications, purchases, contracts or calendar writes were made in these tests. No new booking was obtained.
- Sending needs explicit authorization for the concrete recipients/messages and an approved business mailing address. No home address may be inferred.
- Actual deliverability, customer reply handling, quote acceptance, a new confirmed booking and the first scheduled heartbeat execution remain untested.
- Local outbox and external mail cannot commit atomically. An ambiguous send must be reconciled in Sent before any retry.
- Daily research limits and classification rely on the executing coordinator. This is not an independent always-on mail daemon.
- Scheduled execution depends on the PC, Codex and required services being available. It does not guarantee twenty-four-hour operation or bookings.
- Final entertainment-hiring authority remains unconfirmed for the five prospects. Ownership is not proof of hiring authority; exact route verification remains required where absent.

## Recovery and next action
The dated private recovery package contains pre-change configuration/connector, activated code, database snapshots, exact saved drafts, report and visible chat evidence. Its manifest SHA256 is `b279e98fd9467e46296f73f78498bf9c583e51ab4b8906971e4793acc61e3a43`. The protected record contains its location and live-build evidence.

Next safe action: obtain the one outbound authorization and approved mailing address, add the approved footer to a reviewed revision, reconcile existing correspondence, then test the first real introduction without inventing a send/reply/booking receipt.
