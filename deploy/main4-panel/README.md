# Main 4 panel adapter

These public-safe browser files let the Companion App, Mission Control, and the Rumble game read the same authoritative eight panel positions. Host writes still require the existing Rowdy Room host password and short-lived host session lock.

The adapter never uses or exposes the Supabase service-role key. Configure it with the browser-safe Supabase URL and an enabled publishable key before loading `main4-panel-v2.js`:

```html
<script>
window.ROWDY_ROOM_PANEL_CONFIG = {
  supabaseUrl: "https://YOUR_PROJECT.supabase.co",
  publishableKey: "YOUR_BROWSER_SAFE_PUBLISHABLE_KEY"
};
</script>
<script src="/assets/main4-panel-v2.js"></script>
```

Add this container anywhere the eight positions should appear:

```html
<div data-rowdy-main4></div>
```

## Surface adapters

- `main4-companion-v1.js` adds the live lineup to the Companion queue and Rumble screens.
- `main4-mission-control-v1.js` adds lineup status plus guarded start, refresh, advance, activate, and cancel controls.
- `main4-rumble-bridge-v1.js` tracks individual game points, activates eligible Main 4 challenges, finalizes the four highest scores, and treats matches with fewer than four distinct players as exhibitions.
- `main4-panel-v2.js` polls every five seconds, emits `rowdyroom:panel-status`, exposes the guarded host API, and releases a host lock after a surface finishes its action.

The server may package the configuration, core adapter, and one surface adapter into a versioned bundle. The server-only bundle containing the publishable key must not be committed here.

The database ranks all submitted Rumble scores and protects the top four for exactly 30 minutes. Expiration restores the current live-score and gift leaders while preserving the signup-rotation cursor.

Do not place a service-role key, secret key, database password, host password, or private infrastructure path in this directory or in any browser-delivered file.

