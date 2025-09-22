
(async function(){
  const $ = (sel, root=document)=>root.querySelector(sel);
  const el = (t,a={},c=[])=>{const n=document.createElement(t);Object.entries(a).forEach(([k,v])=>n.setAttribute(k,v));c.forEach(x=>n.appendChild(typeof x==='string'?document.createTextNode(x):x));return n;};

  async function loadJSON(path){ const r = await fetch(path); return r.json(); }

  const registry = await loadJSON("../registry.json");

  const ctx = {
    patientId: "DEMO-001",
    autofill: (key)=>{
      const mock = {
        "patient.name": "Example, Alice",
        "patient.dob": "1990-01-01",
        "patient.mrn": "MRN12345",
        "admission.date":"2025-09-01",
        "team.consultant": "Dr. D. De La Harpe Golden"
      };
      return mock[key];
    }
  };

  function buildMenu(){
    const nav = document.getElementById("formList");
    nav.innerHTML = "";
    registry.categories.forEach(cat => {
      nav.appendChild(el("h3",{},[cat.title]));
      cat.forms.forEach(f => {
        const a = el("a", {href:"#", "data-id": f.id, "data-file": "../" + f.file}, [f.title]);
        a.addEventListener("click", async (ev)=>{
          ev.preventDefault();
          const schema = await loadJSON(a.getAttribute("data-file"));
          window.MH_ACT.renderForm(schema, ctx);
          currentForm = schema;
          setStatus("Loaded " + schema.title);
        });
        nav.appendChild(a);
      });
    });
  }

  function setStatus(msg){ document.getElementById("status").textContent = msg; }

  let currentForm = null;

  document.getElementById("btnSave").addEventListener("click", ()=>{
    if(!currentForm) return;
    const data = window.MH_ACT.getValues(document.getElementById("formContainer"));
    window.MH_ACT.storage.save(currentForm.id, ctx.patientId, data);
    setStatus("Draft saved");
  });

  document.getElementById("btnValidate").addEventListener("click", ()=>{
    if(!currentForm) return;
    const data = window.MH_ACT.getValues(document.getElementById("formContainer"));
    const errs = window.MH_ACT.validate(currentForm, data);
    if(errs.length){
      setStatus("Errors: " + errs.join("; "));
      alert("Please fix:\n" + errs.join("\n"));
    } else {
      setStatus("Looks good ✔︎");
      alert("Validation passed");
    }
  });

  document.getElementById("btnPrint").addEventListener("click", ()=>{
    window.print();
  });

  // External hooks
  window.MH_ACT.onObsChange = function(level){
    alert("Obs/Leave changed to: " + level + "\nPrompt: Update Risk Assessment and review ICP.");
  };
  window.MH_ACT.onRestrictivePractice = function(evt){
    alert("Restrictive practice event: " + JSON.stringify(evt));
  };

  buildMenu();
})();
