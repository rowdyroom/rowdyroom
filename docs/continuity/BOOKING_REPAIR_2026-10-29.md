# Booking workflow repair — 2026-10-29

## Implemented and verified

Bridge source 0.6.34 normalizes ordered and unordered Markdown list prefixes for posted-message matching and preserves detached-clone block boundaries. Draft verification remains strict; task markers, instruction text and amounts remain part of the comparison. Thirty-one consultant and twenty-one workspace/relay checks passed. A read-only regression against the actual previously failed Grok user turn found the old matcher false, the new matcher true, and changed instructions still rejected.

Contact handling now provides `merge-contact-evidence`: an additive operation guarded by a write lock and exact expected versions. Evidence IDs cannot be silently overwritten; bounded research notes, contact-scope corrections and exact evidence-backed gap corrections preserve people, contacts, routes, statuses, unknown fields and booking state. Entire batches roll back on a conflict; identical current-version submissions make no changes. Full existing-lead replacement now also requires an expected version. Workflow v7 documents the contract. Fifty-nine Python integration checks passed, including competing writers, stale/missing versions, rollback, preserved state and repeat behavior; some test counts overlap inherited cases.

The connector was reloaded directly. Actual normal Vivaldi ChatGPT consumer acceptance confirmed workflow v7, applied the three pending evidence/scope merges, reread them, repeated them without changes, and rejected a deliberately stale merge without incrementing a version. Independent SQLite inspection found exactly three new history rows with all people, contact values/statuses, routes and booking stages preserved. Real outbox remains five review-required drafts and zero receipts; no outreach or Calendar mutation occurred. Seth/Gemini completed fresh research in 36.83s through the same normal chat.

## Activation gate and unfinished acceptance

The normal bridge status popup still reports loaded version 0.6.33. Source version on disk is not execution proof. Roger has been asked to reload the existing extension because the established browser-security restriction prevents automation of extension management. No further owner action is required for connector activation; that passed.

The full Grok/Claude continuation and final full-process rerun remain **pending the bridge reload**. Do not claim 0.6.34 live acceptance, a completed full rerun, or permanent provider reliability from prepared code, local tests or the completed database stage. After activation, run an actual long bulleted Gwen/Grok assignment from the existing normal Vivaldi ChatGPT conversation, require a matching 0.6.34 response receipt, then send actual Seth/Gwen findings to Cody/Claude for dependent review and publish the free report.

Outreach remains held. Preserve the existing panes/tabs, current lead records and all confirmed bookings. Private authority: `psyche/booking-repair-2026-10-29`; recovery and exact receipts are protected there.
