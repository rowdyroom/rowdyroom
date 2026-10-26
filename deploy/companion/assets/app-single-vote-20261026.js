let userId = localStorage.getItem('rowdyRoomUserId') || '';
let guestIdentityReady = false;
let apiBase = '../api';
let currentPerformanceId = null;

const screens = document.querySelectorAll('.screen');
const tabs = document.querySelectorAll('.tab');
const toast = document.getElementById('toast');

function msg(t){toast.textContent=t;toast.style.display='block';setTimeout(()=>toast.style.display='none',2500)}
function normalizeScreen(id){
  const clean = String(id || '').replace(/^#/, '').toLowerCase();
  if(clean === 'boost' || clean === 'boost-points' || clean === 'points') return 'earn';
  if(clean === 'signup' || clean === 'sign-up' || clean === 'sing') return 'queue';
  if(clean === 'songbook' || clean === 'songs' || clean === 'song') return 'queue';
  if(clean === 'voting' || clean === 'live-vote') return 'vote';
  if(['requests','rumble','memory','settings','boost','boost-points','points'].includes(clean)) return 'queue';
  return clean || 'queue';
}

function show(id, updateHash=true){
  const screenId = normalizeScreen(id);
  const exists = Array.from(screens).some(s => s.id === screenId);
  const finalId = exists ? screenId : 'queue';
  screens.forEach(s=>s.classList.toggle('active',s.id===finalId));
  tabs.forEach(t=>t.classList.toggle('active',t.dataset.screen===finalId));
  if(updateHash){
    const publicHash = finalId === 'earn' ? 'boost' : finalId;
    if(location.hash !== '#' + publicHash) history.replaceState(null, '', '#' + publicHash);
  }
}

tabs.forEach(t=>t.onclick=()=>{ show(t.dataset.screen); if(t.dataset.screen === 'vote') bootstrap(); });
window.addEventListener('hashchange',()=>show(location.hash,false));
show(location.hash || 'queue', false);

async function api(path, options={}){
  const res = await fetch(apiBase.replace(/\/$/,'') + path, {
    ...options,
    headers:{'Content-Type':'application/json', ...(options.headers||{})}
  });
  const data = await res.json();
  if(!data.ok) msg(data.error || 'API error');
  return data;
}

function renderQueue(rows){
  const demoNames = new Set(['@mainstage','@singername','@nextsinger','@ondeck','@rowdyguest','@guest','@waiting']);
  const demoIds = new Set(['mainstage','singer','next','deck','waiting','guest','rowdyguest','late']);
  const cleanRows = (rows || []).filter(q => {
    const name = String(q.tiktok_username || '').toLowerCase();
    const uid = String(q.user_id || '').toLowerCase();
    return !(demoNames.has(name) || demoIds.has(uid));
  });

  document.getElementById('queueList').innerHTML = cleanRows.length ? cleanRows.map((q,i)=>`
    <div class="row"><div><strong>#${q.position} ${entrySingerLabel(q)}</strong><br><span class="small">${q.song_title || ''} ${q.artist ? '— '+q.artist : ''}</span></div><span class="badge ${i<3?'gold':''}">${q.status}</span></div>
  `).join('') : '<p class="empty-state">No singers are currently in the queue. Be the first to sign up.</p>';
}


function updateWalletBalance(value){
  const walletBalance = document.getElementById('walletBalance');
  if(walletBalance){
    const n = Number(value || 0);
    walletBalance.textContent = n.toLocaleString() + ' BP';
  }
}

function confirmSpend(label, cost, action){
  const ok = confirm(`Spend ${Number(cost).toLocaleString()} BP on ${label}?`);
  if(!ok) return;
  action();
}

function renderRequests(id, rows){
  document.getElementById(id).innerHTML = rows.length ? rows.map(r=>`
    <div class="row"><div><strong>${r.request_type}</strong><br><span class="small">${r.request_id}</span></div><span class="badge gold">${r.status}</span></div>
  `).join('') : '<p>No requests yet.</p>';
}

async function ensureGuestIdentity(){
  if(userId) return true;
  const guestId = 'guest_' + Math.random().toString(36).slice(2, 12);
  const data = await api('/identity/resolve',{method:'POST',body:JSON.stringify({user_id:guestId,display_name:'Guest'})});
  if(!data.ok) return false;
  userId = data.user.user_id;
  localStorage.setItem('rowdyRoomUserId', userId);
  return true;
}

async function bootstrap(){
  if(!(await ensureGuestIdentity())) return;
  const data = await api('/companion/bootstrap?user_id=' + encodeURIComponent(userId));
  if(!data.ok) return;
  const wallet = data.wallet.wallet;
  document.getElementById('bp').textContent = Number(wallet.bp_balance).toLocaleString();
  if(boostUsername) await refreshBoost(false);
  document.getElementById('who').textContent = wallet.tiktok_username || wallet.user_id;
  renderQueue(data.queue.queue || []);
  renderRequests('memoryList', data.memory_requests.requests || []);
  renderRequests('perfList', data.performer_requests.requests || []);
  const score = data.current_score || {};
  document.getElementById('score').textContent = score.avg_rating || '0.00';
  const perf = data.current_performance && data.current_performance.performance ? data.current_performance.performance : null;
  const nextPerformanceId=perf ? perf.performance_id : null;
  if(nextPerformanceId !== currentPerformanceId) resetVoteSelection();
  currentPerformanceId=nextPerformanceId;
  const liveScoreBox = document.getElementById('currentVoteScore');
  if(liveScoreBox){
    liveScoreBox.textContent = perf ? (Number(score.vote_count||0) ? `Live audience score: ${Number(score.avg_rating||0).toFixed(2)}/5 · ${Number(score.vote_count)} vote${Number(score.vote_count)===1?'':'s'}` : 'Live audience score: Awaiting votes') : 'Live audience score: Voting closed';
  }

  const perfBox = document.getElementById('currentPerformance');
  if(perfBox){
    perfBox.innerHTML = perf ? `<div class="row"><div><strong>${esc(perf.display_name || perf.tiktok_username || perf.performer_user_id)}</strong><br><span class="small">${esc(perf.song_title || 'Current performance')} ${perf.artist ? '— '+esc(perf.artist) : ''}</span></div><span class="badge green">${perf.status === 'completed' ? 'Final minute' : 'Voting open'}</span></div>` : '<p>Voting is closed. The host has not started a current performance.</p>';
  }
}

function youtubeTrackUrl(value){
  try{const url=new URL(String(value||''));const host=url.hostname.toLowerCase().replace(/^www\./,'');if(url.protocol!=='https:'||!['youtube.com','m.youtube.com','youtu.be'].includes(host))return'';if(host==='youtu.be')return url.pathname.length>1?url.href:'';return url.searchParams.get('v')?url.href:'';}catch(e){return'';}
}

const signupWizard={step:1,singerCount:0,names:[],track:null,supportChoice:'none',memoryPackage:null,prefill:{}};
const wizardCopy={1:['How many singers?','Choose one button to begin.'],2:['Who is singing?','Enter every name exactly as it should appear on screen.'],3:['Choose your song','Pick the exact YouTube karaoke video.'],4:['Optional support','Tip, save your performance, or skip.'],5:['Confirm your signup','Check everything before joining the queue.']};
const CASH_TIP_URL='https://cash.app/$rogerjamsek';
const MEMORY_API_URL='https://szubjgpvlqliyparrnam.supabase.co/rest/v1/rr_memory_orders';
const MEMORY_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN6dWJqZ3B2bHFsaXlwYXJybmFtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzg5MzUyODgsImV4cCI6MjA5NDUxMTI4OH0.j4hmiRxlRDiS-RYUIlwi1oGzuh4EQfFd5mEJqVyqH4s';
let signupFinishTimer=null;

function entryNames(row){
  let names=row&&row.singer_names_json;
  if(typeof names==='string'){try{names=JSON.parse(names)}catch(e){names=[]}}
  return Array.isArray(names)?names.map(v=>String(v||'').trim()).filter(Boolean):[];
}
function entrySingerLabel(row){const names=entryNames(row);return names.length?names.join(' + '):(row.tiktok_username||row.user_id||'Performer');}

function setWizardStep(step){
  signupWizard.step=step;
  document.querySelectorAll('.wizard-step').forEach(el=>el.classList.remove('active'));
  const panel=document.getElementById('signupStep'+step);if(panel)panel.classList.add('active');
  document.querySelectorAll('[data-wstep]').forEach(el=>{const n=Number(el.dataset.wstep);el.classList.toggle('active',n===step);el.classList.toggle('done',n<step);});
  const copy=wizardCopy[step]||wizardCopy[1];document.getElementById('wizardTitle').textContent=copy[0];document.getElementById('wizardHelp').textContent=copy[1];
  window.scrollTo({top:0,behavior:'smooth'});
}
function chooseSingerCount(count){signupWizard.singerCount=Math.max(1,Math.min(4,Number(count)||1));signupWizard.names=Array(signupWizard.singerCount).fill('').map((_,i)=>signupWizard.names[i]||'');renderSingerNameFields();setWizardStep(2);setTimeout(()=>document.querySelector('#singerNameFields input')?.focus(),80);}
function renderSingerNameFields(){const box=document.getElementById('singerNameFields');box.innerHTML=signupWizard.names.map((name,i)=>'<label><span>Singer '+(i+1)+' name</span><input class="singer-name-input" data-index="'+i+'" value="'+esc(name)+'" placeholder="Singer '+(i+1)+' name" autocomplete="nickname"></label>').join('');}
function collectSingerNames(){const names=[...document.querySelectorAll('.singer-name-input')].map(el=>el.value.trim());if(names.length!==signupWizard.singerCount||names.some(v=>!v)){msg('Enter a name for every singer.');return null;}signupWizard.names=names;return names;}
function continueSingerNames(){if(!collectSingerNames())return;setWizardStep(3);openWizardSongFinder();}
function wizardBack(step){setWizardStep(step);}
function startSignup(prefill={}){signupWizard.prefill={title:String(prefill.title||''),artist:String(prefill.artist||'')};show('queue');if(signupWizard.names.length)setWizardStep(3);else{setWizardStep(1);msg('Choose how many singers first.');}}
function openWizardSongFinder(){
  if(!signupWizard.names.length){setWizardStep(1);msg('Choose singers first.');return;}
  const title=String(signupWizard.prefill.title||(signupWizard.track&&signupWizard.track.title)||'').trim();const artist=String(signupWizard.prefill.artist||(signupWizard.track&&signupWizard.track.artist)||'').trim();
  const q=new URLSearchParams({title,artist,returnTo:'companion'});const popup=window.open('https://songfinder.rowdyroom.site/?'+q.toString(),'rowdySongFinder','width=980,height=760');if(!popup)msg('Allow the SongFinder window, then tap Open SongFinder again.');
}
function chooseCashTip(){signupWizard.supportChoice='cash_tip';signupWizard.memoryPackage=null;window.open(CASH_TIP_URL,'_blank','noopener');renderSignupReview();setWizardStep(5);msg('Cash App opened in a new window. Your queue signup is not delayed.');}
function chooseNoSupport(){signupWizard.supportChoice='none';signupWizard.memoryPackage=null;renderSignupReview();setWizardStep(5);}
function showMemoryPackages(){document.getElementById('memoryPackageBox').classList.add('active');document.getElementById('memoryPackageBox').scrollIntoView({behavior:'smooth',block:'nearest'});}
function chooseMemoryPackage(name,price,paymentUrl){signupWizard.supportChoice='memory_package';signupWizard.memoryPackage={name,price,paymentUrl,email:'',phone:'',delivery:'Email',notes:''};document.querySelectorAll('.package-choice button').forEach(btn=>btn.classList.toggle('selected',btn.textContent.includes(String.fromCharCode(36)+price)));document.getElementById('memoryOrderFields').classList.add('active');window.open(paymentUrl,'rowdyMemoryPayment','noopener');}
function continueMemoryOrder(){
  if(!signupWizard.memoryPackage)return msg('Choose a package first.');
  const email=document.getElementById('memoryEmail').value.trim(),phone=document.getElementById('memoryPhone').value.trim();
  if(!email&&!phone)return msg('Enter an email or phone number for delivery.');
  if(!document.getElementById('memoryPaidConfirm').checked)return msg('Confirm payment or in-person payment before continuing.');
  if(!document.getElementById('memoryConsent').checked)return msg('Recording consent is required for a performance package.');
  Object.assign(signupWizard.memoryPackage,{email,phone,delivery:document.getElementById('memoryDelivery').value,notes:document.getElementById('memoryNotes').value.trim()});
  renderSignupReview();setWizardStep(5);
}
function supportLabel(){if(signupWizard.supportChoice==='cash_tip')return'Cash App tip opened';if(signupWizard.supportChoice==='memory_package'&&signupWizard.memoryPackage)return signupWizard.memoryPackage.name+' · '+String.fromCharCode(36)+signupWizard.memoryPackage.price;return'No thanks';}
function renderSignupReview(){const t=signupWizard.track||{};document.getElementById('signupReview').innerHTML='<div><span>Singers</span><strong>'+esc(signupWizard.names.join(' + '))+'</strong></div><div><span>Song</span><strong>'+esc(t.title||'')+'</strong></div><div><span>Video source</span><strong>'+esc(t.sourceName||'YouTube')+(t.durationText?' · '+esc(t.durationText):'')+'</strong></div><div><span>Support</span><strong>'+esc(supportLabel())+'</strong></div>';}
function resetSignupWizard(){signupWizard.step=1;signupWizard.singerCount=0;signupWizard.names=[];signupWizard.track=null;signupWizard.supportChoice='none';signupWizard.memoryPackage=null;signupWizard.prefill={};['song','artist','songSourceName','songSourceUrl','songDurationSeconds','songDurationText','songDurationIso','memoryEmail','memoryPhone','memoryNotes','signupTikTok'].forEach(id=>{const el=document.getElementById(id);if(el)el.value='';});['memoryPaidConfirm','memoryConsent'].forEach(id=>{const el=document.getElementById(id);if(el)el.checked=false;});document.getElementById('memoryPackageBox')?.classList.remove('active');document.getElementById('memoryOrderFields')?.classList.remove('active');document.getElementById('selectedTrack').innerHTML='<span>No video selected yet.</span>';document.getElementById('singerNameFields').innerHTML='';setWizardStep(1);}
function finishSignupToStart(){if(signupFinishTimer)clearTimeout(signupFinishTimer);show('queue');resetSignupWizard();}

async function saveMemoryOrder(position){
  const p=signupWizard.memoryPackage,t=signupWizard.track;if(signupWizard.supportChoice!=='memory_package'||!p)return null;
  const body={customer_name:signupWizard.names.join(' + '),customer_email:p.email||null,customer_phone:p.phone||null,delivery_method:p.delivery,package_type:p.name,payment_status:'paid_unverified',order_status:'active_paid_order',recording_status:'not_started',notes:p.notes||null,consent:true,singer_name:signupWizard.names.join(' + '),duet_partner:signupWizard.names.slice(1).join(' + ')||null,song_title:t.title,song_artist:t.artist||null,song_source_name:t.sourceName||'YouTube',song_source_url:t.url,queue_position:Number(position||0)||null,song_duration_seconds:Number(t.durationSeconds||0)||null,song_duration_text:t.durationText||null,song_duration_iso:t.durationIso||null};
  const response=await fetch(MEMORY_API_URL,{method:'POST',headers:{apikey:MEMORY_ANON_KEY,Authorization:'Bearer '+MEMORY_ANON_KEY,'Content-Type':'application/json',Prefer:'return=representation'},body:JSON.stringify(body)});
  const data=await response.json().catch(()=>null);if(!response.ok)throw new Error((data&&data.message)||'Memory order could not be saved.');return Array.isArray(data)?data[0]:data;
}

window.addEventListener('message',event=>{
  if(event.origin!=='https://songfinder.rowdyroom.site'||!event.data||event.data.type!=='ROWDY_SONG_SELECTED')return;
  const selected=event.data.payload||{},url=youtubeTrackUrl(selected.url);if(!url){msg('That result did not contain a valid YouTube video link.');return;}
  signupWizard.track={title:selected.videoTitle||selected.title||'',artist:selected.artist||'',sourceName:selected.sourceName||'YouTube',url,channel:selected.channel||'',durationSeconds:Number(selected.durationSeconds||0),durationText:selected.durationText||'',durationIso:selected.durationIso||''};
  document.getElementById('song').value=signupWizard.track.title;document.getElementById('artist').value=signupWizard.track.artist;document.getElementById('songSourceName').value=signupWizard.track.sourceName;document.getElementById('songSourceUrl').value=url;document.getElementById('songDurationSeconds').value=signupWizard.track.durationSeconds||'';document.getElementById('songDurationText').value=signupWizard.track.durationText;document.getElementById('songDurationIso').value=signupWizard.track.durationIso;
  document.getElementById('selectedTrack').innerHTML='<div><strong>'+esc(signupWizard.track.title)+'</strong><span>'+esc(signupWizard.track.sourceName)+(signupWizard.track.durationText?' · '+esc(signupWizard.track.durationText):'')+'</span></div><button class="secondary" type="button" onclick="openWizardSongFinder()">Change</button>';
  show('queue');renderSignupReview();setWizardStep(5);
});

async function joinQueue(){
  const names=signupWizard.names.map(v=>v.trim()).filter(Boolean),track=signupWizard.track;
  if(names.length!==signupWizard.singerCount){msg('Enter every singer name.');setWizardStep(2);return;}
  if(!track||!youtubeTrackUrl(track.url)){msg('Choose a YouTube karaoke track.');setWizardStep(3);return;}
  const button=document.getElementById('confirmSignupBtn');button.disabled=true;button.textContent='Joining...';
  try{
    const handle=document.getElementById('signupTikTok').value.trim();
    if(handle && !/^@?[a-zA-Z0-9_.]{1,24}$/.test(handle)){msg('Enter your actual TikTok username, using letters, numbers, dots or underscores.');setWizardStep(2);return;}
    const identity=await api('/identity/resolve',{method:'POST',body:JSON.stringify({...(handle?{tiktok_username:handle}:{user_id:'guest_'+crypto.randomUUID()}),display_name:names.join(' + ')})});if(!identity.ok)return;
    boostUsername=handle.replace(/^@/,'').toLowerCase();localStorage.setItem('rowdyRoomTikTokHandle',boostUsername);document.getElementById('boostHandle').value=boostUsername?'@'+boostUsername:'';
    userId=identity.user.user_id;localStorage.setItem('rowdyRoomUserId',userId);
    const payload={user_id:userId,singer_count:signupWizard.singerCount,singer_names:names,song_title:track.title,artist:track.artist,song_source_name:track.sourceName,song_source_url:track.url,song_duration_seconds:track.durationSeconds,song_duration_text:track.durationText,song_duration_iso:track.durationIso};
    const data=await api('/queue/join',{method:'POST',body:JSON.stringify(payload)});if(!data.ok)return;
    let memoryMessage='';try{const order=await saveMemoryOrder(data.position);if(order)memoryMessage=' Memory package '+(order.package_code||'order')+' was sent to the host.';}catch(error){memoryMessage=' You are in the queue, but the memory order needs host help: '+error.message;}
    document.querySelectorAll('.wizard-step').forEach(el=>el.classList.remove('active'));document.getElementById('signupSuccess').classList.add('active');document.getElementById('wizardTitle').textContent='Thank you for signing up';document.getElementById('wizardHelp').textContent='Your place is saved. Watch the TV for the live queue.';document.getElementById('signupSuccessText').textContent=names.join(' + ')+' — position #'+data.position+'.'+memoryMessage;document.querySelectorAll('[data-wstep]').forEach(el=>{el.classList.remove('active');el.classList.add('done');});
    await bootstrap();signupFinishTimer=setTimeout(finishSignupToStart,5000);
  }finally{button.disabled=false;button.textContent='Confirm & Join Queue';}
}

let selectedVoteRating = null;
let voteSubmitting = false;

function resetVoteSelection(){
  selectedVoteRating = null;
  document.querySelectorAll('#vote .vote-stars .star').forEach(btn=>{
    btn.classList.remove('selected');btn.setAttribute('aria-pressed','false');
  });
  document.getElementById('overallVoteText').textContent='Choose 1–5 stars.';
}

function selectVote(rating){
  if(!Number.isInteger(rating) || rating < 1 || rating > 5 || voteSubmitting) return;
  selectedVoteRating=rating;
  document.querySelectorAll('#vote .vote-stars .star').forEach((btn,index)=>{
    btn.classList.toggle('selected',index < rating);
    btn.setAttribute('aria-pressed',String(index+1===rating));
  });
  document.getElementById('overallVoteText').textContent=`Overall rating: ${rating}/5 stars`;
}

async function submitFairVote(){
  if(voteSubmitting) return;
  if(!selectedVoteRating){msg('Choose a rating from 1 to 5 stars.');return;}
  if(!currentPerformanceId){msg('Voting is closed until the host starts a singer.');return;}
  const rating=selectedVoteRating;
  voteSubmitting=true;
  const button=document.getElementById('submitVoteButton');button.disabled=true;
  try{
    const data=await api('/vote/submit',{method:'POST',body:JSON.stringify({
      voter_user_id:userId,performance_id:currentPerformanceId,rating,live_session_id:'live_show'
    })});
    if(data.ok){msg(`Vote submitted: ${rating}/5. +1 BP`);resetVoteSelection();}
    await bootstrap();
  }catch(error){msg('Could not confirm your vote. Refresh before trying again.');}
  finally{voteSubmitting=false;button.disabled=false;}
}

async function vote(rating){
  if(!currentPerformanceId){ msg('Voting is closed until the host starts a singer.'); return; }
  const data = await api('/vote/submit',{method:'POST',body:JSON.stringify({voter_user_id:userId,performance_id:currentPerformanceId,rating,live_session_id:'live_show'})});
  if(data.ok) msg('Vote submitted. +1 BP');
  await bootstrap();
}

async function memory(type){
  const data = await api('/memories/request',{method:'POST',body:JSON.stringify({request_type:type,buyer_user_id:userId,performer_user_id:'singer',live_session_id:'live_test',delivery_target:'buyer'})});
  if(data.ok) msg('Memory request created.');
  await bootstrap();
}

async function perf(type){
  const data = await api('/performer/request',{method:'POST',body:JSON.stringify({request_type:type,sponsor_user_id:userId,performer_user_id:'singer'})});
  if(data.ok) msg('Request created.');
  await bootstrap();
}

async function punch(){
  const data = await api('/rumble/punch',{method:'POST',body:JSON.stringify({user_id:userId})});
  if(data.ok) msg('Punch result: ' + data.result);
  await bootstrap();
}

async function lifeline(){
  const data = await api('/rumble/lifeline',{method:'POST',body:JSON.stringify({user_id:userId,team_id:'blue'})});
  if(data.ok) msg('Lifeline: ' + data.result);
  await bootstrap();
}

async function rumbleSlot(){
  const data = await api('/rumble/slot',{method:'POST',body:JSON.stringify({user_id:userId})});
  if(data.ok) msg('Rumble slot filled.');
  await bootstrap();
}

async function rumbleActivate(){
  const data = await api('/rumble/activate',{method:'POST',body:JSON.stringify({user_id:userId,live_session_id:'live_test'})});
  if(data.ok) msg('Rumble activation sponsored.');
  await bootstrap();
}

async function resurrection(){
  const data = await api('/rumble/resurrection',{method:'POST',body:JSON.stringify({user_id:userId,live_session_id:'live_test'})});
  if(data.ok) msg('Resurrection token purchased.');
  await bootstrap();
}

bootstrap();


async function resolveIdentity(){
  const handle = document.getElementById('profileHandle').value.trim();
  if(!handle){msg('Enter a TikTok handle.');return;}
  const data = await api('/identity/resolve',{method:'POST',body:JSON.stringify({tiktok_username:handle,display_name:handle})});
  if(data.ok){
    userId = data.user.user_id;
    localStorage.setItem('rowdyRoomUserId', userId);
    const queueHandle = document.getElementById('queueHandle');
    if(queueHandle) queueHandle.value = data.user.tiktok_username || '';
    msg('Using profile ' + (data.user.tiktok_username || data.user.user_id));
    await bootstrap();
  }
}

async function linkTikTok(){
  const handle = document.getElementById('profileHandle').value.trim();
  if(!handle){msg('Enter a TikTok handle.');return;}
  const data = await api('/identity/link-tiktok',{method:'POST',body:JSON.stringify({user_id:userId,tiktok_username:handle,verification_method:'companion_self_claimed_unverified'})});
  if(data.ok) msg('TikTok handle linked as starter identity.');
  await bootstrap();
}


async function startLiveCode(){
  const handle = document.getElementById('profileHandle').value.trim();
  if(!handle){msg('Enter a TikTok handle.');return;}
  const data = await api('/identity/start-live-code',{method:'POST',body:JSON.stringify({user_id:userId,tiktok_username:handle})});
  const box = document.getElementById('liveCodeBox');
  if(data.ok){
    box.innerHTML = `<div class="card"><h2>Live Verification Code</h2><p>Comment this in the TikTok live from ${data.tiktok_username}:</p><h1>${data.code}</h1><p>${data.instruction}</p></div>`;
    msg('Verification code created.');
  } else {
    box.innerHTML = `<p>${data.error || 'Could not create code.'}</p>`;
  }
}

async function manualVerifyLiveCode(){
  const handle = document.getElementById('profileHandle').value.trim();
  const comment = document.getElementById('manualComment').value.trim();
  if(!handle || !comment){msg('Enter handle and comment text.');return;}
  const data = await api('/identity/verify-live-code',{method:'POST',body:JSON.stringify({tiktok_username:handle,comment_text:comment,source_event_id:'manual_companion_app'})});
  if(data.ok) msg('TikTok handle verified.');
  else msg(data.error || 'Verification failed.');
  await bootstrap();
}


async function earnWatch(){
  const data = await api('/earn/watch-time',{method:'POST',body:JSON.stringify({user_id:userId,minutes:60,source_ref:'companion_app'})});
  if(data.ok) msg('Watch BP awarded: ' + data.awarded_amount);
  await bootstrap();
}

async function earnTaps(){
  const taps = Number(document.getElementById('tapCount').value || 0);
  const data = await api('/earn/taps',{method:'POST',body:JSON.stringify({user_id:userId,tap_count:taps,source_ref:'companion_app'})});
  if(data.ok) msg('Tap BP awarded: ' + data.awarded_amount);
  await bootstrap();
}

async function earnShares(){
  const shares = Number(document.getElementById('shareCount').value || 0);
  const data = await api('/earn/shares',{method:'POST',body:JSON.stringify({user_id:userId,share_count:shares,source_ref:'companion_app'})});
  if(data.ok) msg('Share BP awarded: ' + data.awarded_amount);
  await bootstrap();
}

async function sendChatEarn(){
  const msgText = document.getElementById('chatEarnText').value.trim();
  if(!msgText){msg('Enter chat text.');return;}
  const data = await api('/earn/chat-message',{method:'POST',body:JSON.stringify({user_id:userId,message_text:msgText,source_ref:'companion_app'})});
  if(data.ok && data.award && data.award.awarded_amount) msg('Chat BP awarded: ' + data.award.awarded_amount);
  else if(data.ok) msg(data.is_valid ? 'Valid chat saved.' : 'Chat did not count.');
  await bootstrap();
}




// Songbook Module v7
let songbookResultMap = {};

function esc(v){
  return String(v ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

async function songbookApi(action, options={}){
  const base = apiBase.replace(/\/$/,'') + '/songbook.php?action=' + encodeURIComponent(action);
  const res = await fetch(base + (options.query || ''), {
    method: options.method || 'GET',
    headers: {'Content-Type':'application/json'},
    body: options.body ? JSON.stringify(options.body) : undefined
  });
  const data = await res.json();
  if(!data.ok) msg(data.error || 'Songbook error');
  return data;
}

async function searchSongs(q=null){
  const input = document.getElementById('songSearch');
  const query = q === null ? (input ? input.value.trim() : '') : q;
  const data = await songbookApi('search', {query:'&q=' + encodeURIComponent(query)});
  if(data.ok) renderSongs(data.songs || []);
  await loadSongRequests();
}

function renderSongs(songs){
  const box = document.getElementById('songResults');
  if(!box) return;
  songbookResultMap = {};
  songs.forEach(s => songbookResultMap[s.song_id] = s);

  if(!songs.length){
    box.innerHTML = '<p class="empty-state">No songs found. Try another search or request the song as missing.</p>';
    return;
  }

  box.innerHTML = songs.map(s => `
    <div class="song-card">
      <strong>${esc(s.title)}</strong>
      <span>${esc(s.artist || 'Unknown artist')}${s.version ? ' · ' + esc(s.version) : ''}${s.song_code ? ' · #' + esc(s.song_code) : ''}</span>
      <div class="song-actions">
        <button onclick="useSongForQueue('${esc(s.song_id)}')">Use For Sign Up</button>
        <button class="secondary" onclick="requestSongById('${esc(s.song_id)}')">Request Song</button>
        <button class="secondary" onclick="favoriteSong('${esc(s.song_id)}')">Favorite</button>
      </div>
    </div>
  `).join('');
}

function useSongForQueue(songId){
  const s = songbookResultMap[songId];
  if(!s) return;
  const song = document.getElementById('song');
  const artist = document.getElementById('artist');
  signupWizard.prefill={title:s.title||'',artist:s.artist||''};
  show('queue');
  msg('Start with the number of singers. SongFinder will use this song next.');
  setWizardStep(1);
}

async function requestSongById(songId){
  const data = await songbookApi('request', {method:'POST', body:{user_id:userId, song_id:songId}});
  if(data.ok) msg('Song request sent to host.');
  await loadSongRequests();
}

async function favoriteSong(songId){
  const data = await songbookApi('favorite', {method:'POST', body:{user_id:userId, song_id:songId}});
  if(data.ok) msg('Saved to favorites.');
}

async function loadFavorites(){
  const data = await songbookApi('favorites', {query:'&user_id=' + encodeURIComponent(userId)});
  if(data.ok) renderSongs(data.songs || []);
  await loadSongRequests();
}

async function customSongRequest(){
  const title = document.getElementById('customSongTitle').value.trim();
  const artist = document.getElementById('customSongArtist').value.trim();
  if(!title){msg('Enter a song title.');return;}
  const data = await songbookApi('request', {method:'POST', body:{user_id:userId, custom_title:title, custom_artist:artist}});
  if(data.ok){
    msg('Missing-song request sent.');
    document.getElementById('customSongTitle').value = '';
    document.getElementById('customSongArtist').value = '';
  }
  await loadSongRequests();
}

async function loadSongRequests(){
  const box = document.getElementById('songRequestList');
  if(!box) return;
  const data = await songbookApi('my-requests', {query:'&user_id=' + encodeURIComponent(userId)});
  if(!data.ok) return;
  const rows = data.requests || [];
  box.innerHTML = rows.length ? rows.map(r => `
    <div class="row">
      <div>
        <strong>${esc(r.title || r.custom_title)}</strong><br>
        <span class="small">${esc(r.artist || r.custom_artist || '')}</span>
      </div>
      <span class="badge ${r.status === 'queued' ? 'green' : r.status === 'rejected' ? 'red' : 'gold'}">${esc(r.status)}</span>
    </div>
  `).join('') : '<p>No song requests yet.</p>';
}

document.addEventListener('DOMContentLoaded', () => {
  const songTab = document.querySelector('[data-screen="songbook"]');
  if(songTab) songTab.addEventListener('click', () => setTimeout(() => { searchSongs(''); loadSongRequests(); }, 0));
  if(normalizeScreen(location.hash) === 'songbook') setTimeout(() => { searchSongs(''); loadSongRequests(); }, 200);
});
window.addEventListener('hashchange', () => {
  if(normalizeScreen(location.hash) === 'songbook') setTimeout(() => { searchSongs(''); loadSongRequests(); }, 0);
});

/* Public Current Panel Lineup intentionally hidden 2026-09-17; host queue and Main 4 data remain active. */

/* Verified PayPal checkout — 2026-09-17 */
const VERIFIED_CHECKOUT_URL='https://szubjgpvlqliyparrnam.supabase.co/functions/v1/rowdy-paypal-order';
function chooseMemoryPackage(name,price,paymentUrl){
  const key=Number(price)===5?'bronze':Number(price)===10?'silver':Number(price)===20?'gold':'';
  signupWizard.supportChoice='memory_package';
  signupWizard.memoryPackage={name,price,key,email:'',phone:'',delivery:'Email',notes:''};
  document.querySelectorAll('.package-choice button').forEach(btn=>btn.classList.toggle('selected',btn.textContent.includes(String.fromCharCode(36)+price)));
  document.getElementById('memoryOrderFields').classList.add('active');
  const paid=document.getElementById('memoryPaidConfirm');if(paid&&paid.closest('label'))paid.closest('label').style.display='none';
  const next=document.querySelector('#memoryOrderFields button');if(next)next.textContent='Continue to Review';
}
function continueMemoryOrder(){
  if(!signupWizard.memoryPackage)return msg('Choose a package first.');
  const email=document.getElementById('memoryEmail').value.trim();
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))return msg('Enter a valid email for delivery.');
  if(!document.getElementById('memoryConsent').checked)return msg('Recording consent is required for a performance package.');
  Object.assign(signupWizard.memoryPackage,{email,phone:document.getElementById('memoryPhone').value.trim(),delivery:'Email',notes:document.getElementById('memoryNotes').value.trim()});
  renderSignupReview();setWizardStep(5);
}
async function saveMemoryOrder(position){
  const p=signupWizard.memoryPackage,t=signupWizard.track;if(signupWizard.supportChoice!=='memory_package'||!p)return null;
  const body={package_key:p.key,customer_name:signupWizard.names.join(' + '),customer_email:p.email,singer_name:signupWizard.names.join(' + '),duet_partner:signupWizard.names.slice(1).join(' + '),song_title:t.title,song_artist:t.artist||'',song_source_name:t.sourceName||'YouTube',song_source_url:t.url,queue_user_id:userId,queue_position:Number(position||0)||null,consent:true,notes:p.notes||''};
  const response=await fetch(VERIFIED_CHECKOUT_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const data=await response.json().catch(()=>null);if(!response.ok||!data||!data.ok)throw new Error((data&&data.error)||'Secure PayPal checkout could not be created.');
  sessionStorage.setItem('rowdyPaymentOrder',JSON.stringify({order_id:data.order_id,package_code:data.package_code}));
  location.assign(data.checkout_url);return data;
}
(function removeSelfPaymentClaim(){const paid=document.getElementById('memoryPaidConfirm');if(paid&&paid.closest('label'))paid.closest('label').style.display='none';})();

// Refresh only while the audience is viewing Vote; the server enforces the final window.
setInterval(() => { if(normalizeScreen(location.hash) === 'vote' && document.visibilityState === 'visible') bootstrap(); }, 15000);


let boostUsername=localStorage.getItem('rowdyRoomTikTokHandle')||'';
let boostEntries=[];
let boostSkipUsage={self:0,other:0};
let boostBusy=false;
document.getElementById('boostHandle').value=boostUsername?'@'+boostUsername:'';
function disconnectBoost(){boostUsername='';boostEntries=[];userId='';localStorage.removeItem('rowdyRoomTikTokHandle');localStorage.removeItem('rowdyRoomUserId');document.getElementById('boostHandle').value='';document.getElementById('walletBalance').textContent='—';document.getElementById('boostIdentity').textContent='Connect your TikTok username to see your points.';document.getElementById('boostHistory').textContent='No requests loaded.';document.getElementById('boostEntry').innerHTML='<option value="">Connect your username first</option>';updateSkipQuote();bootstrap();}
async function connectBoost(){
 const handle=document.getElementById('boostHandle').value.trim().replace(/^@/,'').toLowerCase();
 if(!/^[a-z0-9_.]{1,24}$/.test(handle)){msg('Enter your actual TikTok username.');return;}
 const identity=await api('/identity/resolve',{method:'POST',body:JSON.stringify({tiktok_username:handle,display_name:'@'+handle})});if(!identity.ok)return;
 userId=identity.user.user_id;localStorage.setItem('rowdyRoomUserId',userId);boostUsername=handle;localStorage.setItem('rowdyRoomTikTokHandle',handle);
 await refreshBoost();
}
async function refreshBoost(showError=true){
 if(!boostUsername)return;
 const requestedUser=userId,requestedHandle=boostUsername;
 try{
  const data=await api('/bp/wallet?user_id='+encodeURIComponent(requestedUser));if(!data.ok||userId!==requestedUser||boostUsername!==requestedHandle)return;
  updateWalletBalance(data.balance);document.getElementById('boostIdentity').textContent='@'+data.username+' · '+Math.max(0,3-Number(data.used_self_skips||0))+' self / '+Math.max(0,3-Number(data.used_other_skips||0))+' sponsored positions left this hour.';
  boostSkipUsage={self:Number(data.used_self_skips||0),other:Number(data.used_other_skips||0)};
  boostEntries=(data.eligible_entries||[]).map(e=>({...e,max_spots:Math.max(0,Math.min(e.max_spots,3-boostSkipUsage[e.is_self?'self':'other']))})).filter(e=>e.max_spots>0);const select=document.getElementById('boostEntry'),previous=select.value;
  select.innerHTML=boostEntries.length?boostEntries.map(e=>'<option value="'+esc(e.entry_id)+'">#'+e.position+' '+esc(e.singer||'Singer')+(e.is_self?' (you)':' (sponsor)')+' · '+esc(e.title)+' · up to '+e.max_spots+' position(s)</option>').join(''):'<option value="">No eligible waiting turn</option>';
  if(boostEntries.some(e=>e.entry_id===previous))select.value=previous;updateSkipQuote();
  document.getElementById('boostHistory').innerHTML=(data.requests||[]).map(r=>'<div class="row"><div><strong>'+esc(r.action==='play_song'?r.payload.title:'Skip '+r.payload.spots+' position(s) for '+(r.payload.target_singer||'selected singer'))+'</strong><br><span class="small">'+r.cost+' BP</span></div><span class="badge">'+esc(r.status==='processing'?'Approval finishing':r.status)+'</span></div>').join('')||'<p>No requests yet.</p>';
 }catch(e){if(showError)msg('Could not load BP. Please refresh.');}
}
function updateSkipQuote(){const entry=boostEntries.find(e=>e.entry_id===document.getElementById('boostEntry').value);const input=document.getElementById('boostSpots');input.max=entry?entry.max_spots:1;const spots=Math.max(1,Math.min(entry?entry.max_spots:1,Number(input.value)||1));input.value=spots;const button=document.getElementById('boostSkipButton');button.disabled=!entry;button.textContent='Request Skip · '+(spots*25)+' BP';}
async function submitBoost(action){
 if(!boostUsername){msg('Connect your TikTok username first.');return;}if(boostBusy)return;
 const input={user_id:userId,action};
 if(action==='line_skip'){input.entry_id=document.getElementById('boostEntry').value;input.spots=Number(document.getElementById('boostSpots').value);if(!input.entry_id)return;}
 else{input.title=document.getElementById('boostSong').value.trim();input.artist=document.getElementById('boostArtist').value.trim();input.url=document.getElementById('boostUrl').value.trim();if(!input.title){msg('Enter a song title.');return;}}
 boostBusy=true;try{const data=await api('/bp/request',{method:'POST',body:JSON.stringify(input)});if(data.ok){msg('Sent to the host. BP is charged only on approval.');if(action==='play_song')['boostSong','boostArtist','boostUrl'].forEach(id=>document.getElementById(id).value='');await refreshBoost();}}catch(e){msg('Request could not be sent. Refresh your requests before trying again.');}finally{boostBusy=false;}
}

tabs.forEach(t=>t.addEventListener('click',()=>{if(t.dataset.screen==='earn')refreshBoost();}));

setInterval(()=>{if(boostUsername&&normalizeScreen(location.hash)==='earn'&&document.visibilityState==='visible')refreshBoost(false);},15000);
if(boostUsername)refreshBoost(false);
