import { StatusBadge } from '@/components/shared/status-badge';
import type { FeeStatus } from '@/features/fees/types';

export const feeStatusLabels: Record<FeeStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  partial: 'Partial',
  overdue: 'Overdue',
  cancelled: 'Cancelled',
};

const tones = {
  paid: 'success',
  pending: 'neutral',
  partial: 'info',
  overdue: 'error',
  cancelled: 'warning',
} as const;

export function FeeStatusBadge({ status }: { status: FeeStatus }) {
  return (
    <StatusBadge status={tones[status]}>{feeStatusLabels[status]}</StatusBadge>
  );
}
