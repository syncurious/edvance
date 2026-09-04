import type { SchoolService } from '@/features/schools/services/school-service';
import type {
  School,
  SchoolFormValues,
  SchoolListQuery,
  SchoolListResult,
} from '@/features/schools/types';
import { schoolMocks } from '@/mocks/schools';

const wait = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export class SchoolNotFoundError extends Error {
  constructor() {
    super('This school could not be found. It may have been removed.');
    this.name = 'SchoolNotFoundError';
  }
}

export class SchoolConflictError extends Error {
  constructor(public readonly field: 'code' | 'email') {
    super(
      field === 'code'
        ? 'That school code is already in use.'
        : 'That school email is already in use.',
    );
    this.name = 'SchoolConflictError';
  }
}

export class MockSchoolService implements SchoolService {
  private schools: School[];

  constructor(
    schools: School[] = schoolMocks,
    private readonly latency = 250,
  ) {
    this.schools = structuredClone(schools);
  }

  private async pause() {
    if (this.latency > 0) await wait(this.latency);
  }

  async list(query: SchoolListQuery): Promise<SchoolListResult> {
    await this.pause();
    const search = query.search.trim().toLocaleLowerCase();
    const filtered = this.schools
      .filter((school) =>
        search
          ? [school.name, school.code, school.email].some((value) =>
              value.toLocaleLowerCase().includes(search),
            )
          : true,
      )
      .filter((school) =>
        query.status === 'all' ? true : school.status === query.status,
      )
      .filter((school) =>
        query.plan === 'all' ? true : school.plan === query.plan,
      )
      .sort((left, right) => {
        const first = left[query.sortBy];
        const second = right[query.sortBy];
        const result =
          typeof first === 'number'
            ? first - (second as number)
            : first.localeCompare(second as string);
        return query.sortDirection === 'asc' ? result : -result;
      });

    const totalPages = Math.max(1, Math.ceil(filtered.length / query.pageSize));
    const page = Math.min(Math.max(1, query.page), totalPages);
    const start = (page - 1) * query.pageSize;

    return structuredClone({
      schools: filtered.slice(start, start + query.pageSize),
      total: filtered.length,
      page,
      pageSize: query.pageSize,
      totalPages,
    });
  }

  async get(id: string): Promise<School> {
    await this.pause();
    const school = this.schools.find((candidate) => candidate.id === id);
    if (!school) throw new SchoolNotFoundError();
    return structuredClone(school);
  }

  async create(values: SchoolFormValues): Promise<School> {
    await this.pause();
    this.assertUnique(values);
    const baseId = values.code.toLocaleLowerCase();
    const school: School = {
      ...values,
      id: `${baseId}-${Date.now().toString(36)}`,
      campuses: 1,
      students: 0,
      createdAt: new Date().toISOString(),
    };
    this.schools.unshift(school);
    return structuredClone(school);
  }

  async update(id: string, values: SchoolFormValues): Promise<School> {
    await this.pause();
    const index = this.schools.findIndex((school) => school.id === id);
    if (index === -1) throw new SchoolNotFoundError();
    this.assertUnique(values, id);
    this.schools[index] = { ...this.schools[index], ...values };
    return structuredClone(this.schools[index]);
  }

  async delete(id: string): Promise<void> {
    await this.pause();
    const index = this.schools.findIndex((school) => school.id === id);
    if (index === -1) throw new SchoolNotFoundError();
    this.schools.splice(index, 1);
  }

  private assertUnique(values: SchoolFormValues, currentId?: string) {
    const codeTaken = this.schools.some(
      (school) =>
        school.id !== currentId &&
        school.code.toLocaleLowerCase() === values.code.toLocaleLowerCase(),
    );
    if (codeTaken) throw new SchoolConflictError('code');

    const emailTaken = this.schools.some(
      (school) =>
        school.id !== currentId &&
        school.email.toLocaleLowerCase() === values.email.toLocaleLowerCase(),
    );
    if (emailTaken) throw new SchoolConflictError('email');
  }
}
