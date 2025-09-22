// [[HANDLE: CARE_ACTIONS_COMPONENT]]
const ICP_NEEDS = [
  '1. Mental health','2. Physical health','3. Medication','4. Safety/Risk',
  '5. Substance use','6. Housing/Accommodation','7. Finance/Income',
  '8. ADLs/Self-care','9. Social/Family','10. Meaningful activity/Education/Work',
  '11. Legal/Advocacy','12. Transport/Access','13. Cultural/Spiritual',
  '14. Communication','15. Nutrition','16. Other'
];

function showUnsaved(){ document.getElementById('unsavedBanner')?.classList.remove('hidden'); }

export function ensureActions(){
  window.cp = window.cp || {state:{data:{}}};
  window.cp.state.data.actions = window.cp.state.data.actions || [];
  return window.cp.state.data.actions;
}

function makeNeedsSelect(value=''){
  const sel = document.createElement('select');
  ICP_NEEDS.forEach(opt=>{
    const o=document.createElement('option'); o.textContent=opt;
    if(opt===value) o.selected = true; sel.appendChild(o);
  });
  return sel;
}

export function mountCareActions(root){
  const actions = ensureActions();
  root.innerHTML = `
    <div class="card">
      <h3 class="h3">Care Plan Actions</h3>
      <table class="table" width="100%">
        <thead><tr><th>#</th><th>Need</th><th>Goal</th><th>Action</th><th>Responsible</th><th>Status</th><th class="no-print">✖︎</th></tr></thead>
        <tbody id="actionsTbody"></tbody>
      </table>
      <div class="stack no-print"><button class="button" id="btnAddAction">Add Action</button></div>
    </div>
  `;
  function render(){
    const tb = root.querySelector('#actionsTbody');
    tb.innerHTML='';
    actions.forEach((item, idx)=>{
      const tr=document.createElement('tr');
      const cIdx=document.createElement('td'); cIdx.textContent = idx+1; tr.appendChild(cIdx);
      const cNeed=document.createElement('td');
      const needSel=makeNeedsSelect(item.need||'1. Mental health');
      needSel.addEventListener('change', e=>{ item.need=e.target.value; showUnsaved(); });
      cNeed.appendChild(needSel); tr.appendChild(cNeed);
      const mkIn=(val,ph,cb)=>{ const i=document.createElement('input'); i.value=val||''; i.placeholder=ph; i.addEventListener('input', e=>{ cb(e.target.value); showUnsaved(); }); return i; };
      const cGoal=document.createElement('td'); cGoal.appendChild(mkIn(item.goal,'Goal',v=>item.goal=v)); tr.appendChild(cGoal);
      const cAct=document.createElement('td'); cAct.appendChild(mkIn(item.action,'Action',v=>item.action=v)); tr.appendChild(cAct);
      const cResp=document.createElement('td'); cResp.appendChild(mkIn(item.responsible,'Responsible',v=>item.responsible=v)); tr.appendChild(cResp);
      const cStatus=document.createElement('td'); const st=document.createElement('select'); ['Due','Ongoing','Completed','Deferred'].forEach(s=>{ const o=document.createElement('option'); o.textContent=s; if(item.status===s) o.selected=true; st.appendChild(o); }); st.addEventListener('change', e=>{ item.status=e.target.value; showUnsaved(); }); cStatus.appendChild(st); tr.appendChild(cStatus);
      const cDel=document.createElement('td'); cDel.className='no-print'; const btn=document.createElement('button'); btn.className='button'; btn.textContent='Delete'; btn.onclick=()=>{ actions.splice(idx,1); render(); showUnsaved(); }; cDel.appendChild(btn); tr.appendChild(cDel);
      tb.appendChild(tr);
    });
  }
  root.querySelector('#btnAddAction').addEventListener('click', ()=>{ actions.push({need:'1. Mental health', goal:'', action:'', responsible:'', status:'Due'}); render(); showUnsaved(); });
  render();
}
