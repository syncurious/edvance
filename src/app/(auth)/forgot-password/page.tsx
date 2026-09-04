import type { Metadata } from 'next';

import { AuthPage } from '@/features/auth/components/auth-page';
import { ForgotPasswordForm } from '@/features/auth/components/forgot-password-form';

export const metadata: Metadata = {
  title: 'Forgot password',
  description: 'Request Edvance password reset instructions.',
};

export default function ForgotPasswordPage() {
  return (
    <AuthPage
      eyebrow="Account recovery"
      title="Reset your password"
      description="Enter your administrator email and we’ll send the next steps."
    >
      <ForgotPasswordForm />
    </AuthPage>
  );
}
