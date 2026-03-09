import { reportRepository } from '../repositories/report.repository';

export const reportService = {
  // GET /reports/revenue  (optional ?outlet_id=1)
  getRevenueByOutlet: async (outletId?: number) => {
    return reportRepository.getRevenueByOutlet(outletId);
  },

  // GET /reports/outlets/:outletId  → full summary for one outlet
  getOutletSummary: async (outletId: number) => {
    return reportRepository.getOutletSummary(outletId);
  },

  // GET /reports/outlets  → all outlets summary
  getAllOutletsSummary: async () => {
    return reportRepository.getAllOutletsSummary();
  },
};
