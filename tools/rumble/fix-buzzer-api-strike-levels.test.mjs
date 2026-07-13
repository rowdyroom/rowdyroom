import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleBuzzerApiStrikeLevelsFix } from './fix-buzzer-api-strike-levels.mjs';

const fixture = `<?php
function rb_buzzer(string $buzzer): string {
    $b = strtolower(trim($buzzer));
    $map = [ 'strike' => 'strike', 'strike3' => 'strike', 'strike_3' => 'strike', 'steal' => 'steal', 'stealopportunity' => 'steal', 'steal_opportunity' => 'steal', 'strike-steal' => 'strike_steal', 'strikesteal' => 'strike_steal', 'combo' => 'strike_steal', ];
    if (isset($map[$b])) return $map[$b];
    throw new RuntimeException('Unknown buzzer');
}`;

test('adds canonical Strike 1, Strike 2, and Strike 3 mappings', () => {
  const result = applyRumbleBuzzerApiStrikeLevelsFix(fixture);
  assert.equal(result.changed, true);
  assert.match(result.source, /'strike_1' => 'strike_1'/);
  assert.match(result.source, /'strike_2' => 'strike_2'/);
  assert.match(result.source, /'strike_3' => 'strike_3'/);
});

test('supports numbered and word aliases for every strike level', () => {
  const result = applyRumbleBuzzerApiStrikeLevelsFix(fixture);
  assert.match(result.source, /'strike1' => 'strike_1'/);
  assert.match(result.source, /'first_strike' => 'strike_1'/);
  assert.match(result.source, /'strike2' => 'strike_2'/);
  assert.match(result.source, /'second_strike' => 'strike_2'/);
  assert.match(result.source, /'strike3' => 'strike_3'/);
  assert.match(result.source, /'third_strike' => 'strike_3'/);
});

test('maps legacy strike to Strike 3 for backward compatibility', () => {
  const result = applyRumbleBuzzerApiStrikeLevelsFix(fixture);
  assert.match(result.source, /'strike' => 'strike_3'/);
});

test('preserves steal and combined strike-steal mappings', () => {
  const result = applyRumbleBuzzerApiStrikeLevelsFix(fixture);
  assert.match(result.source, /'steal' => 'steal'/);
  assert.match(result.source, /'combo' => 'strike_steal'/);
});

test('is idempotent after API mappings are installed', () => {
  const once = applyRumbleBuzzerApiStrikeLevelsFix(fixture);
  const twice = applyRumbleBuzzerApiStrikeLevelsFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.source, once.source);
});

test('refuses an unknown PHP API implementation', () => {
  assert.throws(
    () => applyRumbleBuzzerApiStrikeLevelsFix('<?php function other(){}'),
    /normalizer was not found/,
  );
});
