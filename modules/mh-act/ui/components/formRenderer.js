
window.MH_ACT = window.MH_ACT || {};

(function(){
  const $ = (sel, root=document)=>root.querySelector(sel);
  const $$ = (sel, root=document)=>Array.from(root.querySelectorAll(sel));

  function el(tag, attrs={}, children=[]) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k,v])=>{
      if (k === "class") node.className = v;
      else if (k === "for") node.htmlFor = v;
      else node.setAttribute(k,v);
    });
    children.forEach(c => node.appendChild(typeof c === "string" ? document.createTextNode(c) : c));
    return node;
  }

  function fieldToInput(field, value=""){
    const wrap = el("div", {class:"mhact-field"});
    const label = el("label", {for: field.key}, [field.label || field.key]);
    if(field.required) label.classList.add("mhact-required");
    wrap.appendChild(label);

    let input;
    switch(field.type){
      case "text":
      case "date":
      case "datetime":
      case "number":
        input = el("input", {id:field.key, name:field.key, type: field.type==="datetime" ? "datetime-local" : field.type, value: value || ""});
        break;
      case "textarea":
        input = el("textarea", {id:field.key, name:field.key}, [value || ""]);
        if(field.maxlength) input.setAttribute("maxlength", field.maxlength);
        break;
      case "select":
        input = el("select", {id:field.key, name:field.key});
        (field.options || []).forEach(opt => input.appendChild(el("option", {value:String(opt)}, [String(opt)])));
        if(value) input.value = value;
        break;
      case "checkbox":
        input = el("input", {id:field.key, name:field.key, type:"checkbox"});
        input.checked = !!value;
        break;
      case "chips":
        input = el("input", {id:field.key, name:field.key, type:"text", placeholder:"Comma-separated"});
        input.value = Array.isArray(value) ? value.join(", ") : (value || "");
        break;
      case "table":
        input = el("div", {id:field.key, class:"mhact-table"});
        const t = el("table", {}, []);
        const thead = el("thead", {}, [ el("tr", {}, field.columns.map(c=>el("th",{},[c]))) ]);
        const tbody = el("tbody");
        t.appendChild(thead); t.appendChild(tbody);
        input.appendChild(t);
        const addRowBtn = el("button", {type:"button"}, ["Add Row"]);
        addRowBtn.addEventListener("click", ()=>{
          const tr = el("tr");
          field.columns.forEach(c=> tr.appendChild(el("td",{},[ el("input", {type:"text"}) ])));
          tbody.appendChild(tr);
        });
        input.appendChild(addRowBtn);
        break;
      case "repeat":
        input = el("div", {id:field.key});
        const addBtn = el("button", {type:"button"}, ["Add"]);
        const list = el("div", {});
        addBtn.addEventListener("click", ()=> {
          const block = el("div", {class:"mhact-repeat"});
          field.template.forEach(tf => block.appendChild(fieldToInput(tf)));
          list.appendChild(block);
        });
        input.appendChild(addBtn);
        input.appendChild(list);
        break;
      case "info":
        input = el("div", {}, [ field.text || "" ]);
        break;
      default:
        input = el("input", {id:field.key, name:field.key, type:"text", value: value || ""});
    }
    wrap.appendChild(input);
    return wrap;
  }

  function getValues(container){
    const values = {};
    $$("input, textarea, select", container).forEach(inp => {
      const key = inp.name || inp.id;
      if(!key) return;
      if(inp.type === "checkbox") values[key] = inp.checked;
      else values[key] = inp.value;
    });
    // tables
    $$(".mhact-table", container).forEach(div => {
      const key = div.id;
      const rows = [];
      div.querySelectorAll("tbody tr").forEach(tr => {
        rows.push(Array.from(tr.querySelectorAll("input")).map(i=>i.value));
      });
      values[key] = rows;
    });
    return values;
  }

  function setTitle(text){
    const node = document.getElementById("formTitle");
    node.innerHTML = "";
    node.appendChild(el("h1",{},[text]));
  }

  function renderForm(schema, ctx){
    setTitle(schema.title || schema.id);
    const container = document.getElementById("formContainer");
    container.innerHTML = "";

    (schema.sections || []).forEach(sec => {
      const secEl = el("div", {class:"mhact-form-section"});
      secEl.appendChild(el("h2",{},[sec.title || "Section"]));
      (sec.fields || []).forEach(f => {
        // Autofill from context
        let v = "";
        if(f.autofill && ctx && ctx.autofill){
          v = ctx.autofill(f.autofill) || "";
        }
        secEl.appendChild(fieldToInput(f, v));
      });
      container.appendChild(secEl);
    });

    // Store schema on container
    container.dataset.schema = JSON.stringify(schema);
  }

  window.MH_ACT.renderForm = renderForm;
  window.MH_ACT.getValues = getValues;
  window.MH_ACT._util = {el,$,$$};

})();
