import type { SubscriptionService } from '@/features/subscriptions/services/subscription-service';
import {
  billingOverviewMock,
  subscriptionOverviewMock,
  usageOverviewMock,
} from '@/mocks/subscriptions';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export class MockSubscriptionService implements SubscriptionService {
  constructor(private readonly latency = 300) {}

  private async load<T>(value: T) {
    if (this.latency > 0) await wait(this.latency);
    return structuredClone(value);
  }

  getOverview() {
    return this.load(subscriptionOverviewMock);
  }

  getBilling() {
    return this.load(billingOverviewMock);
  }

  getUsage() {
    return this.load(usageOverviewMock);
  }
}
