# On-demand Cash App receipt checks - November 3, 2026

Status: deployed and active. The live no-match path is accepted; a genuine matching paid skip remains unverified.

Roger authorized on-demand inspection of the signed-in Cash App browser for paid queue requests. The customer requests a check after paying. A paired show browser reads the genuine received-payment receipt, then the authenticated host surface submits the guarded queue action. This is host-browser verification, not a Cash App API signature or a merchant checkout integration.

- Prices remain $5 for exactly five places, $10 for exactly ten, and $20 immediately behind the person up next.
- The current performer and the person up next remain protected. The server replans inside the queue transaction; inconsistent or insufficient queue positions block the move.
- Checks require a completed received payment, the expected receiving account, exact price and request note, a fresh check token and a readable unique transaction number. One payment cannot be used twice.
- Customer requests do not count as payment. No screenshot, redirect, balance or customer-supplied transaction claim approves a skip.
- No Cash App content is read when no explicit payment check is pending. A finished unsuccessful check is not polled repeatedly; the customer can retry after a short cooldown.
- Ambiguous, failed, stale or unmatched receipts leave the queue unchanged and show host attention. The site does not send money or issue refunds.
- The host queue and Cash App must remain signed in, in the same paired browser. Sign-out, multiple account/host tabs or changed website controls require attention rather than guessing.
- Existing tipping, live voting, free Rumble and the optional honest Google review link remain. Reviews offer no queue reward.

Local verification: 61 PHP behavioral checks with an in-memory SQLite adapter, 13 receipt/browser-contract JavaScript checks, 15 retained JavaScript regression checks, four PHP syntax checks and three JavaScript syntax checks. Counts include the retained manual-queue regression suite. A genuine historical receipt and description search were inspected read-only; no historical payment was applied and no money moved.

Live acceptance: all seven deployed files were downloaded and matched to the tested release by SHA-256; permissions are 0644 and timestamps valid. Roger reloaded the existing paired bridge and signed into the host queue in the same browser as Cash App. The new browser-connection status became visible. Three labeled test singers signed up through the actual audience and SongFinder flow. The third singer selected the $20 option and requested a payment check without paying. The browser searched Cash App for that exact reference, reported no matching received payment, and left the singer third with up next protected. The request was declined, all three test entries removed, and the queue returned to zero with no pending-request warning or browser errors. No performance was started and no money moved.

Recovery and authority: branch `codex/cash-app-receipts-20261103`; protected record `rowdy-room/cashapp-browser-checks-2026-11-03` v3, SHA-256 `8acd879c959ede9f019a62aef2dff491a5a6de92a9948da43685256c99ac2738`. The prior queue authority records now point here. The 37-file private recovery manifest has SHA-256 `24724e9ea8ffcbaa44fa73eceaf233e2ad656301e6f0d5bc4b40a1bb47112695`; detailed source, originals, deployment bundle, proof and operational paths remain protected. Audit run `5f3f9333-ded2-458b-8031-34c4c1dd76be` retains the first-real-payment warning. The previous manual-verification release and extension originals remain the rollback authority. No merge to main is implied.

Next: keep the signed-in host queue and Cash App open in the paired browser. Record the first genuine matching paid skip separately; offline fixtures and an unmatched live payment check do not prove that positive path. Manual receipt confirmation remains available for exceptions. No additional deployment or reload is pending.
