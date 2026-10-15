# Reusable karaoke lyrics player — 2026-10-14

Status: prepared and locally browser-tested; production deployment and Mac-to-TV acceptance pending.

Open Track currently opens a new YouTube tab for each song. Replace that behavior with one same-origin lyrics-player window, reused across tracks. Host controls remain in their original window. The player embeds one YouTube video at a time, preserves its top-level document across song changes, and hides controls without entering browser or native video fullscreen. Escape restores the controls.

Use macOS Window or App sharing for the lyrics-player window; select the Mac headphone or speaker output separately. The website cannot control the Mac's audio routing. Do not claim AirPlay or physical audio delivery is verified from a browser test.

Validation: URL allowlist and ID validation, stable window reuse, close/reopen, popup-block feedback, script syntax, YouTube lifecycle, autoplay recovery, and blocked-embedding feedback passed. A real browser opened two different YouTube videos in the same popup, with no top-level document navigation, and rendered video with controls hidden.

Limits: YouTube can reject individual embedded videos, require a user gesture, show ads, or become unavailable. An Open on YouTube fallback pauses embedded playback first; opening that fallback may require sharing the other window. The remote TV black-screen/audio acceptance test remains required.

Deployment scope: host Open Track function and a new player page only; queue, performance, voting and BP actions are unchanged. Preserve the original host source and a server-side recovery copy before replacing it. Publish player before host and verify both readbacks.

Recovery key: lyrics-player-20261014. Private operational paths and hashes belong in the protected deployment record.
