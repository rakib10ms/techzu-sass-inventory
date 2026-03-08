import { Router } from 'express';
import { outletController } from '../controllers/outlet.controller';

const router = Router();

router.post('/', outletController.create);
router.get('/', outletController.getAll);
router.get('/:id', outletController.getOne);
router.patch('/:id', outletController.update);
router.delete('/:id', outletController.delete);

export default router;
