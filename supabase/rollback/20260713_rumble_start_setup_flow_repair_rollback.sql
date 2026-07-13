-- Roll back only the Rowdy Room Rumble start-to-setup flow repair tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Start Rumble setup flow repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-start-setup-flow';
