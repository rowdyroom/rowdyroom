#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BEFORE = `'strike' => 'strike', 'strike3' => 'strike', 'strike_3' => 'strike',`;
const AFTER = `'strike1' => 'strike_1', 'strike_1' => 'strike_1', 'first_strike' => 'strike_1',
        'strike2' => 'strike_2', 'strike_2' => 'strike_2', 'second_strike' => 'strike_2',
        'strike' => 'strike_3', 'strike3' => 'strike_3', 'strike_3' => 'strike_3', 'third_strike' => 'strike_3',`;

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

export function applyRumbleBuzzerApiStrikeLevelsFix(source) {
  const fullyPatched =
    source.includes("'strike_1' => 'strike_1'") &&
    source.includes("'strike_2' => 'strike_2'") &&
    source.includes("'strike_3' => 'strike_3'") &&
    source.includes("'strike' => 'strike_3'");

  if (fullyPatched) return { source, changed: false, status: 'already-patched' };

  if (!source.includes('function rb_buzzer(')) {
    throw new Error('Buzzer API normalizer was not found. No file was changed.');
  }

  const count = countOccurrences(source, BEFORE);
  if (count !== 1) {
    throw new Error(`Buzzer API strike mapping: expected exactly 1 legacy mapping, found ${count}. No file was changed.`);
  }

  return { source: source.replace(BEFORE, AFTER), changed: true, status: 'patched' };
}

function timestamp() { return new Date().toISOString().replace(/[:.]/g, '-'); }

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleBuzzerApiStrikeLevelsFix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} already normalizes all three strike levels.`);
    return;
  }
  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-strike-level-api-${timestamp()}.bak`);
  const tempPath = `${targetPath}.strike-level-api.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
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
      const result = applyRumbleBuzzerApiStrikeLevelsFix(readFileSync(firstPath, 'utf8'));
      console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
    } else if (mode === '--apply' && firstPath) applyToFile(firstPath);
    else if (mode === '--restore' && firstPath && secondPath) restoreFile(firstPath, secondPath);
    else {
      console.error('Usage: --check <rumble-buzzer.php> | --apply <rumble-buzzer.php> | --restore <backup.bak> <rumble-buzzer.php>');
      process.exitCode = 2;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
