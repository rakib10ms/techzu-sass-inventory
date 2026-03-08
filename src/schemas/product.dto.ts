import { z } from 'zod';

export const CreateProductSchema = z.object({
  company_id: z.coerce.number().int('Company ID must be an integer'),
  name: z.string().min(2, 'Product name must be at least 2 characters'),
  details: z.string(),
  base_price: z.coerce
    .number()
    .positive('Base price must be a positive number'),
});

export const UpdateProductSchema = CreateProductSchema.partial();

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
export type UpdateProductDTO = z.infer<typeof UpdateProductSchema>;
