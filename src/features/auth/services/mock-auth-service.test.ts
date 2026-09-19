import { afterEach, describe, expect, it, vi } from 'vitest';

import { mockAuthService } from '@/features/auth/services/mock-auth-service';

afterEach(() => vi.useRealTimers());

describe('mockAuthService', () => {
  it('keeps password reset requests user-safe', async () => {
    vi.useFakeTimers();
    const request = mockAuthService.requestPasswordReset({
      email: 'admin@example.test',
    });

    await vi.runAllTimersAsync();

    await expect(request).resolves.toMatchObject({
      message: expect.any(String),
    });
  });
});
