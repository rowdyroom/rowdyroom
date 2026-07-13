import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleBuzzerStrikeLevelsFix } from './fix-buzzer-strike-levels.mjs';

const patchedBuzzer = `<script>
function normalizeBuzzerKey(value){
  const key=String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  if(['strike','strike3','strike_3','third_strike'].includes(key)) return 'strike';
  if(['steal','stealopportunity','steal_opportunity'].includes(key)) return 'steal';
  if(['strike_steal','strikesteal','combo','third_strike_steal'].includes(key)) return 'strike_steal';
  return null;
}
function currentBuzzerPlayer(team=state.currentTeam){
  const players=turnPlayers(team);
  const index=team===state.currentTeam?state.currentIndex:Number(state.turnIndexes?.[team]||0);
  return players[index]||players[0]||(team==='red'?'Red Player':'Blue Player');
}
async function triggerBuzzerDisplay(kind,team=state.currentTeam,player=currentBuzzerPlayer(team)){
  const buzzer=normalizeBuzzerKey(kind);
  if(!buzzer) throw new Error('Unknown buzzer event: '+String(kind||''));
  const payload={
    buzzer,
    buzzer_key:buzzer,
    result_key:buzzer,
    event:buzzer,
    player_name:player,
    player_user_id:player,
    team:team==='red'?'fire':'ice'
  };
  await fetch('/api/rumble-buzzer.php?action=trigger',{method:'POST',body:JSON.stringify(payload)});
  return {payload};
}
function fireBuzzerDisplay(kind,team=state.currentTeam,player=currentBuzzerPlayer(team)){
  return triggerBuzzerDisplay(kind,team,player).catch(error=>{state.buzzerSyncError=error.message;return null;});
}
function wrongAnswer(team=state.currentTeam){const answeringTeam=team==='blue'?'blue':'red'; setCurrentTeam(answeringTeam); const struckPlayer=currentBuzzerPlayer(answeringTeam); if(answeringTeam==='red') state.redStrikes++; else state.blueStrikes++; const strikeCount=answeringTeam==='red'?state.redStrikes:state.blueStrikes; if(strikeCount>=3){const stealingTeam=answeringTeam==='red'?'blue':'red'; fireBuzzerDisplay('strike_steal',answeringTeam,struckPlayer); state.redStrikes=0; state.blueStrikes=0; ensureTurnIndexes(); state.turnIndexes[stealingTeam]=0; setCurrentTeam(stealingTeam); state.timer=40; state.overlay=\`❌ THIRD STRIKE<br><span style="font-size:.55em">\${stealingTeam.toUpperCase()} TEAM TURN</span>\`;}else{advanceCurrentPlayer(); state.overlay='❌ STRIKE';} saveState(); startTimer(); setTimeout(()=>{state.overlay=null; saveState();},650);}
function addStrikeToCurrent(label='STRIKE'){
  const struckTeam=state.currentTeam==='blue'?'blue':'red';
  const struckPlayer=currentBuzzerPlayer(struckTeam);
  if(struckTeam==='red') state.redStrikes++; else state.blueStrikes++;
  const strikeCount=struckTeam==='red'?state.redStrikes:state.blueStrikes;
  if(strikeCount>=3) fireBuzzerDisplay('strike',struckTeam,struckPlayer);
  state.overlay=\`❌ \${label}<br><span style="font-size:.55em">\${struckTeam.toUpperCase()} TEAM STRIKE</span>\`;
  saveState(); setTimeout(()=>{state.overlay=null; saveState();},1100);
}
</script>`;

function response(body = { ok: true }) {
  return { ok: true, json: async () => body };
}

function harness(source, overrides = {}) {
  const code = source.replace(/^<script>/, '').replace(/<\/script>$/, '');
  const state = {
    currentTeam: 'red',
    currentIndex: 0,
    redTeam: ['Red One', 'Red Two'],
    blueTeam: ['Blue One', 'Blue Two'],
    turnIndexes: { red: 0, blue: 0 },
    redStrikes: 0,
    blueStrikes: 0,
    timer: 40,
    ...overrides,
  };
  const requests = [];
  const timers = [];
  const window = { ROWDY_BUZZER_COMBO_DELAY_MS: 2500 };
  const factory = new Function(
    'state','window','fetch','turnPlayers','setCurrentTeam','ensureTurnIndexes',
    'advanceCurrentPlayer','saveState','startTimer','setTimeout',
    `${code}; return {wrongAnswer,addStrikeToCurrent,normalizeBuzzerKey,buzzerStrikeEvent,triggerBuzzerDisplay};`,
  );
  const controls = factory(
    state,
    window,
    async (_url, options) => {
      requests.push(JSON.parse(options.body));
      return response();
    },
    (team) => team === 'red' ? state.redTeam : state.blueTeam,
    (team) => {
      state.currentTeam = team === 'blue' ? 'blue' : 'red';
      state.currentIndex = Number(state.turnIndexes[state.currentTeam] || 0);
    },
    () => { state.turnIndexes ||= { red: 0, blue: 0 }; },
    () => {
      const team = state.currentTeam;
      const players = team === 'red' ? state.redTeam : state.blueTeam;
      state.turnIndexes[team] = (Number(state.turnIndexes[team] || 0) + 1) % players.length;
      state.currentIndex = state.turnIndexes[team];
    },
    () => {},
    () => {},
    (callback, ms) => { timers.push({callback,ms}); return timers.length; },
  );
  return { state, requests, timers, controls };
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
}

test('normalizes all three strike levels and preserves legacy Strike 3 alias', () => {
  const result = applyRumbleBuzzerStrikeLevelsFix(patchedBuzzer);
  const h = harness(result.source);
  assert.equal(h.controls.normalizeBuzzerKey('strike 1'), 'strike_1');
  assert.equal(h.controls.normalizeBuzzerKey('strike2'), 'strike_2');
  assert.equal(h.controls.normalizeBuzzerKey('strike'), 'strike_3');
  assert.equal(h.controls.normalizeBuzzerKey('third strike'), 'strike_3');
});

test('first normal wrong answer sends Strike 1 before rotating', async () => {
  const result = applyRumbleBuzzerStrikeLevelsFix(patchedBuzzer);
  const h = harness(result.source);
  h.controls.wrongAnswer('red');
  await flush();
  assert.equal(h.requests[0].buzzer, 'strike_1');
  assert.equal(h.requests[0].strike_count, 1);
  assert.equal(h.requests[0].player_name, 'Red One');
  assert.equal(h.state.currentIndex, 1);
});

test('second normal wrong answer sends Strike 2', async () => {
  const result = applyRumbleBuzzerStrikeLevelsFix(patchedBuzzer);
  const h = harness(result.source, { redStrikes: 1, currentIndex: 1, turnIndexes: { red: 1, blue: 0 } });
  h.controls.wrongAnswer('red');
  await flush();
  assert.equal(h.requests[0].buzzer, 'strike_2');
  assert.equal(h.requests[0].strike_count, 2);
  assert.equal(h.requests[0].player_name, 'Red Two');
});

test('third normal wrong answer sends Strike 3 then schedules combined steal animation', async () => {
  const result = applyRumbleBuzzerStrikeLevelsFix(patchedBuzzer);
  const h = harness(result.source, { redStrikes: 2, currentIndex: 1, turnIndexes: { red: 1, blue: 0 } });
  h.controls.wrongAnswer('red');
  await flush();
  assert.equal(h.requests[0].buzzer, 'strike_3');
  assert.equal(h.requests[0].strike_count, 3);
  assert.equal(h.state.currentTeam, 'blue');
  const combo = h.timers.find((timer) => timer.ms === 2500);
  assert.ok(combo);
  combo.callback();
  await flush();
  assert.equal(h.requests[1].buzzer, 'strike_steal');
  assert.equal(h.requests[1].player_name, 'Red Two');
});

test('standalone strike helper triggers Strike 1, Strike 2, and Strike 3', async () => {
  const result = applyRumbleBuzzerStrikeLevelsFix(patchedBuzzer);
  const first = harness(result.source);
  first.controls.addStrikeToCurrent();
  await flush();
  assert.equal(first.requests[0].buzzer, 'strike_1');

  const second = harness(result.source, { redStrikes: 1 });
  second.controls.addStrikeToCurrent();
  await flush();
  assert.equal(second.requests[0].buzzer, 'strike_2');

  const third = harness(result.source, { redStrikes: 2 });
  third.controls.addStrikeToCurrent();
  await flush();
  assert.equal(third.requests[0].buzzer, 'strike_3');
});

test('is idempotent after strike-level support is installed', () => {
  const once = applyRumbleBuzzerStrikeLevelsFix(patchedBuzzer);
  const twice = applyRumbleBuzzerStrikeLevelsFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.source, once.source);
});

test('refuses a source without the existing buzzer repair', () => {
  assert.throws(
    () => applyRumbleBuzzerStrikeLevelsFix('<script>function wrongAnswer(){}</script>'),
    /Prerequisite missing/,
  );
});
