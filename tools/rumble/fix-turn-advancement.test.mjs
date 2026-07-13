import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleTurnAdvancementFix } from './fix-turn-advancement.mjs';

const startMatch = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; const currentPlayers=state.currentTeam==='red'?state.redTeam:state.blueTeam; state.currentIndex=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(currentPlayers.length-1,0)); resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; renderPage(); saveState(false); startTimer();}";
const nextQuestion = "function nextQuestion(){pickQuestion(); state.timer=40; state.pool=0; saveState(); startTimer();}";
const revealAnswer = "function revealAnswer(i){if(!state.currentQuestion || state.revealed.includes(i)) return; state.revealed.push(i); state.pool += Number(state.currentQuestion.points[i]||0); saveState(); if(state.revealed.length===state.currentQuestion.answers.length) setTimeout(()=>giftOverlay('BOARD CLEARED','AWARD THE POOL'),300);}";
const wrongAnswer = "function wrongAnswer(team=state.currentTeam){if(team==='red') state.redStrikes++; else state.blueStrikes++; state.overlay='❌ STRIKE'; saveState(); setTimeout(()=>{state.overlay=null; saveState();},650);}";
const endRound = "function endRound(){state.round++; const matchComplete=state.round>state.maxRounds; if(matchComplete){const wt=winningTeam().toUpperCase(); state.overlay=`MATCH COMPLETE<br><span style=\"font-size:.45em\">${wt} TEAM WINS</span><br><span style=\"font-size:.32em\">Run Rowdy Rush from Host Dashboard</span>`; state.round=1;} pickQuestion(); state.redStrikes=0; state.blueStrikes=0; saveState(); if(matchComplete) pauseTimer(); else startTimer(); setTimeout(()=>{state.overlay=null;saveState();},2400);}";
const timer = "function startTimer(){clearInterval(timerInterval); if(!Number.isFinite(Number(state.timer))||Number(state.timer)<=0){state.timer=40; saveState();} timerInterval=setInterval(()=>{if(Number(state.timer)<=1){state.timer=0; pauseTimer(); wrongAnswer(state.currentTeam); return;} state.timer--; saveState();},1000);}\nfunction pauseTimer(){clearInterval(timerInterval); timerInterval=null;}";
const restartMatch = "function restartMatch(){state.round=1;state.pool=0;state.redScore=0;state.blueScore=0;state.redStrikes=0;state.blueStrikes=0;state.timer=40;state.revealed=[];state.currentTeam=state.firstTeam||'red';pickQuestion();startTimer();giftOverlay('MATCH RESTARTED','READY');saveState();}";
const fixture = `<script>${startMatch}\n${nextQuestion}\n${revealAnswer}\n${wrongAnswer}\n${endRound}\n${timer}\n${restartMatch}</script>`;

function makeHarness(source, overrides = {}) {
  const code = source.replace(/^<script>/, '').replace(/<\/script>$/, '');
  const state = {
    matchSize: 2,
    redTeam: ['R1', 'R2'],
    blueTeam: ['B1', 'B2'],
    firstTeam: 'red',
    currentTeam: 'red',
    currentIndex: 0,
    turnIndexes: { red: 0, blue: 0 },
    currentQuestion: { answers: ['A', 'B'], points: [10, 5] },
    revealed: [],
    pool: 0,
    redStrikes: 0,
    blueStrikes: 0,
    round: 1,
    maxRounds: 3,
    timer: 22,
    ...overrides,
  };
  const calls = [];
  const factory = new Function(
    'state', 'matchSize', 'resetRowdyRushBonusForMatch', 'pickQuestion', 'renderPage',
    'saveState', 'setTimeout', 'giftOverlay', 'winningTeam', 'clearInterval', 'setInterval', 'timerInterval',
    `${code}
     return {
       startMatch,nextQuestion,revealAnswer,wrongAnswer,endRound,restartMatch,
       turnPlayers,ensureTurnIndexes,syncCurrentTurn,setCurrentTeam,advanceCurrentPlayer,
       setStartTimer(fn){startTimer=fn;}, setPauseTimer(fn){pauseTimer=fn;}
     };`,
  );
  const controls = factory(
    state,
    { value: 2 },
    () => calls.push('resetBonus'),
    () => { calls.push('pickQuestion'); state.currentQuestion ??= { answers: ['A', 'B'], points: [10, 5] }; state.revealed = []; state.timer = 40; },
    () => calls.push('renderPage'),
    (render) => calls.push(`save:${render}`),
    () => { calls.push('timeout'); return 1; },
    (title, sub) => calls.push(`gift:${title}:${sub}`),
    () => 'red',
    () => {},
    () => 1,
    null,
  );
  controls.setStartTimer(() => calls.push('startTimer'));
  controls.setPauseTimer(() => calls.push('pauseTimer'));
  return { state, calls, controls };
}

test('correct answer advances to the next player on the same team and restarts the timer', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  const h = makeHarness(result.source);
  h.controls.revealAnswer(0);
  assert.equal(h.state.currentTeam, 'red');
  assert.equal(h.state.currentIndex, 1);
  assert.equal(h.state.turnIndexes.red, 1);
  assert.equal(h.state.timer, 40);
  assert.ok(h.calls.includes('startTimer'));
});

test('board-clearing answer pauses without rotating away from the current player', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  const h = makeHarness(result.source, { currentQuestion: { answers: ['Only'], points: [20] }, revealed: [] });
  h.controls.revealAnswer(0);
  assert.equal(h.state.currentIndex, 0);
  assert.ok(h.calls.includes('pauseTimer'));
  assert.ok(!h.calls.includes('startTimer'));
});

test('ordinary wrong answer adds a strike and advances within the same team', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  const h = makeHarness(result.source);
  h.controls.wrongAnswer('red');
  assert.equal(h.state.redStrikes, 1);
  assert.equal(h.state.currentTeam, 'red');
  assert.equal(h.state.currentIndex, 1);
  assert.ok(h.calls.includes('startTimer'));
});

test('third strike transfers the turn to the opposing team at its first player', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  const h = makeHarness(result.source, { redStrikes: 2, turnIndexes: { red: 1, blue: 1 }, currentIndex: 1 });
  h.controls.wrongAnswer('red');
  assert.equal(h.state.redStrikes, 0);
  assert.equal(h.state.blueStrikes, 0);
  assert.equal(h.state.currentTeam, 'blue');
  assert.equal(h.state.currentIndex, 0);
  assert.equal(h.state.turnIndexes.blue, 0);
  assert.match(h.state.overlay, /BLUE TEAM TURN/);
});

test('timer expiry remains connected to the same wrong-answer advancement path', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  assert.match(result.source, /wrongAnswer\(state\.currentTeam\); return;/);
  assert.match(result.source, /function wrongAnswer\(team=state\.currentTeam\).+advanceCurrentPlayer\(\)/s);
});

test('manual next question advances the active team rotation and starts a fresh timer', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  const h = makeHarness(result.source);
  h.controls.nextQuestion();
  assert.equal(h.state.currentTeam, 'red');
  assert.equal(h.state.currentIndex, 1);
  assert.equal(h.state.timer, 40);
  assert.ok(h.calls.includes('pickQuestion'));
  assert.ok(h.calls.includes('startTimer'));
});

test('new rounds alternate the starting team and advance that team rotation', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  const h = makeHarness(result.source, { firstTeam: 'red', currentTeam: 'red', round: 1, maxRounds: 3, turnIndexes: { red: 0, blue: 0 } });
  h.controls.endRound();
  assert.equal(h.state.round, 2);
  assert.equal(h.state.currentTeam, 'blue');
  assert.equal(h.state.currentIndex, 1);
  assert.equal(h.state.turnIndexes.blue, 1);
  assert.ok(h.calls.includes('startTimer'));
});

test('single-player teams wrap safely at index zero', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  const h = makeHarness(result.source, { redTeam: ['Solo'], blueTeam: ['Other'], turnIndexes: { red: 0, blue: 0 } });
  h.controls.advanceCurrentPlayer();
  assert.equal(h.state.currentIndex, 0);
  assert.equal(h.state.turnIndexes.red, 0);
});

test('start and restart initialize per-team rotation indexes', () => {
  const result = applyRumbleTurnAdvancementFix(fixture);
  const h = makeHarness(result.source, { firstTeam: 'blue', currentTeam: 'blue', currentIndex: 1, turnIndexes: undefined });
  h.controls.startMatch();
  assert.deepEqual(h.state.turnIndexes, { red: 0, blue: 1 });
  assert.equal(h.state.currentIndex, 1);
  h.controls.restartMatch();
  assert.deepEqual(h.state.turnIndexes, { red: 0, blue: 0 });
  assert.equal(h.state.currentIndex, 0);
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleTurnAdvancementFix(fixture);
  const twice = applyRumbleTurnAdvancementFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 5', () => {
  const noTimerPrerequisite = fixture.replace(timer, "function startTimer(){}\nfunction pauseTimer(){}");
  assert.throws(() => applyRumbleTurnAdvancementFix(noTimerPrerequisite), /Prerequisite missing/);
});

test('refuses an unexpected wrong-answer implementation', () => {
  const changed = fixture.replace(wrongAnswer, "function wrongAnswer(){throw new Error('different')}");
  assert.throws(() => applyRumbleTurnAdvancementFix(changed), /wrong-answer advancement: expected exactly 1 match/);
});
