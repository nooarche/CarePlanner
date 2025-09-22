// [[HANDLE: CORE_STORAGE]]
import { deriveKey, encryptJson, decryptJson, utf8 } from './crypto.js';
import { idb } from './idb.js';

/**
 * Storage design
 * - First run: ask for master password; generate salt; derive key; save {salt, iterations, pwHash} to idb.
 * - Create device keyfile in OPFS (/cp.key) for extra binding; store random 32 bytes.
 * - Ask user to choose a .cpf data file location via File System Access (showSaveFilePicker).
 * - Save encrypted payload to that file; store the file handle in IndexedDB (Chromium only).
 * - On next runs: retrieve handle from IDB if available; else prompt to pick the file.
 * Fallback: if File System Access API unavailable, use OPFS path '/careplanner/data.cpf' invisibly.
 */

const DB_KEYS = {
  MASTER: 'master_meta',
  HANDLE: 'file_handle'
};

export async function ensureKeyfile(){
  if (!('storage' in navigator) || !navigator.storage.getDirectory) return null;
  const root = await navigator.storage.getDirectory();
  // subdir
  const appDir = await root.getDirectoryHandle('careplanner', { create: true });
  const keyHandle = await appDir.getFileHandle('cp.key', { create: true });
  // If empty, write random bytes
  const f = await keyHandle.getFile();
  if (f.size === 0){
    const bytes = crypto.getRandomValues(new Uint8Array(32));
    const w = await keyHandle.createWritable();
    await w.write(bytes);
    await w.close();
  }
  return keyHandle;
}

export async function readKeyfileBytes(){
  try{
    const h = await ensureKeyfile();
    if(!h) return null;
    const f = await h.getFile();
    const buf = await f.arrayBuffer();
    return new Uint8Array(buf);
  }catch(e){ return null; }
}

export async function saveHandle(handle){
  // FileSystemHandle is serializable in IndexedDB in Chromium; on Safari/Firefox this will fail silently.
  try{ await idb.set(DB_KEYS.HANDLE, handle); }catch(e){ /* ignore */ }
}

export async function loadHandle(){
  try{ return await idb.get(DB_KEYS.HANDLE); }catch(e){ return null; }
}

export async function firstRunSetup({ password, fileName='CarePlanner.cpf' }={}){
  // create master meta
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iterations = 200000;
  const key = await deriveKey(password, salt, iterations);
  // store verifier hash
  const verifier = new Uint8Array(await crypto.subtle.digest('SHA-256', utf8(password)));
  await idb.set(DB_KEYS.MASTER, { salt: Array.from(salt), iterations, verifier: Array.from(verifier) });
  await ensureKeyfile();

  // choose file path if API available
  let handle = null;
  if (window.showSaveFilePicker){
    handle = await window.showSaveFilePicker({
      suggestedName: fileName,
      types: [{ description: 'CarePlanner File', accept: { 'application/json': ['.cpf'] } }]
    });
    await saveHandle(handle);
  }

  // initial payload
  const payload = { version:1, created: new Date().toISOString(), data: window.cp?.state?.data || {} };
  const pack = await encryptJson(key, payload);

  if (handle){
    const w = await handle.createWritable();
    await w.write(new Blob([JSON.stringify({ enc:'AES-GCM', pack })], { type:'application/json' }));
    await w.close();
  } else {
    // Fallback: OPFS invisible path
    const root = await navigator.storage.getDirectory();
    const appDir = await root.getDirectoryHandle('careplanner', { create:true });
    const file = await appDir.getFileHandle('data.cpf', { create:true });
    const w = await file.createWritable();
    await w.write(new Blob([JSON.stringify({ enc:'AES-GCM', pack })], { type:'application/json' }));
    await w.close();
  }
}

export async function unlockAndLoad(password){
  const meta = await idb.get(DB_KEYS.MASTER);
  if(!meta) throw new Error('Not initialised.');
  const salt = new Uint8Array(meta.salt);
  const key = await deriveKey(password, salt, meta.iterations);
  // Try handle first
  let file;
  let handle = await loadHandle();
  if (handle){
    file = await (await handle.getFile()).text();
  } else {
    // OPFS fallback
    const root = await navigator.storage.getDirectory();
    const appDir = await root.getDirectoryHandle('careplanner', { create:true });
    const fh = await appDir.getFileHandle('data.cpf', { create:false });
    file = await (await fh.getFile()).text();
  }
  const parsed = JSON.parse(file);
  const payload = await decryptJson(key, parsed.pack);
  window.cp = window.cp || {state:{}};
  window.cp.state.data = payload.data || {};
  return payload;
}

export async function saveNow(password){
  const meta = await idb.get(DB_KEYS.MASTER);
  if(!meta) throw new Error('Not initialised.');
  const salt = new Uint8Array(meta.salt);
  const key = await deriveKey(password, salt, meta.iterations);
  const payload = { version:1, saved:new Date().toISOString(), data: window.cp?.state?.data || {} };
  const pack = await encryptJson(key, payload);

  let handle = await loadHandle();
  if (handle){
    const w = await handle.createWritable();
    await w.write(new Blob([JSON.stringify({ enc:'AES-GCM', pack })], { type:'application/json' }));
    await w.close();
  } else {
    const root = await navigator.storage.getDirectory();
    const appDir = await root.getDirectoryHandle('careplanner', { create:true });
    const file = await appDir.getFileHandle('data.cpf', { create:true });
    const w = await file.createWritable();
    await w.write(new Blob([JSON.stringify({ enc:'AES-GCM', pack })], { type:'application/json' }));
    await w.close();
  }
}
