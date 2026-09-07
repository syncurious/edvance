import type { TeacherService } from '@/features/teachers/services/teacher-service';
import type {
  Teacher,
  TeacherFormValues,
  TeacherListQuery,
} from '@/features/teachers/types';
import { classMocks } from '@/mocks/classes';
import { teacherMocks } from '@/mocks/teachers';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
const campusNames = {
  north: 'North Campus',
  central: 'Central Campus',
  south: 'South Campus',
} as const;

export class TeacherNotFoundError extends Error {
  constructor() {
    super('This teacher could not be found.');
    this.name = 'TeacherNotFoundError';
  }
}
export class TeacherConflictError extends Error {
  constructor() {
    super('That employee ID is already in use.');
    this.name = 'TeacherConflictError';
  }
}

export class MockTeacherService implements TeacherService {
  private teachers: Teacher[];
  constructor(
    teachers: Teacher[] = teacherMocks,
    private readonly latency = 240,
  ) {
    this.teachers = structuredClone(teachers);
  }

  private async pause() {
    if (this.latency) await wait(this.latency);
  }

  async list(query: TeacherListQuery) {
    await this.pause();
    const search = query.search.trim().toLocaleLowerCase();
    const filtered = this.teachers
      .filter(
        (item) => query.campusId === 'all' || item.campusId === query.campusId,
      )
      .filter(
        (item) =>
          !search ||
          [
            item.firstName,
            item.lastName,
            `${item.firstName} ${item.lastName}`,
            item.employeeId,
            item.email,
            item.phone,
          ].some((value) => value.toLocaleLowerCase().includes(search)),
      )
      .filter(
        (item) =>
          query.subject === 'all' ||
          item.assignments.some(
            (assignment) => assignment.subject === query.subject,
          ),
      )
      .filter((item) => query.status === 'all' || item.status === query.status)
      .sort((a, b) =>
        `${a.firstName} ${a.lastName}`.localeCompare(
          `${b.firstName} ${b.lastName}`,
        ),
      );
    const totalPages = Math.max(1, Math.ceil(filtered.length / query.pageSize));
    const page = Math.min(Math.max(query.page, 1), totalPages);
    return structuredClone({
      teachers: filtered.slice(
        (page - 1) * query.pageSize,
        page * query.pageSize,
      ),
      total: filtered.length,
      page,
      pageSize: query.pageSize,
      totalPages,
    });
  }

  async get(id: string) {
    await this.pause();
    const item = this.teachers.find((candidate) => candidate.id === id);
    if (!item) throw new TeacherNotFoundError();
    return structuredClone(item);
  }

  async create(values: TeacherFormValues) {
    await this.pause();
    this.assertUnique(values.employeeId);
    const item = this.toTeacher(`teacher-${Date.now().toString(36)}`, values);
    this.teachers.unshift(item);
    return structuredClone(item);
  }

  async update(id: string, values: TeacherFormValues) {
    await this.pause();
    const index = this.teachers.findIndex((item) => item.id === id);
    if (index < 0) throw new TeacherNotFoundError();
    this.assertUnique(values.employeeId, id);
    this.teachers[index] = this.toTeacher(id, values);
    return structuredClone(this.teachers[index]);
  }

  private assertUnique(employeeId: string, currentId?: string) {
    if (
      this.teachers.some(
        (item) =>
          item.id !== currentId &&
          item.employeeId.toLocaleLowerCase() ===
            employeeId.toLocaleLowerCase(),
      )
    )
      throw new TeacherConflictError();
  }

  private toTeacher(id: string, values: TeacherFormValues): Teacher {
    return {
      ...values,
      id,
      campusName: campusNames[values.campusId],
      assignments: values.assignments.map((assignment) => {
        const classSection = classMocks.find(
          (item) => item.id === assignment.classSectionId,
        );
        return {
          ...assignment,
          gradeName: classSection?.gradeName ?? 'Unassigned',
          section: classSection?.section ?? '—',
        };
      }),
    };
  }
}
