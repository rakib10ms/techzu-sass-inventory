import { Request, Response, NextFunction } from 'express';
import { outletProductService } from '../services/outletProduct.service';
import { sendResponse } from '../utils/apiResponse';
import {
  CreateOutletProductSchema,
  UpdateOutletProductSchema,
} from '../schemas/outletProduct.dto';

export const outletProductController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateOutletProductSchema.parse(req.body);
      const outletProduct =
        await outletProductService.createOutletProduct(validatedData);

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Outlet product created successfully',
        data: outletProduct,
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

      const outletProducts =
        await outletProductService.getAllOutletProducts(outletId);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlet products retrieved successfully',
        data: outletProducts,
      });
    } catch (error) {
      next(error);
    }
  },

  getOne: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const outletProduct = await outletProductService.getOutletProductById(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlet product retrieved successfully',
        data: outletProduct,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const body = req.body ?? {};
      const validatedData = UpdateOutletProductSchema.parse(body);

      if (Object.keys(validatedData).length === 0) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: 'No fields provided to update',
        });
        return;
      }

      const outletProduct = await outletProductService.updateOutletProduct(
        id,
        validatedData
      );

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlet product updated successfully',
        data: outletProduct,
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
      await outletProductService.deleteOutletProduct(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlet product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  getLowStock: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const outletId = req.query.outlet_id
        ? Number(req.query.outlet_id)
        : undefined;

      const lowStockItems =
        await outletProductService.getLowStockProducts(outletId);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Low stock products retrieved successfully',
        data: lowStockItems,
      });
    } catch (error) {
      next(error);
    }
  },
};
