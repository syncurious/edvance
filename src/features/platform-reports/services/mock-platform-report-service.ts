import type { PlatformReportService } from '@/features/platform-reports/services/platform-report-service';
import type {
  PlatformReport,
  PlatformReportQuery,
} from '@/features/platform-reports/types';
import { formatCurrency } from '@/lib/format';
import { schoolMocks } from '@/mocks/schools';
import {
  billingOverviewMock,
  subscriptionOverviewMock,
  usageOverviewMock,
} from '@/mocks/subscriptions';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const number = new Intl.NumberFormat('en-PK');

const includesSearch = (values: string[], search: string) =>
  !search || values.some((value) => value.toLocaleLowerCase().includes(search));

export class MockPlatformReportService implements PlatformReportService {
  constructor(private readonly latency = 220) {}

  async getReport(query: PlatformReportQuery): Promise<PlatformReport> {
    if (this.latency) await wait(this.latency);
    const search = query.search.trim().toLocaleLowerCase();

    if (query.type === 'school-health') {
      const schools = schoolMocks.filter((school) =>
        includesSearch([school.name, school.code, school.plan], search),
      );
      return structuredClone({
        title: 'School health',
        description: 'Tenant growth, enrollment, and operational standing.',
        metrics: [
          {
            label: 'Schools',
            value: number.format(schools.length),
            tone: 'info',
          },
          {
            label: 'Active',
            value: number.format(
              schools.filter((school) => school.status === 'active').length,
            ),
            tone: 'success',
          },
          {
            label: 'Students',
            value: number.format(
              schools.reduce((total, school) => total + school.students, 0),
            ),
            tone: 'neutral',
          },
          {
            label: 'Needs attention',
            value: number.format(
              schools.filter((school) =>
                ['past-due', 'suspended'].includes(school.status),
              ).length,
            ),
            tone: 'warning',
          },
        ],
        columns: ['School', 'Code', 'Plan', 'Campuses', 'Students', 'Status'],
        rows: schools.map((school) => ({
          id: school.id,
          cells: [
            school.name,
            school.code,
            school.plan,
            String(school.campuses),
            number.format(school.students),
            school.status.replace('-', ' '),
          ],
        })),
      });
    }

    if (query.type === 'subscriptions') {
      const rows = subscriptionOverviewMock.subscriptions.filter((item) =>
        includesSearch([item.school, item.plan, item.status], search),
      );
      return structuredClone({
        title: 'Subscription portfolio',
        description: 'Plan mix, renewal timing, and subscription standing.',
        metrics: [
          {
            label: 'Active',
            value: number.format(subscriptionOverviewMock.activeSubscriptions),
            tone: 'success',
          },
          {
            label: 'Trials',
            value: number.format(subscriptionOverviewMock.trialSubscriptions),
            tone: 'info',
          },
          {
            label: 'Monthly recurring',
            value: formatCurrency(
              subscriptionOverviewMock.monthlyRecurringRevenue,
            ),
            tone: 'neutral',
          },
          {
            label: 'Past due',
            value: number.format(
              rows.filter((item) => item.status === 'past-due').length,
            ),
            tone: 'warning',
          },
        ],
        columns: ['School', 'Plan', 'Monthly amount', 'Renews', 'Status'],
        rows: rows.map((item) => ({
          id: item.id,
          cells: [
            item.school,
            item.plan,
            formatCurrency(item.monthlyAmount),
            item.renewsAt,
            item.status.replace('-', ' '),
          ],
        })),
      });
    }

    if (query.type === 'revenue') {
      const rows = billingOverviewMock.records.filter((item) =>
        includesSearch(
          [item.school, item.invoice, item.plan, item.status],
          search,
        ),
      );
      return structuredClone({
        title: 'Revenue collection',
        description: 'Collections, outstanding balances, and failed payments.',
        metrics: [
          {
            label: 'Collected',
            value: formatCurrency(billingOverviewMock.collected),
            tone: 'success',
          },
          {
            label: 'Outstanding',
            value: formatCurrency(billingOverviewMock.outstanding),
            tone: 'info',
          },
          {
            label: 'Overdue',
            value: formatCurrency(billingOverviewMock.overdue),
            tone: 'warning',
          },
          {
            label: 'Failed payments',
            value: String(billingOverviewMock.failedPayments),
            tone: 'error',
          },
        ],
        columns: ['Invoice', 'School', 'Plan', 'Amount', 'Due', 'Status'],
        rows: rows.map((item) => ({
          id: item.id,
          cells: [
            item.invoice,
            item.school,
            item.plan,
            formatCurrency(item.amount),
            item.dueAt,
            item.status,
          ],
        })),
      });
    }

    const rows = usageOverviewMock.schools.filter((item) =>
      includesSearch([item.school, item.plan], search),
    );
    const [sms, storage, users] = usageOverviewMock.metrics;
    return structuredClone({
      title: 'Platform usage',
      description: 'SMS, storage, and staff-account consumption by school.',
      metrics: [
        {
          label: 'SMS used',
          value: number.format(sms.used),
          tone: 'info',
        },
        {
          label: 'SMS remaining',
          value: number.format(sms.limit - sms.used),
          tone: 'neutral',
        },
        {
          label: 'Storage used',
          value: `${number.format(storage.used)} GB`,
          tone: 'warning',
        },
        {
          label: 'Staff accounts',
          value: number.format(users.used),
          tone: 'success',
        },
      ],
      columns: ['School', 'Plan', 'SMS', 'Storage', 'Staff accounts'],
      rows: rows.map((item) => ({
        id: item.id,
        cells: [
          item.school,
          item.plan,
          number.format(item.sms),
          `${number.format(item.storage)} GB`,
          number.format(item.users),
        ],
      })),
    });
  }
}
