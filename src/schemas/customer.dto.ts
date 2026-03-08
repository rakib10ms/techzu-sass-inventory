import { z } from 'zod';

export const CreateCustomerSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  phone: z.string().min(11, 'Phone number must be at least 11 digits'),
  outlet_id: z.number().int(),
});

export const UpdateCustomerSchema = CreateCustomerSchema.partial();
