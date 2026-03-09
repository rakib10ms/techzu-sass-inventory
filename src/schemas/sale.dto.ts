import { z } from 'zod';

const SaleItemSchema = z.object({
  product_id: z.coerce.number().int('Product ID must be an integer'),
  qty: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unit_price: z.coerce.number().positive('Unit price must be positive'),
});

export const CreateSaleSchema = z.object({
  outlet_id: z.coerce.number().int('Outlet ID must be an integer'),
  user_id: z.coerce.number().int('User ID must be an integer'),
  customer_id: z.coerce.number().int().optional(),
  product_id: z.coerce.number().int('Product ID must be an integer'),
  qty: z.coerce.number().int().min(1, 'Quantity must be at least 1'),
  unit_price: z.coerce.number().positive('Unit price must be positive'),
});

export type CreateSaleDTO = z.infer<typeof CreateSaleSchema>;
export type SaleItemDTO = z.infer<typeof SaleItemSchema>;
