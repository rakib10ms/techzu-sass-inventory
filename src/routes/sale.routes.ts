import { Router } from 'express';
import { saleController } from '../controllers/sale.controller';

const router = Router();

router.get('/receipt/:receiptNo', saleController.getByReceiptNo);

router.post('/', saleController.create);
router.get('/', saleController.getAll);
router.get('/:id', saleController.getOne);
router.delete('/:id', saleController.delete);

export default router;
