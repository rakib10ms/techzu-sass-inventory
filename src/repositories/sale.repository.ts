import { prisma } from '../lib/prisma';
import { CreateSaleDTO } from '../schemas/sale.dto';

const generateReceiptNo = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // 20260308
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digit random
  return `RCP-${dateStr}-${random}`;
};

export const saleRepository = {
  create: async (data: CreateSaleDTO) => {
    return prisma.$transaction(async (tx) => {
      const stockAlerts: string[] = [];

      const outletProduct = await tx.outletProduct.findFirst({
        where: {
          outlet_id: data.outlet_id,
          product_id: data.product_id, // সরাসরি data থেকে আসছে
        },
        include: { product: true },
      });

      if (!outletProduct) {
        throw new Error(
          `Product ID ${data.product_id} is not available in this outlet`
        );
      }

      if (outletProduct.stock_quantity < data.qty) {
        throw new Error(
          `Insufficient stock for ${outletProduct.product.name}. Available: ${outletProduct.stock_quantity}, Requested: ${data.qty}`
        );
      }

      const sub_total = data.qty * data.unit_price;
      const total_amount = sub_total;

      const updatedStock = await tx.outletProduct.update({
        where: { id: outletProduct.id },
        data: { stock_quantity: { decrement: data.qty } },
      });

      if (updatedStock.stock_quantity <= outletProduct.min_stock_level) {
        stockAlerts.push(
          `Warning: Stock for '${outletProduct.product.name}' is low. Only ${updatedStock.stock_quantity} left.`
        );
      }

      const sale = await tx.sale.create({
        data: {
          outlet_id: data.outlet_id,
          user_id: data.user_id,
          customer_id: data.customer_id ?? null,
          receipt_no: generateReceiptNo(),
          total_amount: total_amount,
          sales_items: {
            create: [
              {
                outlet_product_id: outletProduct.id,
                qty: data.qty,
                unit_price: data.unit_price,
                sub_total: sub_total,
              },
            ],
          },
        },
        include: {
          sales_items: {
            include: { outlet_product: { include: { product: true } } },
          },
          outlet: true,
          customer: true,
        },
      });

      return { sale, stockAlerts };
    });
  },

  findAll: async (outletId?: number) =>
    prisma.sale.findMany({
      where: outletId ? { outlet_id: outletId } : {},
      include: {
        sales_items: {
          include: { outlet_product: { include: { product: true } } }, // ✅ আপডেট করা হয়েছে
        },
        outlet: true,
        customer: true,
      },
      orderBy: { created_at: 'desc' },
    }),

  findById: async (id: number) =>
    prisma.sale.findUnique({
      where: { id },
      include: {
        sales_items: {
          include: { outlet_product: { include: { product: true } } },
        },
        outlet: true,
        customer: true,
      },
    }),

  findByReceiptNo: async (receiptNo: string) =>
    prisma.sale.findUnique({
      where: { receipt_no: receiptNo },
      include: {
        sales_items: {
          include: { outlet_product: { include: { product: true } } },
        },
        outlet: true,
        customer: true,
      },
    }),

  delete: async (id: number) => {
    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id },
        include: { sales_items: true },
      });

      if (!sale) throw new Error('Sale not found');

      for (const item of sale.sales_items) {
        await tx.outletProduct.update({
          where: { id: item.outlet_product_id },
          data: { stock_quantity: { increment: item.qty } },
        });
      }

      await tx.saleItem.deleteMany({ where: { sale_id: id } });
      return tx.sale.delete({ where: { id } });
    });
  },
};
