// [[HANDLE: CORE_IDB]]
export const idb = {
  async open(name='careplanner', version=1){
    return await new Promise((resolve, reject)=>{
      const r = indexedDB.open(name, version);
      r.onupgradeneeded = (e)=>{
        const db = r.result;
        if(!db.objectStoreNames.contains('kv')) db.createObjectStore('kv');
      };
      r.onerror = ()=>reject(r.error);
      r.onsuccess = ()=>resolve(r.result);
    });
  },
  async set(key, value){
    const db = await this.open();
    return await new Promise((resolve, reject)=>{
      const tx = db.transaction('kv','readwrite');
      tx.objectStore('kv').put(value, key);
      tx.oncomplete = ()=>resolve();
      tx.onerror = ()=>reject(tx.error);
    });
  },
  async get(key){
    const db = await this.open();
    return await new Promise((resolve, reject)=>{
      const tx = db.transaction('kv','readonly');
      const req = tx.objectStore('kv').get(key);
      req.onsuccess = ()=>resolve(req.result);
      req.onerror = ()=>reject(req.error);
    });
  }
};
// [[HANDLE: CORE_IDB]] 
export async function setJSON(key, obj){ return idb.set(key, JSON.stringify(obj)); }
export async function getJSON(key){
  const s = await idb.get(key);
  try { return s ? JSON.parse(s) : null; } catch { return null; }
}
// [[HANDLE: CORE_IDB_JSON_HELPERS]]
export async function setJSON(key, obj){ return idb.set(key, JSON.stringify(obj)); }
export async function getJSON(key){
  const s = await idb.get(key);
  try { return s ? JSON.parse(s) : null; } catch { return null; }
}
