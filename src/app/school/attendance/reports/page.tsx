import type { Metadata } from 'next';
import { AttendanceReports } from '@/features/attendance/components/attendance-reports';

export const metadata: Metadata = { title: 'Attendance Reports' };
export default function AttendanceReportsPage() {
  return <AttendanceReports />;
}
