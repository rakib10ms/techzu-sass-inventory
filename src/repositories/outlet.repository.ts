import { prisma } from '../lib/prisma';

export const outletRepository = {
  create: async (data: any) => prisma.outlet.create({ data }),

  findAll: async () =>
    prisma.outlet.findMany({
      include: { company: true },
    }),

  findById: async (id: number) =>
    prisma.outlet.findUnique({
      where: { id },
      include: { company: true },
    }),

  update: async (id: number, data: any) =>
    prisma.outlet.update({ where: { id }, data }),

  delete: async (id: number) => prisma.outlet.delete({ where: { id } }),
};
