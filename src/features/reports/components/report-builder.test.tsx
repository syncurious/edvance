import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { ReportBuilder } from '@/features/reports/components/report-builder';
import { MockReportService } from '@/features/reports/services';
import type { ReportService } from '@/features/reports/services';
import { makeStore } from '@/store';

afterEach(cleanup);
const renderReport = (service: ReportService = new MockReportService(0)) =>
  render(
    <Provider store={makeStore()}>
      <ReportBuilder service={service} />
    </Provider>,
  );

describe('ReportBuilder', () => {
  it('uses the complete reusable workflow and switches datasets', async () => {
    renderReport();
    expect(await screen.findByText('Academic performance')).toBeVisible();
    const workflow = screen.getByRole('list', { name: 'Report workflow' });
    for (const step of ['Filters', 'Data', 'Summary', 'Table', 'Export'])
      expect(workflow).toHaveTextContent(step);
    expect(screen.getByText('Export is currently UI-only')).toBeVisible();
    fireEvent.change(screen.getByLabelText('Report type'), {
      target: { value: 'fees' },
    });
    expect(await screen.findByText('Fee collection')).toBeVisible();
    expect(
      screen.getByRole('columnheader', { name: 'Collected' }),
    ).toBeVisible();
  });

  it('shows report errors with retry', async () => {
    renderReport({
      getReport: vi.fn().mockRejectedValue(new Error('offline')),
    });
    expect(await screen.findByText('Something went wrong')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Try again' })).toBeVisible();
  });
});
