#!/usr/bin/env node
import { copyFileSync, existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR=dirname(fileURLToPath(import.meta.url));
const REPO_ROOT=resolve(SCRIPT_DIR,'../..');
const SOURCE_DIR=join(REPO_ROOT,'deploy/companion-media');
const MC_TAG='<script src="/mission-control/assets/companion-media-control.js" defer></script>';
const COMPANION_TAG='<script src="/companion/assets/companion-media-overlay.js" defer></script>';

function patchHtml(source,tag,label){
  if(source.includes(tag)) return {source,changed:false,status:'already-patched'};
  const matches=source.match(/<\/body>/gi)||[];
  if(matches.length!==1) throw new Error(`${label}: expected exactly one </body> marker, found ${matches.length}.`);
  return {source:source.replace(/<\/body>/i,`${tag}\n</body>`),changed:true,status:'patched'};
}

function atomicWrite(path,content){
  mkdirSync(dirname(path),{recursive:true});
  const temp=`${path}.tmp`;
  writeFileSync(temp,content,'utf8');
  renameSync(temp,path);
}

function timestamp(){return new Date().toISOString().replace(/[:.]/g,'-');}

function discoverPublishableKey(webRoot){
  const configured=String(process.env.ROWDY_SUPABASE_PUBLISHABLE_KEY||'').trim();
  if(/^sb_publishable_[A-Za-z0-9_-]+$/.test(configured)) return configured;
  const candidates=[
    join(webRoot,'rowdy-room-live-vote.html'),
    join(webRoot,'assets/js/rowdy-home.js'),
    join(webRoot,'companion/assets/app.js')
  ];
  for(const candidate of candidates){
    if(!existsSync(candidate)) continue;
    const match=readFileSync(candidate,'utf8').match(/sb_publishable_[A-Za-z0-9_-]+/);
    if(match) return match[0];
  }
  throw new Error('Supabase publishable key was not found. Set ROWDY_SUPABASE_PUBLISHABLE_KEY or keep it in the deployed vote page.');
}

function configuredAsset(source,publishableKey){
  const marker='__ROWDY_SUPABASE_PUBLISHABLE_KEY__';
  if(!source.includes(marker)) throw new Error('Companion media asset key marker is missing.');
  return source.replaceAll(marker,publishableKey);
}

function targets(webRoot){
  return {
    mcHtml:join(webRoot,'mission-control/index.html'),
    mcAsset:join(webRoot,'mission-control/assets/companion-media-control.js'),
    companionHtml:join(webRoot,'companion/index.html'),
    companionAsset:join(webRoot,'companion/assets/companion-media-overlay.js'),
    video:join(webRoot,'media/rowdy-room-explanation.mp4')
  };
}

export function inspectInstall(webRoot){
  const t=targets(webRoot);
  if(!existsSync(t.mcHtml)) throw new Error(`Missing Mission Control page: ${t.mcHtml}`);
  if(!existsSync(t.companionHtml)) throw new Error(`Missing Companion page: ${t.companionHtml}`);
  const mc=patchHtml(readFileSync(t.mcHtml,'utf8'),MC_TAG,'Mission Control page');
  const companion=patchHtml(readFileSync(t.companionHtml,'utf8'),COMPANION_TAG,'Companion page');
  return {
    webRoot,
    needsInstall:mc.changed||companion.changed||!existsSync(t.mcAsset)||!existsSync(t.companionAsset),
    videoPresent:existsSync(t.video),
    targets:t,
    patched:{mc,companion}
  };
}

export function install(webRoot){
  const report=inspectInstall(webRoot);
  const backupDir=join(webRoot,'../rowdyroom_backups',`companion-media-${timestamp()}`);
  mkdirSync(backupDir,{recursive:true});
  const manifest={webRoot,files:{}};
  for(const [name,path] of Object.entries(report.targets)){
    if(name==='video') continue;
    const existed=existsSync(path);
    manifest.files[name]={path,existed};
    if(existed){
      const backup=join(backupDir,name);
      copyFileSync(path,backup);
      manifest.files[name].backup=backup;
    }
  }
  writeFileSync(join(backupDir,'manifest.json'),JSON.stringify(manifest,null,2)+'\n','utf8');
  try{
    const publishableKey=discoverPublishableKey(webRoot);
    atomicWrite(report.targets.mcHtml,report.patched.mc.source);
    atomicWrite(report.targets.companionHtml,report.patched.companion.source);
    atomicWrite(report.targets.mcAsset,configuredAsset(readFileSync(join(SOURCE_DIR,'mission-control-companion-media.js'),'utf8'),publishableKey));
    atomicWrite(report.targets.companionAsset,configuredAsset(readFileSync(join(SOURCE_DIR,'companion-media-overlay.js'),'utf8'),publishableKey));
    const verified=inspectInstall(webRoot);
    if(verified.needsInstall) throw new Error('Post-install verification failed.');
    return {...verified,status:'installed',backupDir};
  }catch(error){
    restore(backupDir,webRoot);
    throw new Error(`Installation failed and was rolled back: ${error instanceof Error?error.message:String(error)}`);
  }
}

export function restore(backupDir,webRoot){
  const manifest=JSON.parse(readFileSync(join(backupDir,'manifest.json'),'utf8'));
  if(resolve(manifest.webRoot)!==resolve(webRoot)) throw new Error('Backup web root does not match restore target.');
  for(const item of Object.values(manifest.files)){
    if(item.existed) atomicWrite(item.path,readFileSync(item.backup,'utf8'));
    else if(existsSync(item.path)) rmSync(item.path);
  }
  return {status:'restored',backupDir,webRoot};
}

function usage(){
  console.error('Usage:');
  console.error('  node tools/companion-media/install-companion-media-control.mjs --check <public_html>');
  console.error('  node tools/companion-media/install-companion-media-control.mjs --apply <public_html>');
  console.error('  node tools/companion-media/install-companion-media-control.mjs --restore <backup-dir> <public_html>');
}

const isMain=process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1];
if(isMain){
  const [mode,first,second]=process.argv.slice(2);
  try{
    if(mode==='--check'&&first) console.log(JSON.stringify(inspectInstall(resolve(first)),null,2));
    else if(mode==='--apply'&&first) console.log(JSON.stringify(install(resolve(first)),null,2));
    else if(mode==='--restore'&&first&&second) console.log(JSON.stringify(restore(resolve(first),resolve(second)),null,2));
    else{usage();process.exitCode=2;}
  }catch(error){console.error(error instanceof Error?error.message:String(error));process.exitCode=1;}
}
