#!/usr/bin/env node

import { copyFileSync, existsSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { applyRumbleSetupFocusFix } from './fix-setup-focus.mjs';
import { applyRumbleStartSetupFix } from './fix-start-setup-flow.mjs';
import { applyRumbleCoinCarryoverFix } from './fix-coin-carryover.mjs';
import { applyRumbleCurrentTurnDisplayFix } from './fix-current-turn-display.mjs';
import { applyRumbleTimerLifecycleFix } from './fix-timer-lifecycle.mjs';
import { applyRumbleTurnAdvancementFix } from './fix-turn-advancement.mjs';
import { applyRumbleWheelTriggerFix } from './fix-wheel-trigger.mjs';
import { applyRumbleBuzzerTriggerFix } from './fix-buzzer-trigger.mjs';
import { applyRumbleTvModeFix } from './fix-tv-mode.mjs';
import { applyRumbleBuiltInQuestionBankFix } from './fix-built-in-question-bank.mjs';
import { applyRumbleVerticalLayoutFix } from './fix-vertical-layout.mjs';

export const DEFAULT_REPAIRS = Object.freeze([
  { number: 1, name: 'setup-focus', apply: applyRumbleSetupFocusFix },
  { number: 2, name: 'start-setup-routing', apply: applyRumbleStartSetupFix },
  { number: 3, name: 'coin-carryover', apply: applyRumbleCoinCarryoverFix },
  { number: 4, name: 'current-turn-display', apply: applyRumbleCurrentTurnDisplayFix },
  { number: 5, name: 'timer-lifecycle', apply: applyRumbleTimerLifecycleFix },
  { number: 6, name: 'turn-advancement', apply: applyRumbleTurnAdvancementFix },
  { number: 7, name: 'wheel-trigger', apply: applyRumbleWheelTriggerFix },
  { number: 8, name: 'buzzer-trigger', apply: applyRumbleBuzzerTriggerFix },
  { number: 9, name: 'tv-mode', apply: applyRumbleTvModeFix },
  { number: 10, name: 'built-in-question-bank', apply: applyRumbleBuiltInQuestionBankFix },
  { number: 11, name: 'vertical-layout', apply: applyRumbleVerticalLayoutFix },
]);

function validateRepairs(repairs) {
  if (!Array.isArray(repairs) || repairs.length === 0) {
    throw new Error('At least one repair step is required.');
  }
  repairs.forEach((step, index) => {
    if (!step || typeof step.name !== 'string' || typeof step.apply !== 'function') {
      throw new Error(`Repair step ${index + 1} is invalid.`);
    }
  });
}

export function applyAllRumbleRepairs(source, repairs = DEFAULT_REPAIRS) {
  if (typeof source !== 'string') {
    throw new TypeError('Rumble source must be a string.');
  }
  validateRepairs(repairs);

  let working = source;
  const steps = [];

  for (const step of repairs) {
    const result = step.apply(working);
    if (!result || typeof result.source !== 'string') {
      throw new Error(`Repair ${step.name} returned an invalid result.`);
    }
    working = result.source;
    steps.push({
      number: step.number ?? steps.length + 1,
      name: step.name,
      changed: Boolean(result.changed),
      status: result.status || (result.changed ? 'patched' : 'already-patched'),
    });
  }

  for (const step of repairs) {
    const verification = step.apply(working);
    if (!verification || verification.changed || verification.source !== working) {
      throw new Error(`Repair verification failed after ${step.name}.`);
    }
  }

  return {
    source: working,
    changed: working !== source,
    changedCount: steps.filter((step) => step.changed).length,
    steps,
  };
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

export function installAllRumbleRepairs(targetPath, options = {}) {
  const repairs = options.repairs || DEFAULT_REPAIRS;
  const original = readFileSync(targetPath, 'utf8');
  const result = applyAllRumbleRepairs(original, repairs);

  if (!result.changed) {
    return {
      ...result,
      targetPath,
      backupPath: null,
      status: 'already-installed',
    };
  }

  const backupPath = options.backupPath || join(
    dirname(targetPath),
    `${basename(targetPath)}.before-all-rumble-repairs-${timestamp()}.bak`,
  );

  copyFileSync(targetPath, backupPath);

  try {
    writeAtomically(targetPath, result.source, 'all-rumble-repairs');
    const installed = readFileSync(targetPath, 'utf8');
    const verification = applyAllRumbleRepairs(installed, repairs);
    if (verification.changed || verification.changedCount !== 0) {
      throw new Error('Post-write verification found unapplied Rumble repairs.');
    }
  } catch (error) {
    const backup = readFileSync(backupPath, 'utf8');
    writeAtomically(targetPath, backup, 'all-rumble-rollback');
    throw new Error(
      `Rumble installation failed and the original file was restored: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }

  return {
    ...result,
    targetPath,
    backupPath,
    status: 'installed',
  };
}

export function restoreRumbleBackup(backupPath, targetPath) {
  const backup = readFileSync(backupPath, 'utf8');
  writeAtomically(targetPath, backup, 'all-rumble-restore');
  return { backupPath, targetPath, status: 'restored' };
}

function summarize(result) {
  return {
    status: result.status || (result.changed ? 'needs-install' : 'verified'),
    changed: result.changed,
    changedCount: result.changedCount,
    targetPath: result.targetPath,
    backupPath: result.backupPath,
    steps: result.steps,
  };
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/apply-all-repairs.mjs --check <index.html>');
  console.error('  node tools/rumble/apply-all-repairs.mjs --verify <index.html>');
  console.error('  node tools/rumble/apply-all-repairs.mjs --apply <index.html>');
  console.error('  node tools/rumble/apply-all-repairs.mjs --restore <backup.bak> <index.html>');
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const [mode, firstPath, secondPath] = process.argv.slice(2);
  try {
    if ((mode === '--check' || mode === '--verify') && firstPath) {
      const source = readFileSync(firstPath, 'utf8');
      const result = applyAllRumbleRepairs(source);
      console.log(JSON.stringify(summarize({ ...result, targetPath: firstPath }), null, 2));
      if (mode === '--verify' && result.changed) process.exitCode = 1;
    } else if (mode === '--apply' && firstPath) {
      const result = installAllRumbleRepairs(firstPath);
      console.log(JSON.stringify(summarize(result), null, 2));
    } else if (mode === '--restore' && firstPath && secondPath) {
      console.log(JSON.stringify(restoreRumbleBackup(firstPath, secondPath), null, 2));
    } else {
      usage();
      process.exitCode = 2;
    }
  } catch (error) {
    console.error(error instanceof Error ? error.message : String(error));
    process.exitCode = 1;
  }
}
