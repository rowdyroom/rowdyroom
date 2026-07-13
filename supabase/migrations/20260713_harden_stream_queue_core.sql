-- Applied to active Supabase project szubjgpvlqliyparrnam on 2026-07-13.
-- Purpose: make public signup, queue ordering, performer uniqueness, skip approvals,
-- and boost-based movement safe enough for a live karaoke workflow.

create or replace function public.rr_prepare_singer_insert()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if new.status in ('queued','performing') then
    perform pg_advisory_xact_lock(hashtextextended('rowdy_room_active_queue', 0));
    select coalesce(max(queue_position), 0) + 1
      into new.queue_position
    from public.rr_singers
    where status in ('queued','performing');
  end if;
  return new;
end;
$$;

revoke all on function public.rr_prepare_singer_insert() from public, anon, authenticated;

drop trigger if exists rr_prepare_singer_insert_trigger on public.rr_singers;
create trigger rr_prepare_singer_insert_trigger
before insert on public.rr_singers
for each row execute function public.rr_prepare_singer_insert();

drop policy if exists "public insert singers" on public.rr_singers;
create policy "public insert queued singers"
on public.rr_singers
for insert
to anon
with check (
  status = 'queued'
  and started_at is null
  and completed_at is null
);

create unique index if not exists rr_singers_one_performing
on public.rr_singers ((status))
where status = 'performing';

create unique index if not exists rr_singers_active_queue_position_unique
on public.rr_singers (queue_position)
where status in ('queued','performing');

create or replace function public.rr_admin_reorder_queue(p_admin_key text, p_order uuid[])
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_requested_count int := coalesce(cardinality(p_order), 0);
  v_active_count int;
begin
  if not public.rr_is_admin(p_admin_key) then
    raise exception 'Invalid admin key.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('rowdy_room_active_queue', 0));
  perform 1 from public.rr_singers where status in ('queued','performing') for update;

  select count(*) into v_active_count
  from public.rr_singers
  where status in ('queued','performing');

  if v_requested_count <> v_active_count then
    raise exception 'Queue order must contain every active singer exactly once.';
  end if;

  if v_requested_count <> (
    select count(distinct x)
    from unnest(coalesce(p_order, '{}'::uuid[])) as x
  ) then
    raise exception 'Queue order contains duplicate singer IDs.';
  end if;

  if exists (
    (select id from public.rr_singers where status in ('queued','performing'))
    except
    (select x from unnest(coalesce(p_order, '{}'::uuid[])) as x)
  ) or exists (
    (select x from unnest(coalesce(p_order, '{}'::uuid[])) as x)
    except
    (select id from public.rr_singers where status in ('queued','performing'))
  ) then
    raise exception 'Queue order does not match the active queue.';
  end if;

  update public.rr_singers s
  set queue_position = -u.ordinality::int
  from unnest(coalesce(p_order, '{}'::uuid[])) with ordinality as u(singer_id, ordinality)
  where s.id = u.singer_id;

  update public.rr_singers s
  set queue_position = u.ordinality::int
  from unnest(coalesce(p_order, '{}'::uuid[])) with ordinality as u(singer_id, ordinality)
  where s.id = u.singer_id;
end;
$$;

create or replace function public.rr_admin_decide_skip_request(
  p_admin_key text,
  p_request_id uuid,
  p_decision text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_request public.rr_skip_requests%rowtype;
  v_queue_ids uuid[];
  v_target_index int;
  v_new_index int;
  v_remaining_count int;
begin
  if not public.rr_is_admin(p_admin_key) then
    raise exception 'Invalid admin key.';
  end if;

  select * into v_request
  from public.rr_skip_requests
  where id = p_request_id
  for update;

  if not found then raise exception 'Skip request not found.'; end if;
  if v_request.status <> 'pending' then
    return jsonb_build_object('ok', true, 'status', v_request.status);
  end if;

  if lower(coalesce(p_decision,'')) not in ('approve','approved') then
    update public.rr_skip_requests
    set status='denied', decided_at=now(), decided_by='host'
    where id=p_request_id;
    return jsonb_build_object('ok', true, 'status', 'denied');
  end if;

  if v_request.target_singer_id is not null then
    perform pg_advisory_xact_lock(hashtextextended('rowdy_room_active_queue', 0));
    perform 1 from public.rr_singers where status='queued' for update;

    select array_agg(id order by queue_position, created_at)
      into v_queue_ids
    from public.rr_singers
    where status='queued';

    v_target_index := array_position(v_queue_ids, v_request.target_singer_id);
    if v_target_index is null then
      raise exception 'Singer is not currently queued.';
    end if;

    v_new_index := greatest(1, v_target_index - greatest(1, coalesce(v_request.skip_spots, 3)));
    v_queue_ids := array_remove(v_queue_ids, v_request.target_singer_id);
    v_remaining_count := coalesce(array_length(v_queue_ids, 1), 0);

    if v_new_index <= 1 then
      v_queue_ids := array[v_request.target_singer_id] || coalesce(v_queue_ids, '{}'::uuid[]);
    elsif v_new_index > v_remaining_count then
      v_queue_ids := coalesce(v_queue_ids, '{}'::uuid[]) || array[v_request.target_singer_id];
    else
      v_queue_ids := coalesce(v_queue_ids[1:v_new_index-1], '{}'::uuid[])
                     || array[v_request.target_singer_id]
                     || coalesce(v_queue_ids[v_new_index:v_remaining_count], '{}'::uuid[]);
    end if;

    update public.rr_singers s
    set queue_position = -u.ordinality::int
    from unnest(v_queue_ids) with ordinality as u(singer_id, ordinality)
    where s.id = u.singer_id;

    update public.rr_singers s
    set queue_position = u.ordinality::int
    from unnest(v_queue_ids) with ordinality as u(singer_id, ordinality)
    where s.id = u.singer_id;
  end if;

  update public.rr_skip_requests
  set status='approved', decided_at=now(), decided_by='host'
  where id=p_request_id;

  return jsonb_build_object('ok', true, 'status', 'approved');
end;
$$;

revoke all on function public.rr_decide_skip_request(uuid,text) from public, anon, authenticated;
grant execute on function public.rr_decide_skip_request(uuid,text) to service_role;
revoke all on function public.rr_admin_decide_skip_request(text,uuid,text) from public;
grant execute on function public.rr_admin_decide_skip_request(text,uuid,text)
  to anon, authenticated, service_role;

create or replace function public.rr_boost_decide_transfer(
  p_admin_key text,
  p_transfer_id uuid,
  p_decision text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_transfer public.rr_boost_transfers%rowtype;
  v_positions int;
  v_queue_ids uuid[];
  v_target_index int;
  v_new_index int;
  v_remaining_count int;
begin
  if not public.rr_is_admin(p_admin_key) then
    raise exception 'Invalid host password.';
  end if;

  select * into v_transfer
  from public.rr_boost_transfers
  where id = p_transfer_id
  for update;

  if not found then raise exception 'Boost request not found.'; end if;
  if v_transfer.status <> 'pending' then raise exception 'Boost request already decided.'; end if;

  if lower(coalesce(p_decision,'')) = 'deny' then
    update public.rr_boost_transfers
    set status='denied', decided_at=now()
    where id=p_transfer_id;
    return jsonb_build_object('ok', true, 'decision', 'denied');
  end if;

  if lower(coalesce(p_decision,'')) <> 'approve' then
    raise exception 'Decision must be approve or deny.';
  end if;

  if not exists (
    select 1 from public.rr_boost_wallets
    where tiktok_username=v_transfer.from_username
      and boost_points >= v_transfer.points
  ) then
    raise exception 'Viewer no longer has enough points.';
  end if;

  v_positions := least(3, greatest(1, floor(v_transfer.points / 5.0)::int));

  perform pg_advisory_xact_lock(hashtextextended('rowdy_room_active_queue', 0));
  perform 1 from public.rr_singers where status='queued' for update;

  select array_agg(id order by queue_position, created_at)
    into v_queue_ids
  from public.rr_singers
  where status='queued';

  v_target_index := array_position(v_queue_ids, v_transfer.to_singer_id);
  if v_target_index is null then raise exception 'Singer is not currently queued.'; end if;

  v_new_index := greatest(1, v_target_index - v_positions);
  v_queue_ids := array_remove(v_queue_ids, v_transfer.to_singer_id);
  v_remaining_count := coalesce(array_length(v_queue_ids,1),0);

  if v_new_index <= 1 then
    v_queue_ids := array[v_transfer.to_singer_id] || coalesce(v_queue_ids, '{}'::uuid[]);
  elsif v_new_index > v_remaining_count then
    v_queue_ids := coalesce(v_queue_ids, '{}'::uuid[]) || array[v_transfer.to_singer_id];
  else
    v_queue_ids := coalesce(v_queue_ids[1:v_new_index-1], '{}'::uuid[])
                   || array[v_transfer.to_singer_id]
                   || coalesce(v_queue_ids[v_new_index:v_remaining_count], '{}'::uuid[]);
  end if;

  update public.rr_singers s
  set queue_position = -u.ordinality::int
  from unnest(v_queue_ids) with ordinality as u(singer_id, ordinality)
  where s.id = u.singer_id;

  update public.rr_singers s
  set queue_position = u.ordinality::int
  from unnest(v_queue_ids) with ordinality as u(singer_id, ordinality)
  where s.id = u.singer_id;

  update public.rr_boost_wallets
  set boost_points = boost_points - v_transfer.points,
      total_spent = total_spent + v_transfer.points,
      updated_at = now()
  where tiktok_username = v_transfer.from_username;

  insert into public.rr_boost_ledger(tiktok_username, points, reason, source, event_ref)
  values (
    v_transfer.from_username,
    -v_transfer.points,
    'transfer approved to ' || coalesce(v_transfer.to_singer_name,''),
    'boost_transfer',
    v_transfer.id::text
  );

  update public.rr_boost_transfers
  set status='approved', applied_positions=v_positions, decided_at=now()
  where id=p_transfer_id;

  return jsonb_build_object('ok', true, 'decision', 'approved', 'positions', v_positions);
end;
$$;
