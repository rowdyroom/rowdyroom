insert into public.rr_updates(update_time,area,kind,title,details,state,source)
select
  now(),
  'Companion App',
  'Feature',
  'Mission Control room explanation video command installed',
  'The active Supabase project now contains a read-only public singleton media command and host-password-authorized RPC for Play and Stop. GitHub branch fix/companion-room-video-control adds Mission Control buttons, synchronized Companion playback, elapsed-time joining, mobile muted-autoplay fallback, Return to Voting, backup-first deployment, rollback, CI, and the governing Bible law. The database layer is installed and stopped. Hosting scripts and the canonical MP4 still require deployment and browser verification.',
  'Database Installed - Hosting Deployment Pending',
  'github:rowdyroom/rowdyroom#fix/companion-room-video-control'
where not exists(
  select 1 from public.rr_updates
  where title='Mission Control room explanation video command installed'
    and source='github:rowdyroom/rowdyroom#fix/companion-room-video-control'
);
