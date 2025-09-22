// [[HANDLE: ROUTER + THEME_INIT]]
import { initTheme } from "./utils/theme.js";
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
window.addEventListener("DOMContentLoaded", () => {
  initTheme();
  document.getElementById("linkFirst").onclick = e => { e.preventDefault(); routeTo("first-run"); };
  document.getElementById("linkAdmin").onclick = e => { e.preventDefault(); routeTo("admin"); };
  document.getElementById("linkClinical").onclick = e => { e.preventDefault(); routeTo("clinical"); };
  routeTo("home");
});
