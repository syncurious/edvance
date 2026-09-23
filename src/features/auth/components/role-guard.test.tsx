import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RoleGuard } from '@/features/auth/components/role-guard';
import { makeStore } from '@/store';
import { authHydrated } from '@/store/slices/auth-slice';

const replace = vi.fn();
const { getAuthorizationSession } = vi.hoisted(() => ({
  getAuthorizationSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

vi.mock('@/features/auth/authorization', () => ({
  getAuthorizationSession,
  canAccessAudience: () => true,
}));

beforeEach(() => {
  replace.mockReset();
  vi.mocked(usePathname).mockReturnValue('/school-admin/students');
  vi.mocked(useRouter).mockReturnValue({ replace } as never);
  getAuthorizationSession.mockResolvedValue({});
});

afterEach(cleanup);

describe('RoleGuard', () => {
  it('redirects an anonymous visitor back to login with a return path', async () => {
    const store = makeStore();
    store.dispatch(authHydrated(null));

    render(
      <Provider store={store}>
        <RoleGuard audience="school">Private workspace</RoleGuard>
      </Provider>,
    );

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        '/login?next=%2Fschool-admin%2Fstudents',
      ),
    );
    expect(screen.queryByText('Private workspace')).not.toBeInTheDocument();
  });

  it('renders content for an authorized session', async () => {
    const store = makeStore();
    store.dispatch(
      authHydrated({
        user: {
          id: 'school-admin-1',
          name: 'School Admin',
          email: 'admin@example.test',
        },
      }),
    );

    render(
      <Provider store={store}>
        <RoleGuard audience="school">Private workspace</RoleGuard>
      </Provider>,
    );

    expect(await screen.findByText('Private workspace')).toBeVisible();
    expect(replace).not.toHaveBeenCalled();
  });
});
