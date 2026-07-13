-- Applied to active Supabase project szubjgpvlqliyparrnam on 2026-07-13.
-- Purpose: ensure performer switches close the previous performance and preserve
-- exactly one current singer, one open performance, and correct voting state.

create or replace function public.rr_admin_start_singer(p_admin_key text, p_singer_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_active_round int;
  v_target public.rr_singers%rowtype;
begin
  if not public.rr_is_admin(p_admin_key) then
    raise exception 'Invalid admin key.';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('rowdy_room_performer_transition', 0));

  select * into v_target
  from public.rr_singers
  where id = p_singer_id
    and status in ('queued','performing')
  for update;

  if not found then
    raise exception 'Singer is not available in the active queue.';
  end if;

  select coalesce(value::int, 1)
    into v_active_round
  from public.rr_state
  where key = 'current_round';

  update public.rr_performances p
  set completed_at = now(),
      vote_count = (
        select count(*)::int from public.rr_votes v where v.performance_id = p.id
      ),
      performance_average = (
        select coalesce(round(avg(v.rating)::numeric, 2), 0)
        from public.rr_votes v where v.performance_id = p.id
      )
  where p.completed_at is null
    and p.singer_id <> p_singer_id;

  update public.rr_singers
  set status = 'queued',
      started_at = null
  where status = 'performing'
    and id <> p_singer_id;

  if v_target.status <> 'performing' then
    update public.rr_performances p
    set completed_at = now(),
        vote_count = (
          select count(*)::int from public.rr_votes v where v.performance_id = p.id
        ),
        performance_average = (
          select coalesce(round(avg(v.rating)::numeric, 2), 0)
          from public.rr_votes v where v.performance_id = p.id
        )
    where p.singer_id = p_singer_id
      and p.completed_at is null;

    insert into public.rr_performances (
      singer_id,
      singer_name,
      duet_partner,
      song_title,
      song_artist,
      round,
      started_at
    ) values (
      v_target.id,
      v_target.singer_name,
      coalesce(v_target.duet_partner,''),
      v_target.song_title,
      coalesce(v_target.song_artist,''),
      coalesce(v_active_round,1),
      now()
    );
  elsif not exists (
    select 1
    from public.rr_performances
    where singer_id = p_singer_id
      and completed_at is null
  ) then
    insert into public.rr_performances (
      singer_id,
      singer_name,
      duet_partner,
      song_title,
      song_artist,
      round,
      started_at
    ) values (
      v_target.id,
      v_target.singer_name,
      coalesce(v_target.duet_partner,''),
      v_target.song_title,
      coalesce(v_target.song_artist,''),
      coalesce(v_active_round,1),
      now()
    );
  end if;

  update public.rr_singers
  set status = 'performing',
      round = coalesce(v_active_round,1),
      started_at = coalesce(started_at, now()),
      completed_at = null
  where id = p_singer_id;

  update public.rr_state
  set value = 'open'
  where key = 'voting_status';
end;
$$;

-- Close historical records that were still open even though their singers were
-- no longer performing. Four stale records were repaired by this migration.
update public.rr_performances p
set completed_at = coalesce(
      (select s.completed_at from public.rr_singers s where s.id=p.singer_id),
      now()
    ),
    vote_count = (
      select count(*)::int from public.rr_votes v where v.performance_id=p.id
    ),
    performance_average = (
      select coalesce(round(avg(v.rating)::numeric,2),0)
      from public.rr_votes v where v.performance_id=p.id
    )
where p.completed_at is null
  and not exists (
    select 1
    from public.rr_singers s
    where s.id=p.singer_id
      and s.status='performing'
  );

create unique index if not exists rr_performances_one_open
on public.rr_performances ((1))
where completed_at is null;
