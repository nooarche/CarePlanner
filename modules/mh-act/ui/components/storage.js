
(function(){
  const NS = "mhact.drafts.";
  function key(formId, patientId){ return NS + formId + "." + (patientId || "anon"); }
  function save(formId, patientId, data){
    localStorage.setItem(key(formId, patientId), JSON.stringify(data));
    return true;
  }
  function load(formId, patientId){
    const s = localStorage.getItem(key(formId, patientId));
    return s ? JSON.parse(s) : null;
  }
  window.MH_ACT = window.MH_ACT || {};
  window.MH_ACT.storage = {save, load};
})();
