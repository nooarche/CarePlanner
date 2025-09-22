// [[HANDLE: ROUTER + THEME_INIT]]
import { initTheme } from "./utils/theme.js";
import { getJSON } from "./core/idb.js";

export function routeTo(id) {
  const app = document.getElementById("app");
  if (!app) return;
  if (id === "first-run") {
    import("./ui/screens/first-run.js").then(m => m.mountFirstRun(app));
  } else if (id === "admin") {
    import("./ui/screens/admin.js").then(m => m.mountAdmin(app, {}, {}));
  } else if (id === "clinical") {
    import("./ui/screens/clinical.js").then(m => m.mountClinical(app));
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
});
