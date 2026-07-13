-- Roll back only the Rowdy Room Rumble setup input focus repair tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Setup player input focus repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-setup-focus';
