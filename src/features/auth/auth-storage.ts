import type { AuthSession } from '@/features/auth/types';

const PERSISTENT_SESSION_KEY = 'edvance.auth.session';
const BROWSER_SESSION_KEY = 'edvance.auth.browser-session';

function isAuthSession(value: unknown): value is AuthSession {
  if (!value || typeof value !== 'object') return false;
  const candidate = value as Partial<AuthSession>;
  return Boolean(
    candidate.accessToken &&
    candidate.user?.id &&
    candidate.user.email &&
    (candidate.user.role === 'super-admin' ||
      candidate.user.role === 'school-admin'),
  );
}

function readValue(storage: Storage, key: string) {
  const raw = storage.getItem(key);
  if (!raw) return null;

  try {
    const value: unknown = JSON.parse(raw);
    return isAuthSession(value) ? value : null;
  } catch {
    return null;
  }
}

export function readAuthSession() {
  return (
    readValue(window.localStorage, PERSISTENT_SESSION_KEY) ??
    readValue(window.sessionStorage, BROWSER_SESSION_KEY)
  );
}

export function saveAuthSession(session: AuthSession, rememberMe: boolean) {
  clearAuthSession();
  const storage = rememberMe ? window.localStorage : window.sessionStorage;
  const key = rememberMe ? PERSISTENT_SESSION_KEY : BROWSER_SESSION_KEY;
  storage.setItem(key, JSON.stringify(session));
}

export function clearAuthSession() {
  window.localStorage.removeItem(PERSISTENT_SESSION_KEY);
  window.sessionStorage.removeItem(BROWSER_SESSION_KEY);
}
