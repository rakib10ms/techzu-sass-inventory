import { z } from 'zod';

export const CreateCompanySchema = z.object({
  name: z.string().min(2, 'Name is too short').optional().nullable(),
  email: z.string().email('Invalid email address'),
  logo_url: z.string().url('Invalid URL').optional().nullable(),
});

export const UpdateCompanySchema = CreateCompanySchema.partial();
