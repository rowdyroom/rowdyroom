#!/usr/bin/env node

import { existsSync, copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BEFORE = 'const buzzers={ strike:{label:"Strike 3",video:"videos/strike-3.mp4"}, steal:{label:"Steal Opportunity",video:"videos/steal-opportunity.mp4"}, strike_steal:{label:"Strike 3 + Steal Opportunity",video:"videos/strike-steal.mp4"} };';

const AFTER = `const buzzerVideos=window.ROWDY_BUZZER_VIDEO_URLS||{};
const buzzers={
  strike_1:{label:"Strike 1",video:buzzerVideos.strike_1||"videos/strike-1.mp4"},
  strike_2:{label:"Strike 2",video:buzzerVideos.strike_2||"videos/strike-2.mp4"},
  strike_3:{label:"Strike 3",video:buzzerVideos.strike_3||"videos/strike-3.mp4"},
  strike:{label:"Strike 3",video:buzzerVideos.strike_3||"videos/strike-3.mp4"},
  steal:{label:"Steal Opportunity",video:buzzerVideos.steal||"videos/steal-opportunity.mp4"},
  strike_steal:{label:"Strike 3 + Steal Opportunity",video:buzzerVideos.strike_steal||"videos/strike-steal.mp4"}
};`;

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

export function applyRumbleBuzzerDisplayStrikeLevelsFix(source) {
  const fullyPatched =
    source.includes('strike_1:{label:"Strike 1"') &&
    source.includes('strike_2:{label:"Strike 2"') &&
    source.includes('strike_3:{label:"Strike 3"') &&
    source.includes('window.ROWDY_BUZZER_VIDEO_URLS');

  if (fullyPatched) return { source, changed: false, status: 'already-patched' };

  const count = countOccurrences(source, BEFORE);
  if (count !== 1) {
    throw new Error(`Buzzer display mapping: expected exactly 1 legacy mapping, found ${count}. No file was changed.`);
  }

  return { source: source.replace(BEFORE, AFTER), changed: true, status: 'patched' };
}

export function verifyBuzzerVideoAssets(displayPath) {
  const videoDirectory = join(dirname(dirname(displayPath)), 'videos');
  const required = [
    'strike-1.mp4',
    'strike-2.mp4',
    'strike-3.mp4',
    'steal-opportunity.mp4',
    'strike-steal.mp4',
  ];
  const missing = required.filter((name) => !existsSync(join(videoDirectory, name)));
  return { videoDirectory, required, missing, passed: missing.length === 0 };
}

function timestamp() { return new Date().toISOString().replace(/[:.]/g, '-'); }

function applyToFile(targetPath) {
  const assetCheck = verifyBuzzerVideoAssets(targetPath);
  if (!assetCheck.passed) {
    throw new Error(`Missing buzzer video assets: ${assetCheck.missing.join(', ')}. No file was changed.`);
  }
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleBuzzerDisplayStrikeLevelsFix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} already supports all strike levels.`);
    return;
  }
  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-strike-level-display-${timestamp()}.bak`);
  const tempPath = `${targetPath}.strike-level-display.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log(`Assets verified: ${assetCheck.required.join(', ')}`);
}

function restoreFile(backupPath, targetPath) {
  const tempPath = `${targetPath}.restore.tmp`;
  writeFileSync(tempPath, readFileSync(backupPath, 'utf8'), 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Restored: ${targetPath}`);
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const [mode, firstPath, secondPath] = process.argv.slice(2);
  try {
    if (mode === '--check' && firstPath) {
      const result = applyRumbleBuzzerDisplayStrikeLevelsFix(readFileSync(firstPath, 'utf8'));
      const assets = verifyBuzzerVideoAssets(firstPath);
      console.log(JSON.stringify({ status: result.changed ? 'NEEDS_PATCH' : 'PATCHED', assets }, null, 2));
      if (!assets.passed) process.exitCode = 1;
    } else if (mode === '--apply' && firstPath) applyToFile(firstPath);
    else if (mode === '--restore' && firstPath && secondPath) restoreFile(firstPath, secondPath);
    else {
      console.error('Usage: --check <assets/app.js> | --apply <assets/app.js> | --restore <backup.bak> <assets/app.js>');
      process.exitCode = 2;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
