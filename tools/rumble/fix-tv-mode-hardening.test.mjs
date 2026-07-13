import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleTvModeHardeningFix } from './fix-tv-mode-hardening.mjs';

const fixture = `<script id="rowdy-tv-mode-repair">
(function(){
  const TV_HASH='#tv';
  function tvJoinUrl(){
    return window.ROWDY_TV_JOIN_URL||new URL('/companion/',location.origin).href;
  }
  function ensureTvStyles(){
    style.textContent=\`
      #tvPage{position:fixed;inset:0;z-index:99999}
    \`;
  }
  function ensureTvPage(){
    page.innerHTML=\`<div id="tvCurrentPlayer"></div><div id="tvNextPlayer"></div><div id="tvFireQueue"></div><div id="tvIceQueue"></div><footer id="tvRotatingBanner"></footer>\`;
  }
  function openTvMode(){
    const url=new URL(location.href);
    url.hash='tv';
    return window.open(url.href,'rowdyRoomTvMode');
  }
  function installTvHostShortcut(){
    button.textContent='OPEN TV MODE';
  }
})();
</script>`;

test('changes the default QR destination to the production Companion page', () => {
  const result = applyRumbleTvModeHardeningFix(fixture);
  assert.equal(result.changed, true);
  assert.match(result.source, /https:\/\/rowdyroom\.site\/companion\//);
  assert.doesNotMatch(result.source, /new URL\('\/companion\/',location\.origin\)/);
});

test('preserves a full-screen display-only TV page', () => {
  const result = applyRumbleTvModeHardeningFix(fixture);
  assert.match(result.source, /#tvPage\{position:fixed;inset:0/);
  const start = result.source.indexOf('page.innerHTML=`');
  const end = result.source.indexOf('`;', start + 16);
  const markup = result.source.slice(start + 16, end);
  assert.match(markup, /tvCurrentPlayer/);
  assert.match(markup, /tvNextPlayer/);
  assert.match(markup, /tvFireQueue/);
  assert.match(markup, /tvIceQueue/);
  assert.match(markup, /tvRotatingBanner/);
  assert.doesNotMatch(markup, /button|host controls|rules panel|answer key/i);
});

test('keeps the separate host shortcut and #tv window route', () => {
  const result = applyRumbleTvModeHardeningFix(fixture);
  assert.match(result.source, /const TV_HASH='#tv'/);
  assert.match(result.source, /OPEN TV MODE/);
  assert.match(result.source, /rowdyRoomTvMode/);
});

test('is idempotent after hardening', () => {
  const once = applyRumbleTvModeHardeningFix(fixture);
  const twice = applyRumbleTvModeHardeningFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.source, once.source);
});

test('refuses TV markup containing host controls', () => {
  const bad = fixture.replace(
    '<footer id="tvRotatingBanner"></footer>',
    '<button>Reset Game</button><footer id="tvRotatingBanner"></footer>',
  );
  assert.throws(() => applyRumbleTvModeHardeningFix(bad), /host-only controls/);
});

test('refuses a source without TV mode', () => {
  assert.throws(() => applyRumbleTvModeHardeningFix('<html></html>'), /Prerequisite missing/);
});
