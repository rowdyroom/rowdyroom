# One overall five-star vote - 2026-10-26

Companion Vote now shows one Overall Rating selector with five stars and one Submit Vote button. The selected integer1-5 is sent directly as rating. Previously the page required Singing Score and Performance Score and submitted the lower of the two. The server already stored a single1-5 rating, so no server, database, historical score or vote-window migration was required. Existing votes and results remain unchanged.

Selection is cleared when the current performance changes or after success. Empty/closed selection is blocked; double-clicks are blocked while submitting. The versioned script is app-single-vote-20261026.js. The former script remains intact for cached old pages. Viewers should refresh Companion to load the new page.

The periodic TikFinity voting tip now asks for one overall rating. The idle bridge was restarted with no pending events; Event API connected and no error. No broadcast was started.

Verification passed: isolated exact1-5 payloads, absent category_scores, empty and closed guards, duplicate-click guard and classic browser syntax. The deployed page rendered one five-star selector and four-star highlight, current singer and live score. HTML readback matched after excluding hosting analytics; new JS matched byte-for-byte. Live API rejected0/6 and rejected a valid-range score against an intentionally invalid performance before writing. No fake live vote was submitted; next real audience submission remains unobserved.

Implementation cdca97b on codex/voting-announcements-20261026, unmerged. Private rowdy-room/single-overall-vote-2026-10-26 v1/SHA256f2a04ee664d969422f2e8ab0a074952050e3cc195c459e16891599f8146eb468. Public sources deploy/companion/index.html and deploy/companion/assets/app-single-vote-20261026.js. Recovery Rowdy_Room_One_Star_Score_2026-10-26 contains original HTML/JS/CSS/bridge, build and isolated verifier, server readbacks, API boundary results and screenshot. Rollback restores index.before.html, referencing the untouched original app.js, and chatbot.before.mjs if reversing reminder text.

HTML SHA256967b57bdf19ec8769afd9f5ae26359c4e3073ae0096436d392754ec9b84c682f; JS369cbe891e0be0b4fac7ab308ca3bff13de2c5eb4b213776c96c08c692ae44c0; bridge12c2d37298d08134fe8a78d029cf2eb9d99c3e3f8b5390488334be127737c5c9.