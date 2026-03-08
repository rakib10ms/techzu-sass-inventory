import { Request, Response, NextFunction } from 'express';
import { companyService } from '../services/company.service';
import { sendResponse } from '../utils/apiResponse';
import {
  CreateCompanySchema,
  UpdateCompanySchema,
} from '../schemas/company.schema';

export const companyController = {
  create: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = CreateCompanySchema.parse(req.body);
      const company = await companyService.createCompany(validatedData);
      sendResponse(res, {
        statusCode: 201,
        success: true,
        message: 'Company created successfully',
        data: company,
      });
    } catch (error) {
      next(error);
    }
  },

  getAll: async (_req: Request, res: Response, next: NextFunction) => {
    try {
      const companies = await companyService.getAllCompanies();
      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Companies retrieved successfully',
        data: companies,
      });
    } catch (error) {
      next(error);
    }
  },

  // <{ id: string }> ব্যবহার করায় TS জানে params.id একটি string
  getOne: async (
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = Number(req.params.id);
      const company = await companyService.getCompanyById(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Company retrieved successfully',
        data: company,
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
      const validatedData = UpdateCompanySchema.parse(req.body);
      const company = await companyService.updateCompany(id, validatedData);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Company updated successfully',
        data: company,
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
      await companyService.deleteCompany(id);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Company deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
