import type { ClassSection } from '@/features/classes/types';

export const attendanceStatuses = [
  'present',
  'absent',
  'late',
  'leave',
] as const;
export const attendanceReportViews = [
  'daily',
  'weekly',
  'monthly',
  'student',
  'class',
] as const;

export type AttendanceStatus = (typeof attendanceStatuses)[number];
export type AttendanceReportView = (typeof attendanceReportViews)[number];

export interface AttendanceStudent {
  id: string;
  admissionId: string;
  rollNumber: string;
  firstName: string;
  lastName: string;
  photoUrl: string;
}

export interface AttendanceRecord {
  student: AttendanceStudent;
  status: AttendanceStatus;
  note: string;
}

export interface AttendanceSheet {
  classSection: ClassSection;
  date: string;
  records: AttendanceRecord[];
  savedAt: string | null;
}

export interface SaveAttendanceInput {
  classSectionId: string;
  date: string;
  records: Array<
    Pick<AttendanceRecord, 'status' | 'note'> & { studentId: string }
  >;
}

export interface AttendanceSummary {
  total: number;
  present: number;
  absent: number;
  late: number;
  leave: number;
  attendanceRate: number;
}

export interface AttendanceReportQuery {
  view: AttendanceReportView;
  classSectionId: string;
  date: string;
  studentId?: string;
}

export interface AttendanceReport {
  title: string;
  description: string;
  summary: AttendanceSummary;
  columns: string[];
  rows: Array<{ id: string; cells: string[] }>;
  students: AttendanceStudent[];
}
