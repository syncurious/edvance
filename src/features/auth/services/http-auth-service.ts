import type { AuthService } from '@/features/auth/services/auth-service';
import type { AuthResultMessage, AuthSession, LoginCredentials } from '@/features/auth/types';

async function request<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/${path}`, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json', accept: 'application/json' }, body: body ? JSON.stringify(body) : undefined });
  const payload = (await response.json().catch(() => null)) as { data?: T; error?: { message?: string } } | null;
  if (!response.ok || !payload?.data) throw new Error(payload?.error?.message ?? 'The request could not be completed.');
  return payload.data;
}

export const httpAuthService: AuthService & { refresh(): Promise<AuthSession>; logout(): Promise<void> } = {
  login(credentials: LoginCredentials) { return request<AuthSession>('auth/login', { email: credentials.email, password: credentials.password }); },
  refresh() { return request<AuthSession>('auth/refresh'); },
  async logout() { await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }); },
  async requestPasswordReset(): Promise<AuthResultMessage> { throw new Error('Password reset is not available yet.'); },
  async resetPassword(): Promise<AuthResultMessage> { throw new Error('Password reset is not available yet.'); },
};
