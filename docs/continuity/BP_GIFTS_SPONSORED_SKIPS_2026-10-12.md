# BP gift packages and sponsored skips — 2026-10-12

Roger approved restoring TikTok LIVE gift packages into the shared BP wallet: Hand Heart100 BP, Amped Up274 BP, Drum Pop575 BP, Gold Mine1,200 BP, per completed gift. Viewers send gifts through TikTok's LIVE gift tray; the Companion page lists the packages and uses the same TikTok username to view and spend the wallet. There is no separate website cash checkout.

Line skips now cost **10 BP per position**. Song-to-play requests cost **12 BP**. A viewer can select their own eligible waiting turn or sponsor another singer. The requester pays; the recipient wallet is not charged. Host approval remains required and cannot pass the current/up-next singer.

Each payer has two separate caps per rolling hour: **3 total positions for themselves, plus 3 total positions for other singers**. This counts positions, not three unlimited-size purchases. Charged approvals consume the cap; declined/refunded requests do not. The host rechecks the actual target identity, current queue and cap at approval. The page shows remaining positions in both buckets.

Gift delivery uses the existing protected TikFinity receiver and shared wallet. It recognizes actual usernames and the four approved packages, waits for a completed streak, credits each gift once, and preserves paid-gift delivery during outages. It does not trigger the older direct gift-based queue/game actions. The local relay is connected and starts at Windows sign-in.

Validation:12 normalization checks,10 PHP service checks, rollback-only database gift/dedup/credential/cap/price/refund/rolling-expiry checks, full synthetic gift WebSocket-to-wallet pipeline2449 BP, and live host-approved self/sponsored skips and playback charge passed. Replay credited0; unsigned gift returned401. Four live sources and four protected originals matched. The recipient wallet remained0; synthetic remainder was reversed to0 and the queue restored empty. No artificial votes were cast.

Remaining acceptance: one genuine TikTok gift during the next LIVE. Synthetic pipeline proof and desktop connection do not prove genuine audience-event delivery. TikFinity must be connected to the stream.

Authority: this document on `codex/queue-host-unified-20260917` (not merged); protected `rowdy-room/bp-gifts-sponsored-skips-2026-10-12`. Recovery: `Rowdy_Room_BP_Gifts_Recovery_2026-10-12/RECOVERY.md`.
