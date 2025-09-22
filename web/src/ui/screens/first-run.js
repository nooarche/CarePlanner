// [[HANDLE: FIRST_RUN_SCREEN]]
import { firstRunSetup, unlockAndLoad, saveNow } from '../../core/storage.js';

export function mountFirstRun(root){
  root.innerHTML = `
    <h2 class="h2">CarePlanner – First-time setup</h2>
    <div class="card">
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
        <div class="col-8">
          <label>Choose data file name</label>
          <input id="fname" value="CarePlanner.cpf">
        </div>
        <div class="col-4">
          <label>&nbsp;</label>
          <button class="button" id="choosePath">Choose save location…</button>
        </div>
      </div>
      <div class="stack">
        <button class="button primary" id="btnSetup">Set up CarePlanner</button>
      </div>
      <p class="small">A small keyfile will also be written to this device for extra protection.</p>
    </div>

    <div class="card">
      <h3 class="h3">Already set up?</h3>
      <div class="row">
        <div class="col-6">
          <label>Enter master password to unlock</label>
          <input id="pwUnlock" type="password" autocomplete="current-password">
        </div>
        <div class="col-6">
          <label>&nbsp;</label>
          <button class="button" id="btnUnlock">Unlock</button>
        </div>
      </div>
    </div>
  `;

  let chosenName = 'CarePlanner.cpf';
  document.getElementById('choosePath').addEventListener('click', async ()=>{
    try{
      if (!window.showSaveFilePicker) { alert('Your browser does not support choosing a file path. It will save to a private app folder.'); return; }
      const handle = await window.showSaveFilePicker({
        suggestedName: document.getElementById('fname').value || 'CarePlanner.cpf',
        types: [{ description:'CarePlanner File', accept:{ 'application/json':['.cpf'] }}]
      });
      // Persist handle and name via firstRunSetup
      chosenName = handle.name;
      // store handle for later by calling firstRunSetup at final step
      alert('Location chosen. Finish setup to save the file.');
      window.__cp_chosenHandle = handle;
    }catch(e){ console.warn(e); }
  });

  document.getElementById('btnSetup').addEventListener('click', async ()=>{
    const p1 = document.getElementById('pw1').value;
    const p2 = document.getElementById('pw2').value;
    const name = document.getElementById('fname').value || chosenName;
    if(p1.length < 10){ alert('Please use a longer password (10+ characters).'); return; }
    if(p1 !== p2){ alert('Passwords do not match.'); return; }
    // mark user as superuser
    window.cp = window.cp || { state:{ data:{} } };
    window.cp.state.data.users = window.cp.state.data.users || {};
    window.cp.state.data.users['superuser'] = { role:'superuser', created:new Date().toISOString() };
    // if handle chosen, store it in IDB
    if (window.__cp_chosenHandle){
      const { idb } = await import('../../core/idb.js');
      await idb.set('file_handle', window.__cp_chosenHandle);
    }
    await firstRunSetup({ password:p1, fileName:name });
    alert('Setup complete. Remember your password!');
    location.hash = '#/clinical';
    location.reload();
  });

  document.getElementById('btnUnlock').addEventListener('click', async ()=>{
    const p = document.getElementById('pwUnlock').value;
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
