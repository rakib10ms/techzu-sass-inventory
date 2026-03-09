import { z } from 'zod';

export const CreateRoleSchema = z.object({
  name: z.string().min(2, 'Role name is too short').toUpperCase(),
  description: z.string().optional(),
});

export const UpdateRoleSchema = CreateRoleSchema.partial();
