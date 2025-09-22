// [[HANDLE: FIRST_RUN_SCREEN]]
import { firstRunSetup, unlockAndLoad, saveNow } from '../../core/storage.js';
import { setJSON, getJSON } from '../../core/idb.js';
import { constantTimeEquals, guardAttempts, registerFailure, registerSuccess } from '../../utils/secure.js';

const BOOTSTRAP_SECRET = "parasite-primal-circling-unveiling-gab-shuffle-share-clarify-diagnosis";
const BOOTSTRAP_K = 'bootstrap_meta';

async function isBootstrapComplete(){
  const meta = await getJSON(BOOTSTRAP_K);
  return !!meta?.bootstrapComplete;
}

export function mountFirstRun(root){
  root.innerHTML = `
    <h2 class="h2">CarePlanner – First-time setup</h2>

    <div id="bootstrapCard" class="card">
      <h3 class="h3">Bootstrap</h3>
      <p>Enter the one-time bootstrap passphrase to continue.</p>
      <input id="bsSecret" type="password" autocomplete="off" class="input" placeholder="Enter passphrase">
      <button id="bsBtn" class="button">Unlock</button>
      <p id="bsMsg" class="small" aria-live="polite"></p>
    </div>

    <div id="setupCard" class="card" style="display:none">
      <p>This will set a master password (Superuser) and create a data file.</p>
      <div class="row">
        <div class="col-6">
          <label>Master password (Superuser)</label>
          <input id="pw1" type="password" autocomplete="new-password">
        </div>
        <div class="col-6">
          <label>Confirm password</label>
          <input id="pw2" type="password" autocomplete="new-password">
        </div>
      </div>
      <div class="row">
        <div class="col-12">
          <label>CarePlanner data file location</label>
          <input id="path" type="text" readonly placeholder="Will prompt to pick/save .cpf" class="input">
        </div>
      </div>
      <div class="stack">
        <button id="btnPick" class="button secondary">Choose / Create .cpf file</button>
        <button id="btnSave" class="button primary">Create & Save</button>
      </div>
    </div>

    <div class="card">
      <h3 class="h3">Unlock existing</h3>
      <div class="row">
        <div class="col-8">
          <input id="pwUnlock" type="password" placeholder="Master password">
        </div>
        <div class="col-4">
          <button id="btnUnlock" class="button">Unlock</button>
        </div>
      </div>
    </div>
  `;

  const $ = (id)=>root.querySelector(id);

  async function showCorrectPane(){
    if (await isBootstrapComplete()){
      $('#bootstrapCard').style.display='none';
      $('#setupCard').style.display='';
    } else {
      $('#bootstrapCard').style.display='';
      $('#setupCard').style.display='none';
    }
  }
  showCorrectPane();

  // Bootstrap gate
  $('#bsBtn').addEventListener('click', async ()=>{
    const input = $('#bsSecret').value.trim();
    try{
      guardAttempts();
      const ok = constantTimeEquals(input, BOOTSTRAP_SECRET);
      if (!ok) {
        registerFailure();
        $('#bsMsg').textContent = "Incorrect passphrase.";
        $('#bsSecret').value = "";
        $('#bsSecret').focus();
        return;
      }
      registerSuccess();
      await setJSON(BOOTSTRAP_K, { bootstrapComplete: true, t: Date.now() });
      $('#bsMsg').textContent = "Unlocked. Continue with master password setup below.";
      showCorrectPane();
    }catch(e){
      $('#bsMsg').textContent = e.message;
    }
  });

  // File picker
  $('#btnPick').addEventListener('click', async ()=>{
    if ('showSaveFilePicker' in window){
      const handle = await window.showSaveFilePicker({
        suggestedName: 'careplanner-data.cpf',
        types: [{ description:'CarePlanner Encrypted File', accept: {'application/json':['.cpf']} }]
      });
      $('#path').value = handle.name || 'careplanner-data.cpf';
      // storage.js will remember handle internally (where supported)
      window.__cp_handle = handle;
    } else {
      alert('Using internal storage (OPFS) on this browser.');
      $('#path').value = '/careplanner/data.cpf (OPFS)';
    }
  });

  // Create new master + data file
  $('#btnSave').addEventListener('click', async ()=>{
    const p1 = $('#pw1').value, p2 = $('#pw2').value;
    if (p1.length < 12) return alert('Please use at least 12 characters.');
    if (p1 !== p2) return alert('Passwords do not match.');
    try{
      await firstRunSetup(p1, window.__cp_handle); // respects your existing storage flow
      await saveNow(); // initial write
      alert('Created. You can now use the Clinical tab.');
      location.hash = '#/clinical';
      location.reload();
    }catch(e){
      console.error(e);
      alert('Setup failed: ' + e.message);
    }
  });

  // Unlock existing
  $('#btnUnlock').addEventListener('click', async ()=>{
    const p = $('#pwUnlock').value;
    try{
      await unlockAndLoad(p);
      alert('Unlocked.');
      location.hash = '#/clinical';
      location.reload();
    }catch(e){
      alert('Unlock failed. Check password or data file.');
    }
  });
}
