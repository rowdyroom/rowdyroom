(function(){
'use strict';

if(window.__ROWDY_RUMBLE_HOST_DASHBOARD_V2_INSTALLED__)return;
window.__ROWDY_RUMBLE_HOST_DASHBOARD_V2_INSTALLED__=true;

const PATCH_ID='rowdyRumbleHostDashboardV2';
const STYLE_ID='rowdy-rumble-host-dashboard-v2-style';
const REFRESH_MS=500;
let installed=false;
let lastActionAt=0;

function gameState(){
  try{return (typeof state==='object'&&state)?state:{};}catch(_error){return {};}
}

function esc(value){
  return String(value??'').replace(/[&<>"']/g,(ch)=>({
    '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
  }[ch]));
}

function activeTeam(s=gameState()){
  return s.currentTeam==='blue'?'blue':'red';
}

function teamLabel(team){
  return team==='blue'?'ICE TEAM':'FIRE TEAM';
}

function teamPlayers(team,s=gameState()){
  try{
    if(typeof turnPlayers==='function'){
      const players=turnPlayers(team);
      if(Array.isArray(players)&&players.filter(Boolean).length)return players.filter(Boolean);
    }
  }catch(_error){}
  const source=team==='blue'?s.blueTeam:s.redTeam;
  const players=Array.isArray(source)?source.filter(Boolean):[];
  return players.length?players:[team==='blue'?'Ice Player':'Fire Player'];
}

function currentPlayer(s=gameState()){
  const team=activeTeam(s);
  const players=teamPlayers(team,s);
  const index=Math.max(0,Math.min(Number(s.currentIndex)||0,players.length-1));
  return players[index]||players[0];
}

function timerStatus(){
  try{return timerInterval?'RUNNING':'PAUSED';}catch(_error){return 'UNKNOWN';}
}

function ensureStyles(){
  if(document.getElementById(STYLE_ID))return;
  const style=document.createElement('style');
  style.id=STYLE_ID;
  style.textContent=`
    #hostDashboard.rr-host-v2{display:block!important;width:min(1180px,100%);margin:0 auto;padding:12px;box-sizing:border-box}
    #hostDashboard.rr-host-v2.hidden{display:none!important}
    #hostDashboard .rrh-shell{display:grid;gap:14px;color:#fff;font-family:Arial,Helvetica,sans-serif}
    #hostDashboard .rrh-header{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;padding:16px;border:1px solid rgba(168,85,247,.55);border-radius:18px;background:linear-gradient(135deg,rgba(68,18,119,.92),rgba(12,4,27,.96));box-shadow:0 14px 38px rgba(0,0,0,.38)}
    #hostDashboard .rrh-kicker{font-size:12px;letter-spacing:.16em;font-weight:900;color:#facc15}
    #hostDashboard .rrh-title{margin:4px 0 0;font-size:clamp(25px,4vw,42px);line-height:1}
    #hostDashboard .rrh-sub{margin:7px 0 0;color:#d8c8ed;font-size:14px;line-height:1.35}
    #hostDashboard .rrh-lock{min-height:42px;padding:9px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:#241238;color:#fff;font-weight:900;cursor:pointer}
    #hostDashboard .rrh-status{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:9px}
    #hostDashboard .rrh-stat{min-width:0;padding:12px;border:1px solid rgba(255,255,255,.13);border-radius:14px;background:rgba(14,5,31,.94)}
    #hostDashboard .rrh-stat span{display:block;color:#bda8d6;font-size:11px;font-weight:900;letter-spacing:.08em;text-transform:uppercase}
    #hostDashboard .rrh-stat strong{display:block;margin-top:6px;font-size:clamp(17px,2vw,25px);line-height:1.05;overflow-wrap:anywhere}
    #hostDashboard .rrh-team-fire strong{color:#fb7185} #hostDashboard .rrh-team-ice strong{color:#67e8f9}
    #hostDashboard .rrh-main{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(300px,.75fr);gap:14px}
    #hostDashboard .rrh-card{padding:16px;border:1px solid rgba(255,255,255,.14);border-radius:18px;background:rgba(9,3,22,.96);box-shadow:0 14px 34px rgba(0,0,0,.3)}
    #hostDashboard .rrh-card h2{margin:0 0 10px;font-size:20px}
    #hostDashboard .rrh-question{padding:13px;border-radius:13px;background:rgba(124,58,237,.19);font-size:clamp(18px,2.4vw,28px);font-weight:900;line-height:1.2}
    #hostDashboard .rrh-answers{display:grid;gap:8px;margin-top:10px}
    #hostDashboard .rrh-answer{display:grid;grid-template-columns:36px minmax(0,1fr) auto;align-items:center;gap:9px;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.065)}
    #hostDashboard .rrh-answer-key{display:grid;place-items:center;width:32px;height:32px;border-radius:8px;background:#4c1d95;font-weight:1000}
    #hostDashboard .rrh-answer-text{font-weight:850;overflow-wrap:anywhere}
    #hostDashboard .rrh-answer-points{color:#facc15;font-weight:900;white-space:nowrap}
    #hostDashboard .rrh-answer.revealed{opacity:.57}
    #hostDashboard .rrh-controls{display:grid;gap:10px}
    #hostDashboard .rrh-button{min-height:48px;padding:11px 13px;border:1px solid rgba(255,255,255,.2);border-radius:13px;background:linear-gradient(135deg,#6d28d9,#4c1d95);color:#fff;font-size:15px;font-weight:1000;cursor:pointer}
    #hostDashboard .rrh-button.secondary{background:#172033}
    #hostDashboard .rrh-button.danger{background:#7f1d1d}
    #hostDashboard .rrh-button:disabled{opacity:.5;cursor:not-allowed}
    #hostDashboard .rrh-lifeline{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:8px}
    #hostDashboard .rrh-select{min-height:48px;padding:10px;border:1px solid rgba(255,255,255,.2);border-radius:12px;background:#170b29;color:#fff;font-size:16px;font-weight:800}
    #hostDashboard .rrh-help{margin:12px 0 0;padding:10px 12px;border-radius:12px;background:rgba(250,204,21,.09);color:#e8ddf4;font-size:13px;line-height:1.45}
    #hostDashboard .rrh-help kbd{display:inline-block;min-width:25px;padding:2px 7px;margin:0 3px;border:1px solid rgba(255,255,255,.25);border-radius:6px;background:#211332;color:#fff;text-align:center;font:900 13px Arial}
    #hostDashboard .rrh-message{min-height:20px;margin:10px 0 0;color:#c4b5fd;font-size:13px;font-weight:800}
    @media(max-width:850px){
      #hostDashboard .rrh-status{grid-template-columns:repeat(2,minmax(0,1fr))}
      #hostDashboard .rrh-main{grid-template-columns:minmax(0,1fr)}
      #hostDashboard .rrh-header{flex-direction:column}
      #hostDashboard .rrh-lock{width:100%}
    }
  `;
  document.head.appendChild(style);
}

function answerRows(s){
  const question=s.currentQuestion;
  if(!question||!Array.isArray(question.answers)||!question.answers.length){
    return '<div class="rrh-answer"><span class="rrh-answer-key">—</span><span class="rrh-answer-text">No question loaded.</span><span></span></div>';
  }
  return question.answers.map((answer,index)=>{
    const revealed=Array.isArray(s.revealed)&&s.revealed.includes(index);
    const points=Array.isArray(question.points)?question.points[index]:'';
    return `<div class="rrh-answer${revealed?' revealed':''}"><span class="rrh-answer-key">${index+1}</span><span class="rrh-answer-text">${esc(answer)}${revealed?' · REVEALED':''}</span><span class="rrh-answer-points">${esc(points)} pts</span></div>`;
  }).join('');
}

function dashboardMarkup(s){
  const team=activeTeam(s);
  const question=s.currentQuestion?.question||'No question loaded.';
  const lifelines=Math.max(0,Number(s.lifelines)||0);
  const resurrects=Math.max(0,Number(s.resurrects)||0);
  return `
    <div class="rrh-shell" data-patch="${PATCH_ID}">
      <header class="rrh-header">
        <div><div class="rrh-kicker">PRIVATE GAME CONTROLS</div><h1 class="rrh-title">Rumble Host Dashboard</h1><p class="rrh-sub">Focused match information and recovery controls. Wheel and buzzer animations are automatic.</p></div>
        <button type="button" class="rrh-lock" data-rrh-action="lock">LOCK DASHBOARD</button>
      </header>
      <section class="rrh-status">
        <div class="rrh-stat"><span>Current Player</span><strong>${esc(currentPlayer(s))}</strong></div>
        <div class="rrh-stat rrh-team-${team==='blue'?'ice':'fire'}"><span>Current Team</span><strong>${teamLabel(team)}</strong></div>
        <div class="rrh-stat"><span>Timer</span><strong>${Math.max(0,Number(s.timer)||0)} · ${timerStatus()}</strong></div>
        <div class="rrh-stat"><span>Strikes</span><strong>Fire ${Math.max(0,Number(s.redStrikes)||0)} / Ice ${Math.max(0,Number(s.blueStrikes)||0)}</strong></div>
        <div class="rrh-stat"><span>Lifelines</span><strong>${lifelines}</strong></div>
        <div class="rrh-stat"><span>Resurrections</span><strong>${resurrects}</strong></div>
      </section>
      <section class="rrh-main">
        <article class="rrh-card"><h2>Private Answer Key</h2><div class="rrh-question">${esc(question)}</div><div class="rrh-answers">${answerRows(s)}</div><p class="rrh-help"><kbd>1–6</kbd> reveal answers · <kbd>0</kbd> wrong answer and correct strike animation</p></article>
        <article class="rrh-card"><h2>Host Actions</h2><div class="rrh-controls">
          <button type="button" class="rrh-button" data-rrh-action="next-player">NEXT PLAYER</button>
          <button type="button" class="rrh-button" data-rrh-action="next-question">NEXT QUESTION</button>
          <div class="rrh-lifeline"><select class="rrh-select" data-rrh-lifeline aria-label="Lifeline choice"><option value="hint">Get a Hint</option><option value="team">Ask Your Team</option><option value="friend">Phone a Friend</option></select><button type="button" class="rrh-button" data-rrh-action="lifeline" ${lifelines<=0?'disabled':''}>USE LIFELINE</button></div>
          <button type="button" class="rrh-button secondary" data-rrh-action="resurrect" ${resurrects<=0?'disabled':''}>USE RESURRECTION TOKEN</button>
          <button type="button" class="rrh-button secondary" data-rrh-action="open-game">OPEN GAME SCREEN</button>
          <button type="button" class="rrh-button danger" data-rrh-action="emergency-reset">EMERGENCY MATCH RESET</button>
        </div><p class="rrh-help">There are no manual Wheel or Buzzer buttons. Punch Wheel results remain game-controlled. The <kbd>0</kbd> key is the wrong-answer/buzzer keybind.</p><p class="rrh-message" data-rrh-message>Ready.</p></article>
      </section>
    </div>`;
}

function hostDashboard(){return document.getElementById('hostDashboard');}

function dashboardKey(s){
  const q=s.currentQuestion||{};
  return JSON.stringify([
    s.currentTeam,s.currentIndex,s.timer,s.redStrikes,s.blueStrikes,s.lifelines,s.resurrects,
    q.question,q.answers,q.points,s.revealed,Boolean((()=>{try{return timerInterval;}catch(_error){return null;}})())
  ]);
}

function renderDashboard(force=false){
  const host=hostDashboard();
  if(!host)return;
  ensureStyles();
  const s=gameState();
  const key=dashboardKey(s);
  if(!force&&host.dataset.rrhKey===key)return;
  host.classList.add('rr-host-v2');
  const focused=document.activeElement;
  const lifelineValue=focused?.matches?.('[data-rrh-lifeline]')?focused.value:null;
  host.innerHTML=dashboardMarkup(s);
  host.dataset.rrhKey=key;
  if(lifelineValue){
    const select=host.querySelector('[data-rrh-lifeline]');
    if(select)select.value=lifelineValue;
  }
}

function setMessage(message){
  const target=hostDashboard()?.querySelector('[data-rrh-message]');
  if(target)target.textContent=message;
}

function runAction(action){
  if(action==='next-player'){
    if(typeof advanceCurrentPlayer!=='function')throw new Error('Next-player action is unavailable.');
    advanceCurrentPlayer();
    if(typeof saveState==='function')saveState();
    if(typeof startTimer==='function')startTimer();
    return 'Advanced to the next player.';
  }
  if(action==='next-question'){
    if(typeof nextQuestion!=='function')throw new Error('Next-question action is unavailable.');
    nextQuestion();
    return 'Loaded the next question.';
  }
  if(action==='lifeline'){
    if(typeof useLifeline!=='function')throw new Error('Lifeline action is unavailable.');
    const choice=hostDashboard()?.querySelector('[data-rrh-lifeline]')?.value||'hint';
    useLifeline(choice);
    return 'Lifeline used once.';
  }
  if(action==='resurrect'){
    if(typeof useResurrect!=='function')throw new Error('Resurrection action is unavailable.');
    useResurrect();
    return 'Resurrection token used.';
  }
  if(action==='open-game'){
    const url=new URL(location.href);
    url.hash='';
    window.open(url.href,'rowdyRumbleGameScreen');
    return 'Game screen opened.';
  }
  if(action==='lock'){
    if(typeof hostLogout==='function')hostLogout();
    else{try{localStorage.removeItem('rowdyHostUnlocked');location.reload();}catch(_error){}}
    return 'Dashboard locked.';
  }
  if(action==='emergency-reset'){
    if(!window.confirm('Emergency reset the current Rumble match? Scores, strikes, round progress, and the current question will reset.'))return 'Emergency reset cancelled.';
    if(typeof restartMatch!=='function')throw new Error('Emergency reset is unavailable.');
    restartMatch();
    return 'Match reset completed.';
  }
  throw new Error('Unknown host action.');
}

function onDashboardClick(event){
  const button=event.target?.closest?.('[data-rrh-action]');
  if(!button||!hostDashboard()?.contains(button))return;
  event.preventDefault();
  try{setMessage(runAction(button.dataset.rrhAction));}
  catch(error){setMessage(error instanceof Error?error.message:String(error));}
  setTimeout(renderDashboard,0);
}

function typingTarget(target){
  const tag=(target?.tagName||'').toLowerCase();
  const role=(target?.getAttribute?.('role')||'').toLowerCase();
  return tag==='input'||tag==='textarea'||tag==='select'||role==='textbox'||Boolean(target?.isContentEditable);
}

function consume(event){
  event.preventDefault();
  event.stopPropagation();
  event.stopImmediatePropagation();
}

function guardedAction(callback){
  const now=Date.now();
  if(now-lastActionAt<250)return;
  lastActionAt=now;
  callback();
  setTimeout(renderDashboard,0);
}

function onKeydown(event){
  if(typingTarget(event.target)||event.repeat)return;
  const key=String(event.key||'');
  const code=String(event.code||'');
  if(key==='0'||code==='Digit0'||code==='Numpad0'){
    consume(event);
    guardedAction(()=>{if(typeof wrongAnswer==='function')wrongAnswer(gameState().currentTeam);});
    return;
  }
  if(key==='`'||code==='Backquote'){
    consume(event);
    guardedAction(()=>{if(typeof useLifeline==='function')useLifeline('hint');});
    return;
  }
  if(key==='/'||code==='Slash'||code==='NumpadDivide'){
    consume(event);
    guardedAction(()=>{if(typeof useResurrect==='function')useResurrect();});
    return;
  }
  if(key.toLowerCase()==='p'||key.toLowerCase()==='o'){
    consume(event);
  }
}

function wrapRenderHost(){
  try{
    if(typeof renderHost!=='function'||renderHost.__rowdyHostV2)return;
    const original=renderHost;
    const wrapped=function(){
      const result=original.apply(this,arguments);
      renderDashboard(true);
      return result;
    };
    wrapped.__rowdyHostV2=true;
    renderHost=wrapped;
  }catch(_error){}
}

function install(){
  if(installed)return;
  installed=true;
  ensureStyles();
  wrapRenderHost();
  document.addEventListener('click',onDashboardClick);
  document.addEventListener('keydown',onKeydown,true);
  window.addEventListener('hashchange',()=>setTimeout(renderDashboard,0));
  setInterval(()=>{if(location.hash==='#host'&&hostDashboard()&&!hostDashboard().classList.contains('hidden'))renderDashboard();},REFRESH_MS);
  if(location.hash==='#host')renderDashboard(true);
  window.ROWDY_RUMBLE_HOST_DASHBOARD_VERSION='2.0.0';
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',install,{once:true});else install();
})();
