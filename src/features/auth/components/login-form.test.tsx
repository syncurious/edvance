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

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

beforeEach(() => {
  replace.mockReset();
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
  it('shows field-level validation without calling the service', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter your email address.')).toBeVisible();
    expect(screen.getByText('Enter your password.')).toBeVisible();
    expect(replace).not.toHaveBeenCalled();
  });

  it('shows an API-safe error for rejected credentials', async () => {
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

  it('uses a demo account and routes into its role workspace', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: /School admin/i }));
    fireEvent.click(
      screen.getByRole('checkbox', {
        name: 'Keep me signed in on this device',
      }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/school-admin/dashboard'),
    );
    expect(window.localStorage.getItem('edvance.auth.session')).toContain(
      'admin@crescent.test',
    );
  });
});
