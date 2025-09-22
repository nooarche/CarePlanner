// [[HANDLE: PRINT_COMPOSITE_COMPONENT]]
import { RISK_V4_SCHEMA, ensureRiskState } from "./risk-v4.js";

function esc(s){return String(s??'').replace(/[&<>"']/g,m=>({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[m]));}

function table(title, group, store){
  return `
    <h4>${title}</h4>
    <table border="1" cellspacing="0" cellpadding="6" width="100%">
      <tr><th>Item</th><th>Value</th></tr>
      ${group.map(x=>`<tr><td>${esc(x.label)}</td><td>${esc(store?.[x.id]||'—')}</td></tr>`).join('')}
    </table>`;
}

export function buildComposite(){
  const d = window.cp?.state?.data || {};
  const r = ensureRiskState();
  const actions = d.actions || [];
  let out = '';

  if (window.cp?.state?.flags?.riskV4NeedsUpdate){
    out += `<div style="border:1px solid #b91c1c;background:#fef2f2;padding:8px;margin:8px 0">
              <strong>Reminder:</strong> Observation/Leave changed. Please complete an updated Risk Assessment (V4).
            </div>`;
  }

  out += `
    <h3>Risk / Observations & Leave</h3>
    ${table('Historical / Static', RISK_V4_SCHEMA.static, r.static)}
    ${table('Dynamic (current)', RISK_V4_SCHEMA.dynamic, r.dynamic)}
    ${table('Clinical Safety', RISK_V4_SCHEMA.clinical, r.clinical)}
    ${table('Protective Factors', RISK_V4_SCHEMA.protective, r.protective)}
    <p><strong>Summary of risk profile</strong><br>${esc(r.summary||'')}</p>
    <p><strong>Risk mitigation measures</strong><br>${esc(r.mitigation||'')}</p>
    <p><strong>Sign-off:</strong> NCHD/Consultant ${esc(r.sign?.med||'')} (MCN) — ${esc(r.sign?.medDate||'')};
       RPN ${esc(r.sign?.nurse||'')} — ${esc(r.sign?.nurseDate||'')}</p>
  `;

  if(actions.length){
    out += `<h3>Care Plan Actions</h3>
      <table border="1" cellspacing="0" cellpadding="6" width="100%">
        <tr><th>#</th><th>Need</th><th>Goal</th><th>Action</th><th>Responsible</th><th>Status</th></tr>
        ${actions.map((it,i)=>`<tr>
            <td>${i+1}</td>
            <td>${esc(it.need||'')}</td>
            <td>${esc(it.goal||'')}</td>
            <td>${esc(it.action||'')}</td>
            <td>${esc(it.responsible||'')}</td>
            <td>${esc(it.status||'')}</td>
          </tr>`).join('')}
      </table>`;
  }

  return out;
}
