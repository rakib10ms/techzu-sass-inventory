import { Request, Response, NextFunction } from 'express';
import { productService } from '../services/product.service';
import { sendResponse } from '../utils/apiResponse';
import {
  CreateProductSchema,
  UpdateProductSchema,
} from '../schemas/product.dto';

export const productController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateProductSchema.parse(req.body);

      const files = req.files as Express.Multer.File[];
      const imageUrls = files?.map((file) => `/${file.path}`) ?? [];

      const product = await productService.createProduct(
        validatedData,
        imageUrls
      );

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companyId = req.query.company_id
        ? Number(req.query.company_id)
        : undefined;

      const products = await productService.getAllProducts(companyId);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Products retrieved successfully',
        data: products,
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
      const product = await productService.getProductById(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product retrieved successfully',
        data: product,
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

      // ✅ req.body undefined হলে safeguard
      const body = req.body ?? {};
      const validatedData = UpdateProductSchema.parse(body);

      if (Object.keys(validatedData).length === 0) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: 'No fields provided to update',
        });
        return;
      }

      const product = await productService.updateProduct(id, validatedData);
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product updated successfully',
        data: product,
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
      await productService.deleteProduct(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  addImages: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const productId = Number(req.params.id);
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        sendResponse(res, {
          statusCode: 400,
          success: false,
          message: 'No images provided',
        });
        return;
      }

      const imageUrls = files.map((file) => `/${file.path}`);
      const result = await productService.addProductImages(
        productId,
        imageUrls
      );

      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Images added successfully',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  deleteImage: async (
    req: Request<{ imageId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const imageId = Number(req.params.imageId);
      await productService.deleteProductImage(imageId);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
