-- Roll back only the Rowdy Room Rumble buzzer trigger tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Rumble buzzer display trigger repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-buzzer-trigger';
