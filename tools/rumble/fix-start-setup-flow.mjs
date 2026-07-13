#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const FOCUS_FIX_PREREQUISITE = 'function saveState(shouldRender=true){localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); if(channel) channel.postMessage(state); if(shouldRender) render();}';
const GO_SETUP_BEFORE = "function goSetup(){state.page='setup'; renderTeamInputs(); saveState(); location.hash='';}";
const GO_SETUP_AFTER = "function goSetup(){state.page='setup'; location.hash=''; renderPage(); saveState(false);}";

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

export function applyRumbleStartSetupFix(source) {
  if (source.includes(GO_SETUP_AFTER)) {
    return { source, changed: false, status: 'already-patched' };
  }

  if (!source.includes(FOCUS_FIX_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply repair item 1 (setup input focus) before repair item 2. No file was changed.');
  }

  const count = countOccurrences(source, GO_SETUP_BEFORE);
  if (count !== 1) {
    throw new Error(`goSetup: expected exactly 1 match, found ${count}. No file was changed.`);
  }

  return {
    source: source.replace(GO_SETUP_BEFORE, GO_SETUP_AFTER),
    changed: true,
    status: 'patched',
  };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleStartSetupFix(original);

  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }

  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-start-setup-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.start-setup-fix.tmp`;

  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);

  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: START RUMBLE now routes the visible page to setup before saving state.');
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
  const result = applyRumbleStartSetupFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-start-setup-flow.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-start-setup-flow.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-start-setup-flow.mjs --restore <backup.bak> <index.html>');
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
