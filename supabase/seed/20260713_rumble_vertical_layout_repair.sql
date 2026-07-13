-- Rowdy Room Rumble responsive 9:16 layout repair tracking record.
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
  'Rumble responsive 9:16 layout repair implemented',
  'GitHub branch fix/rumble-vertical-layout adds an isolated portrait/narrow responsive layer with viewport-fit cover, safe-area padding, dynamic viewport height, centered single-column game/setup/host surfaces, readable responsive text, one-column answers, touch-sized controls, overlay clipping protection, short-screen compression, and reduced-motion support. The dedicated TV route is excluded and game logic is preserved byte-for-byte. Automated result: 20 tests passed, 0 failed. This completes 110 passing tests across all 11 ordered Rumble repairs. Live deployment and visual verification remain pending because no cPanel/SSH/SFTP or browser connector is available.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-vertical-layout'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble responsive 9:16 layout repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-vertical-layout'
);
