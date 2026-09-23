import type { Metadata } from 'next';
import { AttendanceEntry } from '@/features/attendance/components/attendance-entry';

export const metadata: Metadata = { title: 'Attendance' };
export default function AttendancePage() {
  return <AttendanceEntry />;
}
