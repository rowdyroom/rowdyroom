-- Tracking record for the 2026-07-13 stream queue hardening work.

insert into public.rr_updates (
  update_time, area, kind, title, details, state, source
)
select
  now(),
  'Stream Queue',
  'Hardening',
  'Supabase stream queue core hardened and smoke-tested',
  'Applied migrations harden_stream_queue_core and fix_performer_transition_integrity. Repairs include serialized public signup positions, restricted queued-only public inserts, unique active queue positions, one performing singer, exact-set host reordering, host-authorized skip decisions, deterministic Boost Point movement, safe wallet/ledger accounting, performer-switch closure, one open performance, and cleanup of four stale open performance rows. Transactional verification passed 11 core workflow checks plus 5 movement/accounting checks with no test data persisted. Full stream-ready status remains blocked because the deployed PHP/MySQL Mission Control queue source is not in GitHub and cannot be reviewed or live-tested through current access.',
  'Supabase Verified - Mission Control Verification Blocked',
  'github:rowdyroom/rowdyroom#fix/stream-queue-core-hardening;issue:11'
where not exists (
  select 1
  from public.rr_updates
  where title='Supabase stream queue core hardened and smoke-tested'
    and source='github:rowdyroom/rowdyroom#fix/stream-queue-core-hardening;issue:11'
);
