#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_THREE_PREREQUISITE = 'function showGame(){startMatch();}';
const DISPLAY_BEFORE = "currentPlayerBox.textContent='CURRENT: '+((state.currentTeam==='red'?state.redTeam:state.blueTeam)[state.currentIndex]||state.currentTeam.toUpperCase());";
const DISPLAY_AFTER = "const turnTeam=state.currentTeam==='red'?'Red Team':'Blue Team'; const turnPlayers=state.currentTeam==='red'?state.redTeam:state.blueTeam; const turnName=turnPlayers[state.currentIndex]||`${state.currentTeam==='red'?'Red':'Blue'} ${Number(state.currentIndex||0)+1}`; currentPlayerBox.textContent=`Turn: ${turnName} — ${turnTeam}`;";

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

export function applyRumbleCurrentTurnDisplayFix(source) {
  if (source.includes(DISPLAY_AFTER)) {
    return { source, changed: false, status: 'already-patched' };
  }

  if (!source.includes(ITEM_THREE_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 3 before item 4. No file was changed.');
  }

  const count = countOccurrences(source, DISPLAY_BEFORE);
  if (count !== 1) {
    throw new Error(`current player display: expected exactly 1 match, found ${count}. No file was changed.`);
  }

  return {
    source: source.replace(DISPLAY_BEFORE, DISPLAY_AFTER),
    changed: true,
    status: 'patched',
  };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleCurrentTurnDisplayFix(original);

  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }

  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-current-turn-display-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.current-turn-display-fix.tmp`;

  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);

  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: the game now displays Turn: Name — Team without changing turn state.');
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
  const result = applyRumbleCurrentTurnDisplayFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-current-turn-display.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-current-turn-display.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-current-turn-display.mjs --restore <backup.bak> <index.html>');
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
