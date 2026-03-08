import { z } from 'zod';

export const CreateUserSchema = z.object({
  name: z.string().min(3, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  company_id: z.number().int(),
});

export const UpdateUserSchema = CreateUserSchema.partial();
