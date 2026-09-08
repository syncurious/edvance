import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import { PlatformReportsPage } from '@/features/platform-reports/components/platform-reports';
import { MockPlatformReportService } from '@/features/platform-reports/services/mock-platform-report-service';

afterEach(cleanup);

describe('PlatformReportsPage', () => {
  it('switches complete report datasets from a single filter workspace', async () => {
    render(<PlatformReportsPage service={new MockPlatformReportService(0)} />);

    expect(
      await screen.findByText(
        'Tenant growth, enrollment, and operational standing.',
      ),
    ).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'School' })).toBeVisible();

    fireEvent.change(screen.getByLabelText('Report type'), {
      target: { value: 'revenue' },
    });
    expect(
      await screen.findByText(
        'Collections, outstanding balances, and failed payments.',
      ),
    ).toBeVisible();
    expect(screen.getByRole('columnheader', { name: 'Invoice' })).toBeVisible();
  });

  it('shows a useful empty state and prevents empty export', async () => {
    render(<PlatformReportsPage service={new MockPlatformReportService(0)} />);
    await screen.findByText(
      'Tenant growth, enrollment, and operational standing.',
    );

    fireEvent.change(screen.getByLabelText('Search records'), {
      target: { value: 'no-such-school' },
    });

    expect(await screen.findByText('No report records found')).toBeVisible();
    expect(
      screen.getByRole('button', { name: 'Export preview' }),
    ).toBeDisabled();
  });
});
