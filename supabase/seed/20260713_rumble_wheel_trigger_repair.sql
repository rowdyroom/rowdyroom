-- Rowdy Room Rumble wheel display trigger repair tracking record.
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
  'Rumble wheel display trigger repair implemented',
  'GitHub branch fix/rumble-wheel-trigger connects the compact game Punch Wheel action to /api/rumble-wheel.php?action=spin using the current player and Fire/Ice team mapping. The returned result_key becomes the authoritative in-game effect; action=state is queried when needed; miss, skip-turn, five-second-timer, and power-punch key variants are normalized; and a local fallback preserves play if the display API is unavailable while recording state.wheelSyncError. Automated result: 9 tests passed, 0 failed. The patch is exact-match guarded, backup-first, idempotent, and rollback capable. Live deployment and browser verification remain pending because no cPanel/SSH/SFTP connector is available and the public domain did not resolve from the inspection environment.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-wheel-trigger'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble wheel display trigger repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-wheel-trigger'
);
