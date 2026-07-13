-- Roll back only the Rowdy Room Rumble built-in question-bank tracking record.
-- This does not change application code or database schema.

delete from public.rr_updates
where title = 'Rumble built-in-only question bank repair implemented'
  and source = 'github:rowdyroom/rowdyroom#fix/rumble-built-in-question-bank';
