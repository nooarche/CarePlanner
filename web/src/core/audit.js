// [[HANDLE: AUDIT_CORE_KV]]
import { idb } from './idb.js';

// monotonic sequence in KV: audit_seq -> "N"
async function nextSeq(){
  const cur = parseInt(await idb.get('audit_seq') || '0', 10);
  const nxt = isNaN(cur) ? 1 : cur+1;
  await idb.set('audit_seq', String(nxt));
  return nxt;
}

// cheap chain: prev hash stored in 'audit_tail', entries keyed as 'audit:N'
async function sha256hex(str){
  const d = new TextEncoder().encode(str);
  const b = await crypto.subtle.digest('SHA-256', d);
  return Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
}
async function getTail(){ return (await idb.get('audit_tail')) || 'GENESIS'; }
async function setTail(h){ return idb.set('audit_tail', h); }

export async function auditLog({event, subject, details, actor}){
  const now = new Date().toISOString();
  const prev = await getTail();
  const entry = { now, event, subject, details, actor, prev };
  const body = JSON.stringify(entry);
  const chain = await sha256hex(prev + '|' + body);
  const seq = await nextSeq();
  await idb.set(`audit:${seq}`, JSON.stringify({ ...entry, chain, seq }));
  await setTail(chain);
  return { seq, chain };
}

export async function exportAuditBundle(){
  // find all audit:* keys (kv has no list, so scan a reasonable range or track max seq)
  const max = parseInt(await idb.get('audit_seq') || '0', 10);
  const rows = [];
  for (let i=1; i<=max; i++){
    const s = await idb.get(`audit:${i}`); if (s) rows.push(s);
  }
  return '[' + rows.join(',\n') + ']';
}
