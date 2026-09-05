import { describe, expect, it } from 'vitest';

import { MockSubscriptionService } from '@/features/subscriptions/services';

describe('MockSubscriptionService', () => {
  it('provides complete cloned plan, billing, and usage datasets', async () => {
    const service = new MockSubscriptionService(0);
    const overview = await service.getOverview();
    const billing = await service.getBilling();
    const usage = await service.getUsage();

    expect(overview.plans.map((plan) => plan.name)).toEqual([
      'Starter',
      'Professional',
      'Enterprise',
    ]);
    expect(billing.records.some((record) => record.status === 'overdue')).toBe(
      true,
    );
    expect(usage.metrics).toHaveLength(3);

    overview.plans[0].name = 'Changed outside service';
    expect((await service.getOverview()).plans[0].name).toBe('Starter');
  });
});
