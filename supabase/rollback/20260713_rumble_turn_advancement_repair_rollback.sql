-- Roll back only the Rowdy Room Rumble turn advancement tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Rumble automatic turn advancement repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-turn-advancement';
