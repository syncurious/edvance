import { describe, expect, it } from 'vitest';

import {
  MarksValidationError,
  MockExamService,
} from '@/features/exams/services';
import { classMocks } from '@/mocks/classes';

describe('MockExamService', () => {
  it('lists campus exams and builds a realistic class result roster', async () => {
    const service = new MockExamService(0);
    const exams = await service.list({ campusId: 'north' });
    expect(exams.every((exam) => exam.campusId === 'north')).toBe(true);
    const exam = await service.get('midterm-grade-5-a');
    const results = await service.getResults(exam.id);
    const classSection = classMocks.find(
      (item) => item.id === exam.classSectionId,
    );
    if (!classSection) throw new Error('Expected exam class');
    expect(results).toHaveLength(classSection.studentCount);
    expect(results[0].marks).toHaveLength(exam.subjects.length);
  });

  it('creates an exam with explicit subject rules', async () => {
    const service = new MockExamService(0);
    const exam = await service.create({
      name: 'Spring Assessment',
      term: 'Midterm',
      academicYear: '2026-2027',
      campusId: 'north',
      classSectionId: 'grade-6-a-north',
      startDate: '2026-11-02',
      endDate: '2026-11-05',
      status: 'draft',
      subjects: [
        {
          name: 'Mathematics',
          maxMarks: 100,
          passMarks: 40,
          date: '2026-11-02',
        },
      ],
    });
    expect(exam.className).toBe('Grade 6');
    expect(exam.subjects[0].id).toContain(exam.id);
  });

  it('recalculates grades and rejects marks above the subject maximum', async () => {
    const service = new MockExamService(0);
    const exam = await service.get('midterm-grade-5-a');
    const [result] = await service.getResults(exam.id);
    await expect(
      service.saveMarks(exam.id, [
        {
          studentId: result.student.id,
          marks: exam.subjects.map((subject, index) => ({
            subjectId: subject.id,
            marks: index === 0 ? subject.maxMarks + 1 : 80,
          })),
        },
      ]),
    ).rejects.toBeInstanceOf(MarksValidationError);
    const saved = await service.saveMarks(exam.id, [
      {
        studentId: result.student.id,
        marks: exam.subjects.map((subject) => ({
          subjectId: subject.id,
          marks: Math.round(subject.maxMarks * 0.9),
        })),
      },
    ]);
    expect(saved[0].status).toBe('pass');
    expect(saved[0].percentage).toBeCloseTo(90, 0);
    expect(saved[0].grade).toBe('A+');
  });
});
