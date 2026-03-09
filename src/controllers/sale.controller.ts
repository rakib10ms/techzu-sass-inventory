import { Request, Response, NextFunction } from 'express';
import { saleService } from '../services/sale.service';
import { sendResponse } from '../utils/apiResponse';
import { CreateSaleSchema } from '../schemas/sale.dto';

export const saleController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateSaleSchema.parse(req.body);
      const result = await saleService.createSale(validatedData);

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Sale created successfully',
        data: {
          sale: result.sale,
          alerts:
            result.stockAlerts.length > 0 ? result.stockAlerts : undefined, // স্টক অ্যালার্ট থাকলে দেখাবে
        },
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const outletId = req.query.outlet_id
        ? Number(req.query.outlet_id)
        : undefined;
      const sales = await saleService.getAllSales(outletId);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Sales retrieved successfully',
        data: sales,
      });
    } catch (error) {
      next(error);
    }
  },
  // GET /sales/:id
  getOne: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const sale = await saleService.getSaleById(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Sale retrieved successfully',
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  },

  getByReceiptNo: async (
    req: Request<{ receiptNo: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const sale = await saleService.getSaleByReceiptNo(req.params.receiptNo);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Sale retrieved successfully',
        data: sale,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      await saleService.deleteSale(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Sale deleted and stock restored successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
