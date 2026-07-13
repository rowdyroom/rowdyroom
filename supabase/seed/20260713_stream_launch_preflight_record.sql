-- Tracking record for the successful 2026-07-13 stream queue launch preflight.

insert into public.rr_updates(
  update_time,area,kind,title,details,state,source
)
select
  now(),
  'Stream Queue',
  'Preflight',
  'Stream queue launch preflight passed',
  'Read-only and assertion checks passed for current performer uniqueness, open performance uniqueness, performer/performance matching, voting-state consistency, active queue position uniqueness and positivity, duplicate active-name rejection state, singer timestamp consistency, required integrity indexes, legacy skip-approval revocation, and host-authorized skip availability. Pending host actions must still be reviewed immediately before each show.',
  'Passed - Supabase Queue',
  'github:rowdyroom/rowdyroom#feat/stream-launch-readiness'
where not exists(
  select 1 from public.rr_updates
  where title='Stream queue launch preflight passed'
    and source='github:rowdyroom/rowdyroom#feat/stream-launch-readiness'
);
