import { saleRepository } from '../repositories/sale.repository';
import { CreateSaleDTO } from '../schemas/sale.schema';

export const saleService = {
  createSale: async (data: CreateSaleDTO) => saleRepository.create(data),

  getAllSales: async (outletId?: number) => saleRepository.findAll(outletId),

  getSaleById: async (id: number) => {
    const sale = await saleRepository.findById(id);
    if (!sale) {
      const error: any = new Error('Sale not found');
      error.statusCode = 404;
      throw error;
    }
    return sale;
  },

  getSaleByReceiptNo: async (receiptNo: string) => {
    const sale = await saleRepository.findByReceiptNo(receiptNo);
    if (!sale) {
      const error: any = new Error('Sale not found with this receipt number');
      error.statusCode = 404;
      throw error;
    }
    return sale;
  },

  // Sale delete = stock ফেরত + record মুছে ফেলা
  deleteSale: async (id: number) => {
    await saleService.getSaleById(id); // existence check
    return saleRepository.delete(id);
  },
};
