import type { AttendanceService } from '@/features/attendance/services/attendance-service';
import type {
  AttendanceRecord,
  AttendanceReportQuery,
  AttendanceSheet,
  AttendanceStatus,
  SaveAttendanceInput,
} from '@/features/attendance/types';
import { classMocks } from '@/mocks/classes';
import { makeAttendanceRecords } from '@/mocks/attendance';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const statusLabels: Record<AttendanceStatus, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  leave: 'Leave',
};

export class AttendanceNotFoundError extends Error {
  constructor() {
    super('This attendance sheet could not be found.');
    this.name = 'AttendanceNotFoundError';
  }
}

function summarize(records: AttendanceRecord[]) {
  const count = (status: AttendanceStatus) =>
    records.filter((record) => record.status === status).length;
  const present = count('present');
  const late = count('late');
  const total = records.length;
  return {
    total,
    present,
    absent: count('absent'),
    late,
    leave: count('leave'),
    attendanceRate: total
      ? Number((((present + late) / total) * 100).toFixed(1))
      : 0,
  };
}

export class MockAttendanceService implements AttendanceService {
  private readonly savedSheets = new Map<string, AttendanceSheet>();
  constructor(private readonly latency = 220) {}
  private key(classSectionId: string, date: string) {
    return `${classSectionId}:${date}`;
  }
  private async pause() {
    if (this.latency) await wait(this.latency);
  }
  private classSection(id: string) {
    const item = classMocks.find((candidate) => candidate.id === id);
    if (!item) throw new AttendanceNotFoundError();
    return item;
  }

  async getSheet(classSectionId: string, date: string) {
    await this.pause();
    const saved = this.savedSheets.get(this.key(classSectionId, date));
    if (saved) return structuredClone(saved);
    const classSection = this.classSection(classSectionId);
    return structuredClone({
      classSection,
      date,
      records: makeAttendanceRecords(classSection, date),
      savedAt: null,
    });
  }

  async saveSheet(input: SaveAttendanceInput) {
    await this.pause();
    const classSection = this.classSection(input.classSectionId);
    const roster = makeAttendanceRecords(classSection, input.date);
    const records = roster.map((record) => {
      const incoming = input.records.find(
        (item) => item.studentId === record.student.id,
      );
      return incoming
        ? { ...record, status: incoming.status, note: incoming.note }
        : record;
    });
    const sheet = {
      classSection,
      date: input.date,
      records,
      savedAt: new Date().toISOString(),
    };
    this.savedSheets.set(this.key(input.classSectionId, input.date), sheet);
    return structuredClone(sheet);
  }

  async getReport(query: AttendanceReportQuery) {
    await this.pause();
    const classSection = this.classSection(query.classSectionId);
    const records = makeAttendanceRecords(classSection, query.date);
    const summary = summarize(records);
    const students = records.map((record) => record.student);
    const base = { summary, students };

    if (query.view === 'daily')
      return {
        ...base,
        title: 'Daily attendance',
        description: `${classSection.gradeName} · Section ${classSection.section} on ${query.date}`,
        columns: ['Student', 'Roll number', 'Status', 'Note'],
        rows: records.map((record) => ({
          id: record.student.id,
          cells: [
            `${record.student.firstName} ${record.student.lastName}`,
            record.student.rollNumber,
            statusLabels[record.status],
            record.note || '—',
          ],
        })),
      };
    if (query.view === 'weekly')
      return {
        ...base,
        title: 'Weekly attendance',
        description: `Five-day pattern ending ${query.date}`,
        columns: ['Student', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Rate'],
        rows: records.map((record, index) => ({
          id: record.student.id,
          cells: [
            `${record.student.firstName} ${record.student.lastName}`,
            ...[0, 1, 2, 3, 4].map(
              (day) =>
                statusLabels[
                  (index + day) % 13 === 0
                    ? 'absent'
                    : (index + day) % 9 === 0
                      ? 'late'
                      : 'present'
                ],
            ),
            `${88 + (index % 12)}%`,
          ],
        })),
      };
    if (query.view === 'monthly')
      return {
        ...base,
        title: 'Monthly attendance',
        description: `September 2026 summary for ${classSection.gradeName} · ${classSection.section}`,
        columns: ['Student', 'Present', 'Absent', 'Late', 'Leave', 'Rate'],
        rows: records.map((record, index) => {
          const absent = index % 4;
          const late = index % 3;
          const leave = index % 2;
          const present = 22 - absent - leave;
          return {
            id: record.student.id,
            cells: [
              `${record.student.firstName} ${record.student.lastName}`,
              String(present),
              String(absent),
              String(late),
              String(leave),
              `${Math.round(((present + late) / 22) * 100)}%`,
            ],
          };
        }),
      };
    if (query.view === 'student') {
      const student =
        students.find((item) => item.id === query.studentId) ?? students[0];
      return {
        ...base,
        title: 'Student attendance',
        description: student
          ? `${student.firstName} ${student.lastName} · September 2026`
          : 'Select a student',
        columns: ['Date', 'Day', 'Status', 'Arrival', 'Note'],
        rows: student
          ? Array.from({ length: 10 }, (_, index) => {
              const status: AttendanceStatus =
                index === 4 ? 'absent' : index === 7 ? 'late' : 'present';
              return {
                id: `${student.id}-${index}`,
                cells: [
                  `2026-09-${String(index + 1).padStart(2, '0')}`,
                  ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'][
                    index % 5
                  ],
                  statusLabels[status],
                  status === 'late'
                    ? '08:14'
                    : status === 'present'
                      ? '07:52'
                      : '—',
                  status === 'absent' ? 'Guardian informed' : '—',
                ],
              };
            })
          : [],
      };
    }
    return {
      ...base,
      title: 'Class attendance',
      description: `Daily class trend ending ${query.date}`,
      columns: ['Date', 'Present', 'Absent', 'Late', 'Leave', 'Rate'],
      rows: Array.from({ length: 7 }, (_, index) => {
        const absent = index % 3;
        const late = (index + 1) % 3;
        const leave = index % 2;
        const present = records.length - absent - late - leave;
        return {
          id: `class-day-${index}`,
          cells: [
            `2026-09-${String(index + 1).padStart(2, '0')}`,
            String(present),
            String(absent),
            String(late),
            String(leave),
            `${Math.round(((present + late) / records.length) * 100)}%`,
          ],
        };
      }),
    };
  }
}
