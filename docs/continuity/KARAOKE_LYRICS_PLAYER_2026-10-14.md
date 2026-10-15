# Karaoke lyrics playback — 2026-10-14

Status: Roger confirmed actual karaoke video/lyrics on the TV and sound from the Mac after the screen-sharing selection was corrected.

Desktop Mac Open Track now automatically invokes the approved Rowdy Lyrics helper. It reuses the dedicated Safari YouTube window, using regular YouTube pages because the selected karaoke track prohibited embedded playback. The existing actual-song window was adopted and a native invocation reused window 756. Windows and iPad retain normal browser playback; browser-only window reuse is best-effort.

The TV uses macOS Screen Mirroring with Window or App selected. Keep the shared karaoke window open, with normal-window playback to avoid the earlier fullscreen black-screen transition. Host controls remain on the Mac. A local CoreAudio guard restores the previous non-TV audio output when the TV takes the default. Roger confirmed Mac sound and then TV lyrics; future AirPlay reconnect and show endurance remain untested.

Production host readback matched SHA-256 `a2e56f3200704d59aaccd9f251916cadc8449ddd2e3d031d4c4f02b46bfe7b9c`. Mac routing, explicit helper mode, Windows/iPad fallback, JavaScript syntax, running audio listener, and actual-track native window reuse passed. Queue, scores, voting and BP behavior are unchanged.

Protected authority: `rowdy-room/karaoke-lyrics-player-20261014`, version 4, history 2579, SHA-256 `51c5f99bfac30518ba9588f8094a3c78f1164d1cc879ba3f7b25acd7b938da41`. Public documentation is on unmerged branch `codex/lyrics-player-20261014`. Recovery key `lyrics-player-20261014`, current correction folder `mac-v3`; original rollback and superseded implementations are preserved. Next: operate through existing host controls and leave the shared window open. Recheck TV picture and Mac audio after any new AirPlay connection.
