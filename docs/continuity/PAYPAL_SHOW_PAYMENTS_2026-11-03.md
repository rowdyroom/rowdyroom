# PayPal and card payments for live shows - November 3, 2026

Status: deployed. Live unpaid checkout, cancellation/return and no-credit acceptance passed. The first genuinely completed customer payment remains unverified.

The existing singer signup now offers Cash App, PayPal, and credit/debit card through PayPal for optional tips and paid skips. The normal signup is saved before checkout. Skip prices remain $5 for five places, $10 for ten, and $20 for directly behind the person up next. Current and up-next singers remain protected; ratings never reserve turns.

The existing PayPal business account shows standard credit/debit cards Active. A new server-to-server checkout bridge reuses configured credentials without exposing them to the browser. PayPal and guest-card choices request their respective checkout screens; availability remains PayPal's decision. No card details are collected by the Rowdy Room site.

Only a final completed PayPal capture with the exact reserved order, reference, USD amount and private server capability can move a singer or credit a contribution. Stable provider request IDs and a unique capture ledger prevent repeat application and tip/skip double counting. Queue eligibility is rechecked before capture and again under the queue transaction lock. A previously received payment whose skip can no longer be fulfilled is flagged for host reconciliation; the site does not automatically refund it.

Completed PayPal tips and applied skips count toward the same contributor standings as Cash App. Tips do not alter singing order. Cash App's existing browser receipt workflow remains connected and unchanged. Existing performance-package checkout remains separate; its webhook still verifies provider signatures and now isolates the new show payments from memory-order fulfillment.

Verification: 109 PHP flow checks, 53 JavaScript/receipt/edge/source checks, and six PHP syntax checks passed. New coverage includes receipt mismatches, unpaid orders, provider separation, duplicate captures, queue changes, both protected singers, tips plus skips, and webhook isolation. No genuine funds were captured in testing.

All seven changed existing files matched their saved production baseline before deployment. All twelve deployed files matched tested source by SHA-256; server permissions were 0644. Both edge-function source readbacks matched. A labeled signup reached the real host queue, then opened PayPal checkout. PayPal rejected paying the same merchant account as expected. Returning and checking the unpaid order kept the normal position and added no credit. The test singer was removed; final queue empty, no browser errors, Cash App bridge connected. The two small wording/return-heading corrections are included in the final release.

The card setting and guest-checkout request are verified; a fresh guest card form and an actual completed card/customer payment have not been independently accepted. The first genuine completed customer transaction must still be checked against its received capture, exact queue movement or tip, and single contribution credit. No extra deployment, login or extension reload is pending.

Protected authority: `rowdy-room/paypal-show-payments-2026-11-03` v2, JSONb SHA-256 `95099f045e444b416cc60579bcd47f22626b44a81b64dc7e3e943a3ab19ac424`. Audit run: `648fa992-08f0-42fc-b44c-ac2a1821566d`. Public branch `codex/paypal-show-payments-20261103` remains unmerged. Private recovery manifest: 81 files, SHA-256 `a0adc224dbbbbcbc6dd260946603ca5a8ad2ad93d734a85a4af6281e1e06afae`. Source, credentials, hosting details and recovery locations remain protected.

References: [PayPal payment methods](https://developer.paypal.com/payment-links-buttons/overview), [guest checkout experience](https://developer.paypal.com/api/orders/v2/definitions/order_capture_request/), [previous host layout](SIMPLE_HOST_QUEUE_2026-11-03.md), [Cash App receipt workflow](CASHAPP_BROWSER_CHECKS_2026-11-03.md).
