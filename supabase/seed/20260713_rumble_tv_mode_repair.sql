-- Rowdy Room Rumble TV mode repair tracking record.
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
  'Rumble isolated TV mode repair implemented',
  'GitHub branch fix/rumble-tv-mode adds a dedicated #tv display containing only the join QR/URL, current and next player, Fire/Ice player queues, and rotating Rowdy Room banner. It excludes host controls, answer key, and rules content; stays synchronized through the existing render/BroadcastChannel path; adds a separate host navigation shortcut and Alt+T; supports join URL, QR image, banner, and cadence overrides; and defaults the QR destination to /companion/. Automated result: 12 tests passed, 0 failed. The patch is guarded, backup-first, idempotent, and rollback capable. Live deployment, QR scan, dimensions, and browser synchronization remain pending because no cPanel/SSH/SFTP or browser connector is available.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-tv-mode'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble isolated TV mode repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-tv-mode'
);
