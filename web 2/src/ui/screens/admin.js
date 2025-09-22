import { renderTeamAdmin } from "../../modules/team/roles.js";
import { mountAdminPreferences } from "./admin-preferences.js";

export function mountAdmin(root, serviceObj, ctx) {
  root.innerHTML = `
    <h2 class="h2">Admin</h2>
    <nav style="margin-bottom:1rem">
      <button class="button secondary" id="tabTeam">Team</button>
      <button class="button secondary" id="tabPrefs">Preferences</button>
    </nav>
    <div id="panel"></div>
  `;
  const panel = root.querySelector('#panel');
  const showTeam = ()=>{ panel.innerHTML='<div id="team"></div>'; renderTeamAdmin(panel.querySelector("#team"), serviceObj.team||{}, ()=>{}); };
  const showPrefs = ()=>{ mountAdminPreferences(panel); };
  root.querySelector('#tabTeam').addEventListener('click', showTeam);
  root.querySelector('#tabPrefs').addEventListener('click', showPrefs);
  showPrefs();
}
