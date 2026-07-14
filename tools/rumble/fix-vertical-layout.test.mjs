import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleVerticalLayoutFix } from './fix-vertical-layout.mjs';

const forbiddenTvPageSelector = '#' + 'tvPage';
const gameLogic = `function wrongAnswer(team=state.currentTeam){state.overlay='STRIKE';saveState();}
function pickQuestion(){return QUESTION_BANK[0];}
function punchAttack(){return 'POWER PUNCH';}`;
const fixture = `<html>
<head>
<title>Rowdy Room Rumble</title>
</head>
<body>
<div id="app">
  <section id="introPage"></section>
  <section id="setupPage" class="hidden"></section>
  <section id="gamePage" class="hidden">
    <div id="roundDisplay"></div>
    <div id="timerDisplay"></div>
    <div id="poolDisplay"></div>
    <div id="redScore"></div>
    <div id="blueScore"></div>
    <div id="questionDisplay"></div>
    <div id="answersDisplay"><div class="answerSlot"><span class="answerNum"></span><span class="answerText"></span><span class="answerPts"></span></div></div>
    <div id="currentPlayerBox"></div>
    <div id="strikesBox"></div>
  </section>
  <section id="hostPage" class="hidden"><div id="hostDashboard"></div></section>
</div>
<script>${gameLogic}</script>
<script id="rowdy-built-in-question-bank-repair"></script>
</body>
</html>`;

test('adds a viewport meta with safe-area support when missing', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/);
  assert.equal((result.source.match(/name="viewport"/g) || []).length, 1);
});

test('normalizes an existing viewport meta instead of adding a duplicate', () => {
  const source = fixture.replace('<title>', '<meta name="viewport" content="width=980"><title>');
  const result = applyRumbleVerticalLayoutFix(source);
  assert.equal((result.source.match(/name="viewport"/g) || []).length, 1);
  assert.match(result.source, /viewport-fit=cover/);
  assert.doesNotMatch(result.source, /width=980/);
});

test('injects one isolated vertical layout style and runtime block', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.equal((result.source.match(/id="rowdy-vertical-layout-repair"/g) || []).length, 1);
  assert.equal((result.source.match(/id="rowdy-vertical-layout-runtime"/g) || []).length, 1);
  assert.match(result.source, /<style id="rowdy-vertical-layout-repair">[\s\S]*<\/style>\n<script id="rowdy-vertical-layout-runtime">/);
});

test('activates only for portrait, narrow, or strongly vertical screens', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /@media \(orientation:portrait\),\(max-width:700px\),\(max-aspect-ratio:3\/4\)/);
  assert.match(result.source, /@media \(orientation:portrait\) and \(min-aspect-ratio:8\/17\) and \(max-aspect-ratio:10\/15\)/);
});

test('uses a centered single-column game surface with vertical scrolling', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /#gamePage:not\(\.hidden\)\{[\s\S]*display:flex;[\s\S]*flex-direction:column;/);
  assert.match(result.source, /max-width:720px;/);
  assert.match(result.source, /overflow-y:auto;/);
  assert.match(result.source, /min-height:var\(--rr-viewport-height\)/);
});

test('collapses known game, setup, and host grids to one column', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /#gamePage \.game-grid,[\s\S]*#hostDashboard\{[\s\S]*grid-template-columns:minmax\(0,1fr\)!important;/);
  assert.match(result.source, /#redInputs,[\s\S]*#blueInputs\{[\s\S]*grid-template-columns:minmax\(0,1fr\)/);
});

test('forces answers into one readable column', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /#answersDisplay\{[\s\S]*grid-template-columns:minmax\(0,1fr\)!important;/);
  assert.match(result.source, /\.answerSlot\{[\s\S]*grid-template-columns:clamp\(28px,8vw,46px\) minmax\(0,1fr\) auto!important;/);
  assert.match(result.source, /\.answerText\{[\s\S]*font-size:clamp\(1\.05rem,4\.9vw,1\.7rem\)!important;/);
});

test('uses responsive readable sizes for question, scores, timer, and status', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /#questionDisplay\{[\s\S]*font-size:clamp\(1\.35rem,6\.2vw,2\.35rem\)!important;/);
  assert.match(result.source, /#redScore,[\s\S]*#blueScore\{[\s\S]*font-size:clamp\(2rem,10vw,4rem\)!important;/);
  assert.match(result.source, /#roundDisplay,[\s\S]*#timerDisplay,[\s\S]*#poolDisplay\{[\s\S]*font-size:clamp\(1rem,4\.2vw,1\.45rem\)!important;/);
  assert.match(result.source, /#currentPlayerBox,[\s\S]*#strikesBox\{[\s\S]*font-size:clamp\(1rem,4\.6vw,1\.55rem\)!important;/);
});

test('gives interactive controls a touch-safe minimum height and 16px text', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /button,[\s\S]*input,[\s\S]*select,[\s\S]*textarea\{[\s\S]*min-height:44px;/);
  assert.match(result.source, /font-size:max\(16px,clamp\(1rem,4vw,1\.25rem\)\)!important;/);
  assert.match(result.source, /touch-action:manipulation/);
});

test('uses safe-area padding and a guarded dynamic viewport height', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /--rr-safe-top:env\(safe-area-inset-top,0px\)/);
  assert.match(result.source, /--rr-safe-bottom:env\(safe-area-inset-bottom,0px\)/);
  assert.match(result.source, /--rr-viewport-height:100dvh/);
  assert.match(result.source, /Math\.max\(window\.innerHeight\|\|0,320\)\+'px'/);
});

test('constrains game overlays so full-screen messages cannot clip', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /\[id\*="overlay" i\],/);
  assert.match(result.source, /max-height:var\(--rr-viewport-height\)/);
  assert.match(result.source, /overflow:auto/);
});

test('preserves hidden game sections without TV-specific selectors', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /#app>section\.hidden\{\s*display:none!important;/);
  assert.equal(result.source.includes(forbiddenTvPageSelector), false);
});

test('includes a compact fallback for shorter portrait screens', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /@media \(max-height:760px\) and \(orientation:portrait\)/);
  assert.match(result.source, /\.answerSlot\{[\s\S]*min-height:46px;/);
});

test('respects reduced-motion preferences', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /@media \(prefers-reduced-motion:reduce\)/);
  assert.match(result.source, /animation-duration:\.01ms!important/);
  assert.match(result.source, /transition-duration:\.01ms!important/);
});

test('adds runtime resize and orientation synchronization', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.match(result.source, /document\.documentElement\.classList\.add\('rowdy-rumble-responsive'\)/);
  assert.match(result.source, /window\.addEventListener\('resize',updateRowdyViewportHeight/);
  assert.match(result.source, /window\.addEventListener\('orientationchange',updateRowdyViewportHeight/);
  assert.match(result.source, /window\.ROWDY_LAYOUT_MODE='responsive_9_16'/);
});

test('preserves existing game logic byte-for-byte', () => {
  const result = applyRumbleVerticalLayoutFix(fixture);
  assert.ok(result.source.includes(gameLogic));
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleVerticalLayoutFix(fixture);
  const twice = applyRumbleVerticalLayoutFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 9', () => {
  const source = fixture.replace('<script id="rowdy-built-in-question-bank-repair"></script>', '');
  assert.throws(() => applyRumbleVerticalLayoutFix(source), /Prerequisite missing/);
});

test('refuses an ambiguous body insertion point', () => {
  const source = `${fixture}\n${fixture}`;
  assert.throws(() => applyRumbleVerticalLayoutFix(source), /expected exactly 1 match/);
});

test('refuses a missing head insertion point when no viewport meta exists', () => {
  const source = fixture.replace('<head>', '<header>').replace('</head>', '</header>');
  assert.throws(() => applyRumbleVerticalLayoutFix(source), /expected exactly 1 <head> marker/);
});
