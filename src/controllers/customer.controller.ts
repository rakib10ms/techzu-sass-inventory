import { Request, Response, NextFunction } from 'express';
import { customerService } from '../services/customer.service';
import { sendResponse } from '../utils/apiResponse';
import {
  CreateCustomerSchema,
  UpdateCustomerSchema,
} from '../schemas/customer.dto';

export const customerController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateCustomerSchema.parse(req.body);
      const customer = await customerService.createCustomer(validatedData);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Customer created',
        data: customer,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const outletId = req.query.outletId
        ? Number(req.query.outletId)
        : undefined;
      const customers = await customerService.getAllCustomers(outletId);
      sendResponse(res, { statusCode: 200, success: true, data: customers });
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
      const customer = await customerService.getCustomerById(
        Number(req.params.id)
      );
      sendResponse(res, { statusCode: 200, success: true, data: customer });
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
      const validatedData = UpdateCustomerSchema.parse(req.body);
      const customer = await customerService.updateCustomer(
        Number(req.params.id),
        validatedData
      );
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Customer updated',
        data: customer,
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
      await customerService.deleteCustomer(Number(req.params.id));
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Customer deleted',
      });
    } catch (error) {
      next(error);
    }
  },
};
