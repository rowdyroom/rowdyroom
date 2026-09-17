# Rowdy Room paid-performance fulfillment worker

The worker watches the authoritative live queue. A verified paid order remains
`waiting_for_performance` until its singer becomes the queue's `current`
performer. At that transition it enables OBSBOT AI tracking and records the
Yamaha AG06MK2 mix with the OBSBOT Tiny 2 Lite video. When the host ends the
performance, it stops capture and produces the purchased Bronze, Silver, or
Gold assets.

It intentionally does not trust a customer checkbox. Jobs are created only
after a server-verified payment event. Delivery remains a separate state so a
failed email can retry without re-recording or re-editing.

