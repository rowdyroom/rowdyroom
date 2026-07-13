#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_FOUR_PREREQUISITE = "currentPlayerBox.textContent=`Turn: ${turnName} — ${turnTeam}`;";

const START_MATCH_BEFORE = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; const currentPlayers=state.currentTeam==='red'?state.redTeam:state.blueTeam; state.currentIndex=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(currentPlayers.length-1,0)); resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; renderPage(); saveState(false);}";
const START_MATCH_AFTER = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; const currentPlayers=state.currentTeam==='red'?state.redTeam:state.blueTeam; state.currentIndex=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(currentPlayers.length-1,0)); resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; renderPage(); saveState(false); startTimer();}";

const NEXT_QUESTION_BEFORE = "function nextQuestion(){pickQuestion(); state.timer=40; state.pool=0; saveState();}";
const NEXT_QUESTION_AFTER = "function nextQuestion(){pickQuestion(); state.timer=40; state.pool=0; saveState(); startTimer();}";

const END_ROUND_BEFORE = "function endRound(){state.round++; if(state.round>state.maxRounds){const wt=winningTeam().toUpperCase(); state.overlay=`MATCH COMPLETE<br><span style=\"font-size:.45em\">${wt} TEAM WINS</span><br><span style=\"font-size:.32em\">Run Rowdy Rush from Host Dashboard</span>`; state.round=1;} pickQuestion(); state.redStrikes=0; state.blueStrikes=0; saveState(); setTimeout(()=>{state.overlay=null;saveState();},2400);}";
const END_ROUND_AFTER = "function endRound(){state.round++; const matchComplete=state.round>state.maxRounds; if(matchComplete){const wt=winningTeam().toUpperCase(); state.overlay=`MATCH COMPLETE<br><span style=\"font-size:.45em\">${wt} TEAM WINS</span><br><span style=\"font-size:.32em\">Run Rowdy Rush from Host Dashboard</span>`; state.round=1;} pickQuestion(); state.redStrikes=0; state.blueStrikes=0; saveState(); if(matchComplete) pauseTimer(); else startTimer(); setTimeout(()=>{state.overlay=null;saveState();},2400);}";

const TIMER_BEFORE = "function startTimer(){clearInterval(timerInterval); timerInterval=setInterval(()=>{if(state.timer>0){state.timer--; saveState();}else clearInterval(timerInterval);},1000);}\nfunction pauseTimer(){clearInterval(timerInterval); timerInterval=null;}";
const TIMER_AFTER = "function startTimer(){clearInterval(timerInterval); if(!Number.isFinite(Number(state.timer))||Number(state.timer)<=0){state.timer=40; saveState();} timerInterval=setInterval(()=>{if(Number(state.timer)<=1){state.timer=0; pauseTimer(); wrongAnswer(state.currentTeam); return;} state.timer--; saveState();},1000);}\nfunction pauseTimer(){clearInterval(timerInterval); timerInterval=null;}";

const RESTART_BEFORE = "function restartMatch(){state.round=1;state.pool=0;state.redScore=0;state.blueScore=0;state.redStrikes=0;state.blueStrikes=0;state.timer=40;state.revealed=[];state.currentTeam=state.firstTeam||'red';pickQuestion();giftOverlay('MATCH RESTARTED','READY');saveState();}";
const RESTART_AFTER = "function restartMatch(){state.round=1;state.pool=0;state.redScore=0;state.blueScore=0;state.redStrikes=0;state.blueStrikes=0;state.timer=40;state.revealed=[];state.currentTeam=state.firstTeam||'red';pickQuestion();startTimer();giftOverlay('MATCH RESTARTED','READY');saveState();}";

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

export function applyRumbleTimerLifecycleFix(source) {
  const fullyPatched =
    source.includes(START_MATCH_AFTER) &&
    source.includes(NEXT_QUESTION_AFTER) &&
    source.includes(END_ROUND_AFTER) &&
    source.includes(TIMER_AFTER) &&
    source.includes(RESTART_AFTER);

  if (fullyPatched) {
    return { source, changed: false, status: 'already-patched' };
  }

  if (!source.includes(ITEM_FOUR_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 4 before item 5. No file was changed.');
  }

  let patched = source;
  patched = replaceExactlyOnce(patched, START_MATCH_BEFORE, START_MATCH_AFTER, 'startMatch timer start');
  patched = replaceExactlyOnce(patched, NEXT_QUESTION_BEFORE, NEXT_QUESTION_AFTER, 'nextQuestion timer reset');
  patched = replaceExactlyOnce(patched, END_ROUND_BEFORE, END_ROUND_AFTER, 'endRound timer reset');
  patched = replaceExactlyOnce(patched, TIMER_BEFORE, TIMER_AFTER, 'timer lifecycle');
  patched = replaceExactlyOnce(patched, RESTART_BEFORE, RESTART_AFTER, 'restartMatch timer reset');

  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleTimerLifecycleFix(original);

  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }

  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-timer-lifecycle-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.timer-lifecycle-fix.tmp`;

  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);

  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: the 40-second timer starts, pauses, resumes, resets, and calls wrongAnswer once at zero.');
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
  const result = applyRumbleTimerLifecycleFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-timer-lifecycle.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-timer-lifecycle.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-timer-lifecycle.mjs --restore <backup.bak> <index.html>');
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
