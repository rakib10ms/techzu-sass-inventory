import { z } from 'zod';

export const CreateOutletProductSchema = z.object({
  product_id: z.coerce.number().int('Product ID must be an integer'),
  outlet_id: z.coerce.number().int('Outlet ID must be an integer'),
  price: z.coerce.number().positive('Price must be a positive number'),
  stock_quantity: z.coerce
    .number()
    .int()
    .min(0, 'Stock quantity cannot be negative'),
  min_stock_level: z.coerce
    .number()
    .int()
    .min(0, 'Min stock level cannot be negative'),
  created_by: z.coerce.number().int('Created by must be a user ID'),
});

export const UpdateOutletProductSchema = CreateOutletProductSchema.partial();

export type CreateOutletProductDTO = z.infer<typeof CreateOutletProductSchema>;
export type UpdateOutletProductDTO = z.infer<typeof UpdateOutletProductSchema>;
