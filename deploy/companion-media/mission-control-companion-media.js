(function(){
  'use strict';

  const SUPABASE_URL='https://szubjgpvlqliyparrnam.supabase.co';
  const SUPABASE_KEY='__ROWDY_SUPABASE_PUBLISHABLE_KEY__';
  const VIDEO_URL='https://rowdyroom.site/media/rowdy-room-explanation.mp4';
  const VIDEO_TITLE='How the Rowdy Room Works';
  const VIDEO_DURATION_SECONDS=60;
  const PASSWORD_SESSION_KEY='rr_companion_media_admin_key';
  const PANEL_ID='rrCompanionMediaControls';

  function ensurePanel(){
    let panel=document.getElementById(PANEL_ID);
    if(panel) return panel;

    panel=document.createElement('section');
    panel.id=PANEL_ID;
    panel.setAttribute('aria-label','Companion video controls');
    panel.innerHTML=`
      <style>
        #${PANEL_ID}{position:fixed;right:14px;bottom:14px;z-index:2147483000;width:min(360px,calc(100vw - 28px));padding:14px;border:1px solid rgba(167,139,250,.65);border-radius:16px;background:rgba(13,4,28,.96);box-shadow:0 16px 48px rgba(0,0,0,.55);color:#fff;font-family:Arial,Helvetica,sans-serif}
        #${PANEL_ID} .rr-media-title{font-size:16px;font-weight:900;color:#ffd21f;margin-bottom:4px}
        #${PANEL_ID} .rr-media-sub{font-size:12px;line-height:1.35;color:#d9c8f2;margin-bottom:10px}
        #${PANEL_ID} .rr-media-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px}
        #${PANEL_ID} button{min-height:44px;border-radius:11px;border:1px solid rgba(255,255,255,.2);font-weight:900;cursor:pointer;color:#fff}
        #${PANEL_ID} .rr-media-play{background:linear-gradient(135deg,#7c3aed,#4c1d95)}
        #${PANEL_ID} .rr-media-stop{background:#7f1d1d}
        #${PANEL_ID} button:disabled{opacity:.55;cursor:wait}
        #${PANEL_ID} .rr-media-status{min-height:18px;margin-top:9px;font-size:12px;color:#c4b5fd}
        #${PANEL_ID} .rr-media-status.error{color:#fca5a5}
        #${PANEL_ID} .rr-media-status.success{color:#86efac}
      </style>
      <div class="rr-media-title">COMPANION VOTING VIDEO</div>
      <div class="rr-media-sub">Plays the Rowdy Room explanation video for viewers who currently have the Companion App open.</div>
      <div class="rr-media-actions">
        <button type="button" class="rr-media-play">PLAY ROOM EXPLANATION</button>
        <button type="button" class="rr-media-stop">STOP VIDEO</button>
      </div>
      <div class="rr-media-status" role="status" aria-live="polite">Ready.</div>`;
    document.body.appendChild(panel);
    return panel;
  }

  function setStatus(message,type=''){
    const status=ensurePanel().querySelector('.rr-media-status');
    status.textContent=message;
    status.className='rr-media-status'+(type?' '+type:'');
  }

  function setBusy(busy){
    ensurePanel().querySelectorAll('button').forEach(button=>{button.disabled=busy;});
  }

  function adminKey(){
    let key='';
    try{key=sessionStorage.getItem(PASSWORD_SESSION_KEY)||'';}catch(_error){}
    if(!key){
      key=window.prompt('Enter the Rowdy Room host password to control the Companion video:')||'';
      if(key){try{sessionStorage.setItem(PASSWORD_SESSION_KEY,key);}catch(_error){}}
    }
    return key;
  }

  async function videoExists(){
    try{
      const response=await fetch(VIDEO_URL,{method:'HEAD',cache:'no-store',credentials:'same-origin'});
      return response.ok;
    }catch(_error){
      return false;
    }
  }

  async function sendCommand(action){
    const key=adminKey();
    if(!key) throw new Error('Host password is required.');

    const response=await fetch(`${SUPABASE_URL}/rest/v1/rpc/rr_admin_set_companion_media`,{
      method:'POST',
      headers:{
        apikey:SUPABASE_KEY,
        Authorization:`Bearer ${SUPABASE_KEY}`,
        'Content-Type':'application/json'
      },
      body:JSON.stringify({
        p_admin_key:key,
        p_action:action,
        p_video_url:VIDEO_URL,
        p_title:VIDEO_TITLE,
        p_duration_seconds:VIDEO_DURATION_SECONDS
      })
    });
    const text=await response.text();
    let data={};
    try{data=text?JSON.parse(text):{};}catch(_error){}
    if(!response.ok){
      const message=data.message||data.error||data.hint||'Companion media command failed.';
      if(/admin|password|key/i.test(message)){
        try{sessionStorage.removeItem(PASSWORD_SESSION_KEY);}catch(_error){}
      }
      throw new Error(message);
    }
    return data;
  }

  async function run(action){
    setBusy(true);
    try{
      if(action==='play'){
        setStatus('Checking the video file…');
        if(!(await videoExists())){
          throw new Error('The explanation video is not uploaded at /media/rowdy-room-explanation.mp4.');
        }
      }
      setStatus(action==='play'?'Starting video for Companion viewers…':'Stopping video…');
      await sendCommand(action);
      setStatus(action==='play'?'Video command sent. Viewers will receive it within about 2 seconds.':'Video stopped.','success');
    }catch(error){
      setStatus(error instanceof Error?error.message:String(error),'error');
    }finally{
      setBusy(false);
    }
  }

  function install(){
    const panel=ensurePanel();
    panel.querySelector('.rr-media-play').addEventListener('click',()=>run('play'));
    panel.querySelector('.rr-media-stop').addEventListener('click',()=>run('stop'));
  }

  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',install,{once:true});
  else install();
})();
