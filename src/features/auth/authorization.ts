import { apiClient } from '@/lib/api/client';

export type AuthorizationSession = {
  user: { id: string; email: string | null };
  platform: { roles: string[]; permissions: string[] };
  memberships: Array<{
    id: string;
    scope: 'platform' | 'school' | 'campus';
    school: { id: string; displayName: string } | null;
    roles: string[];
    permissions: string[];
  }>;
};

export type LoginAudience = 'school' | 'platform';

export async function getAuthorizationSession(): Promise<AuthorizationSession> {
  const response = await apiClient.request<{ data: AuthorizationSession }>(
    '/auth/session',
  );
  return response.data;
}

export function canAccessAudience(
  session: AuthorizationSession,
  audience: LoginAudience,
): boolean {
  return audience === 'platform'
    ? session.platform.permissions.includes('platform.manage')
    : session.memberships.some((membership) =>
        membership.permissions.includes('school.manage'),
      );
}

export function dashboardFor(audience: LoginAudience): string {
  return audience === 'platform' ? '/platform/dashboard' : '/school/dashboard';
}
