import { prisma } from '../lib/prisma';
import { CreateSaleDTO, SaleItemDTO } from '../schemas/sale.dto';

// ✅ Receipt No Auto Generate: RCP-20250308-000123
const generateReceiptNo = (): string => {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, ''); // 20250308
  const random = Math.floor(100000 + Math.random() * 900000); // 6 digit random
  return `RCP-${dateStr}-${random}`;
};

export const saleRepository = {
  // ✅ সব কিছু একটা Transaction-এ হবে
  create: async (data: CreateSaleDTO) => {
    return prisma.$transaction(async (tx) => {
      // ─── Step 1: প্রতিটি item-এর stock check ───
      for (const item of data.items) {
        const outletProduct = await tx.outletProduct.findFirst({
          where: {
            outlet_id: data.outlet_id,
            product_id: item.product_id,
          },
        });

        if (!outletProduct) {
          throw new Error(
            `Product ID ${item.product_id} is not available in this outlet`
          );
        }

        if (outletProduct.stock_quantity < item.qty) {
          throw new Error(
            `Insufficient stock for product ID ${item.product_id}. Available: ${outletProduct.stock_quantity}, Requested: ${item.qty}`
          );
        }
      }

      // ─── Step 2: sub_total ও total_amount calculate ───
      const itemsWithSubTotal = data.items.map((item) => ({
        ...item,
        sub_total: item.qty * item.unit_price,
      }));

      const total_amount = itemsWithSubTotal.reduce(
        (sum, item) => sum + item.sub_total,
        0
      );

      // ─── Step 3: Sale create (with nested sale_items) ───
      const sale = await tx.sale.create({
        data: {
          outlet_id: data.outlet_id,
          user_id: data.user_id,
          customer_id: data.customer_id ?? null,
          receipt_no: generateReceiptNo(),
          total_amount,
          sales_items: {
            create: itemsWithSubTotal.map((item) => ({
              product_id: item.product_id,
              qty: item.qty,
              unit_price: item.unit_price,
              sub_total: item.sub_total,
            })),
          },
        },
        include: {
          sales_items: {
            include: { product: true },
          },
          outlet: true,
          customer: true,
        },
      });

      // ─── Step 4: Stock deduct ───
      for (const item of data.items) {
        await tx.outletProduct.updateMany({
          where: {
            outlet_id: data.outlet_id,
            product_id: item.product_id,
          },
          data: {
            stock_quantity: { decrement: item.qty },
          },
        });
      }

      return sale;
    });
  },

  findAll: async (outletId?: number) =>
    prisma.sale.findMany({
      where: outletId ? { outlet_id: outletId } : {},
      include: {
        sales_items: {
          include: { product: true },
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
          include: { product: true },
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
          include: { product: true },
        },
        outlet: true,
        customer: true,
      },
    }),

  // Sale delete করা যাবে না (financial record) — soft approach
  // শুধু admin পারবে, এবং stock ফেরত দেবে
  delete: async (id: number) => {
    return prisma.$transaction(async (tx) => {
      const sale = await tx.sale.findUnique({
        where: { id },
        include: { sales_items: true },
      });

      if (!sale) throw new Error('Sale not found');

      // ─── Stock ফেরত দাও ───
      for (const item of sale.sales_items) {
        await tx.outletProduct.updateMany({
          where: {
            outlet_id: sale.outlet_id,
            product_id: item.product_id,
          },
          data: {
            stock_quantity: { increment: item.qty },
          },
        });
      }

      // ─── Sale delete ───
      await tx.saleItem.deleteMany({ where: { sale_id: id } });
      return tx.sale.delete({ where: { id } });
    });
  },
};
