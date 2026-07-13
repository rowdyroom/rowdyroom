#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const BUZZER_PREREQUISITE = 'async function triggerBuzzerDisplay(';

const NORMALIZE_BEFORE = `function normalizeBuzzerKey(value){
  const key=String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  if(['strike','strike3','strike_3','third_strike'].includes(key)) return 'strike';
  if(['steal','stealopportunity','steal_opportunity'].includes(key)) return 'steal';
  if(['strike_steal','strikesteal','combo','third_strike_steal'].includes(key)) return 'strike_steal';
  return null;
}`;

const NORMALIZE_AFTER = `function normalizeBuzzerKey(value){
  const key=String(value||'').trim().toLowerCase().replace(/[^a-z0-9]+/g,'_').replace(/^_+|_+$/g,'');
  if(['strike1','strike_1','first_strike'].includes(key)) return 'strike_1';
  if(['strike2','strike_2','second_strike'].includes(key)) return 'strike_2';
  if(['strike','strike3','strike_3','third_strike'].includes(key)) return 'strike_3';
  if(['steal','stealopportunity','steal_opportunity'].includes(key)) return 'steal';
  if(['strike_steal','strikesteal','combo','third_strike_steal'].includes(key)) return 'strike_steal';
  return null;
}
function buzzerStrikeEvent(count){
  const strikeCount=Math.max(1,Math.min(3,Number(count)||1));
  return 'strike_'+strikeCount;
}`;

const PAYLOAD_BEFORE = `    event:buzzer,
    player_name:player,`;

const PAYLOAD_AFTER = `    event:buzzer,
    strike_count:buzzer==='strike_1'?1:buzzer==='strike_2'?2:buzzer==='strike_3'?3:null,
    player_name:player,`;

const WRONG_BEFORE = `function wrongAnswer(team=state.currentTeam){const answeringTeam=team==='blue'?'blue':'red'; setCurrentTeam(answeringTeam); const struckPlayer=currentBuzzerPlayer(answeringTeam); if(answeringTeam==='red') state.redStrikes++; else state.blueStrikes++; const strikeCount=answeringTeam==='red'?state.redStrikes:state.blueStrikes; if(strikeCount>=3){const stealingTeam=answeringTeam==='red'?'blue':'red'; fireBuzzerDisplay('strike_steal',answeringTeam,struckPlayer); state.redStrikes=0; state.blueStrikes=0; ensureTurnIndexes(); state.turnIndexes[stealingTeam]=0; setCurrentTeam(stealingTeam); state.timer=40; state.overlay=\`❌ THIRD STRIKE<br><span style="font-size:.55em">\${stealingTeam.toUpperCase()} TEAM TURN</span>\`;}else{advanceCurrentPlayer(); state.overlay='❌ STRIKE';} saveState(); startTimer(); setTimeout(()=>{state.overlay=null; saveState();},650);}`;

const WRONG_AFTER = `function wrongAnswer(team=state.currentTeam){const answeringTeam=team==='blue'?'blue':'red'; setCurrentTeam(answeringTeam); const struckPlayer=currentBuzzerPlayer(answeringTeam); if(answeringTeam==='red') state.redStrikes++; else state.blueStrikes++; const strikeCount=answeringTeam==='red'?state.redStrikes:state.blueStrikes; const strikeEvent=buzzerStrikeEvent(strikeCount); fireBuzzerDisplay(strikeEvent,answeringTeam,struckPlayer); if(strikeCount>=3){const stealingTeam=answeringTeam==='red'?'blue':'red'; const comboDelay=Math.max(0,Number(window.ROWDY_BUZZER_COMBO_DELAY_MS)||2500); setTimeout(()=>fireBuzzerDisplay('strike_steal',answeringTeam,struckPlayer),comboDelay); state.redStrikes=0; state.blueStrikes=0; ensureTurnIndexes(); state.turnIndexes[stealingTeam]=0; setCurrentTeam(stealingTeam); state.timer=40; state.overlay=\`❌ THIRD STRIKE<br><span style="font-size:.55em">\${stealingTeam.toUpperCase()} TEAM TURN</span>\`;}else{advanceCurrentPlayer(); state.overlay='❌ STRIKE';} saveState(); startTimer(); setTimeout(()=>{state.overlay=null; saveState();},650);}`;

const ADD_STRIKE_BEFORE = `function addStrikeToCurrent(label='STRIKE'){
  const struckTeam=state.currentTeam==='blue'?'blue':'red';
  const struckPlayer=currentBuzzerPlayer(struckTeam);
  if(struckTeam==='red') state.redStrikes++; else state.blueStrikes++;
  const strikeCount=struckTeam==='red'?state.redStrikes:state.blueStrikes;
  if(strikeCount>=3) fireBuzzerDisplay('strike',struckTeam,struckPlayer);
  state.overlay=\`❌ \${label}<br><span style="font-size:.55em">\${struckTeam.toUpperCase()} TEAM STRIKE</span>\`;
  saveState(); setTimeout(()=>{state.overlay=null; saveState();},1100);
}`;

const ADD_STRIKE_AFTER = `function addStrikeToCurrent(label='STRIKE'){
  const struckTeam=state.currentTeam==='blue'?'blue':'red';
  const struckPlayer=currentBuzzerPlayer(struckTeam);
  if(struckTeam==='red') state.redStrikes++; else state.blueStrikes++;
  const strikeCount=struckTeam==='red'?state.redStrikes:state.blueStrikes;
  if(strikeCount===1) fireBuzzerDisplay('strike_1',struckTeam,struckPlayer);
  else if(strikeCount===2) fireBuzzerDisplay('strike_2',struckTeam,struckPlayer);
  else fireBuzzerDisplay('strike',struckTeam,struckPlayer);
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

export function applyRumbleBuzzerStrikeLevelsFix(source) {
  const fullyPatched =
    source.includes("return 'strike_'+strikeCount;") &&
    source.includes("fireBuzzerDisplay('strike_1',struckTeam,struckPlayer)") &&
    source.includes("fireBuzzerDisplay('strike_2',struckTeam,struckPlayer)") &&
    source.includes("fireBuzzerDisplay(strikeEvent,answeringTeam,struckPlayer)") &&
    source.includes("window.ROWDY_BUZZER_COMBO_DELAY_MS");

  if (fullyPatched) {
    return { source, changed: false, status: 'already-patched' };
  }

  if (!source.includes(BUZZER_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply the Rumble buzzer trigger repair before strike-level support. No file was changed.');
  }

  let patched = source;
  patched = replaceExactlyOnce(patched, NORMALIZE_BEFORE, NORMALIZE_AFTER, 'buzzer strike-level normalization');
  patched = replaceExactlyOnce(patched, PAYLOAD_BEFORE, PAYLOAD_AFTER, 'buzzer strike-count payload');
  patched = replaceExactlyOnce(patched, WRONG_BEFORE, WRONG_AFTER, 'normal wrong-answer strike-level trigger');
  patched = replaceExactlyOnce(patched, ADD_STRIKE_BEFORE, ADD_STRIKE_AFTER, 'standalone strike-level trigger');
  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleBuzzerStrikeLevelsFix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} already supports Strike 1, Strike 2, and Strike 3.`);
    return;
  }
  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-buzzer-strike-levels-${timestamp()}.bak`);
  const tempPath = `${targetPath}.buzzer-strike-levels.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: Strike 1, Strike 2, and Strike 3 events now trigger externally; third-strike steal follows after a configurable delay.');
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
  const result = applyRumbleBuzzerStrikeLevelsFix(source);
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
