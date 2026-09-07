import { MockAttendanceService } from '@/features/attendance/services/mock-attendance-service';

export type { AttendanceService } from '@/features/attendance/services/attendance-service';
export {
  AttendanceNotFoundError,
  MockAttendanceService,
} from '@/features/attendance/services/mock-attendance-service';

// A NestJS-backed service can replace this singleton while browser requests remain relative `/api/attendance` calls.
export const attendanceService = new MockAttendanceService();
