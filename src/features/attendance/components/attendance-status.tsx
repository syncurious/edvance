import { CalendarMinus, Check, Clock3, X } from 'lucide-react';

import { StatusBadge } from '@/components/shared/status-badge';
import type { AttendanceStatus } from '@/features/attendance/types';

export const attendanceStatusMeta = {
  present: { label: 'Present', icon: Check, tone: 'success' },
  absent: { label: 'Absent', icon: X, tone: 'error' },
  late: { label: 'Late', icon: Clock3, tone: 'warning' },
  leave: { label: 'Leave', icon: CalendarMinus, tone: 'info' },
} as const;

export function AttendanceStatusBadge({
  status,
}: {
  status: AttendanceStatus;
}) {
  const meta = attendanceStatusMeta[status];
  return <StatusBadge status={meta.tone}>{meta.label}</StatusBadge>;
}
