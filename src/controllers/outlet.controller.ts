import { Request, Response, NextFunction } from 'express';
import { outletService } from '../services/outlet.service';
import { sendResponse } from '../utils/apiResponse';
import {
  CreateOutletSchema,
  UpdateOutletSchema,
} from '../schemas/outlet.schema';

export const outletController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateOutletSchema.parse(req.body);
      const outlet = await outletService.createOutlet(validatedData);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Outlet created successfully',
        data: outlet,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const outlets = await outletService.getAllOutlets();
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlets retrieved successfully',
        data: outlets,
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
      const outlet = await outletService.getOutletById(id);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlet retrieved successfully',
        data: outlet,
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
      const validatedData = UpdateOutletSchema.parse(req.body);
      const outlet = await outletService.updateOutlet(id, validatedData);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlet updated successfully',
        data: outlet,
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
      await outletService.deleteOutlet(id);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlet deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
