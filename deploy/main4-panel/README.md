# Main 4 panel adapter

This public-safe browser adapter lets the Companion App, host dashboard, Rumble game, and public display read the same authoritative eight panel positions. Host writes still require the existing Rowdy Room host password and short-lived host session lock.

The adapter never uses or exposes the Supabase service-role key. Configure it with the browser-safe Supabase URL and publishable key before loading `main4-panel-v1.js`:

```html
<script>
window.ROWDY_ROOM_PANEL_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  publishableKey: "YOUR_BROWSER_SAFE_PUBLISHABLE_KEY"
};
</script>
<script src="/assets/main4-panel-v1.js" defer></script>
```

Add this container anywhere the eight positions should appear:

```html
<div data-rowdy-main4></div>
```

The adapter polls every five seconds and also emits a `rowdyroom:panel-status` browser event. The Rumble game can finalize individual player scores with `RowdyRoomPanelClient.finalizeRumble(...)`; the database ranks all submitted scores and protects the top four for exactly 30 minutes.

Do not place a service-role key, database password, host password, or private migration SQL in this directory or in any browser-delivered file.

