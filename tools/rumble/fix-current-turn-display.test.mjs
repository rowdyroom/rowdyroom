import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleCurrentTurnDisplayFix } from './fix-current-turn-display.mjs';

const itemThree = 'function showGame(){startMatch();}';
const displayBefore = "currentPlayerBox.textContent='CURRENT: '+((state.currentTeam==='red'?state.redTeam:state.blueTeam)[state.currentIndex]||state.currentTeam.toUpperCase());";
const fixture = `<script>${itemThree}\nfunction renderTurn(){${displayBefore}}</script>`;

function runDisplay(source, state) {
  const body = source.match(/function renderTurn\(\)\{(.+)\}<\/script>/s)?.[1];
  assert.ok(body, 'renderTurn body should exist');
  const currentPlayerBox = { textContent: '' };
  const before = JSON.parse(JSON.stringify(state));
  new Function('state', 'currentPlayerBox', body)(state, currentPlayerBox);
  return { text: currentPlayerBox.textContent, before };
}

test('shows the selected red player and team in the required format', () => {
  const result = applyRumbleCurrentTurnDisplayFix(fixture);
  const state = { currentTeam: 'red', currentIndex: 1, redTeam: ['R1', 'R2'], blueTeam: ['B1'] };
  const output = runDisplay(result.source, state);
  assert.equal(output.text, 'Turn: R2 — Red Team');
  assert.deepEqual(state, output.before);
});

test('shows the selected blue player and team in the required format', () => {
  const result = applyRumbleCurrentTurnDisplayFix(fixture);
  const state = { currentTeam: 'blue', currentIndex: 0, redTeam: ['R1'], blueTeam: ['B1', 'B2'] };
  const output = runDisplay(result.source, state);
  assert.equal(output.text, 'Turn: B1 — Blue Team');
  assert.deepEqual(state, output.before);
});

test('uses a readable fallback when a player name is missing', () => {
  const result = applyRumbleCurrentTurnDisplayFix(fixture);
  const state = { currentTeam: 'blue', currentIndex: 2, redTeam: [], blueTeam: [] };
  const output = runDisplay(result.source, state);
  assert.equal(output.text, 'Turn: Blue 3 — Blue Team');
});

test('does not retain the ambiguous CURRENT label', () => {
  const result = applyRumbleCurrentTurnDisplayFix(fixture);
  assert.doesNotMatch(result.source, /CURRENT:/);
  assert.match(result.source, /Turn:/);
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleCurrentTurnDisplayFix(fixture);
  const twice = applyRumbleCurrentTurnDisplayFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 3', () => {
  assert.throws(
    () => applyRumbleCurrentTurnDisplayFix(`<script>function renderTurn(){${displayBefore}}</script>`),
    /Prerequisite missing/,
  );
});

test('refuses an unexpected display implementation', () => {
  assert.throws(
    () => applyRumbleCurrentTurnDisplayFix(`<script>${itemThree}\nfunction renderTurn(){currentPlayerBox.textContent='different';}</script>`),
    /expected exactly 1 match/,
  );
});
