import type { CampusId } from '@/features/dashboard/types';
import type { StudentClass } from '@/features/students/types';

export const reportTypes = [
  'academic',
  'attendance',
  'fees',
  'enrollment',
] as const;
export type ReportType = (typeof reportTypes)[number];

export interface SchoolReportQuery {
  type: ReportType;
  campusId: CampusId;
  className: StudentClass | 'all';
  startDate: string;
  endDate: string;
}

export interface SchoolReportMetric {
  label: string;
  value: string;
  tone: 'neutral' | 'info' | 'success' | 'warning' | 'error';
}

export interface SchoolReportRow {
  id: string;
  cells: string[];
}

export interface SchoolReport {
  title: string;
  description: string;
  generatedFor: string;
  metrics: SchoolReportMetric[];
  columns: string[];
  rows: SchoolReportRow[];
}
