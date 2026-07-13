import assert from 'node:assert/strict';
import { existsSync, mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';
import {
  inspectInstall,
  install,
  restore,
} from './install-companion-media-control.mjs';

const deployRoot=join(new URL('.',import.meta.url).pathname,'../../deploy/companion-media');
const MISSION_CONTROL_ASSET=readFileSync(join(deployRoot,'mission-control-companion-media.js'),'utf8');
const COMPANION_ASSET=readFileSync(join(deployRoot,'companion-media-overlay.js'),'utf8');

function fixture(){
  const root=mkdtempSync(join(tmpdir(),'rr-companion-media-'));
  mkdirSync(join(root,'mission-control/assets'),{recursive:true});
  mkdirSync(join(root,'companion/assets'),{recursive:true});
  writeFileSync(join(root,'mission-control/index.html'),'<html><body><main>MC</main></body></html>');
  writeFileSync(join(root,'companion/index.html'),'<html><body><main>APP</main></body></html>');
  writeFileSync(join(root,'rowdy-room-live-vote.html'),"<script>const KEY='sb_publishable_test_key';</script>");
  return root;
}

test('Mission Control asset uses the protected RPC and exact controls',()=>{
  assert.match(MISSION_CONTROL_ASSET,/rr_admin_set_companion_media/);
  assert.match(MISSION_CONTROL_ASSET,/https:\/\/rowdyroom\.site\/media\/rowdy-room-explanation\.mp4/);
  assert.match(MISSION_CONTROL_ASSET,/PLAY ROOM EXPLANATION/);
  assert.match(MISSION_CONTROL_ASSET,/STOP VIDEO/);
  assert.match(MISSION_CONTROL_ASSET,/sessionStorage/);
  assert.match(MISSION_CONTROL_ASSET,/__ROWDY_SUPABASE_PUBLISHABLE_KEY__/);
  assert.match(MISSION_CONTROL_ASSET,/method:'HEAD'/);
});

test('Companion asset supports synchronized playback and mobile fallback',()=>{
  assert.match(COMPANION_ASSET,/rr_companion_media/);
  assert.match(COMPANION_ASSET,/POLL_MS=1500/);
  assert.match(COMPANION_ASSET,/video\.muted=false/);
  assert.match(COMPANION_ASSET,/video\.muted=true/);
  assert.match(COMPANION_ASSET,/TAP FOR SOUND/);
  assert.match(COMPANION_ASSET,/RETURN TO VOTING/);
  assert.match(COMPANION_ASSET,/elapsedSeconds/);
  assert.match(COMPANION_ASSET,/Keep the Companion App usable/);
});

test('reports both pages and assets as needing installation',()=>{
  const root=fixture();
  const report=inspectInstall(root);
  assert.equal(report.needsInstall,true);
  assert.equal(report.videoPresent,false);
  assert.match(report.patched.mc.source,/companion-media-control\.js/);
  assert.match(report.patched.companion.source,/companion-media-overlay\.js/);
});

test('installs scripts and patches each page exactly once',()=>{
  const root=fixture();
  const result=install(root);
  assert.equal(result.status,'installed');
  assert.equal(inspectInstall(root).needsInstall,false);
  assert.equal((readFileSync(join(root,'mission-control/index.html'),'utf8').match(/companion-media-control\.js/g)||[]).length,1);
  assert.equal((readFileSync(join(root,'companion/index.html'),'utf8').match(/companion-media-overlay\.js/g)||[]).length,1);
  const installedMission=readFileSync(join(root,'mission-control/assets/companion-media-control.js'),'utf8');
  assert.match(installedMission,/PLAY ROOM EXPLANATION/);
  assert.match(installedMission,/sb_publishable_test_key/);
  assert.doesNotMatch(installedMission,/__ROWDY_SUPABASE_PUBLISHABLE_KEY__/);
  assert.match(readFileSync(join(root,'companion/assets/companion-media-overlay.js'),'utf8'),/RETURN TO VOTING/);
});

test('is idempotent after installation',()=>{
  const root=fixture();
  install(root);
  const report=inspectInstall(root);
  assert.equal(report.needsInstall,false);
  assert.equal(report.patched.mc.changed,false);
  assert.equal(report.patched.companion.changed,false);
});

test('restores original pages and removes newly-created assets',()=>{
  const root=fixture();
  const originalMc=readFileSync(join(root,'mission-control/index.html'),'utf8');
  const originalCompanion=readFileSync(join(root,'companion/index.html'),'utf8');
  const installed=install(root);
  restore(installed.backupDir,root);
  assert.equal(readFileSync(join(root,'mission-control/index.html'),'utf8'),originalMc);
  assert.equal(readFileSync(join(root,'companion/index.html'),'utf8'),originalCompanion);
  assert.equal(existsSync(join(root,'mission-control/assets/companion-media-control.js')),false);
  assert.equal(existsSync(join(root,'companion/assets/companion-media-overlay.js')),false);
});

test('refuses ambiguous HTML closing markers',()=>{
  const root=fixture();
  writeFileSync(join(root,'companion/index.html'),'<body></body><body></body>');
  assert.throws(()=>inspectInstall(root),/expected exactly one/);
});
