-- Rowdy Room Rumble start-to-setup flow repair tracking record.
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
  'Start Rumble setup flow repair implemented',
  'Root cause fixed in GitHub branch fix/rumble-start-setup-flow: goSetup changed state.page but did not call the page router, so the intro could remain visible. The repair clears the host hash, calls renderPage to reveal setupPage, and then persists with saveState(false) to avoid a redundant render. Automated result: 5 tests passed, 0 failed. The patcher requires repair item 1, creates a timestamped backup, supports check/apply/restore, and refuses an unexpected goSetup implementation. Live server deployment remains pending because no cPanel/SSH/SFTP connector or deployment workflow is available in this session.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-start-setup-flow'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Start Rumble setup flow repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-start-setup-flow'
);
