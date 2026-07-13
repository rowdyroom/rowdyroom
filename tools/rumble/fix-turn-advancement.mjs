#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_FIVE_PREREQUISITE = "wrongAnswer(state.currentTeam); return;} state.timer--; saveState();},1000);}";

const START_MATCH_BEFORE = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; const currentPlayers=state.currentTeam==='red'?state.redTeam:state.blueTeam; state.currentIndex=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(currentPlayers.length-1,0)); resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; renderPage(); saveState(false); startTimer();}";
const START_MATCH_AFTER = "function startMatch(){state.matchSize=Number(matchSize?.value||state.matchSize||1); state.redTeam=state.redTeam.map((x,i)=>x||`Red ${i+1}`); state.blueTeam=state.blueTeam.map((x,i)=>x||`Blue ${i+1}`); state.maxRounds=state.matchSize<=2?3:5; state.round=1; state.pool=0; state.redScore=0; state.blueScore=0; state.redStrikes=0; state.blueStrikes=0; state.timer=40; state.used=[]; state.revealed=[]; state.currentTeam=state.firstTeam||'red'; const currentPlayers=state.currentTeam==='red'?state.redTeam:state.blueTeam; state.currentIndex=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(currentPlayers.length-1,0)); state.turnIndexes={red:0,blue:0}; state.turnIndexes[state.currentTeam]=state.currentIndex; syncCurrentTurn(); resetRowdyRushBonusForMatch(); pickQuestion(); state.page='game'; renderPage(); saveState(false); startTimer();}";

const NEXT_QUESTION_BEFORE = "function nextQuestion(){pickQuestion(); state.timer=40; state.pool=0; saveState(); startTimer();}";
const NEXT_QUESTION_AFTER = "function nextQuestion(){pickQuestion(); state.pool=0; advanceCurrentPlayer(); saveState(); startTimer();}";

const REVEAL_BEFORE = "function revealAnswer(i){if(!state.currentQuestion || state.revealed.includes(i)) return; state.revealed.push(i); state.pool += Number(state.currentQuestion.points[i]||0); saveState(); if(state.revealed.length===state.currentQuestion.answers.length) setTimeout(()=>giftOverlay('BOARD CLEARED','AWARD THE POOL'),300);}";
const TURN_HELPERS_AND_REVEAL_AFTER = `function turnPlayers(team=state.currentTeam){
  const players=(team==='red'?state.redTeam:state.blueTeam)||[];
  const active=players.filter(Boolean);
  if(active.length) return active;
  const count=Math.max(1,Number(state.matchSize)||1);
  return Array.from({length:count},(_,i)=>\`${team==='red'?'Red':'Blue'} \${i+1}\`);
}
function ensureTurnIndexes(){
  state.turnIndexes=state.turnIndexes||{red:0,blue:0};
  state.turnIndexes.red=Math.max(0,Number(state.turnIndexes.red)||0);
  state.turnIndexes.blue=Math.max(0,Number(state.turnIndexes.blue)||0);
}
function syncCurrentTurn(){
  ensureTurnIndexes();
  const players=turnPlayers(state.currentTeam);
  const index=state.turnIndexes[state.currentTeam]%players.length;
  state.turnIndexes[state.currentTeam]=index;
  state.currentIndex=index;
}
function setCurrentTeam(team){
  ensureTurnIndexes();
  state.currentTeam=team==='blue'?'blue':'red';
  syncCurrentTurn();
}
function advanceCurrentPlayer(){
  ensureTurnIndexes();
  const players=turnPlayers(state.currentTeam);
  state.turnIndexes[state.currentTeam]=(state.turnIndexes[state.currentTeam]+1)%players.length;
  syncCurrentTurn();
  state.timer=40;
}
function revealAnswer(i){if(!state.currentQuestion || state.revealed.includes(i)) return; state.revealed.push(i); state.pool += Number(state.currentQuestion.points[i]||0); if(state.revealed.length===state.currentQuestion.answers.length){pauseTimer(); saveState(); setTimeout(()=>giftOverlay('BOARD CLEARED','AWARD THE POOL'),300); return;} advanceCurrentPlayer(); saveState(); startTimer();}`;

const WRONG_BEFORE = "function wrongAnswer(team=state.currentTeam){if(team==='red') state.redStrikes++; else state.blueStrikes++; state.overlay='❌ STRIKE'; saveState(); setTimeout(()=>{state.overlay=null; saveState();},650);}";
const WRONG_AFTER = "function wrongAnswer(team=state.currentTeam){const answeringTeam=team==='blue'?'blue':'red'; setCurrentTeam(answeringTeam); if(answeringTeam==='red') state.redStrikes++; else state.blueStrikes++; const strikeCount=answeringTeam==='red'?state.redStrikes:state.blueStrikes; if(strikeCount>=3){const stealingTeam=answeringTeam==='red'?'blue':'red'; state.redStrikes=0; state.blueStrikes=0; ensureTurnIndexes(); state.turnIndexes[stealingTeam]=0; setCurrentTeam(stealingTeam); state.timer=40; state.overlay=`❌ THIRD STRIKE<br><span style=\"font-size:.55em\">${stealingTeam.toUpperCase()} TEAM TURN</span>`;}else{advanceCurrentPlayer(); state.overlay='❌ STRIKE';} saveState(); startTimer(); setTimeout(()=>{state.overlay=null; saveState();},650);}";

const END_ROUND_BEFORE = "function endRound(){state.round++; const matchComplete=state.round>state.maxRounds; if(matchComplete){const wt=winningTeam().toUpperCase(); state.overlay=`MATCH COMPLETE<br><span style=\"font-size:.45em\">${wt} TEAM WINS</span><br><span style=\"font-size:.32em\">Run Rowdy Rush from Host Dashboard</span>`; state.round=1;} pickQuestion(); state.redStrikes=0; state.blueStrikes=0; saveState(); if(matchComplete) pauseTimer(); else startTimer(); setTimeout(()=>{state.overlay=null;saveState();},2400);}";
const END_ROUND_AFTER = "function endRound(){state.round++; const matchComplete=state.round>state.maxRounds; if(matchComplete){const wt=winningTeam().toUpperCase(); state.overlay=`MATCH COMPLETE<br><span style=\"font-size:.45em\">${wt} TEAM WINS</span><br><span style=\"font-size:.32em\">Run Rowdy Rush from Host Dashboard</span>`; state.round=1;}else{const firstTeam=state.firstTeam==='blue'?'blue':'red'; const roundStarter=state.round%2===0?(firstTeam==='red'?'blue':'red'):firstTeam; setCurrentTeam(roundStarter); advanceCurrentPlayer();} pickQuestion(); state.redStrikes=0; state.blueStrikes=0; saveState(); if(matchComplete) pauseTimer(); else startTimer(); setTimeout(()=>{state.overlay=null;saveState();},2400);}";

const RESTART_BEFORE = "function restartMatch(){state.round=1;state.pool=0;state.redScore=0;state.blueScore=0;state.redStrikes=0;state.blueStrikes=0;state.timer=40;state.revealed=[];state.currentTeam=state.firstTeam||'red';pickQuestion();startTimer();giftOverlay('MATCH RESTARTED','READY');saveState();}";
const RESTART_AFTER = "function restartMatch(){state.round=1;state.pool=0;state.redScore=0;state.blueScore=0;state.redStrikes=0;state.blueStrikes=0;state.timer=40;state.revealed=[];state.currentTeam=state.firstTeam||'red';state.turnIndexes={red:0,blue:0};syncCurrentTurn();pickQuestion();startTimer();giftOverlay('MATCH RESTARTED','READY');saveState();}";

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

export function applyRumbleTurnAdvancementFix(source) {
  const fullyPatched =
    source.includes(START_MATCH_AFTER) &&
    source.includes(NEXT_QUESTION_AFTER) &&
    source.includes(TURN_HELPERS_AND_REVEAL_AFTER) &&
    source.includes(WRONG_AFTER) &&
    source.includes(END_ROUND_AFTER) &&
    source.includes(RESTART_AFTER);

  if (fullyPatched) {
    return { source, changed: false, status: 'already-patched' };
  }

  if (!source.includes(ITEM_FIVE_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 5 before item 6. No file was changed.');
  }

  let patched = source;
  patched = replaceExactlyOnce(patched, START_MATCH_BEFORE, START_MATCH_AFTER, 'startMatch turn indexes');
  patched = replaceExactlyOnce(patched, NEXT_QUESTION_BEFORE, NEXT_QUESTION_AFTER, 'nextQuestion turn advancement');
  patched = replaceExactlyOnce(patched, REVEAL_BEFORE, TURN_HELPERS_AND_REVEAL_AFTER, 'correct-answer advancement');
  patched = replaceExactlyOnce(patched, WRONG_BEFORE, WRONG_AFTER, 'wrong-answer advancement');
  patched = replaceExactlyOnce(patched, END_ROUND_BEFORE, END_ROUND_AFTER, 'round-start team advancement');
  patched = replaceExactlyOnce(patched, RESTART_BEFORE, RESTART_AFTER, 'restart turn indexes');

  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleTurnAdvancementFix(original);

  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }

  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-turn-advancement-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.turn-advancement-fix.tmp`;

  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);

  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: correct, wrong, timer-expiry, question, third-strike, and round transitions advance the expected player or team.');
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
  const result = applyRumbleTurnAdvancementFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-turn-advancement.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-turn-advancement.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-turn-advancement.mjs --restore <backup.bak> <index.html>');
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
