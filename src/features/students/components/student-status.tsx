import { StatusBadge } from '@/components/shared/status-badge';
import type { StudentStatus } from '@/features/students/types';

export const studentStatusLabels: Record<StudentStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
  graduated: 'Graduated',
  withdrawn: 'Withdrawn',
};

const statusTones = {
  active: 'success',
  inactive: 'warning',
  graduated: 'info',
  withdrawn: 'error',
} as const;

export function StudentStatusBadge({ status }: { status: StudentStatus }) {
  return (
    <StatusBadge status={statusTones[status]}>
      {studentStatusLabels[status]}
    </StatusBadge>
  );
}
