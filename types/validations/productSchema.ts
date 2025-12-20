import { z } from 'zod';

export const productSchema = z.object({
  name: z
    .string()
    .min(2, 'Product name must be at least 2 characters')
    .max(200, 'Product name must not exceed 200 characters')
    .trim(),
  categoryId: z
    .string()
    .min(1, 'Category is required'),
  bankProductNumber: z
    .string()
    .min(1, 'Bank product number is required')
    .max(50, 'Bank product number must not exceed 50 characters')
    .trim(),
  productType: z
    .enum(['bank_order', 'bip'], {
      errorMap: () => ({ message: 'Product type is required' }),
    }),
});

export type ProductFormData = z.infer<typeof productSchema>;
