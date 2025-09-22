// Simple build stamp — bump this whenever you deploy
window.__CP_VERSION = "CarePlanner v0.3.1 • 2025-09-22T20:00Z";

// [[HANDLE: ROUTER + THEME_INIT]]
import { initTheme } from "./utils/theme.js";
import { getJSON } from "./core/idb.js";
import { requireRole } from "./core/authz.js";
import { initIdleLock, enableQuickHide, lock, unlock } from "./core/idlelock.js";

const V = (window.__CP_VERSION || '').replace(/\s+/g,'-');

export function routeTo(id) {
  const app = document.getElementById("app");
  if (!app) return;
  if (id === "first-run") {
    import(`./ui/screens/first-run.js?v=${V}`).then(m => m.mountFirstRun(app));
  } else if (id === "admin") {
    import(`./ui/screens/admin.js?v=${V}`).then(m => m.mountAdmin(app, {}, {}));
  } else if (id === "clinical") {
    import(`./ui/screens/clinical.js?v=${V}`).then(m => m.mountClinical(app));
  } else {
    app.textContent = "Home (temporary)";
  }
}

async function hideFirstRunIfBootstrapped(){
  const meta = await getJSON('bootstrap_meta');
  if (meta?.bootstrapComplete) document.getElementById("linkFirst")?.remove();
}

window.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await hideFirstRunIfBootstrapped();
  document.getElementById("linkFirst")?.addEventListener('click', e => { e.preventDefault(); routeTo("first-run"); });
  document.getElementById("linkAdmin").addEventListener('click', e => { e.preventDefault(); routeTo("admin"); });
  document.getElementById("linkClinical").addEventListener('click', e => { e.preventDefault(); routeTo("clinical"); });
  routeTo("home");
  initIdleLock({
  onLock: ()=>{ document.documentElement.style.filter='blur(4px) brightness(0.6)'; },
  onUnlock: ()=>{ document.documentElement.style.filter=''; }
});
enableQuickHide();
// Optional: add buttons with ids 'btnLock' and 'btnUnlock' in your header if you want manual control.
// document.getElementById('btnLock')?.addEventListener('click', lock);
// document.getElementById('btnUnlock')?.addEventListener('click', unlock);
