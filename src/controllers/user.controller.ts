import { Request, Response, NextFunction } from 'express';
import { userService } from '../services/user.service';
import { sendResponse } from '../utils/apiResponse';
import { CreateUserSchema, UpdateUserSchema } from '../schemas/user.dto';

export const userController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateUserSchema.parse(req.body);
      const result = await userService.createUser(validatedData);

      const { user, token } = result;

      const userInfo = JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        outlet_id: user.outlet_id,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
        sameSite: 'lax',
      });

      res.cookie('user_data', userInfo, {
        maxAge: 24 * 60 * 60 * 1000,
        sameSite: 'lax',
      });

      res.status(200).json({
        success: true,
        message: 'Login successful',
        user: user,
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
  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await userService.loginUser(email, password); // { user, token }
      const { user, token } = result;

      const userInfo = JSON.stringify({
        id: user.id,
        name: user.name,
        role: user.role,
        outlet_id: user.outlet_id,
      });

      // COOKIE SET KORA (Sudhu login e hobe)
      res.cookie('token', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000,
      });
      res.cookie('user_data', userInfo, { maxAge: 24 * 60 * 60 * 1000 });

      res
        .status(200)
        .json({ success: true, message: 'Login successful', user });
    } catch (error) {
      next(error);
    }
  },
};
