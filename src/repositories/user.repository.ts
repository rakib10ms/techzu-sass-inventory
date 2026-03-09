import { prisma } from '../lib/prisma';

export const userRepository = {
  create: async (data: any) => prisma.user.create({ data }),

  findAll: async () =>
    prisma.user.findMany({
      include: { company: true },
    }),

  findById: async (id: number) =>
    prisma.user.findUnique({
      where: { id },
      include: { company: true },
    }),

  findByEmail: async (email: string) => {
    return await prisma.user.findUnique({
      where: { email },
      include: {
        role: true, // Role details (ADMIN, MANAGER etc) anbe
        company: true, // Company details (Name, Email) anbe
      },
    });
  },

  update: async (id: number, data: any) =>
    prisma.user.update({ where: { id }, data }),

  delete: async (id: number) => prisma.user.delete({ where: { id } }),
};
