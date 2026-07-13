-- Rowdy Room Rumble coin flip carryover repair tracking record.
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
  'Rumble coin flip carryover repair implemented',
  'Root cause fixed in GitHub branch fix/rumble-coin-carryover: the coin flip selected only a team, hard-coded currentIndex to zero, displayed no first-player name, and the coin-page LETS GO path bypassed full match initialization. The repair randomly selects and displays a first player from the winning team, preserves or safely clamps that index during startMatch, routes the coin and game pages explicitly, and makes showGame delegate to startMatch. Automated result: 7 tests passed, 0 failed. The patcher requires repair items 1 and 2, creates a timestamped backup, supports check/apply/restore, and refuses unexpected implementations. Live server deployment remains pending because no cPanel/SSH/SFTP connector or deployment workflow is available in this session.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-coin-carryover'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble coin flip carryover repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-coin-carryover'
);
