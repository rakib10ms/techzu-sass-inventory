import { prisma } from '../lib/prisma';
import {
  CreateOutletProductDTO,
  UpdateOutletProductDTO,
} from '../schemas/outletProduct.dto';

export const outletProductRepository = {
  create: async (data: CreateOutletProductDTO) =>
    prisma.outletProduct.create({
      data,
      include: {
        product: {
          include: { images: true },
        },
        outlet: true,
      },
    }),

  findAll: async (outletId?: number) =>
    prisma.outletProduct.findMany({
      where: outletId ? { outlet_id: outletId } : {},
      include: {
        product: {
          include: { images: true },
        },
        outlet: true,
        user: true,
      },
      orderBy: { created_at: 'desc' },
    }),

  findById: async (id: number) =>
    prisma.outletProduct.findUnique({
      where: { id },
      include: {
        product: {
          include: { images: true },
        },
        outlet: true,
      },
    }),

  findByOutletAndProduct: async (outletId: number, productId: number) =>
    prisma.outletProduct.findFirst({
      where: { outlet_id: outletId, product_id: productId },
    }),

  update: async (id: number, data: UpdateOutletProductDTO) =>
    prisma.outletProduct.update({
      where: { id },
      data,
      include: {
        product: {
          include: { images: true },
        },
        outlet: true,
      },
    }),

  delete: async (id: number) => prisma.outletProduct.delete({ where: { id } }),

  findLowStock: async (outletId?: number) =>
    prisma.outletProduct.findMany({
      where: {
        ...(outletId ? { outlet_id: outletId } : {}),
        stock_quantity: { lte: prisma.outletProduct.fields.min_stock_level },
      },
      include: {
        product: true,
        outlet: true,
      },
    }),
};
