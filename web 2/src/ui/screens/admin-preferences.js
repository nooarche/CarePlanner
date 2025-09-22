// [[HANDLE: ADMIN_PREFERENCES_UI]]
import { renderPermMatrix } from "../components/perm-matrix.js";
import { applyTheme } from "../../utils/theme.js";

export async function mountAdminPreferences(root) {
  root.innerHTML = `
    <section class="grid cols-2">
      <div class="card">
        <h3 class="h3">Appearance</h3>
        <label for="themeSel">Theme</label>
        <select id="themeSel" class="select"></select>
        <p class="small">Applies immediately and persists per device.</p>
        <div id="preview" style="margin-top:1rem;">
          <button class="button primary">Primary</button>
          <button class="button secondary">Secondary</button>
        </div>
      </div>
      <div class="card">
        <h3 class="h3">Modules & Roles</h3>
        <div id="permMatrix">Loading…</div>
      </div>
    </section>
  `;

  // Load themes
  const sel = root.querySelector('#themeSel');
  try {
    const themes = await fetch('./themes.json', {cache:'no-store'}).then(r=>r.json());
    Object.entries(themes).forEach(([key, obj])=>{
      const opt = document.createElement('option'); opt.value=key; opt.textContent=obj.label; sel.appendChild(opt);
    });
    const saved = localStorage.getItem('careplanner_theme') || 'hse_default';
    sel.value = saved;
  } catch(e) { console.error(e); }

  sel.addEventListener('change', ()=>applyTheme(sel.value));

  // Permissions matrix
  const onChange = (roleId, moduleId, level) => {
    console.log('perm change', {roleId, moduleId, level});
    // TODO: save to backend (permissions.json)
  };
  renderPermMatrix(root.querySelector('#permMatrix'), {}, onChange);
}
