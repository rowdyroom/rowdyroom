# Desktop workspace startup — 2026-10-29

## Grok conversation and blank-tab repair — verified October 29, 2026

- Bridge 0.6.32 now checks the configured Grok conversation after initial page loading/redirects. A home-page landing is corrected in the same tab, without activating it or submitting a prompt. An already-correct conversation is retained; a different owner conversation is preserved rather than overwritten.
- Startup closes inactive, unpinned blank restore tabs only in the paired workspace window. Active/pinned tabs, real pending navigations and the three-pane workspace are protected. Downloads/Extensions are not required startup services; the final utility tab was closed after verification.
- Actual closed-browser test after owner extension reload: zero Vivaldi processes before launching the desktop shortcut; all startup checks passed. Thirty services reused, zero new service tabs, two blank restore tabs removed. Grok's saved conversation restored automatically. Final inventory: thirty-five web tabs, zero blanks, zero duplicate pages; all web pages preserved and three panes visually intact.
- A repeated reconciliation also created zero tabs and retained the correct Grok conversation. Seventeen targeted automated tests passed.
- Readiness now requires a version at least 0.6.32 and explicit Grok conversation-restored evidence. The initial cached-code activation failure was not accepted as success; the owner reloaded once before the passing test.
- Booking database and outreach-policy hashes stayed unchanged. No messages, external drafts, forms or Calendar writes. PC reboot/crash recovery and permanent provider availability are outside this test.
- Protected authority: `psyche/desktop-workspace-2026-10-29`. Local before/after source, actual receipts, tab inventory, screenshot and result are protected there. Recovery manifest SHA256 `a21db7e7fc50c172815b1a6fdc70169baac8637faa229b380e9fbf368a6e2485`.

Earlier test limitations below are historical; this section supersedes the Grok-home/blank-tab activation gaps. Next safe action: use the single Start Psyche desktop shortcut, keep outreach held and retain the existing browser workspace.

Roger's existing Start All desktop button now opens missing required service tabs through the paired browser bridge, instead of relying only on the previous session. It preserves existing pages, forms, conversations and tiled panes. Existing duplicates are not closed automatically.

## Verified behavior

- Bridge 0.6.31 activated in the existing Vivaldi profile without an owner click.
- Thirty required services: ChatGPT, Control Center, Psyche Campus, Gemini, Claude, Grok, Suno, Google Flow; Facebook, Instagram, X, Reddit, TikTok, Google Search, Maps, Gmail, Calendar; Walmart, Amazon, Etsy, eBay, Target, Best Buy, Newegg, Fiverr, Upwork, Indeed, ZipRecruiter, LinkedIn Jobs and Glassdoor.
- Full desktop launcher completed with every recorded startup check true. All eleven registered worker connections reported ready at that check; this is connectivity, not a new inference test of every worker.
- First reconciliation reused twenty-three tabs and created seven missing background tabs. A second live request found all thirty and created zero tabs. Thirteen targeted automated tests passed.
- The existing three-pane workspace was visibly retained. No browser shutdown/cold session restore was performed.
- Reconciliation is explicit per desktop launch, expires after five minutes and is restricted to the selected browser identity. It recognizes pending navigation and does not navigate existing tabs. A local authenticated status receipt is required; a silent bridge failure cannot count as startup success.
- The launcher also starts the installed Codex desktop runtime if it is closed, because the existing research heartbeat depends on it. The final full launcher passed with `CodexProcess` true and zero new service tabs. Starting from Codex closed was not exercised in this active chat.
- Browser startup now precedes browser-bridge readiness checks, fixing the old ordering problem when Vivaldi is closed.

## Operational limits

An open tab is not evidence of sign-in, provider availability, task execution or booked work. Site challenges, expired sessions and provider limits can still require attention. A missing/ambiguous Gemini pane fails closed rather than changing the tiled workspace.

The existing booking heartbeat remains active at 08:00, 12:00, 16:00 and 20:00 Central. Its next scheduled execution was not tested here. PC, Codex, Vivaldi and local services must remain available. No continuous 24/7 guarantee is claimed.

Research and local preparation only: outreach remains held; no external draft, message, application, purchase or calendar change. This update does not enable PC video/voice models or resume rejected video work.

## Authority and recovery

Protected record: `psyche/desktop-workspace-2026-10-29`. Local implementation, status receipts, screenshot and prior-source recovery locations are recorded there. Recovery manifest SHA256: `1e50ffbd8e2fcb3dc206d7778b6993c866bf14988b0a50079ee31b32fa530745` (15 files).

Next safe action: use the existing desktop button; continue permitted research while holding outreach. Review a future failed readiness receipt before retrying startup.


## Closed-browser test — October 29, 2026

Vivaldi exited normally and zero browser processes were verified before the actual desktop shortcut was launched. All startup readiness checks then passed; all thirty required services were found with zero new service tabs. The three tiled panes restored in the same order. Thirty-five web tabs restored without duplicate pages; the Google homepage cache-buster changed. Grok initially returned to its signed-in home page and its existing conversation was recovered using its sidebar without submitting a prompt.

This was not an exact restoration of browser utility windows: the separate Download History popup did not reopen, and Extensions became a blank New Tab. Total tab count changed from 37 to 36. These differences are explicitly retained as restore limitations, not counted as full exact-session success. No startup code was changed in this test. The production booking database and outreach-policy hashes stayed unchanged; no messages or Calendar writes.

Evidence and local session recovery copy: protected record `psyche/desktop-workspace-2026-10-29`. This verifies a normal browser exit/restart, not a PC reboot or crash recovery. Next safe action: use the single Start Psyche desktop shortcut for the service workspace; do not claim exact restoration of internal utility tabs or provider conversations.
