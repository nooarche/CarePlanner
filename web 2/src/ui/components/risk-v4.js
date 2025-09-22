// [[HANDLE: RISK_V4_COMPONENT]]
export const RISK_V4_SCHEMA = {
  static:[
    {id:'garda_adm',label:'Previous requirement for Garda assisted admission'},
    {id:'high_secure',label:'Previous admission to high secure setting'},
    {id:'abscond_hist',label:'Previous absconding from an inpatient setting'},
    {id:'violence_hist',label:'History of physical violence/threatening behaviour'},
    {id:'serious_attempt',label:'Serious suicide attempt'},
    {id:'weapons_hist',label:'Use of or carrying weapons'},
    {id:'selfharm_hist',label:'Past history of non-lethal self-harm'},
    {id:'forensic_hist',label:'Previous convictions/forensic history'},
    {id:'fam_suicide',label:'Family history of suicide'},
    {id:'male_u35',label:'Male < 35 yrs'},
    {id:'male',label:'Male'},
    {id:'persecutory_cmd',label:'Persecutory delusion/command hallucinations'},
    {id:'major_phys',label:'Major physical illness'},
    {id:'prop_damage',label:'Damage to property'},
    {id:'mmi_pd',label:'Major mental illness/Personality disorder'},
    {id:'child_adversity',label:'History of childhood adversity/trauma'},
    {id:'substance_hist',label:'History of alcohol/substance misuse'}
  ],
  dynamic:[
    {id:'si_plan',label:'Suicidal ideation with intent/current plan',weight:'high'},
    {id:'hopeless',label:'Expression of hopelessness',weight:'high'},
    {id:'active_symp',label:'Active symptoms (e.g., depressed mood, psychosis)',weight:'med'},
    {id:'selfharm_curr',label:'Current non-lethal self-harming',weight:'med'},
    {id:'disconnected',label:'Disconnected from family/friends/society',weight:'med'},
    {id:'passive_death',label:'Passive death wish',weight:'med'},
    {id:'si_no_plan',label:'Suicidal ideation – no plan',weight:'med'},
    {id:'burden',label:'Perceived burden on others',weight:'low'},
    {id:'substance_now',label:'Substance abuse/intoxication/withdrawal',weight:'high'},
    {id:'loss_change',label:'Loss event or change in circumstances',weight:'med'},
    {id:'psychosocial',label:'Other active psychosocial stressors',weight:'low'},
    {id:'abscond_attempt',label:'Absconding attempt (this admission)',weight:'high'}
  ],
  clinical:[
    {id:'poor_insight',label:'Poor insight'},
    {id:'delirium',label:'Confusion/delirium'},
    {id:'poor_intake',label:'Not eating/drinking'},
    {id:'acute_phys',label:'Physical illness'},
    {id:'falls_risk',label:'Risk of falls'},
    {id:'polypharm',label:'Multiple medications (polypharmacy)'},
    {id:'poor_adherence',label:'Poor adherence to treatment'},
    {id:'pressure_ulcer',label:'Risk of pressure ulcers'},
    {id:'infection',label:'Transmitting/contracting infection risk'}
  ],
  protective:[
    {id:'no_protective',label:'Unable to identify protective factors'},
    {id:'family_support',label:'Family/friend support'},
    {id:'dependents',label:'Dependent children'},
    {id:'financial',label:'Financially secure'},
    {id:'housing',label:'Secure accommodation'},
    {id:'concordance',label:'Concordance with treatment plan'}
  ],
  opts:['No','Yes','Unknown','N/A']
};

function esc(s){return String(s??'');}

export function ensureState(){
  window.cp = window.cp || {state:{data:{}}};
  const d = window.cp.state.data;
  d.riskV4 = d.riskV4 || {static:{},dynamic:{},clinical:{},protective:{},summary:'',mitigation:'',sign:{med:'',medDate:'',nurse:'',nurseDate:''},history:[]};
  return d.riskV4;
}

function renderGroup(rootId, group, store){
  const wrap = document.getElementById(rootId); if(!wrap) return;
  wrap.innerHTML='';
  group.forEach(item=>{
    const row = document.createElement('div'); row.className='row';
    const lab = document.createElement('label'); lab.textContent=item.label;
    const sel = document.createElement('select');
    RISK_V4_SCHEMA.opts.forEach(o=>{ const opt=document.createElement('option'); opt.textContent=o; if(store[item.id]===o) opt.selected=true; sel.appendChild(opt); });
    sel.addEventListener('change', e=>{ store[item.id]=e.target.value; riskCheckFlags(); showUnsaved(); });
    const c1=document.createElement('div'); c1.className='col-8'; c1.appendChild(lab);
    const c2=document.createElement('div'); c2.className='col-4'; c2.appendChild(sel);
    row.append(c1,c2); wrap.appendChild(row);
  });
}

function riskCheckFlags(){
  const d = ensureState();
  const dyn = d.dynamic||{};
  const isHigh = RISK_V4_SCHEMA.dynamic.some(x=>x.weight==='high' && dyn[x.id]==='Yes');
  const flag = document.getElementById('riskV4Flags');
  if(flag) flag.classList.toggle('hidden', !isHigh);
  d._high = !!isHigh;
}

function showUnsaved(){ document.getElementById('unsavedBanner')?.classList.remove('hidden'); }

export function mountRiskV4(root){
  ensureState();
  root.innerHTML = `
    <div class="card" id="riskV4">
      <h3 class="h3">Structured Risk Assessment (V4)</h3>
      <div id="riskV4Flags" class="card hidden" style="border-color:#b91c1c;background:#fef2f2">
        <strong>High-risk factors present</strong>
        <p class="small">Mitigation and dual sign-off required before printing.</p>
      </div>
      <h4>Historical / Static</h4>
      <div id="riskV4Static"></div>
      <h4>Dynamic (current)</h4>
      <div id="riskV4Dynamic"></div>
      <h4>Clinical Safety</h4>
      <div id="riskV4Clinical"></div>
      <h4>Protective Factors</h4>
      <div id="riskV4Protective"></div>
      <h4>Summary of risk profile</h4>
      <textarea id="riskV4Summary" rows="3"></textarea>
      <h4>Risk mitigation measures</h4>
      <textarea id="riskV4Mitigation" rows="3"></textarea>
      <h4>Sign-off</h4>
      <div class="row">
        <div class="col-6"><label>NCHD/Consultant (MCN)</label><input id="riskV4SignMed"></div>
        <div class="col-6"><label>RPN</label><input id="riskV4SignNurse"></div>
      </div>
      <div class="row">
        <div class="col-6"><label>Date (med)</label><input id="riskV4DateMed" type="date"></div>
        <div class="col-6"><label>Date (RPN)</label><input id="riskV4DateNurse" type="date"></div>
      </div>
      <div class="stack no-print" style="margin-top:8px">
        <button class="button primary" id="riskV4Save">Save Risk Assessment</button>
      </div>
    </div>
  `;
  const d = ensureState();
  renderGroup('riskV4Static', RISK_V4_SCHEMA.static, d.static);
  renderGroup('riskV4Dynamic', RISK_V4_SCHEMA.dynamic, d.dynamic);
  renderGroup('riskV4Clinical', RISK_V4_SCHEMA.clinical, d.clinical);
  renderGroup('riskV4Protective', RISK_V4_SCHEMA.protective, d.protective);
  document.getElementById('riskV4Summary').value = d.summary||'';
  document.getElementById('riskV4Mitigation').value = d.mitigation||'';
  document.getElementById('riskV4SignMed').value = d.sign.med||'';
  document.getElementById('riskV4SignNurse').value = d.sign.nurse||'';
  document.getElementById('riskV4DateMed').value = d.sign.medDate||'';
  document.getElementById('riskV4DateNurse').value = d.sign.nurseDate||'';

  const bind = (id,fn)=>document.getElementById(id)?.addEventListener('input', fn);
  bind('riskV4Summary', e=>{ d.summary=e.target.value; showUnsaved(); });
  bind('riskV4Mitigation', e=>{ d.mitigation=e.target.value; showUnsaved(); });
  bind('riskV4SignMed', e=>{ d.sign.med=e.target.value; showUnsaved(); });
  bind('riskV4SignNurse', e=>{ d.sign.nurse=e.target.value; showUnsaved(); });
  bind('riskV4DateMed', e=>{ d.sign.medDate=e.target.value; showUnsaved(); });
  bind('riskV4DateNurse', e=>{ d.sign.nurseDate=e.target.value; showUnsaved(); });

  document.getElementById('riskV4Save')?.addEventListener('click', ()=>{
    if(d._high){
      if(!(d.mitigation||'').trim()){ alert('Mitigation measures required for high-risk.'); return; }
      if(!(d.sign.med && d.sign.medDate && d.sign.nurse && d.sign.nurseDate)){
        alert('Dual sign-off (NCHD/Consultant + RPN) required.'); return;
      }
    }
    const snap = JSON.parse(JSON.stringify(d)); snap.ts = new Date().toISOString();
    d.history.push(snap);
    alert('Risk assessment saved.');
    showUnsaved();
  });

  riskCheckFlags();
}
