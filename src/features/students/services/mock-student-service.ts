import type { StudentService } from '@/features/students/services/student-service';
import type {
  Student,
  StudentFormValues,
  StudentListQuery,
  StudentListResult,
} from '@/features/students/types';
import { studentMocks } from '@/mocks/students';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const campusNames = {
  north: 'North Campus',
  central: 'Central Campus',
  south: 'South Campus',
} as const;

export class StudentNotFoundError extends Error {
  constructor() {
    super('This student could not be found.');
    this.name = 'StudentNotFoundError';
  }
}

export class StudentConflictError extends Error {
  constructor() {
    super('That admission ID is already in use.');
    this.name = 'StudentConflictError';
  }
}

export class MockStudentService implements StudentService {
  private students: Student[];

  constructor(
    students: Student[] = studentMocks,
    private readonly latency = 250,
  ) {
    this.students = structuredClone(students);
  }

  private async pause() {
    if (this.latency > 0) await wait(this.latency);
  }

  async list(query: StudentListQuery): Promise<StudentListResult> {
    await this.pause();
    const search = query.search.trim().toLocaleLowerCase();
    const filtered = this.students
      .filter((student) =>
        query.campusId === 'all' ? true : student.campusId === query.campusId,
      )
      .filter((student) =>
        search
          ? [
              student.firstName,
              student.lastName,
              `${student.firstName} ${student.lastName}`,
              student.admissionId,
              student.parent.name,
              student.parent.phone,
            ].some((value) => value.toLocaleLowerCase().includes(search))
          : true,
      )
      .filter((student) =>
        query.className === 'all'
          ? true
          : student.className === query.className,
      )
      .filter((student) =>
        query.section === 'all' ? true : student.section === query.section,
      )
      .filter((student) =>
        query.status === 'all' ? true : student.status === query.status,
      )
      .sort((left, right) => {
        const first =
          query.sortBy === 'name'
            ? `${left.firstName} ${left.lastName}`
            : left[query.sortBy];
        const second =
          query.sortBy === 'name'
            ? `${right.firstName} ${right.lastName}`
            : right[query.sortBy];
        const result = first.localeCompare(second);
        return query.sortDirection === 'asc' ? result : -result;
      });

    const totalPages = Math.max(1, Math.ceil(filtered.length / query.pageSize));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const start = (page - 1) * query.pageSize;

    return structuredClone({
      students: filtered.slice(start, start + query.pageSize),
      total: filtered.length,
      page,
      pageSize: query.pageSize,
      totalPages,
    });
  }

  async get(id: string): Promise<Student> {
    await this.pause();
    const student = this.students.find((candidate) => candidate.id === id);
    if (!student) throw new StudentNotFoundError();
    return structuredClone(student);
  }

  async create(values: StudentFormValues): Promise<Student> {
    await this.pause();
    this.assertUnique(values.admissionId);
    const student: Student = {
      ...this.toStudentFields(values),
      id: `${values.admissionId.toLocaleLowerCase()}-${Date.now().toString(36)}`,
      attendance: { percentage: 0, present: 0, absent: 0, late: 0, leave: 0 },
      fees: { total: 0, paid: 0, pending: 0, status: 'paid' },
      examResults: [],
      documents: [],
    };
    this.students.unshift(student);
    return structuredClone(student);
  }

  async update(id: string, values: StudentFormValues): Promise<Student> {
    await this.pause();
    const index = this.students.findIndex((student) => student.id === id);
    if (index === -1) throw new StudentNotFoundError();
    this.assertUnique(values.admissionId, id);
    this.students[index] = {
      ...this.students[index],
      ...this.toStudentFields(values),
    };
    return structuredClone(this.students[index]);
  }

  private assertUnique(admissionId: string, currentId?: string) {
    const exists = this.students.some(
      (student) =>
        student.id !== currentId &&
        student.admissionId.toLocaleLowerCase() ===
          admissionId.toLocaleLowerCase(),
    );
    if (exists) throw new StudentConflictError();
  }

  private toStudentFields(values: StudentFormValues) {
    return {
      admissionId: values.admissionId,
      firstName: values.firstName,
      lastName: values.lastName,
      photoUrl: values.photoUrl,
      dateOfBirth: values.dateOfBirth,
      gender: values.gender,
      campusId: values.campusId,
      campusName: campusNames[values.campusId],
      className: values.className,
      section: values.section,
      rollNumber: values.rollNumber,
      status: values.status,
      admissionDate: values.admissionDate,
      address: values.address,
      bloodGroup: values.bloodGroup,
      house: values.house,
      previousSchool: values.previousSchool,
      parent: {
        name: values.parentName,
        relationship: values.parentRelationship,
        email: values.parentEmail,
        phone: values.parentPhone,
        occupation: values.parentOccupation,
      },
    };
  }
}
