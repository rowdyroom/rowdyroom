# Host rotation completion choice — 2026-10-12

Roger authorized adding a per-performance choice to remove the singer or return them to the bottom of the show rotation.

- Host buttons: **End & Remove** and **End & Return to Bottom**.
- Both finish the performance and preserve its score, votes, and normal completion credits.
- Returning creates a fresh queue entry after everyone waiting, with group names and song metadata retained. An already-submitted next song is reused rather than duplicated.
- The next performer still starts through **Start Next**; returning the only singer leaves them next rather than automatically performing again.
- The existing host authentication remains required. The host sends the expected current queue entry to reject stale or repeated completion requests.
- Completion, credit, queue change, and audit log commit together. Credit supports an enclosing transaction while retaining standalone behavior.

## Verification and deployment

Prepared: PHP syntax and inline JavaScript parse checks; 18 isolated checks passed using the actual performance, earnings, wallet-credit, and queue-action code with a local SQL fixture. The fixture translates MySQL lock/time syntax to SQLite; it does not prove production MySQL locking.

Live deployment and synthetic-singer browser acceptance passed. Return moved singer A behind singer B using a fresh entry; removal then took each singer out. Final queue has zero active entries and no current performance. Normal completion credits and completed performance were read back; final-minute voting was preserved. No artificial ballots or real-singer changes occurred. Unauthenticated completion returned 401. All three live source files exactly matched the tested replacements by readback.

Protected pre-change backups were read back exactly before deployment. Local recovery package: `Rowdy_Room_Rotation_Recovery_2026-10-12/RECOVERY.md`. Private continuity key: `rowdy-room/host-rotation-choice-2026-10-12`. Synthetic identities and completed QA history remain retained for auditing; no active QA entries remain.

Returning retains the existing song details or an already-submitted next song. Choosing a different song is a separate existing signup workflow. Live ballot acceptance against a real show performance remains an inherited owner acceptance gate from the score project; rotation acceptance passed with synthetic singers and no ballots.

Production source remains in protected hosting and local recovery storage. This public record contains no host secrets or performer data. GitHub branch: `codex/queue-host-unified-20260917`; not merged into `main`.

## Durable verification pointers

- Protected record: version 1, history 2478, SHA-256 `0aed99d0883485209b4ef906bd403934e53f6b4d227c780f301365ac5dcd1ee4`; history content and hash exactly match.
- Verification run: `40a09003-64d8-46b3-a778-b8c56e5fb2bb`, checks 992–995 pass for live behavior, isolated tests, recovery, and private readback.
- Recovery record SHA-256: `09b7df459b97a64367fb6c5a00da1b79af18373a98c2c18064065d38b425876d`.
- Source SHA-256: host `722f149423a7f6ee3facec03738a7e5483022f2cabdb2732250beb81c8203c6e`, queue action `761fef3696570a020c54df98590705a027b3add594fe38bc6143e3e99104db24`, completion credit `27ed683dab866f26549e2e6f6b152311f71207fe2cad45fec0d42e5460ad9f48`.
- The protected server active-system index also records the deployment, endpoint contract, verification, and rollback paths.
