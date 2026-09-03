import type { Metadata } from 'next';

import { RoutePlaceholder } from '@/components/shared/route-placeholder';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <RoutePlaceholder
      eyebrow="Authentication route"
      title="A secure welcome starts here."
      description="The route boundary is ready. Form validation, request states, and role-aware access are intentionally scheduled for the authentication build."
      plannedFor="Day 4"
    />
  );
}
