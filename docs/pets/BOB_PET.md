# Bob Codex Pet

**Status:** Installed visual pet package
**Pet ID:** `bob`
**Sprite version:** 2
**Last updated:** 2026-07-28

Bob is Roger's Rowdy Bot Builder visual pet. The visual package is separate from behavioral skills, assistant instructions, tools, and permissions.

## Installed visual package

- Atlas format: WebP with alpha
- Atlas size: 1536 x 2288
- Grid: 8 columns x 11 rows
- Cell size: 192 x 208
- Standard animation rows: 0 through 8
- Looking-direction rows: 9 and 10
- Looking directions: 16 clockwise poses from `000` through `337.5`
- Installed spritesheet SHA-256: `6d48c593f1fdd90c584cd3c1864aa60865c96cbd655af14103ae40f1ebe557b4`

## Verified result

- Installed `pet.json` declares `spriteVersionNumber: 2`.
- Standard frame inspection passed with zero errors and zero warnings.
- Installed atlas validation passed with zero errors, zero warnings, and zero transparent-RGB residue.
- Installed, staged, and final atlas hashes matched exactly.
- Up/down and screen-left/screen-right cardinal direction hard gates passed.
- Labeled review accepted the complete clockwise direction loop.
- Continuity warnings at `157.5` to `180` and `337.5` to `000` were visually reviewed; no reversal, clipping, identity break, attachment break, or scale pop was observed.

## Scope boundary

This upgrade changes Bob's visual pet package only. It does not activate or change any personality, behavior, assistant skill, workflow, tool, external integration, or permission.

## Recovery evidence

- Recovery archive: `Bob_v2_Look_Directions_Recovery_2026-07-28.zip`
- Recovery archive SHA-256: `23e3a41b7e90e6280fcc41bd5fe86e8085a0bcf554b161187e268e68c160f29d`
- Archive contents: installed Bob v2 package, original Bob v1 package, visual QA sheets, structural validation, direction QA, continuity review, and run summary
- Original Bob v1 spritesheet SHA-256: `37e30474cad37cf643a91655e535851f3ebb241d416f8936ac1c16dd6ba3a6b7`
- Continuity recovery archive: `Bob_v2_Continuity_Update_2026-07-28.zip`
- Continuity recovery SHA-256: `dbe0973724a55875fca371663a5455125c0ca7e70d17d3fb8e4fa24400b8a6c9`

## AI Start

- Submission ID: `pending_20260728_170702_fa2a792b`
- Status: pending review
- Proposed Bob passcode: `0003`
- The passcode and mission record are not official until approved in AI Start.

## Recovery required

- A live Codex runtime animation smoke test was not recorded as part of this upgrade.
- The AI Start mission submission remains pending review.

## Exact next safe action

When Bob is next displayed in Codex, visually confirm that the installed standard animations and looking directions render correctly at runtime. Do not regenerate or replace the validated package unless that smoke test reveals a specific defect.
