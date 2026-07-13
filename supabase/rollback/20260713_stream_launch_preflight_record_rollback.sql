-- Roll back only the stream launch preflight tracking record.
-- This does not change queue data, functions, indexes, or permissions.

delete from public.rr_updates
where title='Stream queue launch preflight passed'
  and source='github:rowdyroom/rowdyroom#feat/stream-launch-readiness';
