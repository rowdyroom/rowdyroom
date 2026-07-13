# Supabase Security Audit — 2026-07-13

**Project:** `Final`  
**Project ref:** `szubjgpvlqliyparrnam`  
**Status:** Open — high priority  
**Origin:** Supabase Security Advisor  
**Production permissions changed:** No

## Executive finding

The security advisor reported a large set of pre-existing access-control risks in the active Rowdy Room Supabase project. These issues were not created by the July 13 Bible documentation sync. They should not be patched blindly because several affected objects appear to support current voting, queue, Boost Points, memories, host controls, panel controls, and Rumble behavior.

## Main risk categories

### 1. Public SECURITY DEFINER views

Multiple public views were reported as enforcing the view creator's permissions rather than the caller's permissions. Examples include:

- `rr_competition_leaderboard`
- `rr_public_panel_status`
- `rr_scoreboard`
- `rr_manual_current_export`
- `rr_knowledge_active_export`
- `rr_updates_export`
- multiple Project Engine export and graph views

**Risk:** callers may see rows that underlying RLS policies would otherwise block.

### 2. SECURITY DEFINER functions callable by anonymous or signed-in clients

The advisor reported many privileged functions as executable through the public API. Examples include:

- host and admin queue controls
- ban, delete, reset, round, voting, and start-singer functions
- Boost Points award, transfer, spend, and TikFinity functions
- Rumble reset and state functions
- host login, heartbeat, assertion, and logout functions
- singer add/remove and song-duration functions
- vote-casting and skip-request functions

**Risk:** a caller may be able to invoke privileged behavior directly. Password or token parameters reduce some risk but are not a substitute for limiting who can execute the function.

### 3. Overly permissive RLS policies

The advisor reported policies using unconditional `USING (true)` or `WITH CHECK (true)` on write operations. Affected areas include:

- Boost wallets, ledger, transactions, transfers, and actions
- host sessions
- memory orders and packages
- panel assignments and panel log
- Rumble sessions, players, and state
- singers, skip requests, and votes

**Risk:** anonymous users may be able to insert, update, or otherwise alter records without ownership or authorization checks.

### 4. Mutable function search paths

Several functions do not pin `search_path`.

**Risk:** unqualified object names can resolve unexpectedly, creating a privilege-escalation or function-hijacking path in privileged routines.

### 5. Public memory-bucket listing

The public `rowdy-memories` storage bucket has a broad read policy that permits object listing.

**Risk:** public object URLs may be intentional, but broad listing can reveal the complete inventory and naming structure of stored memories.

## Required remediation approach

1. Map every affected function, view, table, and bucket to the current production clients and endpoints.
2. Back up definitions and grants before changing anything.
3. Use a development branch or controlled migration sequence.
4. Separate deliberately public actions from host/admin-only actions.
5. Revoke anonymous execution from privileged admin and state-changing functions first.
6. Replace public SECURITY DEFINER views with `security_invoker` behavior or move protected exports out of the exposed schema.
7. Replace unconditional write policies with narrowly defined validation, ownership, device-token, session-token, or backend-only rules.
8. Restrict memory listing while preserving intended object delivery.
9. Pin safe function search paths.
10. Regression-test singer signup, voting, queue operations, Mission Control, Boost Points, memories, Companion App, panel controls, and Rumble before production deployment.
11. Preserve a tested rollback migration for every security batch.

## Recommended order

### Critical batch

- admin and host functions
- Boost Points award/spend/transfer paths
- host sessions
- Rumble reset/state mutation
- unrestricted write policies on financial-like ledgers and wallets

### High batch

- queue, singer, panel, voting, and skip-request policies
- SECURITY DEFINER public views
- memory order/package writes

### Medium batch

- public storage listing
- mutable search paths
- internal Project Engine export views

## Decision

No live permission, RLS, function, view, or storage-policy changes were made during the Bible consolidation. The correct next step is a mapped, rollback-safe security hardening project—not a mass revoke that could disable the show.
