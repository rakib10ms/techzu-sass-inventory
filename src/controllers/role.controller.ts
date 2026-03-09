import { Request, Response, NextFunction } from 'express';
import { roleService } from '../services/role.service';
import { sendResponse } from '../utils/apiResponse';
import { CreateRoleSchema, UpdateRoleSchema } from '../schemas/role.dto';

export const roleController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateRoleSchema.parse(req.body);
      const result = await roleService.createRole(validatedData);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Role created',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roleService.getAllRoles();
      sendResponse(res, { statusCode: 200, success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  getOne: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await roleService.getRoleById(Number(req.params.id));
      sendResponse(res, { statusCode: 200, success: true, data: result });
    } catch (error) {
      next(error);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = UpdateRoleSchema.parse(req.body);
      const result = await roleService.updateRole(
        Number(req.params.id),
        validatedData
      );
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Role updated',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction) => {
    try {
      await roleService.deleteRole(Number(req.params.id));
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Role deleted',
      });
    } catch (error) {
      next(error);
    }
  },
};
