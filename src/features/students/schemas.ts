import { z } from 'zod';

import {
  studentClasses,
  studentGenders,
  studentSections,
  studentStatuses,
} from '@/features/students/types';

const phoneSchema = z
  .string()
  .trim()
  .min(7, 'Enter a valid phone number.')
  .max(24)
  .regex(/^[+()\d\s-]+$/, 'Enter a valid phone number.');

export const studentSchema = z.object({
  admissionId: z
    .string()
    .trim()
    .min(4, 'Enter an admission ID.')
    .max(24)
    .regex(/^[A-Z0-9-]+$/, 'Use uppercase letters, numbers, and hyphens only.'),
  firstName: z.string().trim().min(2, 'Enter the first name.').max(50),
  lastName: z.string().trim().min(2, 'Enter the last name.').max(50),
  photoUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || URL.canParse(value),
      'Enter a valid photo URL or leave it blank.',
    ),
  dateOfBirth: z.string().date('Enter a valid date of birth.'),
  gender: z.enum(studentGenders),
  campusId: z.enum(['north', 'central', 'south']),
  className: z.enum(studentClasses),
  section: z.enum(studentSections),
  rollNumber: z.string().trim().min(2, 'Enter a roll number.').max(20),
  status: z.enum(studentStatuses),
  admissionDate: z.string().date('Enter a valid admission date.'),
  address: z.string().trim().min(8, 'Enter the home address.').max(180),
  bloodGroup: z.string().trim().min(1, 'Select a blood group.'),
  house: z.string().trim().min(2, 'Enter the student house.').max(30),
  previousSchool: z.string().trim().max(100),
  parentName: z.string().trim().min(2, 'Enter the parent or guardian name.'),
  parentRelationship: z.string().trim().min(2, 'Enter the relationship.'),
  parentEmail: z.string().trim().email('Enter a valid guardian email.'),
  parentPhone: phoneSchema,
  parentOccupation: z.string().trim().min(2, 'Enter the occupation.'),
});
