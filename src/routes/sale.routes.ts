import { Router } from 'express';
import { saleController } from '../controllers/sale.controller';

const router = Router();

// ✅ specific routes আগে রাখো
router.get('/receipt/:receiptNo', saleController.getByReceiptNo);

router.post('/', saleController.create);
router.get('/', saleController.getAll); // ?outlet_id=1 optional filter
router.get('/:id', saleController.getOne);
router.delete('/:id', saleController.delete); // stock restore সহ

// ✅ Sale update নেই — financial record immutable রাখা best practice

export default router;
