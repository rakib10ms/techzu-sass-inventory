import { prisma } from '../lib/prisma';
import { CreateProductDTO, UpdateProductDTO } from '../schemas/product.dto';

export const productRepository = {
  create: async (data: CreateProductDTO, imageUrls: string[]) =>
    prisma.product.create({
      data: {
        company_id: data.company_id,
        name: data.name,
        details: data.details,
        base_price: data.base_price,
        images: {
          create: imageUrls.map((url) => ({ image_url: url })),
        },
      },
      include: {
        images: true,
        company: true,
      },
    }),

  findAll: async (companyId?: number) =>
    prisma.product.findMany({
      where: companyId ? { company_id: companyId } : {},
      include: {
        images: true,
        company: true,
      },
      orderBy: { created_at: 'desc' },
    }),

  findById: async (id: number) =>
    prisma.product.findUnique({
      where: { id },
      include: {
        images: true,
        company: true,
      },
    }),

  update: async (id: number, data: UpdateProductDTO) =>
    prisma.product.update({
      where: { id },
      data,
      include: {
        images: true,
        company: true,
      },
    }),

  delete: async (id: number) =>
    prisma.$transaction([
      prisma.productImage.deleteMany({ where: { product_id: id } }),
      prisma.product.delete({ where: { id } }),
    ]),

  addImages: async (productId: number, imageUrls: string[]) =>
    prisma.productImage.createMany({
      data: imageUrls.map((url) => ({
        product_id: productId,
        image_url: url,
      })),
    }),

  deleteImage: async (imageId: number) =>
    prisma.productImage.delete({ where: { id: imageId } }),
};
