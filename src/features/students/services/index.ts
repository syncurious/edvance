import { MockStudentService } from '@/features/students/services/mock-student-service';
import type { StudentService } from '@/features/students/services/student-service';

// Swap this singleton for a NestJS implementation that calls relative Next.js /api routes.
export const studentService: StudentService = new MockStudentService();

export {
  MockStudentService,
  StudentConflictError,
  StudentNotFoundError,
} from '@/features/students/services/mock-student-service';
export type { StudentService } from '@/features/students/services/student-service';
