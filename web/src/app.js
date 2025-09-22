// Simple build stamp — bump this whenever you deploy
window.__CP_VERSION = "CarePlanner v0.3.1 • 2025-09-22T20:00Z";

// [[HANDLE: ROUTER + THEME_INIT]]
import { initTheme } from "./utils/theme.js";
import { getJSON } from "./core/idb.js";

const V = (window.__CP_VERSION || '').replace(/\s+/g,'-'); // ok if not set

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

function currentRoute() {
  // Accept "#/first-run" or "first-run" fallback
  const h = (location.hash || "").replace(/^#\/?/, "");
  return h || "home";
}

async function hideFirstRunIfBootstrapped(){
  const meta = await getJSON('bootstrap_meta');
  if (meta?.bootstrapComplete) document.getElementById("linkFirst")?.remove();
}

function onHashChange() {
  routeTo(currentRoute());
}

window.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  await hideFirstRunIfBootstrapped();

  // Route initial load + future hash changes
  window.addEventListener("hashchange", onHashChange);
  onHashChange(); // mount the initial route
});
enableQuickHide();
// Optional: add buttons with ids 'btnLock' and 'btnUnlock' in your header if you want manual control.
// document.getElementById('btnLock')?.addEventListener('click', lock);
// document.getElementById('btnUnlock')?.addEventListener('click', unlock);
