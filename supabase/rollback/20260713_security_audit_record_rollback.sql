begin;

delete from public.rr_updates
where title = 'Supabase security advisor findings require mapped remediation'
  and source = 'Supabase Security Advisor 2026-07-13 and docs/SUPABASE_SECURITY_AUDIT_2026-07-13.md';

commit;
