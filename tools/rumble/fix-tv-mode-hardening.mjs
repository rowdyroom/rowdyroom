#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const TV_PREREQUISITE = 'id="rowdy-tv-mode-repair"';
const JOIN_BEFORE = "return window.ROWDY_TV_JOIN_URL||new URL('/companion/',location.origin).href;";
const JOIN_AFTER = "return window.ROWDY_TV_JOIN_URL||'https://rowdyroom.site/companion/';";

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

function assertProperTvMode(source) {
  const required = [
    '#tvPage{position:fixed;inset:0',
    "const TV_HASH='#tv';",
    "button.textContent='OPEN TV MODE';",
    "window.open(url.href,'rowdyRoomTvMode')",
    'tvCurrentPlayer',
    'tvNextPlayer',
    'tvFireQueue',
    'tvIceQueue',
    'tvRotatingBanner',
  ];
  for (const marker of required) {
    if (!source.includes(marker)) {
      throw new Error(`TV mode prerequisite missing: ${marker}. No file was changed.`);
    }
  }

  const tvBlockStart = source.indexOf(TV_PREREQUISITE);
  const markupStart = source.indexOf('page.innerHTML=`', tvBlockStart);
  const markupEnd = markupStart >= 0 ? source.indexOf('`;', markupStart + 16) : -1;
  if (markupStart < 0 || markupEnd < 0) {
    throw new Error('TV mode markup could not be verified. No file was changed.');
  }
  const markup = source.slice(markupStart + 16, markupEnd);
  if (/<button|host controls|rules panel|answer key/i.test(markup)) {
    throw new Error('TV mode contains host-only controls or answer content. No file was changed.');
  }
}

export function applyRumbleTvModeHardeningFix(source) {
  if (!source.includes(TV_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply the Rumble TV mode repair first. No file was changed.');
  }

  assertProperTvMode(source);

  if (source.includes(JOIN_AFTER)) {
    return { source, changed: false, status: 'already-patched' };
  }

  const count = countOccurrences(source, JOIN_BEFORE);
  if (count !== 1) {
    throw new Error(`TV Companion URL hardening: expected exactly 1 match, found ${count}. No file was changed.`);
  }

  return {
    source: source.replace(JOIN_BEFORE, JOIN_AFTER),
    changed: true,
    status: 'patched',
  };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleTvModeHardeningFix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} already has the production Companion URL and verified display-only TV mode.`);
    return;
  }
  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-tv-mode-hardening-${timestamp()}.bak`);
  const tempPath = `${targetPath}.tv-mode-hardening.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: #tv remains full-screen and display-only, and its QR now points to https://rowdyroom.site/companion/.');
}

function restoreFile(backupPath, targetPath) {
  const backup = readFileSync(backupPath, 'utf8');
  const tempPath = `${targetPath}.restore.tmp`;
  writeFileSync(tempPath, backup, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Restored: ${targetPath}`);
}

function checkFile(targetPath) {
  const source = readFileSync(targetPath, 'utf8');
  const result = applyRumbleTvModeHardeningFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const [mode, firstPath, secondPath] = process.argv.slice(2);
  try {
    if (mode === '--check' && firstPath) checkFile(firstPath);
    else if (mode === '--apply' && firstPath) applyToFile(firstPath);
    else if (mode === '--restore' && firstPath && secondPath) restoreFile(firstPath, secondPath);
    else {
      console.error('Usage: --check <index.html> | --apply <index.html> | --restore <backup.bak> <index.html>');
      process.exitCode = 2;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
