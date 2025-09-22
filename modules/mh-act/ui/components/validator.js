
(function(){
  function validate(schema, data){
    const errors = [];
    (schema.validation || []).forEach(v => {
      if(v.rule === "required"){
        (v.fields || []).forEach(f => {
          if(data[f] === undefined || data[f] === null || String(data[f]).trim() === ""){
            errors.push(`Missing required: ${f}`);
          }
        });
      }
    });
    return errors;
  }
  window.MH_ACT = window.MH_ACT || {};
  window.MH_ACT.validate = validate;
})();
