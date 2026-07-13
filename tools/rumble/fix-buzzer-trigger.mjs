#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_SEVEN_PREREQUISITE = "async function requestWheelSpin()";

const WRONG_BEFORE = "function wrongAnswer(team=state.currentTeam){const answeringTeam=team==='blue'?'blue':'red'; setCurrentTeam(answeringTeam); if(answeringTeam==='red') state.redStrikes++; else state.blueStrikes++; const strikeCount=answeringTeam==='red'?state.redStrikes:state.blueStrikes; if(strikeCount>=3){const stealingTeam=answeringTeam==='red'?'blue':'red'; state.redStrikes=0; state.blueStrikes=0; ensureTurnIndexes(); state.turnIndexes[stealingTeam]=0; setCurrentTeam(stealingTeam); state.timer=40; state.overlay=`❌ THIRD STRIKE<br><span style=\"font-size:.55em\">${stealingTeam.toUpperCase()} TEAM TURN</span>`;}else{advanceCurrentPlayer(); state.overlay='❌ STRIKE';} saveState(); startTimer(); setTimeout(()=>{state.overlay=null; saveState();},650);}";

const BUZZER_HELPERS_AND_WRONG_AFTER = `function normalizeBuzzerKey(value){
  const key=String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  if(['strike','strike3','strike_3','third_strike'].includes(key)) return 'strike';
  if(['steal','stealopportunity','steal_opportunity'].includes(key)) return 'steal';
  if(['strike_steal','strikesteal','combo','third_strike_steal'].includes(key)) return 'strike_steal';
  return null;
}
function currentBuzzerPlayer(team=state.currentTeam){
  const players=turnPlayers(team);
  const index=team===state.currentTeam?state.currentIndex:Number(state.turnIndexes?.[team]||0);
  return players[index]||players[0]||(team==='red'?'Red Player':'Blue Player');
}
function buzzerApiBase(){
  return (window.ROWDY_BUZZER_API_URL||'/api/rumble-buzzer.php').replace(/\\?$/,'');
}
async function postBuzzerAction(action,payload){
  const response=await fetch(buzzerApiBase()+'?action='+encodeURIComponent(action),{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify(payload)
  });
  const data=await response.json();
  if(!response.ok||!data.ok) throw new Error(data.error||'Buzzer request failed');
  return data.state||data;
}
async function triggerBuzzerDisplay(kind,team=state.currentTeam,player=currentBuzzerPlayer(team)){
  const buzzer=normalizeBuzzerKey(kind);
  if(!buzzer) throw new Error('Unknown buzzer event: '+String(kind||''));
  const payload={
    buzzer,
    buzzer_key:buzzer,
    result_key:buzzer,
    event:buzzer,
    player_name:player,
    player_user_id:player,
    team:team==='red'?'fire':'ice'
  };
  const configuredAction=window.ROWDY_BUZZER_API_ACTION||'trigger';
  try{
    const stateResult=await postBuzzerAction(configuredAction,payload);
    state.buzzerSyncError='';
    return {state:stateResult,payload,action:configuredAction};
  }catch(primaryError){
    if(configuredAction===buzzer) throw primaryError;
    const stateResult=await postBuzzerAction(buzzer,payload);
    state.buzzerSyncError='';
    return {state:stateResult,payload,action:buzzer};
  }
}
function fireBuzzerDisplay(kind,team=state.currentTeam,player=currentBuzzerPlayer(team)){
  return triggerBuzzerDisplay(kind,team,player).catch(error=>{
    state.buzzerSyncError=error instanceof Error?error.message:String(error);
    return null;
  });
}
function showStealOpportunity(team=state.currentTeam){
  const player=currentBuzzerPlayer(team);
  fireBuzzerDisplay('steal',team,player);
  giftOverlay('⚡ STEAL OPPORTUNITY',(team==='red'?'RED':'BLUE')+' TEAM');
}
function wrongAnswer(team=state.currentTeam){const answeringTeam=team==='blue'?'blue':'red'; setCurrentTeam(answeringTeam); const struckPlayer=currentBuzzerPlayer(answeringTeam); if(answeringTeam==='red') state.redStrikes++; else state.blueStrikes++; const strikeCount=answeringTeam==='red'?state.redStrikes:state.blueStrikes; if(strikeCount>=3){const stealingTeam=answeringTeam==='red'?'blue':'red'; fireBuzzerDisplay('strike_steal',answeringTeam,struckPlayer); state.redStrikes=0; state.blueStrikes=0; ensureTurnIndexes(); state.turnIndexes[stealingTeam]=0; setCurrentTeam(stealingTeam); state.timer=40; state.overlay=\`❌ THIRD STRIKE<br><span style=\"font-size:.55em\">\${stealingTeam.toUpperCase()} TEAM TURN</span>\`;}else{advanceCurrentPlayer(); state.overlay='❌ STRIKE';} saveState(); startTimer(); setTimeout(()=>{state.overlay=null; saveState();},650);}`;

const ADD_STRIKE_BEFORE = `function addStrikeToCurrent(label='STRIKE'){
  if(state.currentTeam==='red') state.redStrikes++; else state.blueStrikes++;
  state.overlay=\`❌ \${label}<br><span style="font-size:.55em">\${state.currentTeam.toUpperCase()} TEAM STRIKE</span>\`;
  saveState(); setTimeout(()=>{state.overlay=null; saveState();},1100);
}`;

const ADD_STRIKE_AFTER = `function addStrikeToCurrent(label='STRIKE'){
  const struckTeam=state.currentTeam==='blue'?'blue':'red';
  const struckPlayer=currentBuzzerPlayer(struckTeam);
  if(struckTeam==='red') state.redStrikes++; else state.blueStrikes++;
  const strikeCount=struckTeam==='red'?state.redStrikes:state.blueStrikes;
  if(strikeCount>=3) fireBuzzerDisplay('strike',struckTeam,struckPlayer);
  state.overlay=\`❌ \${label}<br><span style="font-size:.55em">\${struckTeam.toUpperCase()} TEAM STRIKE</span>\`;
  saveState(); setTimeout(()=>{state.overlay=null; saveState();},1100);
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

export function applyRumbleBuzzerTriggerFix(source) {
  const fullyPatched =
    source.includes('async function triggerBuzzerDisplay(') &&
    source.includes("fireBuzzerDisplay('strike_steal'") &&
    source.includes("fireBuzzerDisplay('strike',struckTeam,struckPlayer)") &&
    source.includes('function showStealOpportunity(');

  if (fullyPatched) {
    return { source, changed: false, status: 'already-patched' };
  }

  if (!source.includes(ITEM_SEVEN_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 7 before item 8. No file was changed.');
  }

  let patched = source;
  patched = replaceExactlyOnce(patched, WRONG_BEFORE, BUZZER_HELPERS_AND_WRONG_AFTER, 'wrong-answer buzzer trigger');
  patched = replaceExactlyOnce(patched, ADD_STRIKE_BEFORE, ADD_STRIKE_AFTER, 'standalone third-strike buzzer trigger');
  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleBuzzerTriggerFix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }
  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-buzzer-trigger-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.buzzer-trigger-fix.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: third strike, steal opportunity, and combined strike/steal events can trigger the external buzzer display without blocking game flow.');
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
  const result = applyRumbleBuzzerTriggerFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-buzzer-trigger.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-buzzer-trigger.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-buzzer-trigger.mjs --restore <backup.bak> <index.html>');
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
