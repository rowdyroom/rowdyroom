# Live voting restoration — 2026-10-05

**Status:** Live guest and host pages updated; live ballot acceptance remains untested until Roger starts a real performer.

- The Companion at `https://rowdyroom.site/companion/#vote` again exposes Queue and Vote. Other temporarily hidden modules remain hidden. The existing fair-voting form collects singing and performance scores, reduces them to one 1–5 rating, and awards 1 BP for an accepted vote.
- PHP voting now follows the host's `live_show` queue performance. It rejects a missing or stale performance ID, derives the performer from the active queue-backed performance instead of trusting the browser, checks the voter identity, and rejects duplicate votes. Voting is open while that performance is active and for one minute after it is completed.
- The host page at `https://rowdyroom.site/queue/` now shows voting status and score from the PHP Companion service. The unrelated legacy Supabase Voting switch is no longer presented as an operative switch. Host Start Next and End Performance remain the controls that open and close voting.
- Live readback: Companion Vote rendered with a closed message and no July test singer; Queue–Vote navigation worked; host displayed `Voting: Auto` and a closed-status warning; stale performance submission returned HTTP 400; both pages had no browser-console errors; API health and Companion bootstrap returned OK.
- **Operator action before a show:** the queue still has an old current slot from September with no active performance. The host page identifies this mismatch. Roger must use End Performance to clear that stale slot before Start Next; the assistant did not alter the live lineup.
- **Acceptance gap:** no legitimate current singer was active during verification, so opening a real vote, casting a valid ballot, displaying a live score, one-minute close, and duplicate prevention have not been end-to-end witnessed. Do not call this live-ballot accepted until those observations pass.
- Pre-change production files were copied to a private cPanel recovery folder before edits. No database schema or existing vote records were changed. The July seed performance was left untouched but is no longer eligible for new votes.

Next safe action: clear the stale slot using the host control at show setup, start an actual singer, and verify one guest vote, score update, duplicate rejection, and final-minute closure.
