import type { ReportService } from '@/features/reports/services/report-service';
import type {
  SchoolReport,
  SchoolReportMetric,
  SchoolReportQuery,
} from '@/features/reports/types';
import { classMocks } from '@/mocks/classes';
import { invoiceMocks } from '@/mocks/fees';
import { studentMocks } from '@/mocks/students';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const money = (value: number) =>
  new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    maximumFractionDigits: 0,
  }).format(value);

const labels = {
  academic: 'Academic performance',
  attendance: 'Attendance overview',
  fees: 'Fee collection',
  enrollment: 'Enrollment distribution',
} as const;

export class MockReportService implements ReportService {
  constructor(private readonly latency = 220) {}

  async getReport(query: SchoolReportQuery): Promise<SchoolReport> {
    if (this.latency) await wait(this.latency);
    const classes = classMocks.filter(
      (item) =>
        (query.campusId === 'all' || item.campusId === query.campusId) &&
        (query.className === 'all' || item.gradeName === query.className),
    );
    const students = studentMocks.filter(
      (item) =>
        (query.campusId === 'all' || item.campusId === query.campusId) &&
        (query.className === 'all' || item.className === query.className),
    );
    const generatedFor = `${query.startDate} to ${query.endDate}`;
    let metrics: SchoolReportMetric[] = [];
    let columns: string[] = [];
    let rows: SchoolReport['rows'] = [];

    if (query.type === 'academic') {
      const average = students.length
        ? Math.round(
            students.reduce(
              (sum, student) =>
                sum +
                student.examResults.reduce(
                  (subjectSum, subject) => subjectSum + subject.score,
                  0,
                ) /
                  student.examResults.length,
              0,
            ) / students.length,
          )
        : 0;
      metrics = [
        { label: 'Students', value: String(students.length), tone: 'neutral' },
        { label: 'Average', value: `${average}%`, tone: 'info' },
        {
          label: 'Pass rate',
          value: `${students.length ? 91 : 0}%`,
          tone: 'success',
        },
        {
          label: 'Needs support',
          value: String(Math.round(students.length * 0.09)),
          tone: 'warning',
        },
      ];
      columns = ['Class', 'Students', 'Average', 'Highest', 'Pass rate'];
      rows = classes.map((item, index) => ({
        id: item.id,
        cells: [
          `${item.gradeName} · ${item.section}`,
          String(item.studentCount),
          `${74 + (index % 12)}%`,
          `${91 + (index % 8)}%`,
          `${88 + (index % 11)}%`,
        ],
      }));
    } else if (query.type === 'attendance') {
      const average = students.length
        ? Number(
            (
              students.reduce(
                (sum, student) => sum + student.attendance.percentage,
                0,
              ) / students.length
            ).toFixed(1),
          )
        : 0;
      metrics = [
        { label: 'Students', value: String(students.length), tone: 'neutral' },
        { label: 'Attendance', value: `${average}%`, tone: 'success' },
        {
          label: 'Absent today',
          value: String(Math.max(0, Math.round(students.length * 0.04))),
          tone: 'error',
        },
        {
          label: 'Late today',
          value: String(Math.max(0, Math.round(students.length * 0.03))),
          tone: 'warning',
        },
      ];
      columns = ['Class', 'Enrollment', 'Present', 'Absent', 'Late', 'Rate'];
      rows = classes.map((item, index) => ({
        id: item.id,
        cells: [
          `${item.gradeName} · ${item.section}`,
          String(item.studentCount),
          String(item.studentCount - 2 - (index % 2)),
          String(1 + (index % 2)),
          '1',
          `${Math.round(((item.studentCount - 1) / item.studentCount) * 100)}%`,
        ],
      }));
    } else if (query.type === 'fees') {
      const invoices = invoiceMocks.filter(
        (item) =>
          (query.campusId === 'all' || item.campusId === query.campusId) &&
          (query.className === 'all' ||
            item.className.startsWith(query.className)),
      );
      const total = invoices.reduce((sum, item) => sum + item.total, 0);
      const collected = invoices.reduce(
        (sum, item) => sum + item.amountPaid,
        0,
      );
      const overdue = invoices
        .filter((item) => item.status === 'overdue')
        .reduce((sum, item) => sum + item.balance, 0);
      metrics = [
        { label: 'Billed', value: money(total), tone: 'neutral' },
        { label: 'Collected', value: money(collected), tone: 'success' },
        { label: 'Outstanding', value: money(total - collected), tone: 'info' },
        { label: 'Overdue', value: money(overdue), tone: 'error' },
      ];
      columns = ['Class', 'Invoices', 'Billed', 'Collected', 'Outstanding'];
      const invoiceClasses = [
        ...new Set(invoices.map((item) => item.className)),
      ];
      rows = invoiceClasses.map((className) => {
        const matches = invoices.filter(
          (invoice) => invoice.className === className,
        );
        const billed = matches.reduce((sum, invoice) => sum + invoice.total, 0);
        const paid = matches.reduce(
          (sum, invoice) => sum + invoice.amountPaid,
          0,
        );
        return {
          id: className,
          cells: [
            className,
            String(matches.length),
            money(billed),
            money(paid),
            money(billed - paid),
          ],
        };
      });
    } else {
      const capacity = classes.reduce((sum, item) => sum + item.capacity, 0);
      const enrolled = classes.reduce(
        (sum, item) => sum + item.studentCount,
        0,
      );
      metrics = [
        { label: 'Enrollment', value: String(enrolled), tone: 'info' },
        { label: 'Capacity', value: String(capacity), tone: 'neutral' },
        {
          label: 'Utilization',
          value: `${capacity ? Math.round((enrolled / capacity) * 100) : 0}%`,
          tone: 'success',
        },
        {
          label: 'Open seats',
          value: String(capacity - enrolled),
          tone: 'warning',
        },
      ];
      columns = [
        'Class',
        'Section',
        'Campus',
        'Students',
        'Capacity',
        'Utilization',
      ];
      rows = classes.map((item) => ({
        id: item.id,
        cells: [
          item.gradeName,
          item.section,
          item.campusName,
          String(item.studentCount),
          String(item.capacity),
          `${Math.round((item.studentCount / item.capacity) * 100)}%`,
        ],
      }));
    }

    return structuredClone({
      title: labels[query.type],
      description: `A reusable ${labels[query.type].toLowerCase()} view scoped by campus, class, and period.`,
      generatedFor,
      metrics,
      columns,
      rows,
    });
  }
}
