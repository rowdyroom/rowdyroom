# BP signup, spending and participation restored — 2026-10-12

Live Companion now accepts an optional real TikTok username separately from the singer name. It shows Queue, Vote and Boost. Guests can still sign up without TikTok.

- Line skipping costs **2 BP per position** and cannot pass current/up-next. Only the connected singer's eligible waiting turn can be selected.
- A song requested **to play** costs **5 BP**, never enters the singing rotation, and waits for host approval. The host chooses when to play it and can mark it played.
- Both spending options charge the existing TikTok wallet only when the host approves. Declines cost nothing. Queue action retries avoid duplicate movement/debits; failed queue transactions refund reserved points.
- Active visible Companion viewing earns **1 BP per 5 minutes**, only while a singer is live, capped at **12 BP/hour**. Accepted votes earn **1 BP**, capped at **12 BP/hour**. Completed singing earns **25 BP**, capped at **25 BP/hour**. Accepted vote/performance credits retry safely into the shared wallet.
- Verified TikTok follow/share/like-milestone events credit the recovered **10/15/5 BP** rates. Existing webhook validation and duplicate-event protection remain in front of this bridge.
- Host controls show pending requests and the requester to verify. The optional handle is self-claimed; it is not OAuth proof. Spending remains host-approved.

Validation: 11 actual-service PHP fixture checks and PHP/JS syntax passed. Database rollback tests covered fixed prices, pending no-charge, server-authenticated earning, duplicate votes and hourly caps. Live synthetic playback approval charged5 BP without adding a singer; live skip moved position3 to2 for2 BP while leaving up-next first. All test singers were removed, the test wallet was restored, and no artificial ballots were submitted. All five deployment sources and four rollback originals matched readback.

Remaining acceptance: external TikTok event delivery and five real uninterrupted viewing minutes during the next live show. Function-level earning tests passed; these external/live-duration checks are not represented as completed.

Public-safe authority is this document on `codex/queue-host-unified-20260917` (not merged into main). Private authority: `rowdy-room/bp-restoration-2026-10-12`. Local recovery: `Rowdy_Room_BP_Recovery_2026-10-12/RECOVERY.md` and `hashes.json`; exact server paths and private code remain in protected storage. Server active index receives the same breadcrumb.

Next action: use Boost with an actual TikTok handle; review spending requests in host controls, and observe the first genuine rewards during the next show.

Verification receipt: protected `rowdy-room/bp-restoration-2026-10-12` v1, SHA-256 `e0aaa2014a115b4646ae51904c0c6415f926eaca6c72c5b208ee3699e7fe8ba8`, history2481; check run `556dc3fb-5155-498a-9627-9ddc8e22e8e5`. Public preparation commit `be3d22fe7e7c2e2425fd57e83d5f0483da37e75d`, not merged. Recovery `RECOVERY.md` SHA-256 `431540bffb140f9f83489146418b1d0081e1c4833746e612d4baf45f6f46e67d`. Server active index and its rollback copy matched; public document readback matched.
