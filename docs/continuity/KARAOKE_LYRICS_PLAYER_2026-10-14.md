# Reusable karaoke lyrics player — 2026-10-14

Status: deployed with exact production source readbacks and real browser video playback verified; Mac-to-TV picture and audio acceptance pending.

Open Track now reuses one same-origin lyrics-player window across tracks, replacing a new YouTube tab for every song. Host controls remain in their original window. The player embeds one YouTube video at a time, preserves its top-level document across song changes, and hides controls without entering browser or native video fullscreen. Escape restores the controls.

Use macOS Window or App sharing for the lyrics-player window; select the Mac headphone or speaker output separately. The website cannot control the Mac's audio routing. Do not claim AirPlay or physical audio delivery is verified from a browser test.

Validation: URL allowlist and ID validation, stable window reuse, close/reopen, popup-block feedback, script syntax, YouTube lifecycle, autoplay recovery, and blocked-embedding feedback passed. A real browser opened two different YouTube videos in the same popup, with no top-level document navigation, and rendered video with controls hidden.

Limits: YouTube can reject individual embedded videos, require a user gesture, show ads, or become unavailable. An Open on YouTube fallback pauses embedded playback first; opening that fallback may require sharing the other window. The remote TV black-screen/audio acceptance test remains required.

Deployment scope: host Open Track function and a new player page only; queue, performance, voting and BP actions are unchanged. Preserve the original host source and a server-side recovery copy before replacing it. Publish player before host and verify both readbacks.

Recovery key: lyrics-player-20261014. Private operational paths and hashes belong in the protected deployment record.

Protected authority: `rowdy-room/karaoke-lyrics-player-20261014`, version 1, SHA-256 `a4e1938d99bfff61e08fa6234ed9a50f65fa17969c81c1698e7d0fd2d696aa77`. Public record branch `codex/lyrics-player-20261014` is not merged. Dated recovery package key: `lyrics-player-20261014`. Next acceptance: reload host controls on the Mac, Open Track, share the lyrics-player window, and confirm visible TV lyrics plus Mac audio.
