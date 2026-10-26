# Stream Deck voting timer — 2026-10-26

Installed a Rowdy Room Timer action on Stream Deck Neo, Rowdy Room Live profile, page 6, top-left key. All 40 existing keys and their five pages were compared with the recovery copy and remain unchanged.

- Short press starts 60 seconds when hidden, or hides the visible timer.
- Hold at least 0.7 seconds restarts the full minute.
- Key title follows shared server state and shows remaining time / HIDE.
- Existing queue-page Start / Restart and Hide controls remain available.

The locally installed plugin uses the existing protected show bridge credential, without embedding it in the plugin or profile. Timer API accepts narrowly scoped signed commands and retains existing host authorization. Unauthenticated and invalid signatures returned 401. Signed start/hide and simulated SDK short/hold events passed; real Stream Deck plugin context is polling without error. Editor shows the new key on page 6. Physical key activation and next-LIVE viewer delivery remain unobserved; no LIVE session was started.

Implementation: bd29680 on codex/voting-announcements-20261026, not merged into main. Live endpoint: /live-overlay/timer.php. Protected recovery package: Rowdy_Room_VoteTimer_StreamDeck_2026-10-26, including original profile, rollback endpoint, installed plugin source, event tests, profile verification and plugin hashes. Existing overlay URL preserved.

Private authority: rowdy-room/stream-deck-vote-timer-2026-10-26 v1, SHA-256 c63fc254d1c4a1c2ad6e678d9d49308d605b4408e97d8cc3b8222c94a2ea3d16.

Next safe action: press page 6 top-left on the physical deck, then press to hide; hold to restart. If rollback is required, quit Stream Deck and restore the protected profile-before copy, then relaunch. Restore the previous timer endpoint only if retiring signed timer control.
