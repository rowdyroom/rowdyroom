import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
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
const required = ['SUPABASE_URL','SUPABASE_ANON_KEY','WORKER_ID','WORKER_TOKEN','FFMPEG_PATH','OUTPUT_DIR'];
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
  const input = `video=${cfg.CAMERA_NAME || 'OBSBOT Tiny 2 Lite StreamCamera'}:audio=${cfg.AUDIO_NAME || 'Line (3- Yamaha AG06MK2)'}`;
  const proc = ffmpeg(['-hide_banner','-loglevel','warning','-f','dshow','-rtbufsize','512M','-video_size','1920x1080','-framerate','30','-i',input,'-c:v','h264_nvenc','-preset','p4','-b:v','10M','-c:a','aac','-b:a','256k','-y',temp]);
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
    await run(['-hide_banner','-loglevel','error','-ss','15','-i',source,'-t','45','-vf',"scale=1920:-2,drawtext=text='ROWDY ROOM LIVE':x=(w-text_w)/2:y=40:fontsize=48:fontcolor=white:borderw=3",'-c:v','h264_nvenc','-preset','p4','-c:a','aac','-movflags','+faststart','-y',highlight]);
    outputs.push({kind:'highlight',path:highlight});
  }
  if (order.package_key === 'gold') {
    const full=join(dir,`${title} - Full Performance.mp4`);
    await run(['-hide_banner','-loglevel','error','-i',source,'-vf',"scale=1920:-2,drawtext=text='ROWDY ROOM LIVE':x=(w-text_w)/2:y=40:fontsize=48:fontcolor=white:borderw=3",'-c:v','h264_nvenc','-preset','p4','-c:a','aac','-movflags','+faststart','-y',full]);
    outputs.push({kind:'full',path:full});
  }
  const manifest={order:order.package_code,customer:order.customer_name,email:order.customer_email,createdAt:new Date().toISOString(),outputs};
  const manifestPath=join(dir,'manifest.json'); await writeFile(manifestPath,JSON.stringify(manifest,null,2));
  await rpc('rr_worker_update_job',{p_worker_id:cfg.WORKER_ID,p_token:cfg.WORKER_TOKEN,p_job_id:job.id,p_status:'ready_to_deliver',p_result:{...job.result,output_dir:dir,manifest_path:manifestPath,outputs},p_error:null});
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
  }
  state.lastError=null; await saveState();
}

log('Rowdy fulfillment worker online. Recording is triggered only by the live queue current performer.');
for (;;) {
  try { await cycle(); } catch (error) { state.lastError=String(error?.stack||error); await saveState(); log('ERROR',error.message); }
  await new Promise(r => setTimeout(r, Number(cfg.POLL_MS || 2000)));
}

