import type {
  AuthResultMessage,
  AuthSession,
  LoginCredentials,
  PasswordResetRequest,
  PasswordResetSubmission,
} from '@/features/auth/types';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<AuthSession>;
  requestPasswordReset(
    request: PasswordResetRequest,
  ): Promise<AuthResultMessage>;
  resetPassword(
    submission: PasswordResetSubmission,
  ): Promise<AuthResultMessage>;
}
