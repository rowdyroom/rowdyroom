-- Roll back only the Rowdy Room Rumble timer lifecycle repair tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Rumble timer lifecycle repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-timer-lifecycle';
