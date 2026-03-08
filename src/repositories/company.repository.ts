import { prisma } from "../lib/prisma";

export const companyRepository = {
  create: async (data: any) => prisma.company.create({ data }),
  
  findAll: async () => prisma.company.findMany(),
  
  findById: async (id: number) => prisma.company.findUnique({ where: { id } }),
  
  update: async (id: number, data: any) => prisma.company.update({ where: { id }, data }),
  
  delete: async (id: number) => prisma.company.delete({ where: { id } }),
};