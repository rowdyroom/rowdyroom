-- Rowdy Room Rumble built-in-only question bank repair tracking record.
-- DML only. No schema, permission, RLS, function, view, or storage changes.

insert into public.rr_updates (
  update_time,
  area,
  kind,
  title,
  details,
  state,
  source
)
select
  now(),
  'Rumble',
  'Repair',
  'Rumble built-in-only question bank repair implemented',
  'GitHub branch fix/rumble-built-in-question-bank removes the legacy bulk-question heading, entry field, count, load/clear controls, and known file/input variants. A runtime guard removes equivalent controls if recreated and marks window.ROWDY_QUESTION_MODE as built_in_only. The repair requires and preserves the built-in QUESTION_BANK, unused-index filter, and exhaustion reset. Automated result: 15 tests passed, 0 failed. The patch is guarded, backup-first, idempotent, and rollback capable. Live deployment and browser verification remain pending because no cPanel/SSH/SFTP or browser connector is available.',
  'Code Verified - Live Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/rumble-built-in-question-bank'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Rumble built-in-only question bank repair implemented'
    and source = 'github:rowdyroom/rowdyroom#fix/rumble-built-in-question-bank'
);
