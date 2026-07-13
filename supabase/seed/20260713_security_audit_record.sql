begin;

insert into public.rr_updates
  (area, kind, title, details, state, source)
select
  'Security',
  'Audit',
  'Supabase security advisor findings require mapped remediation',
  'The 2026-07-13 security advisor reported public SECURITY DEFINER views, privileged SECURITY DEFINER functions executable by anon/authenticated roles, overly permissive write policies, mutable function search paths, and broad listing on the rowdy-memories bucket. No live permissions were changed. Remediation must be mapped to production clients, tested in controlled batches, and paired with rollback migrations.',
  'Needs Review',
  'Supabase Security Advisor 2026-07-13 and docs/SUPABASE_SECURITY_AUDIT_2026-07-13.md'
where not exists (
  select 1
  from public.rr_updates
  where title = 'Supabase security advisor findings require mapped remediation'
    and source = 'Supabase Security Advisor 2026-07-13 and docs/SUPABASE_SECURITY_AUDIT_2026-07-13.md'
);

commit;
