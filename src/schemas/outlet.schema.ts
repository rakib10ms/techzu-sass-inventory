import { z } from 'zod';

export const CreateOutletSchema = z.object({
  company_id: z
    .number({
      required_error: 'Company ID is required',
      invalid_type_error: 'Company ID must be a number',
    })
    .int()
    .positive(),

  name: z
    .string()
    .min(3, 'Outlet name must be at least 3 characters long')
    .max(255),

  location: z.string().min(5, 'Location is too short').optional().nullable(),

  phone: z
    .string()
    .min(10, 'Invalid phone number')
    .max(15, 'Phone number is too long')
    .optional()
    .nullable(),

  receipt_prefix: z
    .string()
    .min(2, 'Prefix is too short')
    .max(10, 'Prefix is too long'),
});

export const UpdateOutletSchema = CreateOutletSchema.partial();

export type CreateOutletInput = z.infer<typeof CreateOutletSchema>;
export type UpdateOutletInput = z.infer<typeof UpdateOutletSchema>;
