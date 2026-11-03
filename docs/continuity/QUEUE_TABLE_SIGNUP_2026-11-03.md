# Queue signup and host table - 2026-11-03

Roger requested repair of final-step audience signup and a compact spreadsheet-style host queue with a menu per singer. He separately authorized a private availability block; exact dates and calendar identifiers belong in the protected continuity record.

## Prepared change

- The audience HTML loaded an older versioned script while a newer cleanup had changed only an unused file. The loaded script referenced removed BP controls during startup, bootstrap, and signup. Browser console errors confirmed the mismatch.
- A new versioned script removes those active dependencies, preserves the existing single-rating voting contract, reuses guest identity, guards concurrent submission, and displays connection errors. A confirmed signup remains saved even if display refresh fails.
- Host queue becomes a searchable table with position, singer/group, song/artist, length/source, notes/score/orders, and an Actions menu. Waiting singers can move directly to a chosen position or use existing drag and menu controls. Current performer is excluded from reorder payloads. Version-checked rotation writes and existing playback routes remain authoritative.
- Booking remains an inquiry form, with a server-side unavailable-time check including overnight overlap. No booking inquiry is sent as part of testing.

## Verification and deployment gate

Eleven local behavioral checks passed, covering signup success/failure/duplicate prevention, preserved voting contract, full waiting-order payloads, and protection of the current singer. Browser preview verified row positioning and name/song/note filtering. Dated originals were downloaded; protected server rollback copies were verified by name and size. Production deployment and live signup acceptance are pending until the dated follow-up below.

Protected record: `rowdy-room/queue-table-signup-2026-11-03`. Existing live queue, voting, Rumble, and lyrics-player URLs remain in place. No real waiting/current singer is to be moved or deleted for proof. A test entry must be identifiable and cleaned up alone.

## Optional support follow-up

Roger additionally requested restoration of tipping and a review invitation. SongFinder return now reaches the optional support step before confirmation. Existing Cash App tipping and the no-support path are retained. Roger accepted an optional honest Google review link with no queue reward after the platform policy was checked. The supplied listing was verified as Rowdy Room DJ service with the correct business website and calendar; its review dialog opens. Tracking parameters are omitted. No review is posted by automation. Thirteen local checks now pass. Final live acceptance and deployed readback remain to be recorded.

## Paid queue-priority follow-up prepared

Owner-authorized prices: $5 for five places, $10 for ten places, and $20 to move directly behind the person up next. Current singer and the next waiting singer stay protected. Fixed-place options are offered only when the full move is available. Cash App is the same verified destination used for tips. Opening a payment page never confirms payment.

Pending requests use the existing private action ledger with zero BP. Approval requires the existing host credential, a confirmed Cash App receipt and a unique transaction ID. Server-side tier prices, current eligibility, rotation version and queue membership are checked under the existing MySQL rotation lock. Queue movement, receipt deduplication, request completion and rotation state are one transaction. A preview exercises those writes and rolls the whole transaction back. Declining a request does not issue or claim a refund. Any changed-line or already-singing case requires host reconciliation of money received.

Thirteen JavaScript behavioral checks and 32 PHP checks pass locally. PHP checks execute with an in-memory SQLite adapter, so deployed MySQL behavior remains a separate live-preview gate. No live payment has been collected, sent, or marked paid for testing. Prior plain signup reached the live host table; its labeled test entry was removed without starting a performance. The original queue was empty. Final paid-request UI and production integration are pending.

## Production acceptance

The changes are deployed at the existing Companion, queue-host, and booking URLs. Fourteen JavaScript checks and 32 PHP checks pass. The PHP suite uses an in-memory SQLite adapter; deployed MySQL integration was separately exercised through the host's paid-skip preview, which wrote queue/rotation/receipt/request state, read it back, and rolled the transaction back. The visible result calculated one place of movement from waiting position 3 to 2, protected the next singer, and left the request pending and queue order unchanged.

The combined live test used three labeled disposable signups. Two free signups and one unpaid skip request reached the host table. The ordinary position dropdown then changed the waiting order while retaining the next singer. The unpaid request was declined; all three test entries were removed. The queue returned to its original empty state, with no performance started and no real payment marked received. An earlier plain signup had also passed and was cleaned up.

The first live pass caught a missing host credential on the new protected request-list call. That was corrected, regression-tested, and reverified live. Anonymous request-list access is rejected. The normal no-support path, existing Cash App tip destination, optional honest Google review destination, signup success, host request visibility, preview and decline controls were verified. Fixed five/ten-place offers are unavailable when the full move cannot be delivered without passing the next singer.

All seven deployed files were downloaded again and matched their expected SHA-256 hashes. Original 0644 file modes and valid modification times were verified. Recovery manifest SHA-256: `fe7fb2a4b2d4ac0754e4d881c465e90dfbeaaadb482c82634c8846eddc198627`. Exact private calendar dates, event identifiers, deployment paths, protected-record versions/hashes and local recovery location are held under `rowdy-room/queue-table-signup-2026-11-03` and its local receipt.

Cash App remains a manual receipt-confirmation workflow. No real-money transfer was tested. Host checks the actual Cash App payment and enters its transaction ID before approval; duplicate IDs cannot be used twice. Changed-line cases require host reconciliation. Google reviews carry no queue reward and no automated review is posted. Documentation is on `codex/queue-table-20261103`, not merged into `main`.
