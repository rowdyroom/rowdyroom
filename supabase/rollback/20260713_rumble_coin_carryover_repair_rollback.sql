-- Roll back only the Rowdy Room Rumble coin flip carryover repair tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Rumble coin flip carryover repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-coin-carryover';
