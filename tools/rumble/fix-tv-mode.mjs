#!/usr/bin/env node

import { copyFileSync, readFileSync, renameSync, writeFileSync } from 'node:fs';
import { basename, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ITEM_EIGHT_PREREQUISITE = 'async function triggerBuzzerDisplay(';
const CLOSING_MARKER = '</script>\n</body>\n</html>';

const TV_MODE_BLOCK = `<script id="rowdy-tv-mode-repair">
(function(){
  const TV_HASH='#tv';
  const TV_STYLE_ID='rowdyTvModeStyles';
  const TV_PAGE_ID='tvPage';
  const TV_BANNERS_DEFAULT=[
    'LIVE KARAOKE • REAL VOTES • REAL COMMUNITY',
    'ROWDY ROOM RUMBLE • AUDIENCE-POWERED',
    'SING • COMPETE • VOTE • CONNECT'
  ];
  let tvBannerIndex=0;
  let tvBannerTimer=null;

  function tvJoinUrl(){
    return window.ROWDY_TV_JOIN_URL||new URL('/companion/',location.origin).href;
  }
  function tvQrImageUrl(){
    const joinUrl=tvJoinUrl();
    return window.ROWDY_TV_QR_IMAGE_URL||('https://api.qrserver.com/v1/create-qr-code/?size=520x520&margin=18&data='+encodeURIComponent(joinUrl));
  }
  function tvTeamLabel(team){return team==='blue'?'ICE':'FIRE';}
  function tvTeamClass(team){return team==='blue'?'ice':'fire';}
  function tvPlayers(team){
    const players=turnPlayers(team);
    return players.length?players:[team==='blue'?'Blue Player':'Red Player'];
  }
  function tvTeamRows(team){
    const players=tvPlayers(team);
    const activeIndex=team===state.currentTeam?Number(state.currentIndex||0):Number(state.turnIndexes?.[team]||0);
    return players.map((name,index)=>({name,index,active:team===state.currentTeam&&index===activeIndex}));
  }
  function tvCurrentPlayer(){
    const team=state.currentTeam==='blue'?'blue':'red';
    const players=tvPlayers(team);
    const index=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(players.length-1,0));
    return {team,name:players[index]||players[0]};
  }
  function tvNextPlayer(){
    const current=tvCurrentPlayer();
    const players=tvPlayers(current.team);
    const currentIndex=Math.min(Math.max(Number(state.currentIndex)||0,0),Math.max(players.length-1,0));
    const nextIndex=(currentIndex+1)%players.length;
    return {team:current.team,name:players[nextIndex]||players[0]};
  }
  function escapeTv(value){
    return String(value??'').replace(/[&<>"']/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
  }
  function ensureTvStyles(){
    if(document.getElementById(TV_STYLE_ID)) return;
    const style=document.createElement('style');
    style.id=TV_STYLE_ID;
    style.textContent=\`
      #tvPage{position:fixed;inset:0;z-index:99999;overflow:hidden;background:radial-gradient(circle at 50% -10%,#351064 0,#09010f 52%,#020104 100%);color:#fff;font-family:Arial,Helvetica,sans-serif}
      #tvPage.hidden{display:none!important}
      .rr-tv-shell{height:100%;display:grid;grid-template-rows:auto 1fr auto;gap:clamp(14px,2vh,28px);padding:clamp(18px,2.5vw,42px)}
      .rr-tv-header{text-align:center}.rr-tv-title{font-weight:1000;font-size:clamp(34px,5.6vw,86px);letter-spacing:.06em;text-shadow:0 0 24px #7c3aed;margin:0}.rr-tv-subtitle{font-size:clamp(17px,2vw,32px);font-weight:800;color:#d8c7ff;margin-top:6px}
      .rr-tv-main{min-height:0;display:grid;grid-template-columns:minmax(280px,.8fr) minmax(420px,1.4fr);gap:clamp(18px,2.5vw,42px);align-items:stretch}
      .rr-tv-card{border:2px solid rgba(190,140,255,.38);border-radius:30px;background:rgba(12,4,25,.78);box-shadow:0 18px 55px rgba(0,0,0,.46),inset 0 0 35px rgba(124,58,237,.09)}
      .rr-tv-join{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:clamp(18px,2vw,34px);text-align:center}.rr-tv-qr{width:min(42vh,92%);aspect-ratio:1;border-radius:24px;background:#fff;padding:12px;object-fit:contain}.rr-tv-join-title{font-size:clamp(26px,3.2vw,52px);font-weight:1000;margin:18px 0 4px;color:#ffd21f}.rr-tv-url{font-size:clamp(15px,1.35vw,24px);font-weight:800;overflow-wrap:anywhere;color:#fff}
      .rr-tv-live{display:grid;grid-template-rows:auto 1fr;gap:18px;padding:clamp(18px,2vw,34px);min-height:0}.rr-tv-now{display:grid;grid-template-columns:1fr 1fr;gap:14px}.rr-tv-now-box{border-radius:22px;padding:18px;background:rgba(255,255,255,.06);text-align:center}.rr-tv-kicker{font-size:clamp(14px,1.3vw,22px);letter-spacing:.14em;font-weight:900;color:#c9b7ef}.rr-tv-player{font-size:clamp(26px,3.5vw,58px);font-weight:1000;margin-top:5px}.rr-tv-team{font-size:clamp(15px,1.5vw,26px);font-weight:1000;margin-top:5px}.rr-tv-team.fire{color:#ff415f}.rr-tv-team.ice{color:#36d6ff}
      .rr-tv-queues{display:grid;grid-template-columns:1fr 1fr;gap:16px;min-height:0}.rr-tv-queue{border-radius:24px;padding:18px;background:rgba(255,255,255,.045);overflow:hidden}.rr-tv-queue h2{font-size:clamp(22px,2.2vw,38px);margin:0 0 12px;text-align:center}.rr-tv-queue.fire h2{color:#ff415f}.rr-tv-queue.ice h2{color:#36d6ff}.rr-tv-list{display:grid;gap:8px}.rr-tv-row{display:grid;grid-template-columns:44px 1fr;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.12);border-radius:15px;padding:10px 12px;font-size:clamp(17px,1.55vw,27px);font-weight:900}.rr-tv-row.active{border-color:#ffd21f;background:rgba(255,210,31,.15);box-shadow:0 0 20px rgba(255,210,31,.18)}.rr-tv-number{color:#bba9df;text-align:center}
      .rr-tv-banner{min-height:76px;border-radius:22px;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px 24px;background:linear-gradient(90deg,rgba(81,24,155,.9),rgba(23,156,210,.72),rgba(81,24,155,.9));font-size:clamp(20px,2.4vw,40px);font-weight:1000;letter-spacing:.045em;text-shadow:0 2px 12px #000;transition:opacity .25s ease}
      @media(max-aspect-ratio:4/3){.rr-tv-main{grid-template-columns:1fr;grid-template-rows:auto 1fr}.rr-tv-join{display:grid;grid-template-columns:180px 1fr;gap:18px}.rr-tv-qr{width:180px}.rr-tv-join-title{margin:0}.rr-tv-shell{overflow:auto}}
    \`;
    document.head.appendChild(style);
  }
  function ensureTvPage(){
    ensureTvStyles();
    let page=document.getElementById(TV_PAGE_ID);
    if(page) return page;
    page=document.createElement('section');
    page.id=TV_PAGE_ID;
    page.className='hidden';
    page.setAttribute('aria-label','Rowdy Room TV display');
    page.innerHTML=\`<div class="rr-tv-shell">
      <header class="rr-tv-header"><h1 class="rr-tv-title">ROWDY ROOM</h1><div class="rr-tv-subtitle">SING • COMPETE • VOTE • CONNECT</div></header>
      <main class="rr-tv-main">
        <section class="rr-tv-card rr-tv-join" aria-label="Join Rowdy Room"><img id="tvQrImage" class="rr-tv-qr" alt="Scan to join Rowdy Room"><div><div class="rr-tv-join-title">SCAN TO JOIN</div><div id="tvJoinUrl" class="rr-tv-url"></div></div></section>
        <section class="rr-tv-card rr-tv-live" aria-label="Rumble player queue">
          <div class="rr-tv-now"><div class="rr-tv-now-box"><div class="rr-tv-kicker">NOW PLAYING</div><div id="tvCurrentPlayer" class="rr-tv-player"></div><div id="tvCurrentTeam" class="rr-tv-team"></div></div><div class="rr-tv-now-box"><div class="rr-tv-kicker">NEXT PLAYER</div><div id="tvNextPlayer" class="rr-tv-player"></div><div id="tvNextTeam" class="rr-tv-team"></div></div></div>
          <div class="rr-tv-queues"><section class="rr-tv-queue fire"><h2>🔥 FIRE TEAM</h2><div id="tvFireQueue" class="rr-tv-list"></div></section><section class="rr-tv-queue ice"><h2>❄️ ICE TEAM</h2><div id="tvIceQueue" class="rr-tv-list"></div></section></div>
        </section>
      </main>
      <footer id="tvRotatingBanner" class="rr-tv-banner"></footer>
    </div>\`;
    (document.getElementById('app')||document.body).appendChild(page);
    return page;
  }
  function renderTvQueue(team,targetId){
    const target=document.getElementById(targetId);
    if(!target) return;
    target.innerHTML=tvTeamRows(team).map(row=>\`<div class="rr-tv-row\${row.active?' active':''}"><div class="rr-tv-number">\${row.index+1}</div><div>\${escapeTv(row.name)}</div></div>\`).join('');
  }
  function renderTvMode(){
    const page=ensureTvPage();
    const current=tvCurrentPlayer();
    const next=tvNextPlayer();
    const joinUrl=tvJoinUrl();
    const qr=document.getElementById('tvQrImage');
    if(qr&&qr.src!==tvQrImageUrl()) qr.src=tvQrImageUrl();
    document.getElementById('tvJoinUrl').textContent=joinUrl;
    document.getElementById('tvCurrentPlayer').textContent=current.name;
    document.getElementById('tvCurrentTeam').textContent=tvTeamLabel(current.team)+' TEAM';
    document.getElementById('tvCurrentTeam').className='rr-tv-team '+tvTeamClass(current.team);
    document.getElementById('tvNextPlayer').textContent=next.name;
    document.getElementById('tvNextTeam').textContent=tvTeamLabel(next.team)+' TEAM';
    document.getElementById('tvNextTeam').className='rr-tv-team '+tvTeamClass(next.team);
    renderTvQueue('red','tvFireQueue');
    renderTvQueue('blue','tvIceQueue');
    const banners=Array.isArray(window.ROWDY_TV_BANNERS)&&window.ROWDY_TV_BANNERS.length?window.ROWDY_TV_BANNERS:TV_BANNERS_DEFAULT;
    document.getElementById('tvRotatingBanner').textContent=String(banners[tvBannerIndex%banners.length]);
    return page;
  }
  function rotateTvBanner(){
    const banners=Array.isArray(window.ROWDY_TV_BANNERS)&&window.ROWDY_TV_BANNERS.length?window.ROWDY_TV_BANNERS:TV_BANNERS_DEFAULT;
    tvBannerIndex=(tvBannerIndex+1)%banners.length;
    if(location.hash===TV_HASH) renderTvMode();
  }
  function startTvBanner(){
    if(tvBannerTimer) return;
    tvBannerTimer=setInterval(rotateTvBanner,Number(window.ROWDY_TV_BANNER_MS)||6500);
  }
  function showTvMode(){
    const page=renderTvMode();
    document.querySelectorAll('#app>section').forEach(section=>section.classList.add('hidden'));
    page.classList.remove('hidden');
    startTvBanner();
    document.documentElement.classList.add('rowdy-tv-active');
  }
  function leaveTvMode(){document.documentElement.classList.remove('rowdy-tv-active');}
  function openTvMode(){
    const url=new URL(location.href);
    url.hash='tv';
    return window.open(url.href,'rowdyRoomTvMode');
  }
  function installTvHostShortcut(){
    const host=document.getElementById('hostDashboard');
    if(!host||document.getElementById('openTvModeButton')) return;
    const button=document.createElement('button');
    button.id='openTvModeButton';
    button.type='button';
    button.textContent='OPEN TV MODE';
    button.onclick=openTvMode;
    button.style.cssText='width:100%;margin:10px 0;padding:14px;border-radius:14px;border:1px solid #7dd3fc;background:#16213a;color:#fff;font-weight:900;cursor:pointer';
    host.prepend(button);
  }

  const originalRender=render;
  render=function(...args){
    const result=originalRender.apply(this,args);
    if(location.hash===TV_HASH) renderTvMode();
    return result;
  };
  if(typeof renderHost==='function'){
    const originalRenderHost=renderHost;
    renderHost=function(...args){const result=originalRenderHost.apply(this,args);setTimeout(installTvHostShortcut,0);return result;};
  }
  window.openTvMode=openTvMode;
  window.renderTvMode=renderTvMode;
  window.addEventListener('hashchange',()=>{
    if(location.hash===TV_HASH) showTvMode();
    else leaveTvMode();
  });
  document.addEventListener('keydown',event=>{
    if(event.altKey&&String(event.key).toLowerCase()==='t'){event.preventDefault();openTvMode();}
  });
  ensureTvPage();
  installTvHostShortcut();
  if(location.hash===TV_HASH) showTvMode();
})();
</script>`;

function countOccurrences(source, needle) {
  return source.split(needle).length - 1;
}

export function applyRumbleTvModeFix(source) {
  if (source.includes('id="rowdy-tv-mode-repair"')) {
    return { source, changed: false, status: 'already-patched' };
  }
  if (!source.includes(ITEM_EIGHT_PREREQUISITE)) {
    throw new Error('Prerequisite missing: apply Rumble repair items 1 through 8 before item 9. No file was changed.');
  }
  const count = countOccurrences(source, CLOSING_MARKER);
  if (count !== 1) {
    throw new Error(`TV mode insertion point: expected exactly 1 match, found ${count}. No file was changed.`);
  }
  const patched = source.replace(CLOSING_MARKER, `</script>\n${TV_MODE_BLOCK}\n</body>\n</html>`);
  return { source: patched, changed: true, status: 'patched' };
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}
function applyToFile(targetPath) {
  const original = readFileSync(targetPath, 'utf8');
  const result = applyRumbleTvModeFix(original);
  if (!result.changed) { console.log(`No change: ${targetPath} is already patched.`); return; }
  const backupPath = join(dirname(targetPath), `${basename(targetPath)}.before-tv-mode-fix-${timestamp()}.bak`);
  const tempPath = `${targetPath}.tv-mode-fix.tmp`;
  copyFileSync(targetPath, backupPath);
  writeFileSync(tempPath, result.source, 'utf8');
  renameSync(tempPath, targetPath);
  console.log(`Patched: ${targetPath}`);
  console.log(`Backup: ${backupPath}`);
  console.log('Verification: #tv shows only QR, current/next player, Fire/Ice queues, and rotating banner content.');
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
  const result = applyRumbleTvModeFix(source);
  console.log(result.changed ? 'NEEDS_PATCH' : 'PATCHED');
}
function usage() {
  console.error('Usage:');
  console.error('  node tools/rumble/fix-tv-mode.mjs --check <index.html>');
  console.error('  node tools/rumble/fix-tv-mode.mjs --apply <index.html>');
  console.error('  node tools/rumble/fix-tv-mode.mjs --restore <backup.bak> <index.html>');
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
