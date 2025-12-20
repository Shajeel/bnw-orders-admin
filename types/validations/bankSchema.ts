import { z } from 'zod';

export const bankSchema = z.object({
  bankName: z
    .string({ required_error: 'Bank name is required' })
    .trim()
    .min(2, 'Bank name must be at least 2 characters')
    .max(100, 'Bank name must not exceed 100 characters'),
  description: z
    .string()
    .trim()
    .max(500, 'Description must not exceed 500 characters')
    .optional()
    .or(z.literal('')),
});

export type BankFormData = z.infer<typeof bankSchema>;
