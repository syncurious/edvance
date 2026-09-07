import type {
  AttendanceReport,
  AttendanceReportQuery,
  AttendanceSheet,
  SaveAttendanceInput,
} from '@/features/attendance/types';

export interface AttendanceService {
  getSheet(classSectionId: string, date: string): Promise<AttendanceSheet>;
  saveSheet(input: SaveAttendanceInput): Promise<AttendanceSheet>;
  getReport(query: AttendanceReportQuery): Promise<AttendanceReport>;
}
