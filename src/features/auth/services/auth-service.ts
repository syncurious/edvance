import type {
  AuthResultMessage,
  PasswordResetRequest,
  PasswordResetSubmission,
} from '@/features/auth/types';

export interface AuthService {
  requestPasswordReset(
    request: PasswordResetRequest,
  ): Promise<AuthResultMessage>;
  resetPassword(
    submission: PasswordResetSubmission,
  ): Promise<AuthResultMessage>;
}
