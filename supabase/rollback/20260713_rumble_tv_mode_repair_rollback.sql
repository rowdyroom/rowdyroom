-- Roll back only the Rowdy Room Rumble TV mode tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Rumble isolated TV mode repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-tv-mode';
