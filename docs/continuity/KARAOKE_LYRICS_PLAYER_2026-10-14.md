# Karaoke lyrics playback — 2026-10-14

Status: host correction deployed with exact source readback; approved native Mac helper installed and owner-granted Safari control verified. Two non-playing links reused Safari window 621. Actual karaoke-to-TV picture and audio acceptance is pending.

Roger's selected karaoke track rejected embedded playback. The earlier embedded player passed test videos but did not satisfy the actual karaoke acceptance gate. It is superseded by regular YouTube watch-page playback.

The approved local Rowdy Lyrics AppleScript helper accepts only an 11-character YouTube video ID. It loads the regular YouTube page in a dedicated Safari window, reusing its saved window ID. It creates a new window if the saved window was closed or repurposed. Safari Automation permission is owner-approved. It has no HTTP listener, credentials, or generic command/URL input.

Launching Rowdy Lyrics opens host controls with `?player=mac`. Open Track uses the installed `rowdylyrics` handler in that mode. Normal web mode opens a YouTube popup. Browser-only reuse is best-effort: the real-browser test opened a second window because YouTube isolates its browsing context. No browser-only single-window guarantee is made.

Share the dedicated Safari YouTube window using Window or App. Keep it in normal-window Theater mode to avoid the prior native fullscreen transition. Audio routing remains a macOS setting and requires real Mac/TV acceptance.

Scope: host Open Track routing plus the approved local Mac helper. Queue, scores, voting, and BP behavior are unchanged. Original source and prior deployment recovery files are preserved under recovery key `lyrics-player-20261014`.

Protected authority: `rowdy-room/karaoke-lyrics-player-20261014`. Public documentation remains on unmerged branch `codex/lyrics-player-20261014`. Protected version 2, SHA-256 `555b8e9a962c4a13d84b8734fa0046ff091248c6a53a71d3d07d9cee6e036ed6`. Next: use the Mac desktop Rowdy Lyrics launcher, Open Track, allow Safari to open the approved helper if prompted, share the dedicated YouTube window, and confirm actual TV lyrics with Mac audio.
