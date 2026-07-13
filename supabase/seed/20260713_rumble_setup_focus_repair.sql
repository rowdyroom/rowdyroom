-- Rowdy Room Rumble setup input focus repair tracking record.
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
  'Setup player input focus repair implemented',
  'Root cause fixed in GitHub branch fix/rumble-setup-focus: setup input keystrokes persisted state and triggered a full render, rebuilding the input elements and dropping focus. The repair adds an optional render flag to saveState and uses saveState(false) only for team-name inputs. Automated result: 3 tests passed, 0 failed. Patcher creates a timestamped backup, uses exact-match guards, supports check/apply/restore, and refuses an unexpected file version. Live server deployment remains pending because no cPanel/SSH/SFTP connector or deployment workflow is available in this session.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-setup-focus'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Setup player input focus repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-setup-focus'
);
