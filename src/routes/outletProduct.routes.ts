import { Router } from 'express';
import { outletProductController } from '../controllers/outletProduct.controller';

const router = Router();

router.get('/low-stock', outletProductController.getLowStock);

router.post('/', outletProductController.create);
router.get('/', outletProductController.getAll);
router.get('/:id', outletProductController.getOne);
router.patch('/:id', outletProductController.update);
router.delete('/:id', outletProductController.delete);

export default router;
