#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_EIGHT_PREREQUISITE = 'function buzzerStrikeEvent(count){';
const BODY_MARKER = '</body>\n</html>';
const LEGACY_IDS = [
  'bulkQuestions',
  'loadQuestionsBtn',
  'clearQuestionsBtn',
  'questionCount',
  'questionFile',
  'questionUpload',
];

const BUILT_IN_ONLY_BLOCK = `<script id="rowdy-built-in-question-bank-repair">
(function(){
  const LEGACY_IDS=['bulkQuestions','loadQuestionsBtn','clearQuestionsBtn','questionCount','questionFile','questionUpload'];
  const LEGACY_SELECTORS=['[data-question-upload]','[data-question-bank-upload]','.question-upload','.question-bank-upload'];

  function isLegacyQuestionHeading(element){
    return /^question bank(?:\\s*\\(max\\s*2000\\))?$/i.test(String(element?.textContent||'').trim());
  }
  function isLegacyQuestionButton(element){
    return /^(load questions|clear questions)$/i.test(String(element?.textContent||'').trim());
  }
  function onlyContainsLegacyControls(container){
    if(!container||container===document.body||container.id==='setupPage') return false;
    const controls=[...container.querySelectorAll('input,textarea,button,select')];
    return controls.length>0&&controls.every(control=>
      LEGACY_IDS.includes(control.id)||
      isLegacyQuestionButton(control)||
      control.matches?.(LEGACY_SELECTORS.join(','))
    );
  }
  function removeLegacyQuestionUploadUi(){
    const candidates=new Set();
    LEGACY_IDS.forEach(id=>{
      const element=document.getElementById(id);
      if(element) candidates.add(element);
    });
    document.querySelectorAll(LEGACY_SELECTORS.join(',')).forEach(element=>candidates.add(element));
    document.querySelectorAll('h1,h2,h3,h4,h5,h6,legend').forEach(element=>{
      if(isLegacyQuestionHeading(element)) candidates.add(element);
    });
    document.querySelectorAll('button').forEach(element=>{
      if(isLegacyQuestionButton(element)) candidates.add(element);
    });
    document.querySelectorAll('textarea').forEach(element=>{
      const signature=(element.placeholder||'')+' '+(element.value||'');
      if(/question\\s*\\|\\s*answer1/i.test(signature)) candidates.add(element);
    });

    const removableContainers=new Set();
    candidates.forEach(element=>{
      let parent=element.parentElement;
      while(parent&&parent!==document.body&&parent.id!=='setupPage'){
        if(onlyContainsLegacyControls(parent)) removableContainers.add(parent);
        parent=parent.parentElement;
      }
    });
    [...removableContainers]
      .filter(container=>![...removableContainers].some(other=>other!==container&&other.contains(container)))
      .forEach(container=>container.remove());
    candidates.forEach(element=>{if(element.isConnected) element.remove();});
  }

  window.ROWDY_QUESTION_MODE='built_in_only';
  window.removeLegacyQuestionUploadUi=removeLegacyQuestionUploadUi;
  removeLegacyQuestionUploadUi();
  if(typeof MutationObserver==='function'){
    const observer=new MutationObserver(removeLegacyQuestionUploadUi);
    observer.observe(document.documentElement,{childList:true,subtree:true});
    window.rowdyQuestionBankObserver=observer;
  }
})();
</script>`;

function assertBuiltInQuestionBank(source) {
  if (!/\b(?:const|let|var)\s+QUESTION_BANK\s*=\s*\[/.test(source)) {
    throw new Error('Built-in QUESTION_BANK is missing. No file was changed.');
  }
  const pickPattern = /function\s+pickQuestion\s*\(\s*\)\s*\{\s*let\s+available\s*=\s*QUESTION_BANK\.map\(\(_,+\s*i\)\s*=>\s*i\)\.filter\(i\s*=>\s*!state\.used\.includes\(i\)\)/;
  if (!pickPattern.test(source)) {
    throw new Error('Random non-repeating pickQuestion implementation is missing or unexpected. No file was changed.');
  }
  if (!/if\s*\(\s*!available\.length\s*\)\s*\{\s*state\.used\s*=\s*\[\]/.test(source)) {
    throw new Error('Question-bank exhaustion reset is missing or unexpected. No file was changed.');
  }
}

function stripElementById(source, id) {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const paired = new RegExp(`<([a-zA-Z][\\w:-]*)\\b(?=[^>]*\\bid=(["'])${escaped}\\2)[^>]*>[\\s\\S]*?<\\/\\1\\s*>`, 'gi');
  const selfClosing = new RegExp(`<([a-zA-Z][\\w:-]*)\\b(?=[^>]*\\bid=(["'])${escaped}\\2)[^>]*\\/?>`, 'gi');
  return source.replace(paired, '').replace(selfClosing, '');
}

function stripLegacyStaticUi(source) {
  let cleaned = source;
  for (const id of LEGACY_IDS) cleaned = stripElementById(cleaned, id);
  cleaned = cleaned.replace(
    /<h([1-6])\b[^>]*>\s*Question Bank(?:\s*\(Max\s*2000\))?\s*<\/h\1\s*>/gi,
    '',
  );
  cleaned = cleaned.replace(
    /<legend\b[^>]*>\s*Question Bank(?:\s*\(Max\s*2000\))?\s*<\/legend\s*>/gi,
    '',
  );
  return cleaned;
}

export function applyRumbleBuiltInQuestionBankFix(source) {
  if (source.includes('id="rowdy-built-in-question-bank-repair"')) {
    return { source, changed: false, status: 'already-patched' };
  }
  if (!source.includes(ITEM_EIGHT_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 8 before item 9. No file was changed.');
  }
  assertBuiltInQuestionBank(source);

  const markerCount = source.split(BODY_MARKER).length - 1;
  if (markerCount !== 1) {
    throw new Error(`Question-bank guard insertion point: expected exactly 1 match, found ${markerCount}. No file was changed.`);
  }

  const stripped = stripLegacyStaticUi(source);
  const patched = stripped.replace(BODY_MARKER, `${BUILT_IN_ONLY_BLOCK}\n${BODY_MARKER}`);
  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleBuiltInQuestionBankFix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }

  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-built-in-question-bank-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.built-in-question-bank-fix.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: legacy question-import controls are removed while QUESTION_BANK and non-repeating random pickQuestion remain intact.');
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
  const result = applyRumbleBuiltInQuestionBankFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}

function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-built-in-question-bank.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-built-in-question-bank.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-built-in-question-bank.mjs --restore <backup.bak> <index.html>');
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
