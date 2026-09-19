import type { Metadata } from 'next';

import { AuthPage } from '@/features/auth/components/auth-page';
import { SignupForm } from '@/features/auth/components/signup-form';

export const metadata: Metadata = {
  title: 'Create account',
  description: 'Create an Edvance administration account.',
};

export default function SignupPage() {
  return (
    <AuthPage
      eyebrow="Get started"
      title="Create your Edvance account"
      description="Use your email address and a secure password to get started."
    >
      <SignupForm />
    </AuthPage>
  );
}
