# Companion Room Explanation Control Law

**Date:** 2026-07-13  
**Status:** Database installed; source code verified; hosting deployment and MP4 pending

## Locked behavior

Mission Control has one private host action named **PLAY ROOM EXPLANATION** and one **STOP VIDEO** action.

When Play is pressed:

1. The host password is validated by the existing Rowdy Room admin systems.
2. A new unique `play` command is written to `public.rr_companion_media`.
3. Every open Companion App polls the command and opens the same explanation video.
4. A viewer who joins after playback starts seeks to the current elapsed point instead of restarting the room-wide video.
5. The overlay ends automatically at the command expiration or video end.
6. A viewer may return to voting without stopping playback for everyone else.

When Stop is pressed, all connected Companion Apps hide the video on their next poll.

## Media contract

Canonical video URL:

```text
https://rowdyroom.site/media/rowdy-room-explanation.mp4
```

Canonical server path:

```text
/home/ef39cr6m1vih/public_html/media/rowdy-room-explanation.mp4
```

Mission Control checks that the video URL exists before sending Play. No missing-video command is allowed to intentionally blank the Companion App.

## Mobile autoplay law

Browsers may reject automatic playback with sound. The Companion App must:

- try unmuted playback first
- fall back to muted autoplay
- display **TAP FOR SOUND** when browser policy requires user interaction
- remain usable when media polling or playback fails

No implementation may claim guaranteed unmuted mobile autoplay because browser policy controls that behavior.

## Voting law

The video command does not open or close voting. Voting remains controlled by the existing performance workflow. The Companion overlay provides **RETURN TO VOTING** and attempts to activate the existing Vote tab.

## Security law

- Public Companion clients have read-only access to the singleton media command.
- Public clients cannot insert, update, delete, or stop commands directly.
- The command RPC is callable through the publishable key but executes only after the existing Rowdy Room admin password validates.
- The allowed video URL must remain under `https://rowdyroom.site/`.
- The host password is kept only in Mission Control `sessionStorage`, never committed or written into the shared media table.
- The publishable key is discovered during deployment from the existing live voting page or supplied through `ROWDY_SUPABASE_PUBLISHABLE_KEY`; it is not duplicated in repository source.

## Deployment law

Source assets:

```text
deploy/companion-media/mission-control-companion-media.js
deploy/companion-media/companion-media-overlay.js
```

Production targets:

```text
public_html/mission-control/assets/companion-media-control.js
public_html/companion/assets/companion-media-overlay.js
```

Each page receives one append-only script tag. The installer is backup-first, atomic, idempotent, exact-marker guarded, post-write verified, and rollback capable.

## Verification levels

- **Database installed:** table, RLS policy, grants, seed row, and protected RPC exist.
- **Source verified:** installer and client tests pass.
- **Deployed:** production HTML and assets were changed successfully.
- **Media verified:** the canonical MP4 returns successfully and is playable.
- **Browser verified:** Mission Control Play and Stop synchronize at least two real Companion devices, including a mobile autoplay fallback test.

The feature is not fully live until all five levels pass.
