-- Track the verified live PHP queue source recovery tooling.
-- DML only. No schema, RLS, permission, function, view, or storage changes.

insert into public.rr_updates(
  update_time,area,kind,title,details,state,source
)
select
  now(),
  'Mission Control',
  'Recovery',
  'Live PHP queue source recovery tooling merged',
  'GitHub main commit 0dea9d1ba5a6a0f2c30a49a1cf56147a8f303a68 adds a token-protected cPanel exporter for the exact Mission Control, Companion, PHP API, source service, and schema files. It uses an explicit allowlist, blocks traversal and symlink escape, excludes configuration and row data, redacts passwords, DB-pass variants, secrets, tokens, API and admin keys, and JWTs, records SHA-256 hashes, streams and deletes the archive, and includes a verified importer. PHP ZIP CI passed. The tool is not deployed; cPanel upload and recovered source import remain required before the PHP/MySQL queue can be called verified.',
  'Tooling Verified - Server Export Pending',
  'github:rowdyroom/rowdyroom@0dea9d1ba5a6a0f2c30a49a1cf56147a8f303a68'
where not exists(
  select 1 from public.rr_updates
  where title='Live PHP queue source recovery tooling merged'
    and source='github:rowdyroom/rowdyroom@0dea9d1ba5a6a0f2c30a49a1cf56147a8f303a68'
);
