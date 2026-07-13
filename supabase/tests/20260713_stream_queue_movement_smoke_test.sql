-- Transactional line-skip and Boost Point queue-movement smoke test.
-- All test rows and temporary admin-key changes roll back.

begin;

do $$
declare
  v_admin_key text := 'rr-stream-movement-20260713';
  v_ids uuid[] := '{}'::uuid[];
  v_id uuid;
  v_skip uuid;
  v_transfer uuid;
  v_order uuid[];
  v_balance int;
  v_spent int;
  i int;
begin
  update public.rr_settings
  set value=encode(extensions.digest(v_admin_key,'sha256'),'hex')
  where key='admin_key_sha256';

  for i in 1..5 loop
    v_id := (public.rr_public_add_singer(
      'Move Smoke '||i,
      'Movement Song '||i,
      '', '',
      'MOVE-'||i,
      'move-device-'||i,
      null,null,'movement smoke test'
    )->>'id')::uuid;
    v_ids := array_append(v_ids,v_id);
  end loop;

  insert into public.rr_skip_requests(
    from_username,target_singer_id,target_singer_name,
    skip_spots,points_cost,source,status
  ) values (
    'moveviewer',v_ids[5],'Move Smoke 5',3,30,'boost_points','pending'
  ) returning id into v_skip;

  perform public.rr_admin_decide_skip_request(v_admin_key,v_skip,'approve');
  select array_agg(id order by queue_position) into v_order
  from public.rr_singers where id=any(v_ids);
  if v_order <> array[v_ids[1],v_ids[5],v_ids[2],v_ids[3],v_ids[4]] then
    raise exception 'Approved skip produced wrong order: %',v_order;
  end if;

  if not exists(
    select 1 from public.rr_skip_requests
    where id=v_skip and status='approved' and decided_by='host'
  ) then
    raise exception 'Skip request was not marked approved by host.';
  end if;

  insert into public.rr_boost_wallets(
    tiktok_username,boost_points,total_earned,total_spent
  ) values (
    'moveviewer',100,100,0
  ) on conflict (tiktok_username) do update
    set boost_points=100,total_earned=100,total_spent=0;

  insert into public.rr_boost_transfers(
    from_username,to_singer_id,to_singer_name,points,status
  ) values (
    'moveviewer',v_ids[4],'Move Smoke 4',10,'pending'
  ) returning id into v_transfer;

  perform public.rr_boost_decide_transfer(v_admin_key,v_transfer,'approve');
  select array_agg(id order by queue_position) into v_order
  from public.rr_singers where id=any(v_ids);
  if v_order <> array[v_ids[1],v_ids[5],v_ids[4],v_ids[2],v_ids[3]] then
    raise exception 'Boost transfer produced wrong order: %',v_order;
  end if;

  select boost_points,total_spent into v_balance,v_spent
  from public.rr_boost_wallets where tiktok_username='moveviewer';
  if v_balance<>90 or v_spent<>10 then
    raise exception 'Boost wallet accounting incorrect: balance %, spent %',v_balance,v_spent;
  end if;

  if not exists(
    select 1 from public.rr_boost_transfers
    where id=v_transfer and status='approved' and applied_positions=2
  ) then
    raise exception 'Boost transfer approval record incorrect.';
  end if;

  if not exists(
    select 1 from public.rr_boost_ledger
    where event_ref=v_transfer::text and points=-10
  ) then
    raise exception 'Boost ledger debit missing.';
  end if;
end;
$$;

rollback;

select jsonb_build_object(
  'passed',true,
  'checks',jsonb_build_array(
    'host-authorized skip movement',
    'deterministic position rewrite',
    'boost movement',
    'wallet debit',
    'ledger entry'
  ),
  'test_rows_persisted',false
) as stream_movement_smoke_test;
