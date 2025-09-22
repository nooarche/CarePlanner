// [[HANDLE: CLINICAL_SCREEN]]
import { mountRiskV4 } from "../components/risk-v4.js";
import { mountCareActions } from "../components/care-actions.js";
import { buildComposite } from "../components/print-composite.js";

export function mountClinical(root){
  root.innerHTML = `
    <h2 class="h2">Clinical</h2>
    <nav style="margin-bottom:1rem">
      <button class="button secondary" id="tabRisk">Risk V4</button>
      <button class="button secondary" id="tabActions">Care Plan Actions</button>
      <button class="button primary" id="tabPrint">Print</button>
    </nav>
    <div id="panel"></div>
    <div id="unsavedBanner" class="card warning hidden" style="border-color:#b45309;background:#fffbeb">
      <strong>Current plan has changes not yet saved/printed.</strong>
      <p class="small">Use Print to produce the current composite ICP.</p>
    </div>
  `;
  const panel = root.querySelector('#panel');
  const showRisk = ()=>{ panel.innerHTML='<div id="risk"></div>'; mountRiskV4(panel.querySelector('#risk')); };
  const showActions = ()=>{ panel.innerHTML='<div id="actions"></div>'; mountCareActions(panel.querySelector('#actions')); };
  const showPrint = ()=>{
    const html = buildComposite();
    panel.innerHTML = `<div class="print-section">${html}</div>`;
    window.print();
  };
  root.querySelector('#tabRisk').addEventListener('click', showRisk);
  root.querySelector('#tabActions').addEventListener('click', showActions);
  root.querySelector('#tabPrint').addEventListener('click', showPrint);
  showRisk();
}
