import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRumbleSetupFocusFix } from './fix-setup-focus.mjs';

const fixture = `
<script>
function saveState(){localStorage.setItem(STORAGE_KEY,JSON.stringify(state)); if(channel) channel.postMessage(state); render();}
function renderTeamInputs(){
  for(let i=0;i<n;i++){
    redInputs.innerHTML+=\`<input id="redP\${i}" oninput="state.redTeam[\${i}]=this.value; saveState()">\`;
    blueInputs.innerHTML+=\`<input id="blueP\${i}" oninput="state.blueTeam[\${i}]=this.value; saveState()">\`;
  }
}
</script>`;

test('patches setup inputs without changing unrelated saveState calls', () => {
  const result = applyRumbleSetupFocusFix(fixture);
  assert.equal(result.changed, true);
  assert.match(result.source, /function saveState\(shouldRender=true\)/);
  assert.match(result.source, /state\.redTeam\[\$\{i\}\]=this\.value; saveState\(false\)/);
  assert.match(result.source, /state\.blueTeam\[\$\{i\}\]=this\.value; saveState\(false\)/);
});

test('is idempotent after the patch is applied', () => {
  const once = applyRumbleSetupFocusFix(fixture);
  const twice = applyRumbleSetupFocusFix(once.source);
  assert.equal(twice.changed, false);
  assert.equal(twice.status, 'already-patched');
  assert.equal(twice.source, once.source);
});

test('refuses to modify an unexpected file shape', () => {
  assert.throws(
    () => applyRumbleSetupFocusFix('<html>wrong version</html>'),
    /expected exactly 1 match/
  );
});
