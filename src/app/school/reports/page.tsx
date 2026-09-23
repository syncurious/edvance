import type { Metadata } from 'next';

import { ReportBuilder } from '@/features/reports/components/report-builder';

export const metadata: Metadata = { title: 'Reports' };

export default function ReportsPage() {
  return <ReportBuilder />;
}
