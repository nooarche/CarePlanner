// [[HANDLE: PERMISSIONS_MATRIX_UI]]
export async function renderPermMatrix(root, {rolesUrl='./src/models/Roles.json', modulesUrl='./src/models/modules.json'}, onChange) {
  root.innerHTML = '<div class="card">Loading…</div>';
  const [roles, modules] = await Promise.all([
    fetch(rolesUrl).then(r=>r.json()),
    fetch(modulesUrl).then(r=>r.json())
  ]);
  const levels = ['none','view','edit','approve'];
  const table = document.createElement('table');
  table.className='matrix';
  const thead = document.createElement('thead');
  const trh = document.createElement('tr');
  trh.appendChild(Object.assign(document.createElement('th'),{textContent:'Role \ Module'}));
  modules.modules.forEach(m=>{
    const th = document.createElement('th'); th.textContent = m.label; trh.appendChild(th);
  });
  thead.appendChild(trh); table.appendChild(thead);
  const tbody = document.createElement('tbody');
  roles.roles.forEach(role=>{
    const tr = document.createElement('tr');
    const th = document.createElement('th'); th.textContent = role.label; tr.appendChild(th);
    modules.modules.forEach(m=>{
      const td = document.createElement('td');
      const sel = document.createElement('select'); sel.className='select';
      levels.forEach(l=>{
        const opt = document.createElement('option'); opt.value=l; opt.textContent=l.capitalize ? l.capitalize() : l[0].toUpperCase()+l.slice(1);
        sel.appendChild(opt);
      });
      sel.value = 'none';
      sel.addEventListener('change', ()=>onChange && onChange(role.id, m.id, sel.value));
      td.appendChild(sel);
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
  table.appendChild(tbody);
  root.innerHTML = '';
  root.appendChild(table);
}
