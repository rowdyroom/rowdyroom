import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleTimerLifecycleFix } from './fix-timer-lifecycle.mjs';

const prerequisite = "currentPlayerBox.textContent=`Turn: ${turnName} — ${turnTeam}`;";
const startMatch = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; const currentPlayers=state.currentTeam==='red'?state.redTeam:state.blueTeam; state.currentIndex=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(currentPlayers.length-1,0)); resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; renderPage(); saveState(false);}";
const nextQuestion = "function nextQuestion(){pickQuestion(); state.timer=40; state.pool=0; saveState();}";
const endRound = "function endRound(){state.round++; if(state.round>state.maxRounds){const wt=winningTeam().toUpperCase(); state.overlay=`MATCH COMPLETE<br><span style=\"font-size:.45em\">${wt} TEAM WINS</span><br><span style=\"font-size:.32em\">Run Rowdy Rush from Host Dashboard</span>`; state.round=1;} pickQuestion(); state.redStrikes=0; state.blueStrikes=0; saveState(); setTimeout(()=>{state.overlay=null;saveState();},2400);}";
const timer = "function startTimer(){clearInterval(timerInterval); timerInterval=setInterval(()=>{if(state.timer>0){state.timer--; saveState();}else clearInterval(timerInterval);},1000);}\nfunction pauseTimer(){clearInterval(timerInterval); timerInterval=null;}";
const restartMatch = "function restartMatch(){state.round=1;state.pool=0;state.redScore=0;state.blueScore=0;state.redStrikes=0;state.blueStrikes=0;state.timer=40;state.revealed=[];state.currentTeam=state.firstTeam||'red';pickQuestion();giftOverlay('MATCH RESTARTED','READY');saveState();}";
const fixture = `<script>${prerequisite}\n${startMatch}\n${nextQuestion}\n${endRound}\n${timer}\n${restartMatch}</script>`;

function timerHarness(source, initialTimer = 40) {
  const block = source.match(/function startTimer\(\)\{.+?\}\nfunction pauseTimer\(\)\{.+?\}/s)?.[0];
  assert.ok(block, 'timer block should exist');
  const state = { timer: initialTimer, currentTeam: 'blue' };
  const calls = [];
  let intervalCallback = null;
  const factory = new Function(
    'state', 'setInterval', 'clearInterval', 'saveState', 'wrongAnswer', 'timerInterval',
    `${block}; return {startTimer,pauseTimer,getInterval:()=>timerInterval};`,
  );
  const controls = factory(
    state,
    (callback) => { intervalCallback = callback; calls.push('setInterval'); return 99; },
    (id) => calls.push(`clear:${id}`),
    () => calls.push(`save:${state.timer}`),
    (team) => calls.push(`wrong:${team}:${state.timer}`),
    null,
  );
  return { state, calls, controls, tick: () => intervalCallback?.() };
}

test('starts at the existing value and ticks down once per callback', () => {
  const result = applyRumbleTimerLifecycleFix(fixture);
  const h = timerHarness(result.source, 40);
  h.controls.startTimer();
  h.tick();
  assert.equal(h.state.timer, 39);
  assert.ok(h.calls.includes('save:39'));
  assert.equal(h.controls.getInterval(), 99);
});

test('pause and resume preserve remaining time', () => {
  const result = applyRumbleTimerLifecycleFix(fixture);
  const h = timerHarness(result.source, 23);
  h.controls.startTimer();
  h.controls.pauseTimer();
  assert.equal(h.controls.getInterval(), null);
  assert.equal(h.state.timer, 23);
  h.controls.startTimer();
  h.tick();
  assert.equal(h.state.timer, 22);
});

test('expiry reaches zero, clears the handle, and calls wrongAnswer once', () => {
  const result = applyRumbleTimerLifecycleFix(fixture);
  const h = timerHarness(result.source, 1);
  h.controls.startTimer();
  h.tick();
  assert.equal(h.state.timer, 0);
  assert.equal(h.controls.getInterval(), null);
  assert.equal(h.calls.filter((call) => call.startsWith('wrong:')).length, 1);
  assert.ok(h.calls.includes('wrong:blue:0'));
});

test('starting from an expired timer resets it to 40', () => {
  const result = applyRumbleTimerLifecycleFix(fixture);
  const h = timerHarness(result.source, 0);
  h.controls.startTimer();
  assert.equal(h.state.timer, 40);
  assert.ok(h.calls.includes('save:40'));
});

test('match, question, round, and restart paths start the timer', () => {
  const result = applyRumbleTimerLifecycleFix(fixture);
  assert.match(result.source, /function startMatch\(\).+saveState\(false\); startTimer\(\);\}/s);
  assert.match(result.source, /function nextQuestion\(\).+saveState\(\); startTimer\(\);\}/s);
  assert.match(result.source, /function endRound\(\).+const matchComplete=.+if\(matchComplete\) pauseTimer\(\); else startTimer\(\); setTimeout/s);
  assert.match(result.source, /function restartMatch\(\).+pickQuestion\(\);startTimer\(\);giftOverlay/s);
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleTimerLifecycleFix(fixture);
  const twice = applyRumbleTimerLifecycleFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 4', () => {
  assert.throws(
    () => applyRumbleTimerLifecycleFix(`<script>${startMatch}\n${nextQuestion}\n${endRound}\n${timer}\n${restartMatch}</script>`),
    /Prerequisite missing/,
  );
});

test('refuses an unexpected timer implementation', () => {
  assert.throws(
    () => applyRumbleTimerLifecycleFix(`<script>${prerequisite}\n${startMatch}\n${nextQuestion}\n${endRound}\nfunction startTimer(){throw new Error('different')}\nfunction pauseTimer(){}\n${restartMatch}</script>`),
    /timer lifecycle: expected exactly 1 match/,
  );
});
