-- Roll back only the live PHP source recovery tracking record.
-- This does not change application source, queue data, schema, or permissions.

delete from public.rr_updates
where title='Live PHP queue source recovery tooling merged'
  and source='github:rowdyroom/rowdyroom@0dea9d1ba5a6a0f2c30a49a1cf56147a8f303a68';
