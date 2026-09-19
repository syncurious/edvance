import { describe, expect, it } from 'vitest';

import {
  forgotPasswordSchema,
  loginSchema,
  resetPasswordSchema,
} from '@/features/auth/schemas';

describe('auth schemas', () => {
  it('accepts a complete login and rejects malformed credentials', () => {
    expect(
      loginSchema.safeParse({
        email: 'admin@crescent.test',
        password: 'Demo123!',
      }).success,
    ).toBe(true);
    expect(
      loginSchema.safeParse({
        email: 'not-an-email',
        password: '',
      }).success,
    ).toBe(false);
  });

  it('validates recovery email and matching strong passwords', () => {
    expect(
      forgotPasswordSchema.safeParse({ email: 'admin@crescent.test' }).success,
    ).toBe(true);
    expect(
      resetPasswordSchema.safeParse({
        password: 'Secure123',
        confirmPassword: 'Different123',
      }).success,
    ).toBe(false);
    expect(
      resetPasswordSchema.safeParse({
        password: 'Secure123',
        confirmPassword: 'Secure123',
      }).success,
    ).toBe(true);
  });
});
