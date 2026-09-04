import type { AuthService } from '@/features/auth/services/auth-service';
import type { AuthSession, LoginCredentials } from '@/features/auth/types';

export const DEMO_PASSWORD = 'Demo123!';

export const DEMO_ACCOUNTS = [
  {
    email: 'super@edvance.test',
    password: DEMO_PASSWORD,
    session: {
      accessToken: 'mock-super-admin-session',
      user: {
        id: 'user-super-001',
        name: 'Areeb Khan',
        email: 'super@edvance.test',
        role: 'super-admin',
      },
    },
  },
  {
    email: 'admin@crescent.test',
    password: DEMO_PASSWORD,
    session: {
      accessToken: 'mock-school-admin-session',
      user: {
        id: 'user-school-001',
        name: 'Sara Malik',
        email: 'admin@crescent.test',
        role: 'school-admin',
        schoolId: 'school-crescent',
      },
    },
  },
] as const;

function delay(duration = 450) {
  return new Promise((resolve) => setTimeout(resolve, duration));
}

export const mockAuthService: AuthService = {
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    await delay();
    const account = DEMO_ACCOUNTS.find(
      (candidate) =>
        candidate.email === credentials.email.trim().toLowerCase() &&
        candidate.password === credentials.password,
    );

    if (!account) {
      throw new Error(
        'Email or password is incorrect. Try a demo account below.',
      );
    }

    return account.session;
  },

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
