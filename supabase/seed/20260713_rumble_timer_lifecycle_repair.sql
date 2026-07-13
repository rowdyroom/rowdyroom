-- Rowdy Room Rumble timer lifecycle repair tracking record.
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
  'Rumble timer lifecycle repair implemented',
  'Root cause fixed in GitHub branch fix/rumble-timer-lifecycle: the timer could reach zero without calling wrongAnswer, clear only on a later tick, retain a stale interval handle, and fail to start after match/question/reset paths. The repair starts the 40-second timer from match, new-question, continuing-round, and restart paths; preserves remaining time on pause/resume; resets expired values to 40; reaches zero exactly; clears and nulls the interval; calls wrongAnswer(currentTeam) once; and stays stopped at match completion. Automated result: 8 tests passed, 0 failed. Automatic turn advancement is intentionally deferred to repair item 6. The patcher requires item 4, creates a timestamped backup, supports check/apply/restore, and refuses unexpected implementations. Live server deployment remains pending because no cPanel/SSH/SFTP connector or deployment workflow is available in this session.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-timer-lifecycle'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble timer lifecycle repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-timer-lifecycle'
);
