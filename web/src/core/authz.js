// [[HANDLE: AUTHZ_CORE]]
export const ROLES = ['superuser','admin','clinician','viewer'];

export function hasAnyRole(user, allowed){
  if (!user?.role) return false;
  if (user.role === 'superuser') return true;
  return allowed.includes(user.role);
}
export function requireRole(user, allowed){
  if (!hasAnyRole(user, allowed)) throw new Error('Forbidden: insufficient role');
}
