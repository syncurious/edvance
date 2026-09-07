import { StatusBadge } from '@/components/shared/status-badge';
import type { TeacherStatus } from '@/features/teachers/types';

export const teacherStatusLabels: Record<TeacherStatus, string> = {
  active: 'Active',
  'on-leave': 'On leave',
  inactive: 'Inactive',
};

const tones = {
  active: 'success',
  'on-leave': 'warning',
  inactive: 'neutral',
} as const;

export function TeacherStatusBadge({ status }: { status: TeacherStatus }) {
  return (
    <StatusBadge status={tones[status]}>
      {teacherStatusLabels[status]}
    </StatusBadge>
  );
}
