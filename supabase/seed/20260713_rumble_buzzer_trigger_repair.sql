-- Rowdy Room Rumble buzzer display trigger repair tracking record.
-- DML only. No schema, permission, RLS, function, view, or storage changes.

insert into public.rr_updates (
  update_time,
  area,
  kind,
  title,
  details,
  state,
  source
)
select
  now(),
  'Rumble',
  'Repair',
  'Rumble buzzer display trigger repair implemented',
  'GitHub branch fix/rumble-buzzer-trigger connects compact-game strike and steal transitions to /api/rumble-buzzer.php. It normalizes strike, steal, and strike_steal aliases; sends the affected player and Fire/Ice team; uses action=trigger with a canonical direct-action fallback; triggers standalone Strike 3, Steal Opportunity, and combined Strike 3 + Steal events; leaves ordinary first/second strikes local; and records state.buzzerSyncError without blocking game flow. Automated result: 12 tests passed, 0 failed. The patch is exact-match guarded, backup-first, idempotent, and rollback capable. Live deployment and browser verification remain pending because no cPanel/SSH/SFTP connector is available and the public domain did not resolve from the inspection environment.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-buzzer-trigger'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble buzzer display trigger repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-buzzer-trigger'
);
