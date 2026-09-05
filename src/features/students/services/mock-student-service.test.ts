import { describe, expect, it } from 'vitest';

import { MockStudentService } from '@/features/students/services';
import type {
  StudentFormValues,
  StudentListQuery,
} from '@/features/students/types';
import { studentMocks } from '@/mocks/students';

const defaultQuery: StudentListQuery = {
  search: '',
  campusId: 'all',
  className: 'all',
  section: 'all',
  status: 'all',
  sortBy: 'name',
  sortDirection: 'asc',
  page: 1,
  pageSize: 8,
};

const newStudent: StudentFormValues = {
  admissionId: 'CRA-2026-0200',
  firstName: 'Anaya',
  lastName: 'Saeed',
  photoUrl: '',
  dateOfBirth: '2014-03-12',
  gender: 'female',
  campusId: 'north',
  className: 'Grade 6',
  section: 'B',
  rollNumber: '06-B-200',
  status: 'active',
  admissionDate: '2026-09-05',
  address: '42 Margalla Road, Islamabad',
  bloodGroup: 'B+',
  house: 'Fatima',
  previousSchool: '',
  parentName: 'Saeed Ahmed',
  parentRelationship: 'Father',
  parentEmail: 'saeed@example.com',
  parentPhone: '+92 300 555 0200',
  parentOccupation: 'Architect',
};

describe('MockStudentService', () => {
  it('filters and paginates campus-specific student records', async () => {
    const service = new MockStudentService(studentMocks, 0);
    const result = await service.list({
      ...defaultQuery,
      campusId: 'north',
      className: 'Grade 8',
    });

    expect(result.students.map((student) => student.firstName)).toEqual([
      'Ayesha',
    ]);
    expect(result.total).toBe(1);
  });

  it('creates and updates a complete student through the shared contract', async () => {
    const service = new MockStudentService([], 0);
    const created = await service.create(newStudent);
    const updated = await service.update(created.id, {
      ...newStudent,
      section: 'C',
    });

    expect(updated.section).toBe('C');
    expect(updated.parent.name).toBe('Saeed Ahmed');
    expect((await service.list(defaultQuery)).total).toBe(1);
  });

  it('prevents duplicate admission IDs', async () => {
    const service = new MockStudentService([], 0);
    await service.create(newStudent);
    await expect(service.create(newStudent)).rejects.toThrow(
      'That admission ID is already in use.',
    );
  });
});
