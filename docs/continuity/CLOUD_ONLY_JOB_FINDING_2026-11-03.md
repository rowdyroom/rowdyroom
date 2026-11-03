# Cloud-only job finding and specialist roles — November 3, 2026

Roger directed job finding to use the Cloud Team independently of the Local Team and corrected the division of work. Gwen/Grok researches original social posts and customer requests. Seth/Gemini researches Google, browsers and original websites. Cody/Claude independently researches buyer requirements, outside-vendor eligibility and referral channels, and produces substantive plans, documents or technical deliverables. Lucian coordinates, verifies sources, integrates findings and owns final review. No routine provider peer-review stage.

## Implemented and verified

- Job-finding dispatch has explicit specialist lanes, strict cloud pins, no local fallback and localSupport:false. Wrong lanes, local overrides and routine peer-review assignments are rejected before enqueue.
- Cloud-only opt-out now excludes old background-practice samples as well as new local helpers.
- Grok retries bounded, idempotent reads of the original callback through the existing deadline. Its provider dispatch POST is never blindly repeated. Earlier failed deliveries were reconciled separately without erasing their history.
- Claude has a subscription-authenticated public research path permitting WebSearch and WebFetch only; no file, shell, MCP, private-account or outreach access.
- The explicit source-manifest parser accepts a copied JSON-language label while continuing to reject malformed or absent manifests.
- Cloud managers exited gracefully and rejoined with their original worker identities. No forced termination or Local Team configuration replacement was used.
- Targeted validation: 81 tests passed. Audited assignments have zero matching local child records, skipped local support, no local reasoning and no practice sample review. Production booking/contact table hashes are unchanged.

## Actual results and limits

Seth/Gemini's corrected website-research assignment completed in 85.67 seconds but supplied no captured original supporting pages or verified candidate. Cody/Claude's targeted requirement assignment completed in 48.66 seconds and produced one corroborated original booking-page finding: Lucky Chapel permits outside vendors without an added venue charge. Rental insurance wording does not establish a separate DJ/vendor insurance rule. Olde Oak's bounded corroborating page capture failed; its reported policy remains unverified in this pass. Gwen/Grok's final social-channel assignment completed in 101.94 seconds with an authenticated callback, but its candidate Facebook community was not verified as a local channel. These differing assignments are not a controlled speed comparison.

Cloud-only execution is demonstrated. A successful open-gig discovery pipeline is not yet demonstrated: zero verified open gigs, incomplete source capture and authenticated social coverage, current need/pay/buyer authority/route qualification UNKNOWN. A provider answer or healthy process is not independent source proof. No outreach, applications, external outreach drafts, purchases or Calendar writes occurred.

The native Vivaldi Facebook session was observed signed in with working public post search. Public-tool failures do not establish that the owner's browser lacks access. LinkedIn and Fiverr account setup and business-profile image consistency are separate ongoing UI tasks.

Protected authorities: psyche/ai-task-routing-policy and psyche/cloud-only-job-finding-2026-11-03. Private recovery identifier: cloud_only_job_search_20261103. Policy and code are deployed locally; this public record remains on the working branch until merged. Next: finish the current account/tab workflow and improve verified local source coverage without assigning generic peer-review work or involving Local Team models.
