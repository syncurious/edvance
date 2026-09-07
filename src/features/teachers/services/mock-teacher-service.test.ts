import { describe, expect, it } from 'vitest';
import { MockTeacherService } from '@/features/teachers/services';
import type {
  TeacherFormValues,
  TeacherListQuery,
} from '@/features/teachers/types';
import { teacherMocks } from '@/mocks/teachers';

const query: TeacherListQuery = {
  search: '',
  campusId: 'all',
  subject: 'all',
  status: 'all',
  page: 1,
  pageSize: 8,
};
const values: TeacherFormValues = {
  employeeId: 'CRA-T-099',
  firstName: 'Anam',
  lastName: 'Khalid',
  photoUrl: '',
  email: 'anam@crescent.edu.pk',
  phone: '+92 300 555 1099',
  campusId: 'north',
  qualification: 'M.Ed',
  specialization: 'Mathematics',
  joiningDate: '2026-09-07',
  employmentType: 'full-time',
  status: 'active',
  assignments: [{ classSectionId: 'grade-5-a-north', subject: 'Mathematics' }],
};

describe('MockTeacherService', () => {
  it('combines campus, subject, and status filters', async () => {
    const result = await new MockTeacherService(teacherMocks, 0).list({
      ...query,
      campusId: 'north',
      subject: 'Islamiyat',
      status: 'on-leave',
    });
    expect(result.teachers.map((item) => item.firstName)).toEqual(['Usman']);
  });

  it('creates and updates assignments through the shared contract', async () => {
    const service = new MockTeacherService([], 0);
    const created = await service.create(values);
    const updated = await service.update(created.id, {
      ...values,
      assignments: [{ classSectionId: 'grade-6-a-north', subject: 'Science' }],
    });
    expect(updated.assignments[0]).toMatchObject({
      gradeName: 'Grade 6',
      section: 'A',
      subject: 'Science',
    });
    expect((await service.list(query)).total).toBe(1);
  });

  it('rejects duplicate employee IDs', async () => {
    const service = new MockTeacherService([], 0);
    await service.create(values);
    await expect(service.create(values)).rejects.toThrow(
      'That employee ID is already in use.',
    );
  });
});
