#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SAVE_STATE_BEFORE = 'function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); if(channel) channel.postMessage(state); render();}';
const SAVE_STATE_AFTER = 'function saveState(shouldRender=true){localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); if(channel) channel.postMessage(state); if(shouldRender) render();}';

const RED_INPUT_BEFORE = 'oninput="state.redTeam[${i}]=this.value; saveState()">';
const RED_INPUT_AFTER = 'oninput="state.redTeam[${i}]=this.value; saveState(false)">';
const BLUE_INPUT_BEFORE = 'oninput="state.blueTeam[${i}]=this.value; saveState()">';
const BLUE_INPUT_AFTER = 'oninput="state.blueTeam[${i}]=this.value; saveState(false)">';

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

function replaceExactlyOnce(source, before, after, label) {
  const count = countOccurrences(source, before);
  if (count !== 1) {
    throw new Error(`${label}: expected exactly 1 match, found ${count}. No file was changed.`);
  }
  return source.replace(before, after);
}

export function applyRumbleSetupFocusFix(source) {
  const fullyPatched =
    source.includes(SAVE_STATE_AFTER) &&
    source.includes(RED_INPUT_AFTER) &&
    source.includes(BLUE_INPUT_AFTER);

  if (fullyPatched) {
    return { source, changed: false, status: 'already-patched' };
  }

  let patched = source;
  patched = replaceExactlyOnce(patched, SAVE_STATE_BEFORE, SAVE_STATE_AFTER, 'saveState');
  patched = replaceExactlyOnce(patched, RED_INPUT_BEFORE, RED_INPUT_AFTER, 'red player input');
  patched = replaceExactlyOnce(patched, BLUE_INPUT_BEFORE, BLUE_INPUT_AFTER, 'blue player input');

  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleSetupFocusFix(original);

  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }

  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-focus-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.focus-fix.tmp`;

  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);

  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: setup player inputs now persist without triggering a full render on each keystroke.');
}

function restoreFile(backupPath, targetPath) {
  const backup = readFileSync(backupPath, 'utf8');
  const tempPath = `${targetPath}.restore.tmp`;
  writeFileSync(tempPath, backup, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Restored: ${targetPath}`);
  console.log(`From: ${backupPath}`);
}

function checkFile(targetPath) {
  const source = readFileSync(targetPath, 'utf8');
  const result = applyRumbleSetupFocusFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-setup-focus.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-setup-focus.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-setup-focus.mjs --restore <backup.bak> <index.html>');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const [mode, firstPath, secondPath] = process.argv.slice(2);
  try {
    if (mode === '--check' && firstPath) checkFile(firstPath);
    else if (mode === '--apply' && firstPath) applyToFile(firstPath);
    else if (mode === '--restore' && firstPath && secondPath) restoreFile(firstPath, secondPath);
    else {
      usage();
      process.exitCode = 2;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
