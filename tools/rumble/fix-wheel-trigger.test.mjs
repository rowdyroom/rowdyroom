import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleWheelTriggerFix } from './fix-wheel-trigger.mjs';

const prerequisite = "state.turnIndexes={red:0,blue:0}; state.turnIndexes[state.currentTeam]=state.currentIndex; syncCurrentTurn();";
const punch = `function punchAttack(){
  const effects=currentStrikeCount()>=2?['5 SECOND TIMER','SKIP TURN','MISS']:['5 SECOND TIMER','SKIP TURN','MISS','POWER PUNCH'];
  const result=effects[Math.floor(Math.random()*effects.length)];
  state.punchLog=(state.punchLog||[]).concat([result]).slice(-10);
  if(result==='5 SECOND TIMER'){
    state.timer=5; startTimer(); giftOverlay('🥊 PUNCH RESULT','5 SECOND ANSWER TIMER');
  } else if(result==='SKIP TURN') {
    skipCurrentTurn();
  } else if(result==='MISS') {
    addStrikeToCurrent('MISS');
  } else {
    powerPunchAttack(true);
  }
  saveState();
}`;
const fixture = `<script>${prerequisite}\n${punch}</script>`;

function harness(source, fetchImpl, overrides = {}) {
  const code = source.replace(/^<script>/, '').replace(/<\/script>$/, '').replace(prerequisite, '');
  const state = {
    currentTeam: 'red',
    currentIndex: 1,
    redTeam: ['Red One', 'Red Two'],
    blueTeam: ['Blue One', 'Blue Two'],
    punchLog: [],
    timer: 40,
    ...overrides,
  };
  const calls = [];
  const window = { ROWDY_WHEEL_API_URL: '/api/rumble-wheel.php' };
  const factory = new Function(
    'state','window','fetch','turnPlayers','currentStrikeCount','startTimer','giftOverlay',
    'skipCurrentTurn','addStrikeToCurrent','powerPunchAttack','saveState','Math',
    `${code}; return {punchAttack,wheelEffectFromKey,currentWheelPlayer,requestWheelSpin};`,
  );
  const controls = factory(
    state,
    window,
    fetchImpl,
    (team) => team === 'red' ? state.redTeam : state.blueTeam,
    () => Number(overrides.strikeCount || 0),
    () => calls.push('startTimer'),
    (title, sub) => calls.push(`gift:${title}:${sub}`),
    () => calls.push('skip'),
    (label) => calls.push(`strike:${label}`),
    (fromWheel) => calls.push(`power:${fromWheel}`),
    () => calls.push('save'),
    Object.assign(Object.create(Math), { random: () => 0 }),
  );
  return { state, calls, controls };
}

function response(body, ok = true) {
  return { ok, json: async () => body };
}

test('posts current player and Fire team to the deployed spin endpoint', async () => {
  const result = applyRumbleWheelTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url, options) => {
    requests.push({ url, options });
    return response({ ok: true, state: { result_key: 'skip_turn' } });
  });
  await h.controls.punchAttack();
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, '/api/rumble-wheel.php?action=spin');
  const payload = JSON.parse(requests[0].options.body);
  assert.deepEqual(payload, { player_name: 'Red Two', player_user_id: 'Red Two', team: 'fire' });
  assert.ok(h.calls.includes('skip'));
});

test('maps Blue team to Ice and applies power punch returned by the wheel', async () => {
  const result = applyRumbleWheelTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url, options) => {
    requests.push({ url, options });
    return response({ ok: true, result_key: 'power-punch' });
  }, { currentTeam: 'blue', currentIndex: 0 });
  await h.controls.punchAttack();
  assert.equal(JSON.parse(requests[0].options.body).team, 'ice');
  assert.ok(h.calls.includes('power:true'));
  assert.equal(h.state.punchLog.at(-1), 'POWER PUNCH');
});

test('maps all deployed video key variants to game effects', () => {
  const result = applyRumbleWheelTriggerFix(fixture);
  const h = harness(result.source, async () => response({ ok: true }));
  assert.equal(h.controls.wheelEffectFromKey('miss'), 'MISS');
  assert.equal(h.controls.wheelEffectFromKey('skip-turn'), 'SKIP TURN');
  assert.equal(h.controls.wheelEffectFromKey('5-second-timer'), '5 SECOND TIMER');
  assert.equal(h.controls.wheelEffectFromKey('five_second_timer'), '5 SECOND TIMER');
  assert.equal(h.controls.wheelEffectFromKey('power_punch'), 'POWER PUNCH');
});

test('uses the state endpoint when the spin response omits result_key', async () => {
  const result = applyRumbleWheelTriggerFix(fixture);
  const requests = [];
  const h = harness(result.source, async (url, options) => {
    requests.push({ url, options });
    if (url.endsWith('action=spin')) return response({ ok: true });
    return response({ ok: true, state: { result_key: 'miss' } });
  });
  await h.controls.punchAttack();
  assert.deepEqual(requests.map((r) => r.url), [
    '/api/rumble-wheel.php?action=spin',
    '/api/rumble-wheel.php?action=state',
  ]);
  assert.ok(h.calls.includes('strike:MISS'));
});

test('falls back locally without blocking the game when the wheel API is unavailable', async () => {
  const result = applyRumbleWheelTriggerFix(fixture);
  const h = harness(result.source, async () => { throw new Error('network down'); });
  await h.controls.punchAttack();
  assert.equal(h.state.wheelSyncError, 'network down');
  assert.equal(h.state.timer, 5);
  assert.ok(h.calls.includes('startTimer'));
  assert.ok(h.calls.includes('save'));
});

test('records a readable fallback player when team names are missing', async () => {
  const result = applyRumbleWheelTriggerFix(fixture);
  let payload;
  const h = harness(result.source, async (_url, options) => {
    payload = JSON.parse(options.body);
    return response({ ok: true, result_key: 'miss' });
  }, { redTeam: [], currentIndex: 0 });
  await h.controls.punchAttack();
  assert.equal(payload.player_name, 'Red Player');
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleWheelTriggerFix(fixture);
  const twice = applyRumbleWheelTriggerFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to run before repair item 6', () => {
  assert.throws(() => applyRumbleWheelTriggerFix(`<script>${punch}</script>`), /Prerequisite missing/);
});

test('refuses an unexpected punch implementation', () => {
  assert.throws(
    () => applyRumbleWheelTriggerFix(`<script>${prerequisite}\nfunction punchAttack(){throw new Error('different')}</script>`),
    /punch wheel trigger: expected exactly 1 match/,
  );
});
