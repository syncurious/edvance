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

import { SignupForm } from '@/features/auth/components/signup-form';
import { makeStore } from '@/store';

const replace = vi.fn();
const signUp = vi.fn();

vi.mock('next/navigation', () => ({ useRouter: vi.fn() }));

vi.mock('@/lib/supabase/client', () => ({
  getSupabaseBrowserClient: () => ({ auth: { signUp } }),
}));

beforeEach(() => {
  replace.mockReset();
  signUp.mockReset();
  vi.mocked(useRouter).mockReturnValue({ replace } as never);
});

afterEach(cleanup);

function renderForm() {
  render(
    <Provider store={makeStore()}>
      <SignupForm />
    </Provider>,
  );
}

describe('SignupForm', () => {
  it('creates an email/password account and explains email confirmation', async () => {
    signUp.mockResolvedValue({ data: { session: null }, error: null });
    renderForm();
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'new@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Secure123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'Secure123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    expect(await screen.findByText('Check your email')).toBeVisible();
    expect(signUp).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'new@example.test',
        password: 'Secure123',
      }),
    );
  });

  it('routes directly to the dashboard when confirmation is disabled', async () => {
    signUp.mockResolvedValue({
      data: {
        session: {
          user: { id: 'user-1', email: 'new@example.test', user_metadata: {} },
        },
      },
      error: null,
    });
    renderForm();
    fireEvent.change(screen.getByLabelText('Email address'), {
      target: { value: 'new@example.test' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Secure123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm password'), {
      target: { value: 'Secure123' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create account' }));

    await waitFor(() =>
      expect(replace).toHaveBeenCalledWith('/super-admin/dashboard'),
    );
  });
});
