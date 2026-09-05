import { MockSubscriptionService } from '@/features/subscriptions/services/mock-subscription-service';

export type { SubscriptionService } from '@/features/subscriptions/services/subscription-service';
export { MockSubscriptionService } from '@/features/subscriptions/services/mock-subscription-service';

export const subscriptionService = new MockSubscriptionService();
