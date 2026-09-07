import { z } from 'zod';
import {
  employmentTypes,
  teacherStatuses,
  teacherSubjects,
} from '@/features/teachers/types';

export const teacherSchema = z.object({
  employeeId: z
    .string()
    .trim()
    .min(3, 'Enter an employee ID.')
    .regex(/^[A-Z0-9-]+$/, 'Use uppercase letters, numbers, and hyphens.'),
  firstName: z.string().trim().min(2, 'Enter the first name.'),
  lastName: z.string().trim().min(2, 'Enter the last name.'),
  photoUrl: z.union([z.literal(''), z.url('Enter a valid photo URL.')]),
  email: z.email('Enter a valid work email.'),
  phone: z.string().trim().min(10, 'Enter a valid phone number.'),
  campusId: z.enum(['north', 'central', 'south']),
  qualification: z.string().trim().min(3, 'Enter the qualification.'),
  specialization: z.string().trim().min(2, 'Enter the specialization.'),
  joiningDate: z.string().min(1, 'Enter a joining date.'),
  employmentType: z.enum(employmentTypes),
  status: z.enum(teacherStatuses),
  assignments: z
    .array(
      z.object({
        classSectionId: z.string().min(1, 'Choose a class section.'),
        subject: z.enum(teacherSubjects),
      }),
    )
    .min(1, 'Add at least one assignment.'),
});
