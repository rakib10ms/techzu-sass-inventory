import { Router } from 'express';
import { outletProductController } from '../controllers/outletProduct.controller';

const router = Router();

// ✅ /low-stock আগে রাখতে হবে, নাহলে /:id এটাকে ধরে নেবে
router.get('/low-stock', outletProductController.getLowStock);

router.post('/', outletProductController.create);
router.get('/', outletProductController.getAll); // ?outlet_id=1 optional
router.get('/:id', outletProductController.getOne);
router.patch('/:id', outletProductController.update);
router.delete('/:id', outletProductController.delete);

export default router;
