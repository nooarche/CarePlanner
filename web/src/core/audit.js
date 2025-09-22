// [[HANDLE: AUDIT_CORE]]
import { idb } from './idb.js'; // your existing idb wrapper
import { sha256hex } from './crypto.js'; // if you have one; else add a tiny helper below

const AUDIT_STORE = 'audit_log'; // ensure store exists in your idb init

async function getTail(){
  const tail = await idb.get('audit_tail_hash');
  return tail || 'GENESIS';
}

async function setTail(h){ await idb.set('audit_tail_hash', h); }

export async function auditLog({event, subject, details, actor}){
  const now = new Date().toISOString();
  const prev = await getTail();
  const entry = { now, event, subject, details, actor, prev };
  const body = JSON.stringify(entry);
  const chain = await sha256hex(prev + '|' + body);
  const rec = { ...entry, chain };
  await idb.add(AUDIT_STORE, JSON.stringify(rec)); // add/append
  await setTail(chain);
  return rec;
}

// Optional: export bundle for QA/inspection
export async function exportAudit(){
  const all = await idb.getAll(AUDIT_STORE);
  return '[' + all.join(',\n') + ']';
}

// Minimal sha256 helper if needed:
export async function sha256hex(str){
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest('SHA-256', enc);
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}
