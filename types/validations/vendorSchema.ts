import { z } from 'zod';

export const vendorSchema = z.object({
  vendorName: z
    .string()
    .min(2, 'Vendor name must be at least 2 characters')
    .max(200, 'Vendor name must not exceed 200 characters')
    .trim(),
  phone: z
    .string()
    .min(10, 'Phone number must be at least 10 characters')
    .max(20, 'Phone number must not exceed 20 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .max(100, 'Email must not exceed 100 characters')
    .trim(),
  address: z
    .string()
    .min(5, 'Address must be at least 5 characters')
    .max(500, 'Address must not exceed 500 characters')
    .trim(),
  city: z
    .string()
    .min(2, 'City must be at least 2 characters')
    .max(100, 'City must not exceed 100 characters')
    .trim(),
  status: z.enum(['active', 'inactive']).default('active'),
});

export type VendorFormData = z.infer<typeof vendorSchema>;
