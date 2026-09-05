import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  BillingPage,
  SubscriptionsPage,
  UsagePage,
} from '@/features/subscriptions/components/subscription-pages';
import { MockSubscriptionService } from '@/features/subscriptions/services';

afterEach(cleanup);

describe('subscription management pages', () => {
  it('shows all plans, summary metrics, and school subscriptions', async () => {
    render(<SubscriptionsPage service={new MockSubscriptionService(0)} />);
    expect(await screen.findByText('Most popular')).toBeVisible();
    const plans = screen.getByRole('region', { name: 'Subscription plans' });
    for (const name of ['Starter', 'Professional', 'Enterprise']) {
      expect(within(plans).getByText(name)).toBeVisible();
    }
    expect(screen.getByText('Monthly recurring revenue')).toBeVisible();
    expect(screen.getByText('School subscriptions')).toBeVisible();
  });

  it('shows billing summary and invoice statuses', async () => {
    render(<BillingPage service={new MockSubscriptionService(0)} />);
    expect(await screen.findByText('Recent invoices')).toBeVisible();
    expect(screen.getByText('Collected this month')).toBeVisible();
    expect(screen.getByText('INV-260905-24')).toBeVisible();
    expect(screen.getAllByText('Overdue')).not.toHaveLength(0);
  });

  it('shows aggregate and per-school resource usage', async () => {
    render(<UsagePage service={new MockSubscriptionService(0)} />);
    expect(await screen.findByText('Highest school usage')).toBeVisible();
    expect(
      screen.getByRole('progressbar', { name: /SMS messages/ }),
    ).toBeVisible();
    expect(screen.getByText('Beacon Valley School')).toBeVisible();
  });

  it('shows loading, empty, and error presentations', async () => {
    const loadingService = {
      getOverview: () => new Promise<never>(() => undefined),
      getBilling: vi.fn(),
      getUsage: vi.fn(),
    };
    const { rerender } = render(<SubscriptionsPage service={loadingService} />);
    expect(screen.getAllByLabelText('Loading subscription plan')).toHaveLength(
      3,
    );

    const emptyService = {
      getOverview: vi.fn().mockResolvedValue({
        plans: [],
        subscriptions: [],
        activeSubscriptions: 0,
        trialSubscriptions: 0,
        monthlyRecurringRevenue: 0,
      }),
      getBilling: vi.fn(),
      getUsage: vi.fn(),
    };
    rerender(<SubscriptionsPage service={emptyService} />);
    expect(await screen.findByText('No plans configured')).toBeVisible();
    expect(screen.getByText('No subscriptions found')).toBeVisible();

    const failingService = {
      ...emptyService,
      getOverview: vi.fn().mockRejectedValue(new Error('Offline')),
    };
    rerender(<SubscriptionsPage service={failingService} />);
    expect(await screen.findByText('Something went wrong')).toBeVisible();
    expect(
      screen.getByText('Subscription information could not be loaded.'),
    ).toBeVisible();
  });
});
