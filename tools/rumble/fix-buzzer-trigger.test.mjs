import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleBuzzerTriggerFix } from './fix-buzzer-trigger.mjs';

const prerequisite = 'async function requestWheelSpin(){}';
const wrong = "function wrongAnswer(team=state.currentTeam){const answeringTeam=team==='blue'?'blue':'red'; setCurrentTeam(answeringTeam); if(answeringTeam==='red') state.redStrikes++; else state.blueStrikes++; const strikeCount=answeringTeam==='red'?state.redStrikes:state.blueStrikes; if(strikeCount>=3){const stealingTeam=answeringTeam==='red'?'blue':'red'; state.redStrikes=0; state.blueStrikes=0; ensureTurnIndexes(); state.turnIndexes[stealingTeam]=0; setCurrentTeam(stealingTeam); state.timer=40; state.overlay=`❌ THIRD STRIKE<br><span style=\"font-size:.55em\">${stealingTeam.toUpperCase()} TEAM TURN</span>`;}else{advanceCurrentPlayer(); state.overlay='❌ STRIKE';} saveState(); startTimer(); setTimeout(()=>{state.overlay=null; saveState();},650);}";
const addStrike = `function addStrikeToCurrent(label='STRIKE'){
  if(state.currentTeam==='red') state.redStrikes++; else state.blueStrikes++;
  state.overlay=\`❌ \${label}<br><span style="font-size:.55em">\${state.currentTeam.toUpperCase()} TEAM STRIKE</span>\`;
  saveState(); setTimeout(()=>{state.overlay=null; saveState();},1100);
}`;
const fixture = `<script>${prerequisite}\n${wrong}\n${addStrike}</script>`;

function response(body, ok = true) {
  return { ok, json: async () => body };
}

function harness(source, fetchImpl, overrides = {}) {
  const code = source
    .replace(/^<script>/, '')
    .replace(/<\/script>$/, '')
    .replace(prerequisite, '');
  const state = {
    currentTeam: 'red',
    currentIndex: 0,
    redTeam: ['Red One', 'Red Two'],
    blueTeam: ['Blue One', 'Blue Two'],
    turnIndexes: { red: 0, blue: 0 },
    redStrikes: 0,
    blueStrikes: 0,
    timer: 22,
    ...overrides,
  };
  const calls = [];
  const window = {
    ROWDY_BUZZER_API_URL: '/api/rumble-buzzer.php',
    ...overrides.window,
  };
  const factory = new Function(
    'state','window','fetch','turnPlayers','setCurrentTeam','ensureTurnIndexes',
    'advanceCurrentPlayer','saveState','startTimer','setTimeout','giftOverlay',
    `${code}; return {
      wrongAnswer,addStrikeToCurrent,showStealOpportunity,triggerBuzzerDisplay,
      normalizeBuzzerKey,currentBuzzerPlayer
    };`,
  );
  const controls = factory(
    state,
    window,
    fetchImpl,
    (team) => team === 'red' ? state.redTeam : state.blueTeam,
    (team) => {
      state.currentTeam = team === 'blue' ? 'blue' : 'red';
      state.currentIndex = Number(state.turnIndexes[state.currentTeam] || 0);
      calls.push(`team:${state.currentTeam}`);
    },
    () => {
      state.turnIndexes ||= { red: 0, blue: 0 };
      calls.push('ensure');
    },
    () => {
      const team = state.currentTeam;
      const players = team === 'red' ? state.redTeam : state.blueTeam;
      state.turnIndexes[team] = (Number(state.turnIndexes[team] || 0) + 1) % Math.max(players.length, 1);
      state.currentIndex = state.turnIndexes[team];
      state.timer = 40;
      calls.push(`advance:${team}:${state.currentIndex}`);
    },
    () => calls.push('save'),
    () => calls.push('startTimer'),
    () => { calls.push('timeout'); return 1; },
    (title, sub) => calls.push(`gift:${title}:${sub}`),
  );
  return { state, calls, controls };
}

async function flush() {
  await Promise.resolve();
  await Promise.resolve();
  await new Promise((resolve) => setImmediate(resolve));
}

test('normalizes strike, steal, and combined event aliases', () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  const h = harness(result.source, async () => response({ ok: true }));
  assert.equal(h.controls.normalizeBuzzerKey('strike3'), 'strike');
  assert.equal(h.controls.normalizeBuzzerKey('steal-opportunity'), 'steal');
  assert.equal(h.controls.normalizeBuzzerKey('strike + steal'), 'strike_steal');
  assert.equal(h.controls.normalizeBuzzerKey('combo'), 'strike_steal');
});

test('posts the current Red player as Fire to the trigger action', async () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url, options) => {
    requests.push({ url, options });
    return response({ ok: true, state: { buzzer: 'strike' } });
  });
  const output = await h.controls.triggerBuzzerDisplay('strike');
  assert.equal(requests[0].url, '/api/rumble-buzzer.php?action=trigger');
  const payload = JSON.parse(requests[0].options.body);
  assert.equal(payload.buzzer, 'strike');
  assert.equal(payload.player_name, 'Red One');
  assert.equal(payload.team, 'fire');
  assert.equal(output.action, 'trigger');
});

test('maps Blue team to Ice', async () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  let payload;
  const h = harness(result.source, async (_url, options) => {
    payload = JSON.parse(options.body);
    return response({ ok: true });
  }, { currentTeam: 'blue', currentIndex: 1, turnIndexes: { red: 0, blue: 1 } });
  await h.controls.triggerBuzzerDisplay('steal');
  assert.equal(payload.player_name, 'Blue Two');
  assert.equal(payload.team, 'ice');
  assert.equal(payload.result_key, 'steal');
});

test('falls back to the normalized event action when trigger is unavailable', async () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url, options) => {
    requests.push({ url, options });
    if (url.endsWith('action=trigger')) return response({ ok: false, error: 'unknown action' }, false);
    return response({ ok: true, result_key: 'strike_steal' });
  });
  const output = await h.controls.triggerBuzzerDisplay('combo');
  assert.deepEqual(requests.map((request) => request.url), [
    '/api/rumble-buzzer.php?action=trigger',
    '/api/rumble-buzzer.php?action=strike_steal',
  ]);
  assert.equal(output.action, 'strike_steal');
});

test('ordinary wrong answer rotates normally without playing a third-strike video', async () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url) => {
    requests.push(url);
    return response({ ok: true });
  });
  h.controls.wrongAnswer('red');
  await flush();
  assert.equal(h.state.redStrikes, 1);
  assert.equal(h.state.currentTeam, 'red');
  assert.equal(h.state.currentIndex, 1);
  assert.equal(requests.length, 0);
});

test('third wrong answer triggers combined strike and steal for the struck player', async () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url, options) => {
    requests.push({ url, payload: JSON.parse(options.body) });
    return response({ ok: true });
  }, { redStrikes: 2, currentTeam: 'red', currentIndex: 1, turnIndexes: { red: 1, blue: 0 } });
  h.controls.wrongAnswer('red');
  await flush();
  assert.equal(requests[0].url, '/api/rumble-buzzer.php?action=trigger');
  assert.equal(requests[0].payload.buzzer, 'strike_steal');
  assert.equal(requests[0].payload.player_name, 'Red Two');
  assert.equal(requests[0].payload.team, 'fire');
  assert.equal(h.state.currentTeam, 'blue');
  assert.equal(h.state.currentIndex, 0);
  assert.equal(h.state.redStrikes, 0);
  assert.equal(h.state.blueStrikes, 0);
});

test('standalone third strike from a Punch effect triggers the strike video', async () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url, options) => {
    requests.push({ url, payload: JSON.parse(options.body) });
    return response({ ok: true });
  }, { blueStrikes: 2, currentTeam: 'blue', currentIndex: 0, turnIndexes: { red: 0, blue: 0 } });
  h.controls.addStrikeToCurrent('MISS');
  await flush();
  assert.equal(h.state.blueStrikes, 3);
  assert.equal(requests[0].payload.buzzer, 'strike');
  assert.equal(requests[0].payload.player_name, 'Blue One');
  assert.equal(requests[0].payload.team, 'ice');
});

test('standalone steal helper triggers the steal video and overlay', async () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url, options) => {
    requests.push({ url, payload: JSON.parse(options.body) });
    return response({ ok: true });
  });
  h.controls.showStealOpportunity('red');
  await flush();
  assert.equal(requests[0].payload.buzzer, 'steal');
  assert.ok(h.calls.includes('gift:⚡ STEAL OPPORTUNITY:RED TEAM'));
});

test('display failure never blocks game state and records the error', async () => {
  const result = applyRumbleBuzzerTriggerFix(fixture);
  const h = harness(result.source, async () => { throw new Error('buzzer offline'); }, {
    redStrikes: 2,
  });
  h.controls.wrongAnswer('red');
  await flush();
  assert.equal(h.state.currentTeam, 'blue');
  assert.equal(h.state.buzzerSyncError, 'buzzer offline');
  assert.ok(h.calls.includes('save'));
  assert.ok(h.calls.includes('startTimer'));
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleBuzzerTriggerFix(fixture);
  const twice = applyRumbleBuzzerTriggerFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 7', () => {
  assert.throws(
    () => applyRumbleBuzzerTriggerFix(`<script>${wrong}\n${addStrike}</script>`),
    /Prerequisite missing/,
  );
});

test('refuses an unexpected wrong-answer implementation', () => {
  assert.throws(
    () => applyRumbleBuzzerTriggerFix(`<script>${prerequisite}\nfunction wrongAnswer(){throw new Error('different')}\n${addStrike}</script>`),
    /wrong-answer buzzer trigger: expected exactly 1 match/,
  );
});
