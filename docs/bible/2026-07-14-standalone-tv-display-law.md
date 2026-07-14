# Rowdy Room Standalone TV Display Law

**Effective:** 2026-07-14  
**Owner:** Roger Jamsek  
**Authority:** Rowdy Room Bible

## Product identity

The Rowdy Room TV display is a standalone live-show and livestream display.

It is independent from:

- Rowdy Room Rumble
- `game.rowdyroom.site`
- Rumble Wheel
- Rumble Buzzer
- Any Rumble score, team, strike, steal, question, answer or control state

No game route, game folder, game script, game control or game deployment may be used as the canonical TV display.

## Reserved public address

The approved hostname is reserved as:

`https://tv.rowdyroom.site/`

The approved document root is reserved as:

`/home/ef39cr6m1vih/public_html/tv.rowdyroom.site`

This hostname and folder were not present in the cPanel screenshots supplied on 2026-07-14. The TV display is therefore not approved for live deployment until the subdomain is created, the exact document root is verified, and a live smoke test passes.

## Required screen content

The TV screen must show:

1. Signup QR code linked to `https://companion.rowdyroom.site/`
2. Rotating information banner
3. Now Performing
4. Up Next
5. The next five performers in rotation
6. Estimated wait time

## Queue data contract

The TV display must read live karaoke rotation information from the canonical queue system.

The minimum data contract is:

- `now_performing_name`
- `up_next_name`
- `next_five_performers`
- `estimated_wait_minutes`
- `queue_updated_at`

The estimated wait time must be calculated from the live karaoke queue or supplied by the canonical queue service. It must not be calculated from Rumble rounds, game timers or game state.

## Rotating banner contract

The rotating banner is always present during normal TV operation.

It may rotate messages such as:

- Scan the code to sign up
- Join the queue from your phone
- Vote during live performances
- Follow your place in the rotation
- Rowdy Room announcements approved by the host

The banner must not contain Rumble gameplay information unless the host deliberately switches to a separate Rumble display source. The standalone TV display itself remains karaoke-queue focused.

## Forbidden screen content

The TV display must not show:

- How to Play game rules
- Fire Team or Ice Team
- Rumble scores
- Strike counts
- Steal opportunity
- Wheel results
- Buzzer animations
- Game questions or answers
- Game host controls
- Mission Control controls
- Private viewer or performer data

## Display behavior

- The screen is viewer-facing and safe to show on a television, projector or livestream source.
- It has no private host controls.
- It updates automatically when the queue changes.
- It keeps the signup QR and rotating banner visible.
- Missing queue data must produce a neutral message such as `Waiting for the next performer`, not game content.
- The display must remain useful during regular karaoke, live events and livestreams whether Rumble is active or not.

## Separation enforcement

The following are prohibited as canonical TV addresses:

- `https://game.rowdyroom.site/#tv`
- Any route under `game.rowdyroom.site`
- Any route under `rumble-wheel`
- Any route under `rumble-buzzer`

The game and TV products may both read shared public queue data, but neither may own or embed the other.

## Deployment gate

Before live deployment:

1. Create `tv.rowdyroom.site` in cPanel.
2. Confirm its document root is `/home/ef39cr6m1vih/public_html/tv.rowdyroom.site`.
3. Back up any existing target contents.
4. Deploy the standalone TV code only to that root.
5. Verify the signup QR opens `https://companion.rowdyroom.site/`.
6. Verify Now Performing, Up Next, next five and wait time update from the canonical queue.
7. Verify the rotating banner remains visible.
8. Verify no Rumble content appears.
9. Complete a television/fullscreen and livestream-source smoke test.

If any gate fails, the TV display is not live-ready.
