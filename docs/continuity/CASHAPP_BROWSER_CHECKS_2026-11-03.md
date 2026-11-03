# On-demand Cash App receipt checks - November 3, 2026

Status: implementation prepared and locally tested; production activation and live acceptance pending.

Roger authorized on-demand inspection of the signed-in Cash App browser for paid queue requests. The customer requests a check after paying. A paired show browser reads the genuine received-payment receipt, then the authenticated host surface submits the guarded queue action. This is host-browser verification, not a Cash App API signature or a merchant checkout integration.

- Prices remain $5 for exactly five places, $10 for exactly ten, and $20 immediately behind the person up next.
- The current performer and the person up next remain protected. The server replans inside the queue transaction; inconsistent or insufficient queue positions block the move.
- Checks require a completed received payment, the expected receiving account, exact price and request note, a fresh check token and a readable unique transaction number. One payment cannot be used twice.
- Customer requests do not count as payment. No screenshot, redirect, balance or customer-supplied transaction claim approves a skip.
- No Cash App content is read when no explicit payment check is pending. A finished unsuccessful check is not polled repeatedly; the customer can retry after a short cooldown.
- Ambiguous, failed, stale or unmatched receipts leave the queue unchanged and show host attention. The site does not send money or issue refunds.
- The host queue and Cash App must remain signed in, in the same paired browser. Sign-out, multiple account/host tabs or changed website controls require attention rather than guessing.
- Existing tipping, live voting, free Rumble and the optional honest Google review link remain. Reviews offer no queue reward.

Local verification: 61 PHP behavioral checks with an in-memory SQLite adapter, 13 receipt/browser-contract JavaScript checks, four PHP syntax checks and three JavaScript syntax checks. Counts include the retained manual-queue regression suite. A genuine historical receipt and description search were inspected read-only; no historical payment was applied and no money moved. A real matching paid-skip acceptance remains unverified.

Recovery and authority: branch `codex/cash-app-receipts-20261103`; protected record `rowdy-room/cashapp-browser-checks-2026-11-03` v1, SHA-256 `e41d80ef2333f6b3daea46066308c434919124cb5873815e941a9de8b12bf656`. Detailed private source, originals, deployment bundle and operational paths are retained in that record. The previously accepted queue release remains the rollback authority until the replacement is deployed and read back. No merge to main is implied.

Next: deploy the prepared bundle, reload the paired browser bridge, verify the live no-match path without moving a singer, then record the first genuine matching paid transaction separately.
