// [[HANDLE: IDLE_LOCK_CORE]]
let timer=null, locked=false, onLockCb=()=>{}, onUnlockCb=()=>{};
const IDLE_MS = 5 * 60_000;

function reset(){ if (locked) return; clearTimeout(timer); timer = setTimeout(lock, IDLE_MS); }
export function initIdleLock({ onLock, onUnlock } = {}){
  if (onLock) onLockCb = onLock; if (onUnlock) onUnlockCb = onUnlock;
  ['mousemove','keydown','click','touchstart'].forEach(ev=>window.addEventListener(ev, reset, { passive:true }));
  reset();
}
export function lock(){ locked=true; clearTimeout(timer); onLockCb(); }
export function unlock(){ locked=false; onUnlockCb(); reset(); }
export function enableQuickHide(){
  const shade = document.createElement('div');
  Object.assign(shade.style,{position:'fixed',inset:0,background:'#000',opacity:'0',transition:'opacity .12s',zIndex:999999,pointerEvents:'none'});
  document.body.appendChild(shade);
  const show=()=>shade.style.opacity='1', hide=()=>shade.style.opacity='0';
  window.addEventListener('keydown', e=>{ if ((e.ctrlKey&&e.key.toLowerCase()==='h')||e.key==='Escape') shade.style.opacity==='1'?hide():show(); });
}
