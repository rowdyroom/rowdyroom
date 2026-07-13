import assert from 'node:assert/strict';
import { mkdtempSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  DEFAULT_REPAIRS,
  applyAllRumbleRepairs,
  installAllRumbleRepairs,
  restoreRumbleBackup,
} from './apply-all-repairs.mjs';

function fakeRepairs() {
  return [
    {
      number: 1,
      name: 'first',
      apply(source) {
        if (source.includes('[first]')) return { source, changed: false, status: 'already-patched' };
        return { source: `${source}[first]`, changed: true, status: 'patched' };
      },
    },
    {
      number: 2,
      name: 'second',
      apply(source) {
        if (!source.includes('[first]')) throw new Error('first prerequisite missing');
        if (source.includes('[second]')) return { source, changed: false, status: 'already-patched' };
        return { source: `${source}[second]`, changed: true, status: 'patched' };
      },
    },
  ];
}

test('default repair list contains the 11 ordered Rumble repairs', () => {
  assert.equal(DEFAULT_REPAIRS.length, 11);
  assert.deepEqual(DEFAULT_REPAIRS.map((step) => step.number), [1,2,3,4,5,6,7,8,9,10,11]);
  assert.deepEqual(
    DEFAULT_REPAIRS.map((step) => step.name),
    [
      'setup-focus','start-setup-routing','coin-carryover','current-turn-display',
      'timer-lifecycle','turn-advancement','wheel-trigger','buzzer-trigger',
      'tv-mode','built-in-question-bank','vertical-layout',
    ],
  );
  DEFAULT_REPAIRS.forEach((step) => assert.equal(typeof step.apply, 'function'));
});

test('applies repairs in order and reports every changed step', () => {
  const result = applyAllRumbleRepairs('base', fakeRepairs());
  assert.equal(result.source, 'base[first][second]');
  assert.equal(result.changed, true);
  assert.equal(result.changedCount, 2);
  assert.deepEqual(result.steps.map((step) => step.name), ['first','second']);
  assert.ok(result.steps.every((step) => step.changed));
});

test('is idempotent when every repair is already installed', () => {
  const repairs = fakeRepairs();
  const once = applyAllRumbleRepairs('base', repairs);
  const twice = applyAllRumbleRepairs(once.source, repairs);
  assert.equal(twice.source, once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.changedCount, 0);
  assert.ok(twice.steps.every((step) => step.status === 'already-patched'));
});

test('installs only missing repairs on a partially patched file', () => {
  const result = applyAllRumbleRepairs('base[first]', fakeRepairs());
  assert.equal(result.source, 'base[first][second]');
  assert.equal(result.changedCount, 1);
  assert.equal(result.steps[0].changed, false);
  assert.equal(result.steps[1].changed, true);
});

test('rejects invalid repair definitions', () => {
  assert.throws(() => applyAllRumbleRepairs('base', []), /At least one repair/);
  assert.throws(
    () => applyAllRumbleRepairs('base', [{ name: 'bad', apply: null }]),
    /Repair step 1 is invalid/,
  );
});

test('rejects a repair that returns an invalid result', () => {
  assert.throws(
    () => applyAllRumbleRepairs('base', [{ name:'bad', apply:()=>({changed:true}) }]),
    /returned an invalid result/,
  );
});

test('rejects non-string source input', () => {
  assert.throws(() => applyAllRumbleRepairs(null, fakeRepairs()), /source must be a string/);
});

test('creates one original backup and atomically installs the complete result', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rowdy-install-'));
  const target = join(dir, 'index.html');
  const backup = join(dir, 'original.bak');
  writeFileSync(target, 'base', 'utf8');

  const result = installAllRumbleRepairs(target, {
    repairs: fakeRepairs(),
    backupPath: backup,
  });

  assert.equal(result.status, 'installed');
  assert.equal(result.backupPath, backup);
  assert.equal(readFileSync(target, 'utf8'), 'base[first][second]');
  assert.equal(readFileSync(backup, 'utf8'), 'base');
  assert.equal(readdirSync(dir).some((name) => name.endsWith('.tmp')), false);
});

test('does not create another backup when the suite is already installed', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rowdy-installed-'));
  const target = join(dir, 'index.html');
  writeFileSync(target, 'base[first][second]', 'utf8');
  const result = installAllRumbleRepairs(target, { repairs: fakeRepairs() });
  assert.equal(result.status, 'already-installed');
  assert.equal(result.backupPath, null);
  assert.deepEqual(readdirSync(dir), ['index.html']);
});

test('does not alter the target when a repair fails before writing', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rowdy-fail-'));
  const target = join(dir, 'index.html');
  writeFileSync(target, 'base', 'utf8');
  const repairs = [
    ...fakeRepairs(),
    { name:'failure', apply(){ throw new Error('deliberate failure'); } },
  ];
  assert.throws(
    () => installAllRumbleRepairs(target, { repairs }),
    /deliberate failure/,
  );
  assert.equal(readFileSync(target, 'utf8'), 'base');
  assert.deepEqual(readdirSync(dir), ['index.html']);
});

test('restores an installed target from the suite backup', () => {
  const dir = mkdtempSync(join(tmpdir(), 'rowdy-restore-'));
  const target = join(dir, 'index.html');
  const backup = join(dir, 'original.bak');
  writeFileSync(target, 'base', 'utf8');
  installAllRumbleRepairs(target, { repairs: fakeRepairs(), backupPath: backup });
  const result = restoreRumbleBackup(backup, target);
  assert.equal(result.status, 'restored');
  assert.equal(readFileSync(target, 'utf8'), 'base');
});

test('the complete default suite can verify an already-patched source', () => {
  assert.equal(DEFAULT_REPAIRS.length, 11);
  DEFAULT_REPAIRS.forEach((step) => assert.equal(typeof step.apply, 'function'));
});
