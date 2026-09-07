import { z } from 'zod';

export const examSchema = z
  .object({
    name: z.string().trim().min(3, 'Enter an exam name.'),
    term: z.enum(['Midterm', 'Final', 'Monthly assessment']),
    academicYear: z.string().regex(/^\d{4}-\d{4}$/, 'Use YYYY-YYYY format.'),
    campusId: z.enum(['north', 'central', 'south']),
    classSectionId: z.string().min(1, 'Select a class section.'),
    startDate: z.string().min(1, 'Start date is required.'),
    endDate: z.string().min(1, 'End date is required.'),
    status: z.enum([
      'draft',
      'scheduled',
      'in_progress',
      'completed',
      'published',
    ]),
    subjects: z
      .array(
        z.object({
          name: z.string().trim().min(2, 'Enter a subject name.'),
          maxMarks: z.number().positive('Maximum marks must be positive.'),
          passMarks: z.number().positive('Pass marks must be positive.'),
          date: z.string().min(1, 'Exam date is required.'),
        }),
      )
      .min(1, 'Add at least one subject.'),
  })
  .superRefine((values, context) => {
    if (values.endDate < values.startDate)
      context.addIssue({
        code: 'custom',
        path: ['endDate'],
        message: 'End date cannot be before start date.',
      });
    values.subjects.forEach((subject, index) => {
      if (subject.passMarks > subject.maxMarks)
        context.addIssue({
          code: 'custom',
          path: ['subjects', index, 'passMarks'],
          message: 'Pass marks cannot exceed maximum marks.',
        });
    });
  });
