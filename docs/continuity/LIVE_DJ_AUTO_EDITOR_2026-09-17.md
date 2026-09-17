# Live DJ Auto Editor — 2026-09-17

Production URL: `https://videomaker.rowdyroom.site/live-dj/`

## Show-night workflow

1. Choose or drop recorded video clips.
2. Set the title, subtitle, output shape, maximum length, edit energy, quality, and audio preference.
3. Select **Build AI Edit Plan**.
4. Preview the result. **STOP** is the immediate manual override.
5. Select **Render & Download** to create a WebM file in the browser.

## AI-team control

The **AI team control** panel imports and exports JSON edit plans. Browser automation can also operate the labeled controls. This is operator-supervised automation; it does not grant an unattended agent unrestricted computer or footage access.

## Safety and limits

- Footage is processed locally in the browser and is not uploaded to Rowdy Room hosting.
- Target duration is a maximum; short footage is not repeated to fill it.
- Browser rendering is intended for Chrome-family browsers and produces WebM.
- Keep source recordings until the downloaded output is watched and accepted.

## Acceptance evidence

- Live HTTP response: 200.
- Production editor rendered with all controls.
- Real 6.0-second 720 x 1280 MP4 loaded.
- Planner produced one unique 5.5-second cut.
- Preview started and STOP returned the editor to idle.
