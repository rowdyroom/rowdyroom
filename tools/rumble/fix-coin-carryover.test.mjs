import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleCoinCarryoverFix } from './fix-coin-carryover.mjs';

const itemOne = "function saveState(shouldRender=true){localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); if(channel) channel.postMessage(state); if(shouldRender) render();}";
const itemTwo = "function goSetup(){state.page='setup'; location.hash=''; renderPage(); saveState(false);}";
const flipBefore = "function flipForFirst(){setupCoin.classList.remove('flip'); setTimeout(()=>setupCoin.classList.add('flip'),20); state.firstTeam=Math.random()<.5?'red':'blue'; state.currentTeam=state.firstTeam; state.currentIndex=0; coinWinner.textContent=(state.firstTeam==='red'?'RED TEAM':'BLUE TEAM'); setTimeout(()=>{state.page='coin'; saveState();},950);}";
const startBefore = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; saveState();}";
const showBefore = "function showGame(){state.page='game'; if(!state.currentQuestion) pickQuestion(); saveState(); location.hash='';}";
const fixture = `<script>${itemOne}\n${itemTwo}\n${flipBefore}\n${startBefore}\n${showBefore}</script>`;

function loadPatchedFunctions(source, context) {
  const script = source.replace(/^<script>/, '').replace(/<\/script>$/, '');
  const factory = new Function(
    ...Object.keys(context),
    `${script}; return { flipForFirst, startMatch, showGame };`,
  );
  return factory(...Object.values(context));
}

function buildContext(state, randomValues) {
  const calls = [];
  const fakeMath = Object.create(Math);
  fakeMath.random = () => randomValues.shift();
  const storage = new Map();

  return {
    context: {
      state,
      location: { hash: '' },
      setupCoin: { classList: { remove: () => calls.push('coin:remove'), add: () => calls.push('coin:add') } },
      coinWinner: { textContent: '' },
      setTimeout: (fn) => fn(),
      Math: fakeMath,
      renderPage: () => calls.push(`renderPage:${state.page}`),
      matchSize: { value: '3' },
      resetRowdyRushBonusForMatch: () => calls.push('resetBonus'),
      pickQuestion: () => {
        state.currentQuestion = { question: 'Test question' };
        calls.push('pickQuestion');
      },
      localStorage: { setItem: (key, value) => storage.set(key, value) },
      STORAGE_KEY: 'rr-test',
      channel: null,
      render: () => calls.push('render'),
    },
    calls,
    storage,
  };
}

test('coin flip chooses and displays a first player from the winning team', () => {
  const result = applyRumbleCoinCarryoverFix(fixture);
  const state = {
    page: 'setup',
    redTeam: ['R1', 'R2', 'R3'],
    blueTeam: ['B1', 'B2', 'B3'],
  };
  const { context, calls } = buildContext(state, [0.75, 0.6]);
  const functions = loadPatchedFunctions(result.source, context);

  functions.flipForFirst();

  assert.equal(state.firstTeam, 'blue');
  assert.equal(state.currentTeam, 'blue');
  assert.equal(state.currentIndex, 1);
  assert.equal(context.coinWinner.textContent, 'BLUE TEAM — B2');
  assert.equal(state.page, 'coin');
  assert.ok(calls.includes('renderPage:coin'));
});

test('game initialization preserves the coin-selected player index', () => {
  const result = applyRumbleCoinCarryoverFix(fixture);
  const state = {
    page: 'setup',
    matchSize: 3,
    redTeam: ['R1', 'R2', 'R3'],
    blueTeam: ['B1', 'B2', 'B3'],
    firstTeam: 'blue',
    currentTeam: 'blue',
    currentIndex: 1,
  };
  const { context, calls } = buildContext(state, []);
  const functions = loadPatchedFunctions(result.source, context);

  functions.startMatch();

  assert.equal(state.currentTeam, 'blue');
  assert.equal(state.currentIndex, 1);
  assert.equal(state.blueTeam[state.currentIndex], 'B2');
  assert.equal(state.page, 'game');
  assert.deepEqual(calls.slice(-3), ['resetBonus', 'pickQuestion', 'renderPage:game']);
  assert.equal(state.maxRounds, 5);
  assert.equal(state.timer, 40);
});

test('coin page LETS GO delegates to full match initialization', () => {
  const result = applyRumbleCoinCarryoverFix(fixture);
  assert.match(result.source, /function showGame\(\)\{startMatch\(\);\}/);
});

test('clamps an invalid saved player index to the winning team', () => {
  const result = applyRumbleCoinCarryoverFix(fixture);
  const state = {
    page: 'coin',
    matchSize: 1,
    redTeam: ['R1'],
    blueTeam: ['B1'],
    firstTeam: 'red',
    currentTeam: 'red',
    currentIndex: 99,
  };
  const { context } = buildContext(state, []);
  const functions = loadPatchedFunctions(result.source, context);

  functions.startMatch();

  assert.equal(state.currentIndex, 0);
  assert.equal(state.redTeam[state.currentIndex], 'R1');
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleCoinCarryoverFix(fixture);
  const twice = applyRumbleCoinCarryoverFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair items 1 and 2', () => {
  assert.throws(
    () => applyRumbleCoinCarryoverFix(`<script>${flipBefore}\n${startBefore}\n${showBefore}</script>`),
    /Prerequisite missing/,
  );
});

test('refuses an unexpected coin-flip implementation', () => {
  assert.throws(
    () => applyRumbleCoinCarryoverFix(`<script>${itemOne}\n${itemTwo}\nfunction flipForFirst(){throw new Error('different')}\n${startBefore}\n${showBefore}</script>`),
    /flipForFirst: expected exactly 1 match/,
  );
});
