# Rowdy Room

Rowdy Room is a live karaoke, audience-participation, competition, community, and local entertainment platform based in Rolla, Missouri.

**Live Karaoke. Real Votes. Real Community.**  
**Sing â€¢ Compete â€¢ Vote â€¢ Connect.**

## Current systems

- public Rowdy Room website
- singer queue and host rotation
- anonymous 1-5 star live voting
- Main 4 leaderboard
- Companion App
- Boost Points and TikFinity integration
- karaoke memories
- Rowdy Room Rumble
- Mission Control
- local DJ/karaoke booking
- Supabase-backed Project Engine

## Documentation

- [Rowdy Room Project Bible](docs/ROWDY_ROOM_BIBLE.md)
- [Progress Status â€” 2026-07-13](docs/PROJECT_STATUS_2026-07-13.md)
- [Supabase Security Audit â€” 2026-07-13](docs/SUPABASE_SECURITY_AUDIT_2026-07-13.md)
- [Supabase Bible sync](supabase/seed/20260713_rowdy_room_bible_sync.sql)
- [Supabase Bible sync rollback](supabase/rollback/20260713_rowdy_room_bible_sync_rollback.sql)
- [Supabase security-audit record](supabase/seed/20260713_security_audit_record.sql)
- [Supabase security-audit record rollback](supabase/rollback/20260713_security_audit_record_rollback.sql)
- [Public-safe Main 4 browser adapter](deploy/main4-panel/README.md)

## Main 4 authority

Mission Control includes the eight-position Main 4 and regular-signup rotation panel. Public browser surfaces can use the adapter in `deploy/main4-panel` to read the same authority. Host mutations require the existing host password and short-lived session lock; browser code never receives the Supabase service-role key.

## Operating rule

No production patch is complete without a backup or version-controlled recovery point, updated Bible documentation, verification results, and rollback notes.

## Application stack

The repository includes a Next.js 15, React 19, and TypeScript enterprise-engine application. The production website currently also includes PHP, HTML, CSS, and JavaScript surfaces that must be synchronized into version control as the deployment process is formalized.

Never commit secrets, host passwords, private tokens, service-role keys, or API credentials.

