-- Removes only the Companion media command feature.
drop function if exists public.rr_admin_set_companion_media(text,text,text,text,integer);
drop table if exists public.rr_companion_media;
