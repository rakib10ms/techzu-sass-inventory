import { prisma } from '../lib/prisma';

export const reportRepository = {
  // Total revenue by outlet
  getRevenueByOutlet: async (outletId?: number) => {
    const where = outletId ? { outlet_id: outletId } : {};

    return prisma.sale.groupBy({
      by: ['outlet_id'],
      where,
      _sum: { total_amount: true },
      _count: { id: true },
    });
  },

  // Top 5 selling items per outlet
  getTopSellingItems: async (outletId: number) => {
    return prisma.saleItem.groupBy({
      by: ['outlet_product_id'],
      where: {
        sale: { outlet_id: outletId },
      },
      _sum: { qty: true, sub_total: true },
      orderBy: { _sum: { qty: 'desc' } },
      take: 5,
    });
  },

  // Full report: revenue + top items for one outlet (or all)
  getOutletSummary: async (outletId: number) => {
    const [revenue, topItemsRaw] = await Promise.all([
      prisma.sale.aggregate({
        where: { outlet_id: outletId },
        _sum: { total_amount: true },
        _count: { id: true },
      }),
      prisma.saleItem.groupBy({
        by: ['outlet_product_id'],
        where: { sale: { outlet_id: outletId } },
        _sum: { qty: true, sub_total: true },
        orderBy: { _sum: { qty: 'desc' } },
        take: 5,
      }),
    ]);

    // Enrich top items with product name
    const topItems = await Promise.all(
      topItemsRaw.map(async (item) => {
        const outletProduct = await prisma.outletProduct.findUnique({
          where: { id: item.outlet_product_id },
          include: { product: true },
        });
        return {
          product_name: outletProduct?.product?.name ?? 'Unknown',
          outlet_product_id: item.outlet_product_id,
          total_qty_sold: item._sum.qty,
          total_revenue: item._sum.sub_total,
        };
      })
    );

    return {
      outlet_id: outletId,
      total_sales_count: revenue._count.id,
      total_revenue: revenue._sum.total_amount ?? 0,
      top_5_items: topItems,
    };
  },

  // All outlets summary
  getAllOutletsSummary: async () => {
    const outlets = await prisma.outlet.findMany({
      select: { id: true, name: true },
    });

    const summaries = await Promise.all(
      outlets.map(async (outlet) => {
        const summary = await reportRepository.getOutletSummary(outlet.id);
        return { outlet_name: outlet.name, ...summary };
      })
    );

    return summaries;
  },
};
