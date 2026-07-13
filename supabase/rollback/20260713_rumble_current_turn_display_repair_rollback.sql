-- Roll back only the Rowdy Room Rumble current-turn display repair tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Rumble current turn display repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-current-turn-display';
