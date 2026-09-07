import type { Exam } from '@/features/exams/types';

const subjects = [
  ['english', 'English', 100, 40, '2026-09-14'],
  ['mathematics', 'Mathematics', 100, 40, '2026-09-16'],
  ['science', 'Science', 100, 40, '2026-09-18'],
  ['pakistan-studies', 'Pakistan Studies', 75, 30, '2026-09-20'],
] as const;

const makeSubjects = (prefix: string, dateOffset = 0) =>
  subjects.map(([id, name, maxMarks, passMarks, date], index) => ({
    id: `${prefix}-${id}`,
    name,
    maxMarks,
    passMarks,
    date:
      dateOffset === 0
        ? date
        : `2026-10-${String(6 + dateOffset + index * 2).padStart(2, '0')}`,
  }));

export const examMocks: Exam[] = [
  {
    id: 'midterm-grade-5-a',
    name: 'Autumn Midterm Examination',
    term: 'Midterm',
    academicYear: '2026-2027',
    campusId: 'north',
    campusName: 'North Campus',
    className: 'Grade 5',
    section: 'A',
    classSectionId: 'grade-5-a-north',
    startDate: '2026-09-14',
    endDate: '2026-09-20',
    status: 'in_progress',
    subjects: makeSubjects('midterm-5a'),
  },
  {
    id: 'final-grade-6-a',
    name: 'First Term Final Examination',
    term: 'Final',
    academicYear: '2026-2027',
    campusId: 'central',
    campusName: 'Central Campus',
    className: 'Grade 7',
    section: 'A',
    classSectionId: 'grade-7-a-central',
    startDate: '2026-10-08',
    endDate: '2026-10-14',
    status: 'scheduled',
    subjects: makeSubjects('final-6a', 2),
  },
  {
    id: 'monthly-grade-7-b',
    name: 'September Monthly Assessment',
    term: 'Monthly assessment',
    academicYear: '2026-2027',
    campusId: 'south',
    campusName: 'South Campus',
    className: 'Grade 6',
    section: 'B',
    classSectionId: 'grade-6-b-south',
    startDate: '2026-09-02',
    endDate: '2026-09-05',
    status: 'published',
    subjects: makeSubjects('monthly-7b'),
  },
  {
    id: 'draft-grade-8-a',
    name: 'Winter Practice Examination',
    term: 'Midterm',
    academicYear: '2026-2027',
    campusId: 'north',
    campusName: 'North Campus',
    className: 'Grade 10',
    section: 'A',
    classSectionId: 'grade-10-a-north',
    startDate: '2026-12-01',
    endDate: '2026-12-05',
    status: 'draft',
    subjects: makeSubjects('winter-8a'),
  },
];
