// [[HANDLE: SECURE_UTILS]]
export function constantTimeEquals(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  if (a.length !== b.length) return false;
  let res = 0;
  for (let i = 0; i < a.length; i++) res |= (a.charCodeAt(i) ^ b.charCodeAt(i));
  return res === 0;
}

const ATTEMPT_STATE_KEY = 'bootstrap_attempt_state';

function readState() {
  try { return JSON.parse(localStorage.getItem(ATTEMPT_STATE_KEY) || '{}'); }
  catch { return {}; }
}
function writeState(s) {
  localStorage.setItem(ATTEMPT_STATE_KEY, JSON.stringify(s));
}

export function guardAttempts(now = Date.now()) {
  const s = readState();
  if (s.nextAllowedAt && now < s.nextAllowedAt) {
    const secs = Math.ceil((s.nextAllowedAt - now)/1000);
    throw new Error(`Locked. Try again in ${secs}s`);
  }
}

export function registerFailure() {
  const s = readState();
  s.n = (s.n || 0) + 1;
  const base = 1500;       // ms
  const backoff = 2.2;
  const coolOff = 15 * 60_000;
  const delay = Math.min(base * Math.pow(backoff, s.n - 1), coolOff);
  s.nextAllowedAt = Date.now() + delay;
  writeState(s);
}

export function registerSuccess() {
  writeState({ n: 0, nextAllowedAt: 0 });
}
