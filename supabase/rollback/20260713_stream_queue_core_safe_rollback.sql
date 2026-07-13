-- SAFE EMERGENCY ROLLBACK for the 2026-07-13 stream queue hardening.
-- This rollback intentionally fails closed:
--   * public signups are disabled rather than restored to a permissive policy
--   * the insecure legacy skip-decision RPC remains unavailable to anonymous users
--   * repaired historical performance timestamps are not erased
--   * corrected function bodies remain installed unless restored from a known backup
--
-- Run only during a maintenance window after exporting the affected definitions.

begin;

drop trigger if exists rr_prepare_singer_insert_trigger on public.rr_singers;
drop function if exists public.rr_prepare_singer_insert();

drop index if exists public.rr_singers_active_queue_position_unique;
drop index if exists public.rr_singers_one_performing;
drop index if exists public.rr_performances_one_open;

-- Disable public signup until a reviewed policy is installed.
drop policy if exists "public insert queued singers" on public.rr_singers;

-- Never restore the old public skip-approval vulnerability.
revoke all on function public.rr_decide_skip_request(uuid,text)
  from public, anon, authenticated;
grant execute on function public.rr_decide_skip_request(uuid,text)
  to service_role;

commit;

-- After rollback:
-- 1. Keep the show offline.
-- 2. Restore prior function bodies only from a known-good database backup.
-- 3. Re-run queue integrity queries before re-enabling signup.
-- 4. Do not create a permissive INSERT policy as a shortcut.
