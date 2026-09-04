import { describe, expect, it } from 'vitest';

import {
  MockSchoolService,
  SchoolConflictError,
  SchoolNotFoundError,
} from '@/features/schools/services/mock-school-service';
import type {
  SchoolFormValues,
  SchoolListQuery,
} from '@/features/schools/types';
import { schoolMocks } from '@/mocks/schools';

const defaultQuery: SchoolListQuery = {
  search: '',
  status: 'all',
  plan: 'all',
  sortBy: 'createdAt',
  sortDirection: 'desc',
  page: 1,
  pageSize: 8,
};

const newSchool: SchoolFormValues = {
  name: 'Atlas Community School',
  code: 'ACS-201',
  email: 'admin@atlas.edu.pk',
  phone: '+92 51 555 0101',
  address: '10 Constitution Avenue, Islamabad',
  logoUrl: '',
  plan: 'Professional',
  status: 'trial',
};

describe('MockSchoolService', () => {
  it('filters, sorts, and paginates predictably', async () => {
    const service = new MockSchoolService(schoolMocks, 0);
    const result = await service.list({
      ...defaultQuery,
      search: 'school',
      status: 'active',
      sortBy: 'students',
      sortDirection: 'desc',
      pageSize: 2,
    });

    expect(result.schools).toHaveLength(2);
    expect(result.schools[0].students).toBeGreaterThanOrEqual(
      result.schools[1].students,
    );
    expect(result.schools.every((school) => school.status === 'active')).toBe(
      true,
    );
    expect(result.totalPages).toBeGreaterThanOrEqual(1);
  });

  it('supports a complete create, read, update, and delete cycle', async () => {
    const service = new MockSchoolService([], 0);
    const created = await service.create(newSchool);
    expect((await service.get(created.id)).name).toBe(newSchool.name);

    const updated = await service.update(created.id, {
      ...newSchool,
      name: 'Atlas International School',
      status: 'active',
    });
    expect(updated).toMatchObject({
      name: 'Atlas International School',
      status: 'active',
    });

    await service.delete(created.id);
    await expect(service.get(created.id)).rejects.toBeInstanceOf(
      SchoolNotFoundError,
    );
  });

  it('protects unique school codes and emails', async () => {
    const service = new MockSchoolService([], 0);
    await service.create(newSchool);
    await expect(
      service.create({
        ...newSchool,
        email: 'different@atlas.edu.pk',
      }),
    ).rejects.toBeInstanceOf(SchoolConflictError);
  });

  it('returns clones rather than exposing its internal records', async () => {
    const service = new MockSchoolService(schoolMocks, 0);
    const school = await service.get('crescent-academy');
    school.name = 'Changed outside the service';
    expect((await service.get('crescent-academy')).name).toBe(
      'Crescent Academy',
    );
  });
});
