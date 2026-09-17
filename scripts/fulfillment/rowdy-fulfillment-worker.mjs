import { spawn } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { mkdir, open, readFile, rename, stat, writeFile } from 'node:fs/promises';
import { createReadStream, existsSync } from 'node:fs';
import { basename, join } from 'node:path';
import dgram from 'node:dgram';

const ROOT = new URL('.', import.meta.url).pathname.replace(/^\/(.:)/, '$1').replace(/\//g, '\\');
const ENV_PATH = join(ROOT, '.env.local');
const STATE_PATH = join(ROOT, 'worker-state.json');

function parseEnv(text) {
  return Object.fromEntries(text.split(/\r?\n/).filter(x => x && !x.trim().startsWith('#')).map(line => {
    const at = line.indexOf('='); return at < 0 ? [line.trim(), ''] : [line.slice(0, at).trim(), line.slice(at + 1).trim()];
  }));
}
const cfg = parseEnv(await readFile(ENV_PATH, 'utf8'));
const required = ['SUPABASE_URL','SUPABASE_ANON_KEY','WORKER_ID','WORKER_TOKEN','FFMPEG_PATH','OUTPUT_DIR','DELIVERY_URL','DELIVERY_TOKEN','SMTP_HOST','SMTP_PORT','SMTP_USERNAME','SMTP_PASSWORD','PYTHON_PATH'];
for (const key of required) if (!cfg[key]) throw new Error(`Missing ${key} in ${ENV_PATH}`);
await mkdir(cfg.OUTPUT_DIR, { recursive: true });

let state = existsSync(STATE_PATH) ? JSON.parse(await readFile(STATE_PATH, 'utf8')) : { active: null, lastError: null, updatedAt: null };
const saveState = async () => { state.updatedAt = new Date().toISOString(); await writeFile(STATE_PATH, JSON.stringify(state, null, 2)); };
const log = (...v) => console.log(new Date().toISOString(), ...v);

async function rpc(name, body) {
  const response = await fetch(`${cfg.SUPABASE_URL}/rest/v1/rpc/${name}`, {
    method: 'POST', headers: { apikey: cfg.SUPABASE_ANON_KEY, Authorization: `Bearer ${cfg.SUPABASE_ANON_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const data = await response.json().catch(() => null);
  if (!response.ok) throw new Error(data?.message || `${name} failed (${response.status})`);
  return data;
}

function oscString(value) { const raw = Buffer.from(value + '\0'); return Buffer.concat([raw, Buffer.alloc((4 - raw.length % 4) % 4)]); }
function oscInt(value) { const b = Buffer.alloc(4); b.writeInt32BE(value); return b; }
async function sendOsc(path, value) {
  const socket = dgram.createSocket('udp4');
  const packet = Buffer.concat([oscString(path), oscString(',i'), oscInt(value)]);
  await new Promise((resolve, reject) => socket.send(packet, Number(cfg.OBSBOT_OSC_PORT || 16284), '127.0.0.1', e => e ? reject(e) : resolve()));
  socket.close();
}
async function tracking(on) {
  // Tiny 2 Lite tracking stays enabled in OBSBOT Center's Human/Group mode.
  // Do not send a blind toggle: a missing or stale OSC listener could leave
  // tracking disabled at the start of a paid performance.
  if ((cfg.OBSBOT_CONTROL_MODE || 'always_on') === 'always_on') return;
  await sendOsc('/OBSBOT/WebCam/General/SelectDevice', 0).catch(() => {});
  await sendOsc('/OBSBOT/WebCam/Tiny/ToggleAILock', on ? 1 : 0);
}

function ffmpeg(args) {
  return spawn(cfg.FFMPEG_PATH, args, { stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
}
async function startCapture(order, job) {
  const safe = String(order.package_code).replace(/[^A-Za-z0-9_-]/g, '_');
  const temp = join(cfg.OUTPUT_DIR, `${safe}.recording.mkv`);
  await tracking(true);
  const camera = cfg.CAMERA_NAME || 'OBSBOT Tiny 2 Lite StreamCamera';
  const primaryAudio = cfg.AUDIO_NAME || 'Line (3- Yamaha AG06MK2)';
  const backupAudio = cfg.BACKUP_AUDIO_NAME || 'OBSBOT Tiny 2 Lite Microphone (3- OBSBOT Tiny 2 Lite Audio)';
  const args = ['-hide_banner','-loglevel','warning','-f','dshow','-rtbufsize','512M','-video_size','1920x1080','-framerate','30','-i',`video=${camera}:audio=${primaryAudio}`];
  if (backupAudio && backupAudio !== primaryAudio) {
    args.push('-f','dshow','-i',`audio=${backupAudio}`,'-filter_complex','[0:a][1:a]amix=inputs=2:duration=first:dropout_transition=2:weights=1 0.35[aout]','-map','0:v:0','-map','[aout]');
  }
  args.push('-c:v','h264_nvenc','-preset','p4','-b:v','10M','-c:a','aac','-b:a','256k','-y',temp);
  const proc = ffmpeg(args);
  state.active = { jobId: job.id, orderId: order.id, singer: order.singer_name, temp, pid: proc.pid, startedAt: new Date().toISOString() };
  await saveState();
  await rpc('rr_worker_update_job',{p_worker_id:cfg.WORKER_ID,p_token:cfg.WORKER_TOKEN,p_job_id:job.id,p_status:'recording',p_result:{capture_path:temp},p_error:null});
  proc.stderr.on('data', d => log('ffmpeg', String(d).trim()));
  proc.on('exit', code => log('capture exit', code));
  log('Recording started for', order.package_code, order.singer_name);
}
async function stopCapture() {
  if (!state.active) return;
  try { process.kill(state.active.pid, 'SIGINT'); } catch {}
  await new Promise(r => setTimeout(r, 1800));
  await tracking(false).catch(() => {});
  const finalPath = state.active.temp.replace('.recording.mkv', '.master.mkv');
  if (existsSync(state.active.temp)) await rename(state.active.temp, finalPath);
  const jobId = state.active.jobId;
  await rpc('rr_worker_update_job',{p_worker_id:cfg.WORKER_ID,p_token:cfg.WORKER_TOKEN,p_job_id:jobId,p_status:'ready_to_edit',p_result:{capture_path:finalPath},p_error:null});
  log('Recording stopped', finalPath);
  state.active = null; await saveState();
}

async function currentPerformer() {
  const response = await fetch(cfg.QUEUE_URL || 'https://rowdyroom.site/api/queue', { cache: 'no-store' });
  if (!response.ok) throw new Error(`Queue unavailable (${response.status})`);
  const data = await response.json();
  return (data.queue || []).find(x => String(x.status).toLowerCase() === 'current') || null;
}
const norm = value => String(value || '').trim().toLowerCase().replace(/^@/, '');
function matches(order, performer) {
  if (!performer) return false;
  return norm(order.queue_user_id) === norm(performer.user_id) || norm(order.singer_name).split(/\s*\+\s*/).includes(norm(performer.tiktok_username));
}

async function edit(job, order) {
  const source = job.result?.capture_path;
  if (!source || !existsSync(source)) throw new Error('Recorded master is missing.');
  const dir = join(cfg.OUTPUT_DIR, String(order.package_code)); await mkdir(dir, { recursive: true });
  const title = `${order.singer_name || 'Rowdy Room'} - ${order.song_title || 'Live Karaoke'}`.replace(/[\\/:*?"<>|]/g, '-');
  const outputs = [];
  const run = args => new Promise((resolve,reject) => { const p=ffmpeg(args); let err=''; p.stderr.on('data',d=>err+=d); p.on('exit',c=>c===0?resolve():reject(new Error(err.slice(-1500)||`ffmpeg ${c}`))); });
  const photoCount = order.package_key === 'bronze' ? 5 : 8;
  await run(['-hide_banner','-loglevel','error','-i',source,'-vf',`fps=1/20,scale=1920:-2`,'-frames:v',String(photoCount),'-q:v','2','-y',join(dir,'photo-%02d.jpg')]);
  outputs.push({kind:'photos',count:photoCount});
  if (order.package_key === 'silver' || order.package_key === 'gold') {
    const highlight=join(dir,`${title} - Highlight.mp4`);
    await run(['-hide_banner','-loglevel','error','-ss','15','-i',source,'-t','45','-vf',"scale=1920:-2,drawtext=text='ROWDY ROOM LIVE':x=(w-text_w)/2:y=40:fontsize=48:fontcolor=white:borderw=3",'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:v','h264_nvenc','-preset','p4','-c:a','aac','-movflags','+faststart','-y',highlight]);
    outputs.push({kind:'highlight',path:highlight});
  }
  if (order.package_key === 'gold') {
    const full=join(dir,`${title} - Full Performance.mp4`);
    await run(['-hide_banner','-loglevel','error','-i',source,'-vf',"scale=1920:-2,drawtext=text='ROWDY ROOM LIVE':x=(w-text_w)/2:y=40:fontsize=48:fontcolor=white:borderw=3",'-af','loudnorm=I=-16:TP=-1.5:LRA=11','-c:v','h264_nvenc','-preset','p4','-c:a','aac','-movflags','+faststart','-y',full]);
    outputs.push({kind:'full',path:full});
  }
  const manifest={order:order.package_code,customer:order.customer_name,email:order.customer_email,createdAt:new Date().toISOString(),outputs};
  const manifestPath=join(dir,'manifest.json'); await writeFile(manifestPath,JSON.stringify(manifest,null,2));
  await rpc('rr_worker_update_job',{p_worker_id:cfg.WORKER_ID,p_token:cfg.WORKER_TOKEN,p_job_id:job.id,p_status:'ready_to_deliver',p_result:{...job.result,output_dir:dir,manifest_path:manifestPath,outputs},p_error:null});
}

function runProcess(command,args){return new Promise((resolve,reject)=>{const p=spawn(command,args,{stdio:['ignore','pipe','pipe'],windowsHide:true});let err='';p.stderr.on('data',d=>err+=d);p.on('exit',c=>c===0?resolve():reject(new Error(err.slice(-1500)||`${command} exited ${c}`)));});}
function sendDeliveryEmail(order,deliveryUrl){return new Promise((resolve,reject)=>{const script=join(ROOT,'send-delivery-email.py'),p=spawn(cfg.PYTHON_PATH,[script],{stdio:['pipe','pipe','pipe'],windowsHide:true});let out='',err='';p.stdout.on('data',d=>out+=d);p.stderr.on('data',d=>err+=d);p.on('exit',c=>c===0?resolve(out):reject(new Error(err.slice(-1500)||`Email sender exited ${c}`)));p.stdin.end(JSON.stringify({host:cfg.SMTP_HOST,port:Number(cfg.SMTP_PORT),username:cfg.SMTP_USERNAME,password:cfg.SMTP_PASSWORD,to:order.customer_email,customer:order.customer_name||order.singer_name||'Rowdy Room Guest',package_code:order.package_code,delivery_url:deliveryUrl}));});}
async function fileHash(path){const hash=createHash('sha256');await new Promise((resolve,reject)=>{const stream=createReadStream(path);stream.on('data',d=>hash.update(d));stream.on('error',reject);stream.on('end',resolve);});return hash.digest('hex');}
async function deliver(job,order){
  const dir=job.result?.output_dir;if(!dir||!existsSync(dir))throw new Error('Edited package directory is missing.');
  const safe=String(order.package_code).replace(/[^A-Za-z0-9_-]/g,'_'),archive=join(cfg.OUTPUT_DIR,`${safe}.zip`);
  await runProcess('tar.exe',['-a','-c','-f',archive,'-C',dir,'.']);
  const size=(await stat(archive)).size,sha256=await fileHash(archive),deliveryKey=randomBytes(24).toString('hex'),filename=`${safe}.zip`,chunkSize=5*1024*1024,handle=await open(archive,'r');
  try{for(let offset=0,index=0;offset<size;offset+=chunkSize,index++){const length=Math.min(chunkSize,size-offset),buffer=Buffer.alloc(length);await handle.read(buffer,0,length,offset);const form=new FormData();form.set('action','chunk');form.set('delivery_key',deliveryKey);form.set('filename',filename);form.set('index',String(index));form.set('chunk',new Blob([buffer]),`chunk-${index}`);const response=await fetch(cfg.DELIVERY_URL,{method:'POST',headers:{'X-Rowdy-Worker-Token':cfg.DELIVERY_TOKEN},body:form});const data=await response.json().catch(()=>null);if(!response.ok||!data?.ok)throw new Error(data?.error||`Delivery upload failed (${response.status})`);}}
  finally{await handle.close();}
  const form=new FormData();form.set('action','finalize');form.set('delivery_key',deliveryKey);form.set('filename',filename);form.set('sha256',sha256);form.set('email',order.customer_email);form.set('customer',order.customer_name||order.singer_name||'Rowdy Room Guest');form.set('package_code',order.package_code);
  const response=await fetch(cfg.DELIVERY_URL,{method:'POST',headers:{'X-Rowdy-Worker-Token':cfg.DELIVERY_TOKEN},body:form}),data=await response.json().catch(()=>null);if(!response.ok||!data?.ok)throw new Error(data?.error||`Delivery finalize failed (${response.status})`);
  await sendDeliveryEmail(order,data.delivery_url);
  await rpc('rr_worker_update_job',{p_worker_id:cfg.WORKER_ID,p_token:cfg.WORKER_TOKEN,p_job_id:job.id,p_status:'delivered',p_result:{...job.result,archive_path:archive,archive_sha256:sha256,delivery_url:data.delivery_url,emailed_at:new Date().toISOString()},p_error:null});
  log('Package delivered and emailed',order.package_code,order.customer_email);
}

async function cycle() {
  const performer = await currentPerformer();
  if (state.active && !performer) await stopCapture();
  const jobs = await rpc('rr_worker_claim_jobs',{p_worker_id:cfg.WORKER_ID,p_token:cfg.WORKER_TOKEN,p_limit:10});
  for (const job of jobs || []) {
    const order = await rpc('rr_worker_get_order',{p_worker_id:cfg.WORKER_ID,p_token:cfg.WORKER_TOKEN,p_order_id:job.order_id});
    if (job.status === 'waiting_for_performance' && !state.active && matches(order, performer)) await startCapture(order, job);
    else if (job.status === 'recording' && state.active?.jobId === job.id && !matches(order, performer)) await stopCapture();
    else if (job.status === 'ready_to_edit') await edit(job, order);
    else if (job.status === 'ready_to_deliver') await deliver(job, order);
  }
  state.lastError=null; await saveState();
}

log('Rowdy fulfillment worker online. Recording is triggered only by the live queue current performer.');
for (;;) {
  try { await cycle(); } catch (error) { state.lastError=String(error?.stack||error); await saveState(); log('ERROR',error.message); }
  await new Promise(r => setTimeout(r, Number(cfg.POLL_MS || 2000)));
}
