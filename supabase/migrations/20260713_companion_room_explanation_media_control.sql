-- Shared host-authorized Companion media command. Applied to project szubjgpvlqliyparrnam on 2026-07-13.
create table if not exists public.rr_companion_media (
  id text primary key default 'main',
  command_id uuid not null default extensions.gen_random_uuid(),
  action text not null default 'stop' check (action in ('play','stop')),
  video_url text not null default 'https://rowdyroom.site/media/rowdy-room-explanation.mp4',
  title text not null default 'How the Rowdy Room Works',
  duration_seconds integer not null default 60 check (duration_seconds between 5 and 600),
  started_at timestamptz,
  expires_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint rr_companion_media_singleton check (id = 'main')
);

alter table public.rr_companion_media enable row level security;
drop policy if exists "public read companion media" on public.rr_companion_media;
create policy "public read companion media" on public.rr_companion_media for select to anon, authenticated using (id='main');
revoke all on public.rr_companion_media from anon, authenticated;
grant select on public.rr_companion_media to anon, authenticated;

insert into public.rr_companion_media(id,action,video_url,title,duration_seconds)
values('main','stop','https://rowdyroom.site/media/rowdy-room-explanation.mp4','How the Rowdy Room Works',60)
on conflict(id) do nothing;

create or replace function public.rr_admin_set_companion_media(
  p_admin_key text,
  p_action text,
  p_video_url text default 'https://rowdyroom.site/media/rowdy-room-explanation.mp4',
  p_title text default 'How the Rowdy Room Works',
  p_duration_seconds integer default 60
) returns jsonb language plpgsql security definer set search_path to 'public','extensions' as $function$
declare
  v_action text:=lower(trim(coalesce(p_action,'')));
  v_valid_admin boolean:=false;
  v_command_id uuid:=extensions.gen_random_uuid();
  v_started_at timestamptz;
  v_expires_at timestamptz;
begin
  select public.rr_is_admin(p_admin_key) or exists(
    select 1 from public.rr_state where key='admin_key_hash'
      and value=encode(extensions.digest(coalesce(p_admin_key,''),'sha256'),'hex')
  ) into v_valid_admin;
  if not coalesce(v_valid_admin,false) then raise exception 'Invalid admin key.'; end if;
  if v_action not in ('play','stop') then raise exception 'Media action must be play or stop.'; end if;
  if p_duration_seconds<5 or p_duration_seconds>600 then raise exception 'Media duration must be between 5 and 600 seconds.'; end if;
  if v_action='play' then
    if trim(coalesce(p_video_url,'')) !~ '^https://rowdyroom[.]site/' then raise exception 'Video URL must be hosted on rowdyroom.site.'; end if;
    v_started_at:=now();
    v_expires_at:=v_started_at+make_interval(secs=>p_duration_seconds);
  end if;
  insert into public.rr_companion_media(id,command_id,action,video_url,title,duration_seconds,started_at,expires_at,updated_at)
  values('main',v_command_id,v_action,coalesce(nullif(trim(p_video_url),''),'https://rowdyroom.site/media/rowdy-room-explanation.mp4'),coalesce(nullif(trim(p_title),''),'How the Rowdy Room Works'),p_duration_seconds,v_started_at,v_expires_at,now())
  on conflict(id) do update set command_id=excluded.command_id,action=excluded.action,video_url=excluded.video_url,title=excluded.title,duration_seconds=excluded.duration_seconds,started_at=excluded.started_at,expires_at=excluded.expires_at,updated_at=excluded.updated_at;
  return jsonb_build_object('ok',true,'command_id',v_command_id,'action',v_action,'video_url',coalesce(nullif(trim(p_video_url),''),'https://rowdyroom.site/media/rowdy-room-explanation.mp4'),'started_at',v_started_at,'expires_at',v_expires_at);
end;
$function$;
revoke all on function public.rr_admin_set_companion_media(text,text,text,text,integer) from public;
grant execute on function public.rr_admin_set_companion_media(text,text,text,text,integer) to anon,authenticated;
