import { prisma } from '../lib/prisma';
import { CreateRoleSchema } from '../schemas/role.dto';

export const roleRepository = {
  create: async (data: any) => prisma.role.create({ data }),

  findAll: async () =>
    prisma.role.findMany({
      include: { _count: { select: { users: true } } },
    }),

  findById: async (id: number) =>
    prisma.role.findUnique({
      where: { id },
      include: { users: true },
    }),

  update: async (id: number, data: any) =>
    prisma.role.update({
      where: { id },
      data,
    }),

  delete: async (id: number) => prisma.role.delete({ where: { id } }),
};
