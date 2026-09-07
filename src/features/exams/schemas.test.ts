import { describe, expect, it } from 'vitest';

import { examSchema } from '@/features/exams/schemas';

const valid = {
  name: 'Autumn Midterm',
  term: 'Midterm' as const,
  academicYear: '2026-2027',
  campusId: 'north' as const,
  classSectionId: 'grade-5-a-north',
  startDate: '2026-10-05',
  endDate: '2026-10-12',
  status: 'draft' as const,
  subjects: [
    {
      name: 'English',
      maxMarks: 100,
      passMarks: 40,
      date: '2026-10-05',
    },
  ],
};

describe('examSchema', () => {
  it('accepts a valid exam and rejects reversed dates', () => {
    expect(examSchema.safeParse(valid).success).toBe(true);
    const result = examSchema.safeParse({
      ...valid,
      endDate: '2026-10-01',
    });
    expect(result.success).toBe(false);
  });

  it('prevents pass marks exceeding maximum marks', () => {
    const result = examSchema.safeParse({
      ...valid,
      subjects: [{ ...valid.subjects[0], passMarks: 101 }],
    });
    expect(result.success).toBe(false);
  });
});
