import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendResponse } from '../utils/apiResponse';
import { CreateUserSchema, UpdateUserSchema } from '../schemas/user.dto';

export const userController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);

      const user = await userService.createUser(validatedData);

      const { password, ...userWithoutPassword } = user;

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'User created successfully',
        data: userWithoutPassword,
      });
    } catch (error: any) {
      next(error);
    }
  },

  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await userService.getAllUsers();
      const safeUsers = users.map(({ password, ...rest }: any) => rest);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Users retrieved successfully',
        data: safeUsers,
      });
    } catch (error) {
      next(error);
    }
  },
};
