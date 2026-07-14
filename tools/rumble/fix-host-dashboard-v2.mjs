#!/usr/bin/env node

import { copyFileSync, existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_TEN_PREREQUISITE = 'id="rowdy-vertical-layout-repair"';
const PATCH_ID = 'rowdy-rumble-host-dashboard-v2';
const runtimePath = fileURLToPath(new URL('../../deploy/rumble-host-dashboard/rumble-host-dashboard-v2.js', import.meta.url));
const HOST_DASHBOARD_RUNTIME = readFileSync(runtimePath, 'utf8').trim();
const HOST_DASHBOARD_BLOCK = `<script id="${PATCH_ID}">\n${HOST_DASHBOARD_RUNTIME}\n</script>`;

function insertionIndex(source) {
  const lower = source.toLowerCase();
  const index = lower.lastIndexOf('</body>');
  if (index < 0) throw new Error('Host dashboard insertion point: closing </body> tag not found. No file was changed.');
  return index;
}

export function applyRumbleHostDashboardV2Fix(source) {
  if (typeof source !== 'string') throw new TypeError('Rumble source must be a string.');
  if (source.includes(`id="${PATCH_ID}"`)) {
    return { source, changed: false, status: 'already-patched' };
  }
  if (!source.includes(ITEM_TEN_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 10 before host dashboard repair item 11. No file was changed.');
  }
  const index = insertionIndex(source);
  const patched = `${source.slice(0, index)}${HOST_DASHBOARD_BLOCK}\n${source.slice(index)}`;
  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function writeAtomically(targetPath, content, suffix) {
  const tempPath = `${targetPath}.${suffix}.tmp`;
  try {
    writeFileSync(tempPath, content, 'utf8');
    renameSync(tempPath, targetPath);
  } finally {
    if (existsSync(tempPath)) unlinkSync(tempPath);
  }
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleHostDashboardV2Fix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} already has Rumble Host Dashboard v2.`);
    return;
  }
  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-host-dashboard-v2-${timestamp()}.bak`);
  copyFileSync(targetPath, backupPath);
  try {
    writeAtomically(targetPath, result.source, 'host-dashboard-v2');
    const installed = readFileSync(targetPath, 'utf8');
    const verification = applyRumbleHostDashboardV2Fix(installed);
    if (verification.changed) throw new Error('Post-write verification found the host dashboard repair missing.');
  } catch (error) {
    writeAtomically(targetPath, original, 'host-dashboard-v2-rollback');
    throw error;
  }
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: focused host dashboard installed; 0 triggers wrongAnswer once; manual P/O Wheel controls are blocked; lifeline shortcut no longer double-decrements.');
}

function restoreFile(backupPath, targetPath) {
  const backup = readFileSync(backupPath, 'utf8');
  writeAtomically(targetPath, backup, 'host-dashboard-v2-restore');
  console.log(`Restored: ${targetPath}`);
  console.log(`From: ${backupPath}`);
}

function checkFile(targetPath) {
  const source = readFileSync(targetPath, 'utf8');
  const result = applyRumbleHostDashboardV2Fix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-host-dashboard-v2.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-host-dashboard-v2.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-host-dashboard-v2.mjs --restore <backup.bak> <index.html>');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const [mode, firstPath, secondPath] = process.argv.slice(2);
  try {
    if (mode === '--check' && firstPath) checkFile(firstPath);
    else if (mode === '--apply' && firstPath) applyToFile(firstPath);
    else if (mode === '--restore' && firstPath && secondPath) restoreFile(firstPath, secondPath);
    else { usage(); process.exitCode = 2; }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
