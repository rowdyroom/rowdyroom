#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_NINE_PREREQUISITE = 'id="rowdy-built-in-question-bank-repair"';
const BODY_MARKER = '</body>\n</html>';
const HEAD_MARKER = '<head>';
const VIEWPORT_CONTENT = 'width=device-width, initial-scale=1, viewport-fit=cover';

const VERTICAL_LAYOUT_BLOCK = `<style id="rowdy-vertical-layout-repair">
:root{
  --rr-safe-top:env(safe-area-inset-top,0px);
  --rr-safe-right:env(safe-area-inset-right,0px);
  --rr-safe-bottom:env(safe-area-inset-bottom,0px);
  --rr-safe-left:env(safe-area-inset-left,0px);
  --rr-viewport-height:100dvh;
}
html.rowdy-rumble-responsive,html.rowdy-rumble-responsive body{
  width:100%;
  max-width:100%;
  min-height:100%;
  overflow-x:hidden;
}
html.rowdy-rumble-responsive body{
  min-height:var(--rr-viewport-height);
  text-rendering:optimizeLegibility;
  -webkit-font-smoothing:antialiased;
}
html.rowdy-rumble-responsive #app{
  width:100%;
  max-width:100%;
  min-height:var(--rr-viewport-height);
}
html.rowdy-rumble-responsive #app>section.hidden{
  display:none!important;
}
html.rowdy-rumble-responsive button,
html.rowdy-rumble-responsive input,
html.rowdy-rumble-responsive select,
html.rowdy-rumble-responsive textarea{
  max-width:100%;
  min-width:0;
  touch-action:manipulation;
}
html.rowdy-rumble-responsive #questionDisplay,
html.rowdy-rumble-responsive .answerText,
html.rowdy-rumble-responsive #currentPlayerBox,
html.rowdy-rumble-responsive #strikesBox{
  overflow-wrap:anywhere;
  word-break:normal;
}
@media (orientation:portrait),(max-width:700px),(max-aspect-ratio:3/4){
  html.rowdy-rumble-responsive body{
    overflow-y:auto;
  }
  html.rowdy-rumble-responsive #introPage:not(.hidden),
  html.rowdy-rumble-responsive #setupPage:not(.hidden),
  html.rowdy-rumble-responsive #coinPage:not(.hidden),
  html.rowdy-rumble-responsive #gamePage:not(.hidden),
  html.rowdy-rumble-responsive #hostPage:not(.hidden){
    box-sizing:border-box;
    width:100%;
    max-width:720px;
    min-height:var(--rr-viewport-height);
    margin:0 auto;
    padding:
      calc(12px + var(--rr-safe-top))
      calc(12px + var(--rr-safe-right))
      calc(14px + var(--rr-safe-bottom))
      calc(12px + var(--rr-safe-left));
    overflow-x:hidden;
    overflow-y:auto;
  }
  html.rowdy-rumble-responsive #gamePage:not(.hidden){
    display:flex;
    flex-direction:column;
    justify-content:flex-start;
    gap:clamp(8px,1.1vh,16px);
  }
  html.rowdy-rumble-responsive #gamePage>*,
  html.rowdy-rumble-responsive #setupPage>*,
  html.rowdy-rumble-responsive #hostPage>*{
    min-width:0;
    max-width:100%;
  }
  html.rowdy-rumble-responsive #gamePage .game-grid,
  html.rowdy-rumble-responsive #gamePage .gameGrid,
  html.rowdy-rumble-responsive #gamePage .score-grid,
  html.rowdy-rumble-responsive #gamePage .scoreGrid,
  html.rowdy-rumble-responsive #gamePage .team-grid,
  html.rowdy-rumble-responsive #gamePage .teamGrid,
  html.rowdy-rumble-responsive #gamePage .top-grid,
  html.rowdy-rumble-responsive #gamePage .topGrid,
  html.rowdy-rumble-responsive #setupPage .team-grid,
  html.rowdy-rumble-responsive #setupPage .teamGrid,
  html.rowdy-rumble-responsive #hostDashboard{
    display:grid!important;
    grid-template-columns:minmax(0,1fr)!important;
    gap:clamp(8px,1.1vh,14px)!important;
  }
  html.rowdy-rumble-responsive #redInputs,
  html.rowdy-rumble-responsive #blueInputs{
    display:grid;
    grid-template-columns:minmax(0,1fr);
    gap:8px;
  }
  html.rowdy-rumble-responsive #roundDisplay,
  html.rowdy-rumble-responsive #timerDisplay,
  html.rowdy-rumble-responsive #poolDisplay{
    font-size:clamp(1rem,4.2vw,1.45rem)!important;
    line-height:1.1;
    white-space:normal;
  }
  html.rowdy-rumble-responsive #redScore,
  html.rowdy-rumble-responsive #blueScore{
    font-size:clamp(2rem,10vw,4rem)!important;
    line-height:1;
  }
  html.rowdy-rumble-responsive #questionDisplay{
    width:100%;
    margin:0;
    padding:clamp(10px,1.5vh,18px);
    font-size:clamp(1.35rem,6.2vw,2.35rem)!important;
    line-height:1.14;
    text-align:center;
  }
  html.rowdy-rumble-responsive #answersDisplay{
    width:100%;
    display:grid!important;
    grid-template-columns:minmax(0,1fr)!important;
    gap:clamp(7px,1vh,12px)!important;
  }
  html.rowdy-rumble-responsive .answerSlot{
    box-sizing:border-box;
    width:100%;
    min-height:clamp(52px,7.2vh,78px);
    display:grid!important;
    grid-template-columns:clamp(28px,8vw,46px) minmax(0,1fr) auto!important;
    align-items:center;
    gap:clamp(7px,2vw,14px);
    padding:clamp(9px,1.2vh,14px) clamp(10px,3vw,18px)!important;
    border-radius:clamp(12px,3vw,20px);
  }
  html.rowdy-rumble-responsive .answerNum{
    font-size:clamp(1rem,4.8vw,1.55rem)!important;
    line-height:1;
  }
  html.rowdy-rumble-responsive .answerText{
    min-width:0;
    font-size:clamp(1.05rem,4.9vw,1.7rem)!important;
    line-height:1.12;
  }
  html.rowdy-rumble-responsive .answerPts{
    font-size:clamp(1rem,4.5vw,1.55rem)!important;
    line-height:1;
    white-space:nowrap;
  }
  html.rowdy-rumble-responsive #currentPlayerBox,
  html.rowdy-rumble-responsive #strikesBox{
    box-sizing:border-box;
    width:100%;
    min-height:48px;
    padding:10px 12px!important;
    font-size:clamp(1rem,4.6vw,1.55rem)!important;
    line-height:1.15;
    text-align:center;
  }
  html.rowdy-rumble-responsive button,
  html.rowdy-rumble-responsive input,
  html.rowdy-rumble-responsive select,
  html.rowdy-rumble-responsive textarea{
    min-height:44px;
    font-size:max(16px,clamp(1rem,4vw,1.25rem))!important;
  }
  html.rowdy-rumble-responsive button{
    padding:10px 12px!important;
    white-space:normal;
    line-height:1.1;
  }
  html.rowdy-rumble-responsive [id*="overlay" i],
  html.rowdy-rumble-responsive [class*="overlay" i]{
    box-sizing:border-box;
    max-width:100vw;
    max-height:var(--rr-viewport-height);
    overflow:auto;
    padding:
      calc(16px + var(--rr-safe-top))
      calc(14px + var(--rr-safe-right))
      calc(16px + var(--rr-safe-bottom))
      calc(14px + var(--rr-safe-left));
  }
}
@media (orientation:portrait) and (min-aspect-ratio:8/17) and (max-aspect-ratio:10/15){
  html.rowdy-rumble-responsive #gamePage:not(.hidden){
    max-width:min(100%,680px);
  }
}
@media (max-height:760px) and (orientation:portrait){
  html.rowdy-rumble-responsive #gamePage:not(.hidden){
    gap:6px;
  }
  html.rowdy-rumble-responsive #questionDisplay{
    padding:8px;
    font-size:clamp(1.15rem,5.5vw,1.8rem)!important;
  }
  html.rowdy-rumble-responsive .answerSlot{
    min-height:46px;
    padding:7px 9px!important;
  }
}
@media (prefers-reduced-motion:reduce){
  html.rowdy-rumble-responsive *,
  html.rowdy-rumble-responsive *::before,
  html.rowdy-rumble-responsive *::after{
    scroll-behavior:auto!important;
    animation-duration:.01ms!important;
    animation-iteration-count:1!important;
    transition-duration:.01ms!important;
  }
}
</style>
<script id="rowdy-vertical-layout-runtime">
(function(){
  function updateRowdyViewportHeight(){
    document.documentElement.style.setProperty('--rr-viewport-height',Math.max(window.innerHeight||0,320)+'px');
  }
  document.documentElement.classList.add('rowdy-rumble-responsive');
  updateRowdyViewportHeight();
  window.addEventListener('resize',updateRowdyViewportHeight,{passive:true});
  window.addEventListener('orientationchange',updateRowdyViewportHeight,{passive:true});
  if(window.visualViewport){
    window.visualViewport.addEventListener('resize',updateRowdyViewportHeight,{passive:true});
  }
  window.ROWDY_LAYOUT_MODE='responsive_9_16';
})();
</script>`;

function ensureViewportMeta(source) {
  const viewportPattern = /<meta\b[^>]*\bname=(["'])viewport\1[^>]*>/i;
  if (viewportPattern.test(source)) {
    return source.replace(
      viewportPattern,
      `<meta name="viewport" content="${VIEWPORT_CONTENT}">`,
    );
  }
  const count = source.split(HEAD_MARKER).length - 1;
  if (count !== 1) {
    throw new Error(`Viewport insertion point: expected exactly 1 <head> marker, found ${count}. No file was changed.`);
  }
  return source.replace(
    HEAD_MARKER,
    `${HEAD_MARKER}\n<meta name="viewport" content="${VIEWPORT_CONTENT}">`,
  );
}

export function applyRumbleVerticalLayoutFix(source) {
  if (source.includes('id="rowdy-vertical-layout-repair"')) {
    return { source, changed: false, status: 'already-patched' };
  }
  if (!source.includes(ITEM_NINE_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 9 before item 10. No file was changed.');
  }

  const markerCount = source.split(BODY_MARKER).length - 1;
  if (markerCount !== 1) {
    throw new Error(`Vertical layout insertion point: expected exactly 1 match, found ${markerCount}. No file was changed.`);
  }

  const withViewport = ensureViewportMeta(source);
  const patched = withViewport.replace(BODY_MARKER, `${VERTICAL_LAYOUT_BLOCK}\n${BODY_MARKER}`);
  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleVerticalLayoutFix(original);
  if (!result.changed) {
    console.log(`No change: ${targetPath} is already patched.`);
    return;
  }
  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-vertical-layout-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.vertical-layout-fix.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: portrait/narrow layouts use readable single-column game content, touch-sized controls, safe-area padding, and guarded viewport height.');
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
  const result = applyRumbleVerticalLayoutFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}
function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-vertical-layout.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-vertical-layout.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-vertical-layout.mjs --restore <backup.bak> <index.html>');
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
