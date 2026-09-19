import type { AuthService } from '@/features/auth/services/auth-service';

function delay(duration = 450) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export const mockAuthService: AuthService = {
  async requestPasswordReset() {
    await delay();
    return {
      message:
        'If an account matches that email, password reset instructions are on the way.',
    };
  },

  async resetPassword({ token }) {
    await delay();
    if (!token) {
      throw new Error(
        'This reset link is missing or expired. Request a new one.',
      );
    }

    return { message: 'Your password has been updated. You can now sign in.' };
  },
};
