-- Read-only Rowdy Room stream launch preflight.
-- Run before every show. This query does not modify production data.

with
active as (
  select *
  from public.rr_singers
  where status in ('queued','performing')
),
counts as (
  select
    (select count(*) from active) as active_count,
    (select count(*) from active where status='performing') as performing_count,
    (select count(*) from public.rr_performances where completed_at is null) as open_performance_count,
    (select count(distinct queue_position) from active) as distinct_positions,
    (select count(*) from public.rr_skip_requests where status='pending') as pending_skip_requests,
    (select count(*) from public.rr_boost_transfers where status='pending') as pending_boost_transfers,
    (select value from public.rr_state where key='voting_status') as voting_status
),
checks as (
  select 10 as sort_order, 'at_most_one_current_performer'::text as check_name,
         performing_count <= 1 as passed,
         jsonb_build_object('performing_count',performing_count) as details
  from counts

  union all
  select 20, 'at_most_one_open_performance',
         open_performance_count <= 1,
         jsonb_build_object('open_performance_count',open_performance_count)
  from counts

  union all
  select 30, 'current_performer_matches_open_performance',
         (
           (performing_count=0 and open_performance_count=0)
           or
           (
             performing_count=1 and open_performance_count=1
             and exists (
               select 1
               from active s
               join public.rr_performances p on p.singer_id=s.id
               where s.status='performing' and p.completed_at is null
             )
           )
         ),
         jsonb_build_object(
           'performing_count',performing_count,
           'open_performance_count',open_performance_count
         )
  from counts

  union all
  select 40, 'voting_matches_performer_state',
         (
           (performing_count=0 and voting_status='closed')
           or (performing_count=1 and voting_status='open')
         ),
         jsonb_build_object('performing_count',performing_count,'voting_status',voting_status)
  from counts

  union all
  select 50, 'active_queue_positions_unique',
         active_count=distinct_positions,
         jsonb_build_object('active_count',active_count,'distinct_positions',distinct_positions)
  from counts

  union all
  select 60, 'active_queue_positions_positive',
         not exists(
           select 1 from active where queue_position is null or queue_position<1
         ),
         jsonb_build_object(
           'invalid_rows',
           coalesce((
             select jsonb_agg(jsonb_build_object(
               'id',id,'name',singer_name,'position',queue_position
             ))
             from active
             where queue_position is null or queue_position<1
           ),'[]'::jsonb)
         )

  union all
  select 70, 'no_duplicate_active_singer_names',
         not exists(
           select 1
           from active
           group by lower(btrim(singer_name))
           having count(*)>1
         ),
         jsonb_build_object(
           'duplicates',
           coalesce((
             select jsonb_agg(jsonb_build_object(
               'normalized_name',normalized_name,'count',duplicate_count
             ))
             from (
               select lower(btrim(singer_name)) as normalized_name,
                      count(*) as duplicate_count
               from active
               group by lower(btrim(singer_name))
               having count(*)>1
             ) d
           ),'[]'::jsonb)
         )

  union all
  select 80, 'singer_status_timestamps_consistent',
         not exists(
           select 1
           from public.rr_singers
           where (status='performing' and (started_at is null or completed_at is not null))
              or (status='queued' and completed_at is not null)
              or (status='completed' and completed_at is null)
         ),
         jsonb_build_object(
           'invalid_count',
           (
             select count(*)
             from public.rr_singers
             where (status='performing' and (started_at is null or completed_at is not null))
                or (status='queued' and completed_at is not null)
                or (status='completed' and completed_at is null)
           )
         )

  union all
  select 90, 'one_performing_index_present',
         exists(
           select 1 from pg_indexes
           where schemaname='public' and indexname='rr_singers_one_performing'
         ),
         '{}'::jsonb

  union all
  select 100, 'active_position_index_present',
         exists(
           select 1 from pg_indexes
           where schemaname='public' and indexname='rr_singers_active_queue_position_unique'
         ),
         '{}'::jsonb

  union all
  select 110, 'one_open_performance_index_present',
         exists(
           select 1 from pg_indexes
           where schemaname='public' and indexname='rr_performances_one_open'
         ),
         '{}'::jsonb

  union all
  select 120, 'legacy_skip_approval_not_public',
         not has_function_privilege(
           'anon','public.rr_decide_skip_request(uuid,text)','EXECUTE'
         ),
         jsonb_build_object(
           'anon_execute',
           has_function_privilege(
             'anon','public.rr_decide_skip_request(uuid,text)','EXECUTE'
           )
         )

  union all
  select 130, 'host_authorized_skip_function_available',
         has_function_privilege(
           'anon','public.rr_admin_decide_skip_request(text,uuid,text)','EXECUTE'
         ),
         jsonb_build_object(
           'anon_execute',
           has_function_privilege(
             'anon','public.rr_admin_decide_skip_request(text,uuid,text)','EXECUTE'
           )
         )

  union all
  select 140, 'pending_host_actions', true,
         jsonb_build_object(
           'pending_skip_requests',pending_skip_requests,
           'pending_boost_transfers',pending_boost_transfers
         )
  from counts
)
select sort_order,check_name,passed,details
from checks
order by sort_order;
