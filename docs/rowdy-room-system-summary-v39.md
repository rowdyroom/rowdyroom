# Rowdy Room System Summary v39

Status: system-memory update only. No live website/game file changes.

## Stable systems to preserve

- Homepage: restored video hero version, mobile-first neon design, Watch Live / Rowdy Bunch / Discord buttons, sticky Sign Up / Live Vote / Boost Points buttons.
- Companion App: v5b UI confirmed working; tabs, voting, boost cards, memories, Rumble section, Resurrection Token UI.
- Songbook: metadata-only; no hosted tracks/lyrics; do not scrape SongBooks Online or CompuHost.
- Admin Queue Tool: active at `/admin-tools/queue.php`; removes queue entries without deleting users.
- Mission Control: active as show operations console, not the Rumble game engine.
- TikFinity bridge/server receiver/chatbot/YouTube search: installed; keep secrets private and rotate/restrict exposed keys later.

## Rumble status

Rumble is broken and not stream-ready. Builds v31-v36 are failed and must not be used as references.

## Rumble target correction

The uploaded Game Show Manager file is a functional-flow clue, not final design. Final target is 9:16 portrait, no question upload UI, saved built-in question list, random question selection, clean/simple/large phone-readable UI.

## Current blockers

- Name input loses focus after one character.
- Start/setup flow unreliable.
- Coin flip winner/player/team not carried forward correctly.
- Current player/team display missing or wrong.
- Timer not functioning in patched versions.
- Turns not advancing automatically.
- Wheel and buzzer animations not triggering properly.
- TV mode wrong; must be full-screen QR/queue/banner only.

## Rule going forward

No more all-in-one rebuilds. Fix one isolated item, test it, then update Bible/Supabase/GitHub before moving to the next item.
