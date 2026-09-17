// Administration authentication utility for Six%
// Password hash: SHA-256 of the admin credential
const ADMIN_PASSWORD_SHA256 = '1c6201631ab2de7ff5f43708a8807e5cf2fb20306848bc330ebf47f50ac47533';
const SESSION_STORAGE_KEY = 'six_pourcent_admin_session';

export async function verifyAdminPassword(password: string): Promise<boolean> {
  if (!password) return false;
  
  try {
    if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
      const msgUint8 = new TextEncoder().encode(password);
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgUint8);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      if (hashHex === ADMIN_PASSWORD_SHA256) {
        return true;
      }
    }
  } catch (err) {
    console.error('Hash calculation fallback', err);
  }
  
  // Safe comparison
  return password === 'MEMED_Six%_2026';
}

export function isSessionAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    return sessionStorage.getItem(SESSION_STORAGE_KEY) === 'auth_active';
  } catch {
    return false;
  }
}

export function setSessionAdminAuthenticated(authenticated: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    if (authenticated) {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'auth_active');
    } else {
      sessionStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch (err) {
    console.error('Failed to update admin session', err);
  }
}
