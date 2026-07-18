-- Public-safe host-lock handoff migration; contains no credentials.
create or replace function public.rr_host_logout(p_session_token text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  released_count integer := 0;
begin
  update public.rr_host_sessions
  set session_token = null,
      locked_by = null,
      heartbeat_at = null,
      updated_at = clock_timestamp()
  where id = 'main'
    and session_token = p_session_token;

  get diagnostics released_count = row_count;
  return jsonb_build_object('ok', true, 'released', released_count > 0);
end;
$$;

revoke execute on function public.rr_host_logout(text) from public;
grant execute on function public.rr_host_logout(text) to anon, authenticated, service_role;

comment on function public.rr_host_logout(text) is
  'Releases the active Main 4 host lock only when the caller presents the current session token.';

drop function if exists public.rr_host_release(text);

