# Lucian Codex Pet

**Status:** Installed Codex v2 visual pet  
**Last updated:** 2026-07-28  
**Owner:** Roger Jamsek

Lucian is Roger's active main assistant companion visual pet. This record covers the local Codex pet package only; it does not define or activate assistant behavior, tools, permissions, a Bob Rowdy Robot runtime, or any other worker runtime.

## Installed package

- Pet ID: `lucian`
- Sprite version: `2`
- Atlas: `1536 x 2288`, 8 columns x 11 rows
- Standard animation rows: idle, running-right, running-left, waving, jumping, failed, waiting, active work, and review
- Looking directions: 16 clockwise poses from `000` through `337.5`
- Installed spritesheet SHA-256: `9fd0ecd64ab9b09513cbf25b039bfb3e6bcdf90cc401858b9209ace455ad7e79`
- Previous v1 spritesheet SHA-256: `41cfe841cca1ae58f67a09de9ff88cfc52daccc7ab354cf15d2f355a57e6d080`

## Verification

- Strict v2 atlas validation: pass; zero errors, zero warnings
- Transparent RGB residue: 0 pixels
- Chroma despill: pass
- Three-worker blind direction QA: cardinal hard gates pass
- Independent final visual QA: pass; no repair rows
- Accepted minor review warnings: the vertical cue is subtle at blind size for `067.5`, `112.5`, and `337.5`; the labeled loop confirms the intended quadrants and contains no reversal
- Continuity metrics warn at `157.5 -> 180` and `337.5 -> 000`; labeled visual review found no wrong quadrant or visible reversal

## Recovery

- Dated recovery archive: `Lucian_v2_Recovery_2026-07-28.zip`
- Archive SHA-256: `f9fc131860f478b74fc5be6c146fef15150f4a1ee97194e7aec256028187d23b`
- Archive entries: 14
- Contents: original v1 package, installed v2 package, strict validation reports, direction QA, blind QA resolution, continuity report, contact sheet, and run summary

## Recovery required

- Live in-app rendering remains to be observed after Codex reload or pet wake. Structural installation and file readback are verified.

## Next safe action

Reload or wake Lucian in Codex and visually confirm idle, active-work, and pointer-following directions in the running app. Do not change behavior or permissions as part of that visual check.
