import { z } from 'zod';

import { schoolPlans, schoolStatuses } from '@/features/schools/types';

export const schoolSchema = z.object({
  name: z.string().trim().min(2, 'Enter the school name.').max(80),
  code: z
    .string()
    .trim()
    .min(2, 'Enter a school code.')
    .max(16)
    .regex(/^[A-Z0-9-]+$/, 'Use uppercase letters, numbers, and hyphens only.'),
  email: z
    .string()
    .trim()
    .min(1, 'Enter the school email.')
    .email('Enter a valid email address.'),
  phone: z
    .string()
    .trim()
    .min(7, 'Enter a valid phone number.')
    .max(24)
    .regex(/^[+()\d\s-]+$/, 'Enter a valid phone number.'),
  address: z.string().trim().min(8, 'Enter the school address.').max(180),
  logoUrl: z
    .string()
    .trim()
    .refine(
      (value) => value === '' || URL.canParse(value),
      'Enter a valid logo URL or leave it blank.',
    ),
  plan: z.enum(schoolPlans),
  status: z.enum(schoolStatuses),
});
