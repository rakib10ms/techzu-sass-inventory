import { Router } from 'express';
import { reportController } from '../controllers/report.controller';

const router = Router();

// GET /reports/revenue?outlet_id=1   → total revenue (all or per outlet)
router.get('/revenue', reportController.getRevenue);

// GET /reports/outlets               → all outlets summary + top 5 items each
router.get('/outlets', reportController.getAllOutlets);

// GET /reports/outlets/:outletId     → single outlet summary + top 5 items
router.get('/outlets/:outletId', reportController.getOneOutlet);

export default router;
