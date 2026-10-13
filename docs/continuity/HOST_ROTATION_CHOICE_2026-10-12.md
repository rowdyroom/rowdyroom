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

Live deployment and live UI acceptance pending at this commit. Protected pre-change backups were read back exactly before deployment. Local recovery package: `Rowdy_Room_Rotation_Recovery_2026-10-12`. Private continuity key: `rowdy-room/host-rotation-choice-2026-10-12`.

Production source remains in protected hosting and local recovery storage. This public record contains no host secrets or performer data. GitHub branch: `codex/queue-host-unified-20260917`; not merged into `main`.
