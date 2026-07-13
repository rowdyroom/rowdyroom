#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_SIX_PREREQUISITE = "state.turnIndexes={red:0,blue:0}; state.turnIndexes[state.currentTeam]=state.currentIndex; syncCurrentTurn();";

const PUNCH_BEFORE = `function punchAttack(){
  const effects=currentStrikeCount()>=2?['5 SECOND TIMER','SKIP TURN','MISS']:['5 SECOND TIMER','SKIP TURN','MISS','POWER PUNCH'];
  const result=effects[Math.floor(Math.random()*effects.length)];
  state.punchLog=(state.punchLog||[]).concat([result]).slice(-10);
  if(result==='5 SECOND TIMER'){
    state.timer=5; startTimer(); giftOverlay('🥊 PUNCH RESULT','5 SECOND ANSWER TIMER');
  } else if(result==='SKIP TURN') {
    skipCurrentTurn();
  } else if(result==='MISS') {
    addStrikeToCurrent('MISS');
  } else {
    powerPunchAttack(true);
  }
  saveState();
}`;

const WHEEL_HELPERS_AND_PUNCH_AFTER = `function normalizeWheelResultKey(value){
  return String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
}
function wheelEffectFromKey(value){
  const key=normalizeWheelResultKey(value);
  if(['5_second_timer','five_second_timer','five_seconds','five_second'].includes(key)) return '5 SECOND TIMER';
  if(['skip_turn','skip'].includes(key)) return 'SKIP TURN';
  if(['power_punch','power'].includes(key)) return 'POWER PUNCH';
  if(key==='miss') return 'MISS';
  return null;
}
function currentWheelPlayer(){
  const players=turnPlayers(state.currentTeam);
  return players[state.currentIndex]||players[0]||(state.currentTeam==='red'?'Red Player':'Blue Player');
}
function wheelApiBase(){
  return (window.ROWDY_WHEEL_API_URL||'/api/rumble-wheel.php').replace(/\\?$/,'');
}
async function readWheelState(){
  const response=await fetch(wheelApiBase()+'?action=state',{method:'GET',cache:'no-store'});
  const data=await response.json();
  if(!response.ok||!data.ok) throw new Error(data.error||'Wheel state request failed');
  return data.state||data;
}
async function requestWheelSpin(){
  const player=currentWheelPlayer();
  const payload={
    player_name:player,
    player_user_id:player,
    team:state.currentTeam==='red'?'fire':'ice'
  };
  const response=await fetch(wheelApiBase()+'?action=spin',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  const data=await response.json();
  if(!response.ok||!data.ok) throw new Error(data.error||'Wheel spin request failed');
  const spinState=data.state||data;
  let resultKey=spinState.result_key||data.result_key||data.result||'';
  if(!resultKey){
    const latest=await readWheelState();
    resultKey=latest.result_key||'';
  }
  return {resultKey,payload};
}
function applyPunchResult(result){
  state.punchLog=(state.punchLog||[]).concat([result]).slice(-10);
  if(result==='5 SECOND TIMER'){
    state.timer=5; startTimer(); giftOverlay('🥊 PUNCH RESULT','5 SECOND ANSWER TIMER');
  } else if(result==='SKIP TURN') {
    skipCurrentTurn();
  } else if(result==='MISS') {
    addStrikeToCurrent('MISS');
  } else {
    powerPunchAttack(true);
  }
  saveState();
}
async function punchAttack(){
  const fallbackEffects=currentStrikeCount()>=2?['5 SECOND TIMER','SKIP TURN','MISS']:['5 SECOND TIMER','SKIP TURN','MISS','POWER PUNCH'];
  let result=null;
  try{
    const wheel=await requestWheelSpin();
    result=wheelEffectFromKey(wheel.resultKey);
    state.wheelSyncError='';
  }catch(error){
    state.wheelSyncError=error instanceof Error?error.message:String(error);
  }
  if(!result) result=fallbackEffects[Math.floor(Math.random()*fallbackEffects.length)];
  applyPunchResult(result);
}`;

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

export function applyRumbleWheelTriggerFix(source) {
  const fullyPatched =
    source.includes('async function requestWheelSpin()') &&
    source.includes("wheelApiBase()+'?action=spin'") &&
    source.includes('async function punchAttack()') &&
    source.includes('applyPunchResult(result);');

  if (fullyPatched) {
    return { source, changed: false, status: 'already-patched' };
  }

  if (!source.includes(ITEM_SIX_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 6 before item 7. No file was changed.');
  }

  const patched = replaceExactlyOnce(source, PUNCH_BEFORE, WHEEL_HELPERS_AND_PUNCH_AFTER, 'punch wheel trigger');
  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleWheelTriggerFix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }

  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-wheel-trigger-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.wheel-trigger-fix.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: Punch Wheel posts the active player/team to action=spin and applies the returned result_key in the game.');
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
  const result = applyRumbleWheelTriggerFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-wheel-trigger.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-wheel-trigger.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-wheel-trigger.mjs --restore <backup.bak> <index.html>');
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
