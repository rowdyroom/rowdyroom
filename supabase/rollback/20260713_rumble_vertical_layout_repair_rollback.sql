-- Roll back only the Rowdy Room Rumble vertical-layout tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Rumble responsive 9:16 layout repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-vertical-layout';
