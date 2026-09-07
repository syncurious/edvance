import { MockTeacherService } from '@/features/teachers/services/mock-teacher-service';

export type { TeacherService } from '@/features/teachers/services/teacher-service';
export {
  MockTeacherService,
  TeacherConflictError,
  TeacherNotFoundError,
} from '@/features/teachers/services/mock-teacher-service';

// A NestJS-backed implementation can replace this singleton while browser calls remain relative Next.js `/api` requests.
export const teacherService = new MockTeacherService();
