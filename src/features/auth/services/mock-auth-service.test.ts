import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  DEMO_PASSWORD,
  mockAuthService,
} from '@/features/auth/services/mock-auth-service';

afterEach(() => vi.useRealTimers());

describe('mockAuthService', () => {
  it('returns the role-specific session for a demo account', async () => {
    vi.useFakeTimers();
    const request = mockAuthService.login({
      email: 'SUPER@EDVANCE.TEST',
      password: DEMO_PASSWORD,
      rememberMe: false,
    });

    await vi.runAllTimersAsync();

    await expect(request).resolves.toMatchObject({
      user: { role: 'super-admin', email: 'super@edvance.test' },
    });
  });

  it('rejects invalid credentials with a user-safe message', async () => {
    vi.useFakeTimers();
    const request = mockAuthService.login({
      email: 'unknown@example.com',
      password: 'wrong-password',
      rememberMe: false,
    });
    const expectation = expect(request).rejects.toThrow(
      'Email or password is incorrect',
    );

    await vi.runAllTimersAsync();
    await expectation;
  });
});
