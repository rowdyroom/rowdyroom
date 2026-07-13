-- Transactional stream queue smoke test.
-- All test singers, wallets, requests, and temporary admin-key changes roll back.
-- Run against a quiet queue before a show or after queue-related migrations.

begin;

do $$
declare
  v_admin_key text := 'rr-stream-smoke-20260713';
  v_one uuid;
  v_two uuid;
  v_three uuid;
  v_direct uuid;
  v_duplicate_blocked boolean := false;
  v_count int;
  v_next uuid;
  v_position int;
begin
  update public.rr_settings
  set value = encode(extensions.digest(v_admin_key, 'sha256'), 'hex')
  where key = 'admin_key_sha256';

  v_one := (public.rr_public_add_singer(
    'Smoke Alpha','Song Alpha','Artist A','','SMOKE-A','smoke-device-a',null,null,'stream readiness test'
  )->>'id')::uuid;
  v_two := (public.rr_public_add_singer(
    'Smoke Bravo','Song Bravo','Artist B','','SMOKE-B','smoke-device-b',null,null,'stream readiness test'
  )->>'id')::uuid;
  v_three := (public.rr_public_add_singer(
    'Smoke Charlie','Song Charlie','Artist C','','SMOKE-C','smoke-device-c',null,null,'stream readiness test'
  )->>'id')::uuid;

  if (
    select array_agg(queue_position order by queue_position)
    from public.rr_singers
    where id in (v_one,v_two,v_three)
  ) <> array[1,2,3] then
    raise exception 'Signup positions failed.';
  end if;

  begin
    perform public.rr_public_add_singer(
      ' smoke alpha ','Duplicate Song','','','SMOKE-DUP','another-device',null,null,null
    );
  exception when others then
    if sqlerrm ilike '%already have an active song%' then
      v_duplicate_blocked := true;
    else
      raise;
    end if;
  end;
  if not v_duplicate_blocked then
    raise exception 'Duplicate active signup accepted.';
  end if;

  insert into public.rr_singers(
    singer_name,song_title,song_artist,queue_position,status,round,remove_code,device_token
  ) values (
    'Smoke Direct','Direct Song','Artist D',999,'queued',1,'SMOKE-D','smoke-device-d'
  ) returning id,queue_position into v_direct,v_position;
  if v_position <> 4 then
    raise exception 'Direct append failed: %',v_position;
  end if;

  perform public.rr_admin_reorder_queue(v_admin_key,array[v_three,v_one,v_direct,v_two]);
  if (
    select array_agg(id order by queue_position)
    from public.rr_singers
    where status in ('queued','performing')
  ) <> array[v_three,v_one,v_direct,v_two] then
    raise exception 'Reorder failed.';
  end if;

  perform public.rr_admin_start_singer(v_admin_key,v_three);
  select count(*) into v_count from public.rr_singers where status='performing';
  if v_count <> 1 or not exists(
    select 1 from public.rr_singers where id=v_three and status='performing'
  ) then
    raise exception 'First start failed.';
  end if;
  if not exists(
    select 1 from public.rr_state where key='voting_status' and value='open'
  ) then
    raise exception 'Vote open failed.';
  end if;
  if (select count(*) from public.rr_performances where completed_at is null) <> 1 then
    raise exception 'Exactly one open performance not created.';
  end if;

  perform public.rr_admin_start_singer(v_admin_key,v_one);
  select count(*) into v_count from public.rr_singers where status='performing';
  if v_count <> 1 or not exists(
    select 1 from public.rr_singers where id=v_one and status='performing'
  ) then
    raise exception 'Switch failed.';
  end if;
  if not exists(
    select 1 from public.rr_singers where id=v_three and status='queued'
  ) then
    raise exception 'Prior performer not requeued.';
  end if;
  if (select count(*) from public.rr_performances where completed_at is null) <> 1 then
    raise exception 'Switch left multiple open performances.';
  end if;
  if exists(
    select 1 from public.rr_performances where singer_id=v_three and completed_at is null
  ) then
    raise exception 'Prior performance remained open.';
  end if;

  perform public.rr_admin_complete_current(v_admin_key);
  if not exists(
    select 1 from public.rr_singers where id=v_one and status='completed'
  ) then
    raise exception 'Complete failed.';
  end if;
  if exists(select 1 from public.rr_singers where status='performing') then
    raise exception 'Performer remained active.';
  end if;
  if exists(select 1 from public.rr_performances where completed_at is null) then
    raise exception 'Open performance remained.';
  end if;
  if not exists(
    select 1 from public.rr_state where key='voting_status' and value='closed'
  ) then
    raise exception 'Vote close failed.';
  end if;

  select id into v_next
  from public.rr_singers
  where status='queued'
  order by queue_position,created_at
  limit 1;
  if v_next <> v_three then
    raise exception 'Next performer inconsistent.';
  end if;

  perform public.rr_public_remove_self(v_two,'smoke-b');
  if exists(select 1 from public.rr_singers where id=v_two) then
    raise exception 'Self remove failed.';
  end if;

  begin
    perform public.rr_admin_decide_skip_request('wrong-key',gen_random_uuid(),'approve');
    raise exception 'Unauthorized skip approval accepted.';
  exception when others then
    if sqlerrm='Unauthorized skip approval accepted.' then raise; end if;
    if sqlerrm not ilike '%invalid admin key%' then raise; end if;
  end;

  if has_function_privilege(
    'anon','public.rr_decide_skip_request(uuid,text)','EXECUTE'
  ) then
    raise exception 'Legacy skip approval remains public.';
  end if;
end;
$$;

rollback;

select jsonb_build_object(
  'passed',true,
  'checks',11,
  'test_rows_persisted',false,
  'open_performances',(select count(*) from public.rr_performances where completed_at is null),
  'active_queue',(select count(*) from public.rr_singers where status in ('queued','performing'))
) as stream_queue_smoke_test;
