(function(){
  'use strict';

  const SUPABASE_URL='https://szubjgpvlqliyparrnam.supabase.co';
  const SUPABASE_KEY='__ROWDY_SUPABASE_PUBLISHABLE_KEY__';
  const POLL_MS=1500;
  const OVERLAY_ID='rrCompanionMediaOverlay';
  const DISMISSED_KEY='rr_companion_media_dismissed_command';
  let activeCommandId='';
  let requestInFlight=false;

  function dismissedCommand(){
    try{return sessionStorage.getItem(DISMISSED_KEY)||'';}catch(_error){return '';}
  }

  function markDismissed(commandId){
    try{sessionStorage.setItem(DISMISSED_KEY,commandId||'');}catch(_error){}
  }

  function ensureOverlay(){
    let overlay=document.getElementById(OVERLAY_ID);
    if(overlay) return overlay;
    overlay=document.createElement('section');
    overlay.id=OVERLAY_ID;
    overlay.hidden=true;
    overlay.setAttribute('aria-label','Rowdy Room explanation video');
    overlay.innerHTML=`
      <style>
        #${OVERLAY_ID}{position:fixed;inset:0;z-index:2147483000;padding:14px;background:radial-gradient(circle at 50% 0,#2d0c52,#050008 58%);color:#fff;font-family:Arial,Helvetica,sans-serif;overflow:auto}
        #${OVERLAY_ID}[hidden]{display:none!important}
        #${OVERLAY_ID} .rr-media-shell{width:min(560px,100%);min-height:100%;margin:auto;display:flex;flex-direction:column;justify-content:center;gap:12px}
        #${OVERLAY_ID} .rr-media-head{text-align:center}
        #${OVERLAY_ID} .rr-media-kicker{font-size:13px;letter-spacing:.18em;font-weight:900;color:#ffd21f}
        #${OVERLAY_ID} .rr-media-heading{font-size:clamp(25px,7vw,40px);line-height:1.02;font-weight:1000;margin:6px 0 0;text-shadow:0 0 22px rgba(139,44,255,.8)}
        #${OVERLAY_ID} .rr-media-video-wrap{position:relative;border:2px solid rgba(168,85,247,.65);border-radius:22px;overflow:hidden;background:#000;box-shadow:0 18px 48px rgba(0,0,0,.55)}
        #${OVERLAY_ID} video{display:block;width:100%;max-height:65vh;background:#000;object-fit:contain}
        #${OVERLAY_ID} .rr-media-sound{position:absolute;left:50%;bottom:12px;transform:translateX(-50%);min-height:44px;padding:10px 16px;border:1px solid rgba(255,255,255,.3);border-radius:999px;background:rgba(0,0,0,.82);color:#fff;font-weight:900}
        #${OVERLAY_ID} .rr-media-sound[hidden]{display:none!important}
        #${OVERLAY_ID} .rr-media-note{text-align:center;color:#d9c8f2;font-size:14px;font-weight:700}
        #${OVERLAY_ID} .rr-media-return{min-height:52px;border:1px solid rgba(255,255,255,.25);border-radius:15px;background:linear-gradient(135deg,#7c3aed,#4c1d95);color:#fff;font-size:17px;font-weight:1000;cursor:pointer}
      </style>
      <div class="rr-media-shell">
        <header class="rr-media-head"><div class="rr-media-kicker">VOTING BREAK</div><h1 class="rr-media-heading">How the Rowdy Room Works</h1></header>
        <div class="rr-media-video-wrap"><video playsinline preload="auto"></video><button type="button" class="rr-media-sound" hidden>TAP FOR SOUND</button></div>
        <div class="rr-media-note">Voting remains open. Return to the Vote tab whenever you are ready.</div>
        <button type="button" class="rr-media-return">RETURN TO VOTING</button>
      </div>`;
    document.body.appendChild(overlay);
    const video=overlay.querySelector('video');
    overlay.querySelector('.rr-media-return').addEventListener('click',()=>dismissCurrent());
    overlay.querySelector('.rr-media-sound').addEventListener('click',async()=>{
      video.muted=false;
      try{await video.play(); overlay.querySelector('.rr-media-sound').hidden=true;}catch(_error){}
    });
    video.addEventListener('ended',()=>hideOverlay());
    video.addEventListener('error',()=>hideOverlay());
    return overlay;
  }

  function hideOverlay(){
    const overlay=ensureOverlay();
    const video=overlay.querySelector('video');
    video.pause();
    overlay.hidden=true;
  }

  function dismissCurrent(){
    if(activeCommandId) markDismissed(activeCommandId);
    hideOverlay();
    const voteTab=document.querySelector('[data-screen="vote"]');
    if(voteTab instanceof HTMLElement) voteTab.click();
  }

  function activeWindow(row,nowMs=Date.now()){
    if(!row||row.action!=='play'||!row.command_id||!row.started_at||!row.expires_at) return null;
    const started=Date.parse(row.started_at);
    const expires=Date.parse(row.expires_at);
    if(!Number.isFinite(started)||!Number.isFinite(expires)||expires<=nowMs) return null;
    return {started,expires,elapsedSeconds:Math.max(0,(nowMs-started)/1000)};
  }

  async function playRow(row,windowInfo){
    if(row.command_id===dismissedCommand()) return;
    const overlay=ensureOverlay();
    const video=overlay.querySelector('video');
    const sound=overlay.querySelector('.rr-media-sound');
    overlay.querySelector('.rr-media-heading').textContent=row.title||'How the Rowdy Room Works';
    activeCommandId=row.command_id;
    overlay.hidden=false;

    if(video.dataset.commandId!==row.command_id){
      video.dataset.commandId=row.command_id;
      video.src=row.video_url;
      video.load();
      await new Promise(resolve=>{
        if(video.readyState>=1) return resolve();
        const done=()=>{video.removeEventListener('loadedmetadata',done);resolve();};
        video.addEventListener('loadedmetadata',done,{once:true});
        setTimeout(done,3000);
      });
      if(Number.isFinite(video.duration)&&video.duration>0){
        video.currentTime=Math.min(windowInfo.elapsedSeconds,Math.max(0,video.duration-.25));
      }else{
        video.currentTime=windowInfo.elapsedSeconds;
      }
    }

    video.muted=false;
    sound.hidden=true;
    try{
      await video.play();
    }catch(_error){
      video.muted=true;
      try{await video.play(); sound.hidden=false;}catch(_mutedError){sound.hidden=false;}
    }
  }

  async function fetchState(){
    if(requestInFlight) return;
    requestInFlight=true;
    try{
      const response=await fetch(`${SUPABASE_URL}/rest/v1/rr_companion_media?id=eq.main&select=id,command_id,action,video_url,title,duration_seconds,started_at,expires_at,updated_at`,{
        headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`},
        cache:'no-store'
      });
      if(!response.ok) return;
      const rows=await response.json();
      const row=Array.isArray(rows)?rows[0]:null;
      const windowInfo=activeWindow(row);
      if(!windowInfo){
        if(row?.action==='stop'||row?.command_id===activeCommandId) hideOverlay();
        return;
      }
      if(row.command_id===activeCommandId&&!ensureOverlay().hidden) return;
      await playRow(row,windowInfo);
    }catch(_error){
      // Keep the Companion App usable when the media control service is unavailable.
    }finally{
      requestInFlight=false;
    }
  }

  function install(){
    ensureOverlay();
    fetchState();
    setInterval(fetchState,POLL_MS);
    document.addEventListener('visibilitychange',()=>{if(!document.hidden) fetchState();});
  }

  window.RowdyCompanionMedia={activeWindow};
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
