import { Request, Response, NextFunction } from 'express';
import { reportService } from '../services/report.service';
import { sendResponse } from '../utils/apiResponse';

export const reportController = {
  // GET /reports/revenue?outlet_id=1
  getRevenue: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const outletId = req.query.outlet_id
        ? Number(req.query.outlet_id)
        : undefined;
      const data = await reportService.getRevenueByOutlet(outletId);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Revenue report retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /reports/outlets
  getAllOutlets: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const data = await reportService.getAllOutletsSummary();

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'All outlets report retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  // GET /reports/outlets/:outletId
  getOneOutlet: async (
    req: Request<{ outletId: string }>,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const outletId = Number(req.params.outletId);
      const data = await reportService.getOutletSummary(outletId);

      sendResponse(res, {
        statusCode: 200,
        success: true,
        message: 'Outlet report retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },
};
