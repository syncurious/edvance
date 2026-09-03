import type { Metadata } from 'next';

import { RoutePlaceholder } from '@/components/shared/route-placeholder';

export const metadata: Metadata = {
  title: 'School Admin',
};

export default function SchoolAdminDashboardPage() {
  return (
    <RoutePlaceholder
      eyebrow="School Admin route"
      title="Daily school work, made legible."
      description="This route will connect attendance, students, teachers, fees, exams, and school-level decisions without losing context."
      plannedFor="Days 3 and 9–14"
    />
  );
}
