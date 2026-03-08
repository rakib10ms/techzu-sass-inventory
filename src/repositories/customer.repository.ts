import { prisma } from '../lib/prisma';

export const customerRepository = {
  create: async (data: any) => prisma.customer.create({ data }),

  findAll: async (outletId?: number) =>
    prisma.customer.findMany({
      where: outletId ? { outlet_id: outletId } : {},
      include: {
        outlet: {
          include: {
            company: true,
          },
        },
      },
    }),
  findById: async (id: number) =>
    prisma.customer.findUnique({
      where: { id },
      include: {
        outlet: {
          include: {
            company: true,
          },
        },
      },
    }),

  update: async (id: number, data: any) =>
    prisma.customer.update({ where: { id }, data }),

  delete: async (id: number) => prisma.customer.delete({ where: { id } }),
};
