// [[HANDLE: CORE_CRYPTO]]
export async function sha256(buf){
  return await crypto.subtle.digest('SHA-256', buf);
}

export function hex(buf){
  return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,'0')).join('');
}

export function utf8(s){ return new TextEncoder().encode(s); }
export function deutf8(b){ return new TextDecoder().decode(b); }

export async function deriveKey(password, salt, iterations=200000){
  const keyMaterial = await crypto.subtle.importKey('raw', utf8(password), 'PBKDF2', false, ['deriveKey']);
  return await crypto.subtle.deriveKey(
    {name:'PBKDF2', hash:'SHA-256', salt, iterations},
    keyMaterial,
    {name:'AES-GCM', length:256},
    false,
    ['encrypt','decrypt']
  );
}

export async function encryptJson(key, obj){
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const data = utf8(JSON.stringify(obj));
  const ct = await crypto.subtle.encrypt({name:'AES-GCM', iv}, key, data);
  return { iv: Array.from(iv), ct: Array.from(new Uint8Array(ct)) };
}

export async function decryptJson(key, pack){
  const iv = new Uint8Array(pack.iv);
  const ct = new Uint8Array(pack.ct);
  const pt = await crypto.subtle.decrypt({name:'AES-GCM', iv}, key, ct);
  return JSON.parse(deutf8(new Uint8Array(pt)));
}
