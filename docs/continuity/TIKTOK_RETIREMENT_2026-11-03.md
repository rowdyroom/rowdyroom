# Production and live-show focus - 2026-11-03

Roger retired TikTok livestreaming, TikFinity, BP/Boost Points, gift-trigger rewards and streaming chatbots. Current focus: the production studio and live in-person DJ/karaoke shows. This explicitly preserves live audience voting and Rowdy Room Rumble without BP spending or awards. It supersedes older streaming setup, future-LIVE verification, gift-mapping and points-growth instructions. The Psyche Team remains the combined Cloud Team and Local Team; current cloud management authority is retained.

## Implemented

- Removed the TikFinity/BP Windows startup entry. Retired both ordinary and direct bridge launch paths before configuration, delivery or network connection.
- Uninstalled current TikFinity and archived a separate old installation, plugin and shortcuts. Removed only the two TikFinity/TikTok launch actions from the shared Stream Deck Programs action, retaining Spotify, OBS, Voicemod and other controls. One Stream Deck manifest changed; other manifests match their originals.
- Removed automatic TikTok browser restoration/launch targets, closed its existing tab and retired the Coins shortcut. Booking automation remains active; no streaming-specific Codex automation or queued streaming job was found.
- Removed the older dashboard's TikTok setup panel and streaming preflight requirements. Changed studio descriptions to general video production. Saved active business focus and a current Psyche context amendment so old streaming instructions are not resumed.
- Public homepage, Companion and host queue no longer offer wallets, gifts, paid skips or streaming controls. Removed points polling. Existing retired HTTP entry points return 410, while the API compatibility service does not mutate wallets.
- Disabled ten identified points/gifting RPCs for client and service roles and removed public/client writes on twelve points/gift tables. Historical wallets, transactions, identities, votes and show data were retained.

## Explicitly preserved

- Live audience voting: Vote tab and all five rating controls retained; standings API responds successfully. Vote submission route remains in place, and the old BP reward synchronization was removed.
- Singer signup, queues, current performance, rotation and lyrics/projection workflows remain. No real vote, singer reorder, show reset or signup was submitted by the checks.
- Rumble remains at the existing game/control URLs and has a Companion link. Normal answer scoring, duplicate-answer protection, lifelines and resurrection work without wallet spending. Host game controls are free. Removed the wallet-dependent Punch availability check, BP balance input/display and BP award code. Rowdy Rush keeps its game score and target; no wallet reward is created. TikTok/gift labels were removed from its controls.

## Verification and limits

Seventeen isolated browser/game checks passed with no runtime JavaScript errors. All mutating HTTP requests were blocked in that test; it used an existing identity for read-only show data. Rumble engine exercises used only the isolated test profile's local state. Current dashboard typecheck and downloaded public JavaScript syntax checks passed. Read-only API checks: health, queue, performance, standings and rotation 200; wallet, gifting, watch earning and TikTok verification 410. Database check: ten retired RPCs, zero remaining client/service execution grants; twelve retired points/gift tables, zero public-client write grants. Physical show acceptance and a real audience vote were not performed.

Windows canceled TikTok LIVE Studio's uninstall (0x800704c7). The application remains installed. No related process is running; its elevation service is stopped/manual, and its shared Stream Deck launch action is removed. Do not report a complete software uninstall or silently retry the canceled installer. Old source/history and account content are retained as inactive recovery material, not current objectives.

Live local/site changes are deployed. Public documentation and migration record are on codex/local-studio-rerun-20261103, unmerged. Protected record: psyche/tiktok-live-retirement-2026-11-03. Recovery identifier: tiktok_retirement_20261103. Next: owner show review; remaining app removal requires completing the Windows uninstaller if Roger wants the installed binary removed.
