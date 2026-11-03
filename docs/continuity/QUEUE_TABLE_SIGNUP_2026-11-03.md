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
