// [[HANDLE: REVIEW_CADENCE]]
export function nextDue(fromISO, setting){
  const t = new Date(fromISO||Date.now()).getTime();
  const ms = setting==='acute' ? 7*24*60*60*1000 : 182*24*60*60*1000;
  return new Date(t+ms).toISOString().slice(0,10);
}
export function banner(lastISO, setting){
  const due = nextDue(lastISO, setting);
  const today = new Date().toISOString().slice(0,10);
  return (today > due) ? `Review overdue since ${due}` : `Next review due by ${due}`;
}
