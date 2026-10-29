# Booking simulation and workflow v4 — 2026-10-29

This is the current successor to the workflow v3 booking-mission record. Private authority remains `psyche/booking-mission-2026-10-29`; individual contacts, infrastructure and outreach copy remain protected.

## Verified offline result
- Fifty-five simulation scenarios passed, zero failed. Eight simulated sends, fictional replies and an exact five-hour USD375 quote led to one fake booking. Duplicate booking replay reused that fake event.
- Fifty-four automated test methods passed across the pipeline, simulation, retained-contact, publisher and connector suites. These counts overlap and are not independent customer trials.
- The rehearsal used fictional invalid-domain addresses, a separate database, fake mail/calendar, frozen time and network blocking within the simulation.
- Real contact/outbox files were byte-for-byte unchanged both across the simulation and from the beginning to the end of this task. Real sends, external drafts and Calendar write calls: zero. Real outreach remains on explicit owner hold.

## Weaknesses exposed and corrected
1. A prepared follow-up could advance after a human replied. Send preflight and receipt validation now recheck replies, due timing and suppression.
2. Past event dates could pass readiness. Future start dates are mandatory.
3. Malformed calendar intervals could be overlooked. Invalid intervals fail closed; all-day dates are normalized in the configured Central timezone.
4. Windows lacked the required IANA timezone data. The dependency is installed and pinned; spring/fall DST and all-day conflicts pass.
5. A generic agreement string was insufficient to bind an event to an exact quote. Pure planning helpers now compute amount, reference/version and content hash. Customer evidence and owner approval both bind to the exact quote revision; changed terms require renewed agreement/approval.
6. Setup/travel buffers could be reduced outside the approved quote. Quoted buffers now govern the final conflict plan.
7. A lost send response could invite a duplicate. Preflight requires fresh reconciled Sent evidence, matching reviewed copy, mailbox, approved footer and authority. Ambiguous matches block retries. This is coordinator-supplied evidence, not an atomic mail transaction.
8. Synthetic receipts could contaminate production metrics. Explicit simulation/test/fake identifiers are rejected by the production record operation; the fixed simulator accepts no live recipient/database/command overrides.

All twelve first-Saturday recurring commitments were protected in fictional calendar fixtures. The fixtures were not live Calendar reads. Additional cases covered wrong mailbox/thread/customer, auto-replies, bounce/opt-out/decline, maximum follow-ups, expired quotes, stale/incomplete calendar reads, last-minute conflict and duplicate fake booking.

## Delivery-path finding
The same fixed simulation succeeded through the local MCP stdio tools/call interface. The normal Vivaldi ChatGPT/cloud connector path encountered timeouts/internal errors and did not deliver a verified completed simulation. Local networking and MCP implementation were checked; a bounded connector reload/retry did not establish external recovery. The stalled normal-chat retry was stopped. This remains a warning, not a successful end-to-end cloud test.

The mission policy now limits repeated connector attempts and permits independent authorized local work with explicit provenance. A local fallback must never be represented as a successful normal-chat/cloud handoff.

## Scope of the additions
- Workflow defaults are v4. The existing owner outreach hold is retained.
- Send preflight, quote, customer-evidence acceptance and confirmation helpers produce plans only. They never send, accept a contract on Roger's behalf or write Calendar.
- The fixed simulation runs in its own process; its frozen clock and network mocks cannot alter the live connector process.
- Normal scheduled research must not rerun the regression suite. The existing research schedule is unchanged.

## Remaining acceptance gates
Actual Gmail delivery, real incoming-message classification, actual customer consent and real Calendar create/reconciliation remain untested while held. Fake-provider idempotency does not prove real Google Calendar or Gmail idempotency. Natural-language evidence classification and authorization remain coordinator attestations, not independent verification. An approved mailing footer and event/payment/cancellation terms must never be invented.

## Recovery
Dated protected recovery contains pre-change files, activated code/configuration, dependency pin, baseline/fixed probes, 55-case receipts, fake mailbox/calendar/database and visible report evidence. Manifest SHA256: `7b4b3c39ddbbaa44be1a46a3b3ddd5dc5c3a99872baa74659e62b7f36367af34`. Its location and implementation hashes are stored in the protected authority.

Next safe action: continue internal readiness and independent research while the hold remains active; resolve the cloud connector warning before claiming a successful normal-chat handoff. Do not ask Roger to authorize sending during the hold.
