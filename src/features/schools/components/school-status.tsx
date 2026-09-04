import { StatusBadge } from '@/components/shared/status-badge';
import type { SchoolStatus } from '@/features/schools/types';

export const schoolStatusLabels: Record<SchoolStatus, string> = {
  active: 'Active',
  trial: 'Trial',
  'past-due': 'Past due',
  suspended: 'Suspended',
};

const tones = {
  active: 'success',
  trial: 'info',
  'past-due': 'warning',
  suspended: 'error',
} as const;

export function SchoolStatusBadge({ status }: { status: SchoolStatus }) {
  return (
    <StatusBadge status={tones[status]}>
      {schoolStatusLabels[status]}
    </StatusBadge>
  );
}
