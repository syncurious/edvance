import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { useRouter } from 'next/navigation';
import { Provider } from 'react-redux';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginForm } from '@/features/auth/components/login-form';
import { makeStore } from '@/store';

const replace = vi.fn();
const signInWithPassword = vi.fn();
const { getAuthorizationSession } = vi.hoisted(() => ({
  getAuthorizationSession: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => ({
    auth: { signInWithPassword },
  }),
}));

vi.mock('@/features/auth/authorization', () => ({
  getAuthorizationSession,
  canAccessAudience: () => true,
  dashboardFor: () => '/school/dashboard',
}));

beforeEach(() => {
  replace.mockReset();
  signInWithPassword.mockReset();
  signInWithPassword.mockResolvedValue({
    data: {
      session: {
        access_token: 'test-access-token',
        user: {
          id: 'user-1',
          email: 'admin@example.test',
          user_metadata: {},
        },
      },
    },
    error: null,
  });
  getAuthorizationSession.mockResolvedValue({
    user: { id: 'user-1', email: 'admin@example.test' },
    platform: { roles: [], permissions: [] },
    memberships: [],
  });
  vi.mocked(useRouter).mockReturnValue({ replace } as never);
  window.localStorage.clear();
  window.sessionStorage.clear();
});

afterEach(cleanup);

function renderForm() {
  render(
    <Provider store={makeStore()}>
      <LoginForm />
    </Provider>,
  );
}

describe('LoginForm', () => {
  it('shows field-level validation without calling Supabase', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter your email address.')).toBeVisible();
    expect(screen.getByText('Enter your password.')).toBeVisible();
    expect(signInWithPassword).not.toHaveBeenCalled();
    expect(replace).not.toHaveBeenCalled();
  });

  it('shows an API-safe error for rejected credentials', async () => {
    signInWithPassword.mockResolvedValue({
      data: { session: null },
      error: new Error('Invalid login credentials'),
    });
    renderForm();
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'unknown@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Wrong123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Unable to sign in')).toBeVisible();
    expect(screen.getByText(/Email or password is incorrect/)).toBeVisible();
  });

  it('signs in with Supabase and routes to the authenticated dashboard', async () => {
    renderForm();
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'admin@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/school/dashboard'),
    );
    expect(signInWithPassword).toHaveBeenCalledWith({
      email: 'admin@example.test',
      password: 'Password123!',
    });
  });
});
