# Rowdy Room Cleanup Audit Summary

**Date:** 2026-07-14  
**Mode:** Read-only inventory. No deletion was performed or approved.

## Overall result

A cleanup is justified, but cPanel, GitHub, and Supabase contain live products mixed with duplicate-looking folders, generated development records, historical migrations, temporary tooling, and security findings. Cleanup must be executed in small, verified batches.

## cPanel

Canonical document roots in `config/canonical-sites.json` are protected.

Duplicate or ambiguous groups requiring comparison include:

- `companion` and `companion.rowdyroom.site`
- `game`, `game-control`, `game-viewer`, and `game.rowdyroom.site`
- `memories` and `memories.rowdyroom.site`
- top-level `render` and `public_html/render.rowdyroom.site`
- top-level `videomaker` and `public_html/videomaker.rowdyroom.site`
- `admin` and `admin.memories.rowdyroom.site`
- nested `public_html/public_html`
- `admin-tools`
- `rowdyroom_mobile_homepage_v7`
- `staging`
- `_old_rowdyroom_deployment_files`

These are review candidates, not approved deletions. Confirmed one-time PHP installers and failed installers may be retired after a full account backup and exact file verification.

## GitHub

Current laws, registries, live feature source, migrations, rollbacks, and Git history remain protected.

The clearest retirement candidate is the old Rumble-owned TV implementation, which conflicts with the standalone TV law. Its active source includes:

- `tools/rumble/fix-tv-mode.mjs`
- `tools/rumble/fix-tv-mode.test.mjs`
- `tools/rumble/fix-tv-mode-hardening.mjs`
- `tools/rumble/fix-tv-mode-hardening.test.mjs`
- `docs/bible/2026-07-13-rumble-tv-mode-repair.md`
- `supabase/seed/20260713_rumble_tv_mode_repair.sql`
- `supabase/rollback/20260713_rumble_tv_mode_repair_rollback.sql`
- old TV commands in `package.json`
- the TV step in `tools/rumble/apply-all-repairs.mjs`

Temporary recovery and installer tooling remains under review until its purpose is confirmed complete.

## Supabase

The account has two projects:

- `Final` — active and protected.
- `rowdyroom@gmail.com's Project` — inactive and a retirement candidate only after export and explicit project-level approval.

The active project currently has 62 public tables, 28 public views, 71 public functions, no Edge Functions, one storage bucket, and five stored memory-delivery objects.

Large generated Engine datasets are concentrated on 2026-06-28:

- `rr_engine_file_snapshots`: 30,742 rows
- `rr_code_objects`: 24,672 rows
- `rr_system_dependencies`: 6,880 rows
- `rr_engine_runs`: 35 rows
- `rr_scan_jobs`: 30 rows

These appear rebuildable, but they remain review-only until Engine dashboards, knowledge exports, health checks, releases, and search functions pass retention tests.

The security advisor also reports security-definer views, mutable function search paths, broad anonymous write policies, public bucket listing, and publicly executable security-definer RPCs. These require feature-level hardening, not blind deletion.

## Cleanup order

1. Remove obsolete GitHub Rumble-TV source after tests are updated.
2. Back up cPanel and retire only confirmed temporary installers.
3. Compare duplicate cPanel folders and quarantine proven legacy copies.
4. Export and verify the inactive Supabase project before deciding its disposition.
5. Implement reversible Engine-data retention.
6. Harden Supabase security in feature-specific batches.

No destructive cleanup is authorized by this summary alone.
