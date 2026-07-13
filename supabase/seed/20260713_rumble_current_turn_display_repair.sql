-- Rowdy Room Rumble current-turn display repair tracking record.
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
  'Rumble current turn display repair implemented',
  'Root cause fixed in GitHub branch fix/rumble-current-turn-display: the game displayed only CURRENT: Player and did not identify the active team. The repair reads the selected player from the active team and displays Turn: Name — Red Team or Turn: Name — Blue Team, with a readable numbered fallback for missing names. It changes display text only and does not mutate currentTeam, currentIndex, scoring, timer, or turn logic. Automated result: 7 tests passed, 0 failed. The patcher requires repair item 3, creates a timestamped backup, supports check/apply/restore, and refuses an unexpected implementation. Live server deployment remains pending because no cPanel/SSH/SFTP connector or deployment workflow is available in this session.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-current-turn-display'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble current turn display repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-current-turn-display'
);
