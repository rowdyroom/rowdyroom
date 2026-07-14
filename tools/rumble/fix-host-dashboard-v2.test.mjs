import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleHostDashboardV2Fix } from './fix-host-dashboard-v2.mjs';

const BASE = `<!doctype html><html><head></head><body>\n<style id="rowdy-vertical-layout-repair"></style>\n</body></html>`;

test('installs the focused Rumble host dashboard after repair item 10', () => {
  const result = applyRumbleHostDashboardV2Fix(BASE);
  assert.equal(result.changed, true);
  assert.match(result.source, /id="rowdy-rumble-host-dashboard-v2"/);
  assert.match(result.source, /Rumble Host Dashboard/);
  assert.match(result.source, /PRIVATE GAME CONTROLS/);
  assert.match(result.source, /NEXT PLAYER/);
  assert.match(result.source, /NEXT QUESTION/);
  assert.match(result.source, /USE LIFELINE/);
  assert.match(result.source, /USE RESURRECTION TOKEN/);
  assert.match(result.source, /EMERGENCY MATCH RESET/);
});

test('0 key calls wrongAnswer exactly once and suppresses the legacy key handler', () => {
  const source = applyRumbleHostDashboardV2Fix(BASE).source;
  assert.match(source, /key==='0'\|\|code==='Digit0'\|\|code==='Numpad0'/);
  assert.match(source, /document\.addEventListener\('keydown',onKeydown,true\)/);
  assert.equal((source.match(/wrongAnswer\(gameState\(\)\.currentTeam\)/g)||[]).length, 1);
  assert.doesNotMatch(source, /giftOverlay\('❌ BUZZER'/);
});

test('blocks manual P and O Wheel controls without calling Wheel functions', () => {
  const source = applyRumbleHostDashboardV2Fix(BASE).source;
  assert.match(source, /key\.toLowerCase\(\)==='p'\|\|key\.toLowerCase\(\)==='o'/);
  assert.doesNotMatch(source, /punchAttack\(/);
  assert.doesNotMatch(source, /powerPunchAttack\(/);
  assert.doesNotMatch(source, /data-rrh-action="(?:wheel|buzzer|punch)"/);
});

test('lifeline shortcut delegates once and never decrements inventory directly', () => {
  const source = applyRumbleHostDashboardV2Fix(BASE).source;
  assert.match(source, /useLifeline\('hint'\)/);
  assert.doesNotMatch(source, /state\.lifelines--/);
});

test('is idempotent', () => {
  const once = applyRumbleHostDashboardV2Fix(BASE);
  const twice = applyRumbleHostDashboardV2Fix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.source, once.source);
});

test('requires the completed vertical-layout repair', () => {
  assert.throws(
    () => applyRumbleHostDashboardV2Fix('<html><body></body></html>'),
    /repair items 1 through 10/,
  );
});

test('fails closed when the body insertion point is missing', () => {
  assert.throws(
    () => applyRumbleHostDashboardV2Fix('<style id="rowdy-vertical-layout-repair"></style>'),
    /closing <\/body>/,
  );
});

test('rejects non-string source', () => {
  assert.throws(() => applyRumbleHostDashboardV2Fix(null), /source must be a string/);
});
