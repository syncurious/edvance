import { StatusBadge } from '@/components/shared/status-badge';
import type {
  BillingStatus,
  SubscriptionStatus,
} from '@/features/subscriptions/types';

const subscriptionLabels: Record<SubscriptionStatus, string> = {
  active: 'Active',
  trial: 'Trial',
  'past-due': 'Past due',
  cancelled: 'Cancelled',
};

const billingLabels: Record<BillingStatus, string> = {
  paid: 'Paid',
  pending: 'Pending',
  overdue: 'Overdue',
  failed: 'Failed',
};

export function SubscriptionStatusBadge({
  status,
}: {
  status: SubscriptionStatus;
}) {
  return (
    <StatusBadge
      status={
        status === 'active'
          ? 'success'
          : status === 'trial'
            ? 'info'
            : status === 'past-due'
              ? 'warning'
              : 'neutral'
      }
    >
      {subscriptionLabels[status]}
    </StatusBadge>
  );
}

export function BillingStatusBadge({ status }: { status: BillingStatus }) {
  return (
    <StatusBadge
      status={
        status === 'paid'
          ? 'success'
          : status === 'pending'
            ? 'info'
            : status === 'overdue'
              ? 'warning'
              : 'error'
      }
    >
      {billingLabels[status]}
    </StatusBadge>
  );
}
