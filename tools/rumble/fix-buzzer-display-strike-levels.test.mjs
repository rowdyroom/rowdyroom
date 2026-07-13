import assert from 'node:assert/strict';
import { mkdtempSync, mkdirSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  applyRumbleBuzzerDisplayStrikeLevelsFix,
  verifyBuzzerVideoAssets,
} from './fix-buzzer-display-strike-levels.mjs';

const fixture = 'const buzzers={ strike:{label:"Strike 3",video:"videos/strike-3.mp4"}, steal:{label:"Steal Opportunity",video:"videos/steal-opportunity.mp4"}, strike_steal:{label:"Strike 3 + Steal Opportunity",video:"videos/strike-steal.mp4"} };';

test('adds Strike 1, Strike 2, and Strike 3 video mappings', () => {
  const result = applyRumbleBuzzerDisplayStrikeLevelsFix(fixture);
  assert.equal(result.changed, true);
  assert.match(result.source, /strike_1:\{label:"Strike 1"/);
  assert.match(result.source, /strike-1\.mp4/);
  assert.match(result.source, /strike_2:\{label:"Strike 2"/);
  assert.match(result.source, /strike-2\.mp4/);
  assert.match(result.source, /strike_3:\{label:"Strike 3"/);
  assert.match(result.source, /strike-3\.mp4/);
});

test('keeps legacy strike mapped to Strike 3', () => {
  const result = applyRumbleBuzzerDisplayStrikeLevelsFix(fixture);
  assert.match(result.source, /strike:\{label:"Strike 3",video:buzzerVideos\.strike_3/);
});

test('supports explicit video URL overrides', () => {
  const result = applyRumbleBuzzerDisplayStrikeLevelsFix(fixture);
  assert.match(result.source, /window\.ROWDY_BUZZER_VIDEO_URLS/);
  assert.match(result.source, /buzzerVideos\.strike_1\|\|"videos\/strike-1\.mp4"/);
});

test('is idempotent after display mappings are installed', () => {
  const once = applyRumbleBuzzerDisplayStrikeLevelsFix(fixture);
  const twice = applyRumbleBuzzerDisplayStrikeLevelsFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.source, once.source);
});

test('refuses an unknown display implementation', () => {
  assert.throws(
    () => applyRumbleBuzzerDisplayStrikeLevelsFix('const buzzers={other:{}};'),
    /expected exactly 1 legacy mapping/,
  );
});

test('verifies every required video asset before deployment', () => {
  const root = mkdtempSync(join(tmpdir(), 'rowdy-buzzer-display-'));
  const assets = join(root, 'assets');
  const videos = join(root, 'videos');
  mkdirSync(assets);
  mkdirSync(videos);
  const displayPath = join(assets, 'app.js');
  writeFileSync(displayPath, fixture);

  for (const name of ['strike-1.mp4','strike-2.mp4','strike-3.mp4','steal-opportunity.mp4','strike-steal.mp4']) {
    writeFileSync(join(videos, name), 'video');
  }

  const result = verifyBuzzerVideoAssets(displayPath);
  assert.equal(result.passed, true);
  assert.deepEqual(result.missing, []);
});

test('reports missing Strike 1 and Strike 2 assets', () => {
  const root = mkdtempSync(join(tmpdir(), 'rowdy-buzzer-missing-'));
  const assets = join(root, 'assets');
  const videos = join(root, 'videos');
  mkdirSync(assets);
  mkdirSync(videos);
  const displayPath = join(assets, 'app.js');
  writeFileSync(displayPath, fixture);
  for (const name of ['strike-3.mp4','steal-opportunity.mp4','strike-steal.mp4']) {
    writeFileSync(join(videos, name), 'video');
  }
  const result = verifyBuzzerVideoAssets(displayPath);
  assert.equal(result.passed, false);
  assert.deepEqual(result.missing, ['strike-1.mp4','strike-2.mp4']);
});
