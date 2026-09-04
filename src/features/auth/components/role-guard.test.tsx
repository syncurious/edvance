import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { usePathname, useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { RoleGuard } from '@/features/auth/components/role-guard';
import { makeStore } from '@/store';
import { authHydrated } from '@/store/slices/auth-slice';

const replace = vi.fn();

vi.mock('next/navigation', () => ({
  usePathname: vi.fn(),
  useRouter: vi.fn(),
}));

beforeEach(() => {
  replace.mockReset();
  vi.mocked(usePathname).mockReturnValue('/school-admin/students');
  vi.mocked(useRouter).mockReturnValue({ replace } as never);
});

afterEach(cleanup);

describe('RoleGuard', () => {
  it('redirects an anonymous visitor back to login with a return path', async () => {
    const store = makeStore();
    store.dispatch(authHydrated(null));

    render(
      <Provider store={store}>
        <RoleGuard adminRole="school-admin">Private workspace</RoleGuard>
      </Provider>,
    );

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith(
        '/login?next=%2Fschool-admin%2Fstudents',
      ),
    );
    expect(screen.queryByText('Private workspace')).not.toBeInTheDocument();
  });

  it('renders content for the required authenticated role', () => {
    const store = makeStore();
    store.dispatch(
      authHydrated({
        accessToken: 'test-session',
        user: {
          id: 'school-admin-1',
          name: 'School Admin',
          email: 'admin@example.test',
          role: 'school-admin',
        },
      }),
    );

    render(
      <Provider store={store}>
        <RoleGuard adminRole="school-admin">Private workspace</RoleGuard>
      </Provider>,
    );

    expect(screen.getByText('Private workspace')).toBeVisible();
    expect(replace).not.toHaveBeenCalled();
  });
});
