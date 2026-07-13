import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleStartSetupFix } from './fix-start-setup-flow.mjs';

const prerequisite = 'function saveState(shouldRender=true){localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); if(channel) channel.postMessage(state); if(shouldRender) render();}';
const oldGoSetup = "function goSetup(){state.page='setup'; renderTeamInputs(); saveState(); location.hash='';}";
const fixture = `<script>${prerequisite}\n${oldGoSetup}</script>`;

test('routes START RUMBLE to the setup page before saving', () => {
  const result = applyRumbleStartSetupFix(fixture);
  assert.equal(result.changed, true);

  const match = result.source.match(/function goSetup\(\)\{[^}]+\}/);
  assert.ok(match, 'patched goSetup function should exist');

  const state = { page: 'intro' };
  const location = { hash: '#host' };
  const calls = [];
  const renderPage = () => calls.push(`renderPage:${state.page}:${location.hash}`);
  const saveState = (shouldRender) => calls.push(`saveState:${shouldRender}`);
  const goSetup = new Function('state', 'location', 'renderPage', 'saveState', `${match[0]}; return goSetup;`)(
    state,
    location,
    renderPage,
    saveState,
  );

  goSetup();

  assert.equal(state.page, 'setup');
  assert.equal(location.hash, '');
  assert.deepEqual(calls, ['renderPage:setup:', 'saveState:false']);
});

test('removes the redundant direct setup-input render', () => {
  const result = applyRumbleStartSetupFix(fixture);
  const match = result.source.match(/function goSetup\(\)\{[^}]+\}/);
  assert.ok(match);
  assert.doesNotMatch(match[0], /renderTeamInputs/);
  assert.match(match[0], /renderPage\(\)/);
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleStartSetupFix(fixture);
  const twice = applyRumbleStartSetupFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 1', () => {
  assert.throws(
    () => applyRumbleStartSetupFix(`<script>${oldGoSetup}</script>`),
    /Prerequisite missing/,
  );
});

test('refuses an unexpected goSetup implementation', () => {
  assert.throws(
    () => applyRumbleStartSetupFix(`<script>${prerequisite}\nfunction goSetup(){throw new Error('different version')}</script>`),
    /expected exactly 1 match/,
  );
});
