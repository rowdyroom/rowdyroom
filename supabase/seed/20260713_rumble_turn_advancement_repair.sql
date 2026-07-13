-- Rowdy Room Rumble automatic turn advancement repair tracking record.
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
  'Rumble automatic turn advancement repair implemented',
  'GitHub branch fix/rumble-turn-advancement adds independent red/blue rotation indexes; correct-answer and ordinary wrong-answer player advancement; timer-expiry reuse of the wrong-answer path; third-strike transfer to the opposing team first player; next-question rotation; alternating round starters; one-player wrapping; and start/restart rotation initialization. Automated result: 12 tests passed, 0 failed. The patch is exact-match guarded, backup-first, idempotent, and rollback capable. Live server deployment and browser verification remain pending because no cPanel/SSH/SFTP connector or deployment workflow is available in this session. A separate stream-readiness gate now requires sign-up, queue, rotation, current/next performer, host-control, persistence, and companion-display verification.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-turn-advancement'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble automatic turn advancement repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-turn-advancement'
);
