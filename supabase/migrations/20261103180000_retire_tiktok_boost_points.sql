-- Owner-authorized retirement, 2026-11-03. Retain all historical data.
revoke execute on function public.rr_record_gift_event(text,text,text,integer,text) from public, anon, authenticated, service_role;
revoke execute on function public.rr_boost_request_transfer(text,uuid,integer) from public, anon, authenticated, service_role;
revoke execute on function public.rr_boost_decide_transfer(text,uuid,text) from public, anon, authenticated, service_role;
revoke execute on function public.rr_tikfinity_boost_event(text,text,text,integer,integer,text) from public, anon, authenticated, service_role;
revoke execute on function public.rr_boost_award_points(text,integer,text,text,text) from public, anon, authenticated, service_role;
revoke execute on function public.rr_boost_spend_action(text,text,integer,text) from public, anon, authenticated, service_role;
revoke execute on function public.rr_show_bp(text,text,text,jsonb,uuid,text) from public, anon, authenticated, service_role;
revoke execute on function public.rr_tiktok_active_bp(text,text,text,bigint) from public, anon, authenticated, service_role;
revoke execute on function public.rr_show_gift_package(text,text,integer,text,text) from public, anon, authenticated, service_role;
revoke execute on function public.rr_show_participation(text,text,text,text,integer) from public, anon, authenticated, service_role;
revoke insert, update, delete, truncate, references, trigger on table public.rr_boost_actions from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_boost_ledger from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_boost_transactions from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_boost_transfers from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_boost_wallets from public, anon, authenticated;

revoke insert, update, delete, truncate, references, trigger on table public.rr_show_bp_requests from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_show_bp_server from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_show_bp_credits from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_show_bp_watch from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_panel_gift_events from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_channel_contributors from public, anon, authenticated;
revoke insert, update, delete, truncate, references, trigger on table public.rr_skip_requests from public, anon, authenticated;
