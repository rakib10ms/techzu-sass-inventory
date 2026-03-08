import { outletProductRepository } from '../repositories/outletProduct.repository';
import {
  CreateOutletProductDTO,
  UpdateOutletProductDTO,
} from '../schemas/outletProduct.dto';

export const outletProductService = {
  createOutletProduct: async (data: CreateOutletProductDTO) => {
    // ✅ একই outlet-এ একই product দুইবার add করা যাবে না
    const existing = await outletProductRepository.findByOutletAndProduct(
      data.outlet_id,
      data.product_id
    );
    if (existing) {
      const error: any = new Error('This product already exists in the outlet');
      error.statusCode = 409;
      throw error;
    }
    return outletProductRepository.create(data);
  },

  getAllOutletProducts: async (outletId?: number) =>
    outletProductRepository.findAll(outletId),

  getOutletProductById: async (id: number) => {
    const outletProduct = await outletProductRepository.findById(id);
    if (!outletProduct) {
      const error: any = new Error('Outlet product not found');
      error.statusCode = 404;
      throw error;
    }
    return outletProduct;
  },

  updateOutletProduct: async (id: number, data: UpdateOutletProductDTO) => {
    await outletProductService.getOutletProductById(id);
    return outletProductRepository.update(id, data);
  },

  deleteOutletProduct: async (id: number) => {
    await outletProductService.getOutletProductById(id);
    return outletProductRepository.delete(id);
  },

  // ✅ Low stock alert — stock_quantity <= min_stock_level
  getLowStockProducts: async (outletId?: number) => {
    const all = await outletProductRepository.findAll(outletId);
    return all.filter((item) => item.stock_quantity <= item.min_stock_level);
  },
};
