#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_ONE_PREREQUISITE = "function saveState(shouldRender=true){localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); if(channel) channel.postMessage(state); if(shouldRender) render();}";
const ITEM_TWO_PREREQUISITE = "function goSetup(){state.page='setup'; location.hash=''; renderPage(); saveState(false);}";

const FLIP_BEFORE = "function flipForFirst(){setupCoin.classList.remove('flip'); setTimeout(()=>setupCoin.classList.add('flip'),20); state.firstTeam=Math.random()<.5?'red':'blue'; state.currentTeam=state.firstTeam; state.currentIndex=0; coinWinner.textContent=(state.firstTeam==='red'?'RED TEAM':'BLUE TEAM'); setTimeout(()=>{state.page='coin'; saveState();},950);}";
const FLIP_AFTER = "function flipForFirst(){setupCoin.classList.remove('flip'); setTimeout(()=>setupCoin.classList.add('flip'),20); state.firstTeam=Math.random()<.5?'red':'blue'; state.currentTeam=state.firstTeam; const firstPlayers=state.firstTeam==='red'?state.redTeam:state.blueTeam; state.currentIndex=Math.floor(Math.random()*Math.max(firstPlayers.length,1)); const firstPlayer=firstPlayers[state.currentIndex]||`${state.firstTeam==='red'?'Red':'Blue'} ${state.currentIndex+1}`; coinWinner.textContent=(state.firstTeam==='red'?'RED TEAM':'BLUE TEAM')+' — '+firstPlayer; setTimeout(()=>{state.page='coin'; renderPage(); saveState(false);},950);}";

const START_BEFORE = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; saveState();}";
const START_AFTER = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; const currentPlayers=state.currentTeam==='red'?state.redTeam:state.blueTeam; state.currentIndex=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(currentPlayers.length-1,0)); resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; renderPage(); saveState(false);}";

const SHOW_GAME_BEFORE = "function showGame(){state.page='game'; if(!state.currentQuestion) pickQuestion(); saveState(); location.hash='';}";
const SHOW_GAME_AFTER = "function showGame(){startMatch();}";

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

export function applyRumbleCoinCarryoverFix(source) {
  const fullyPatched =
    source.includes(FLIP_AFTER) &&
    source.includes(START_AFTER) &&
    source.includes(SHOW_GAME_AFTER);

  if (fullyPatched) {
    return { source, changed: false, status: 'already-patched' };
  }

  if (!source.includes(ITEM_ONE_PREREQUISITE) || !source.includes(ITEM_TWO_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 and 2 before item 3. No file was changed.');
  }

  let patched = source;
  patched = replaceExactlyOnce(patched, FLIP_BEFORE, FLIP_AFTER, 'flipForFirst');
  patched = replaceExactlyOnce(patched, START_BEFORE, START_AFTER, 'startMatch');
  patched = replaceExactlyOnce(patched, SHOW_GAME_BEFORE, SHOW_GAME_AFTER, 'showGame');

  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleCoinCarryoverFix(original);

  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }

  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-coin-carryover-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.coin-carryover-fix.tmp`;

  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);

  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: coin winner team and selected first player now carry into initialized game state.');
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
  const result = applyRumbleCoinCarryoverFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-coin-carryover.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-coin-carryover.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-coin-carryover.mjs --restore <backup.bak> <index.html>');
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
