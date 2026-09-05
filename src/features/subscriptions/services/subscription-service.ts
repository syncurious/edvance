import type {
  BillingOverview,
  SubscriptionOverview,
  UsageOverview,
} from '@/features/subscriptions/types';

export interface SubscriptionService {
  getOverview(): Promise<SubscriptionOverview>;
  getBilling(): Promise<BillingOverview>;
  getUsage(): Promise<UsageOverview>;
}
