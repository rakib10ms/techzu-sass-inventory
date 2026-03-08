import { Router } from 'express';
import { customerController } from '../controllers/customer.controller';

const router = Router();

router.post('/', customerController.create);
router.get('/', customerController.getAll);
router.get('/:id', customerController.getOne);
router.patch('/:id', customerController.update);
router.delete('/:id', customerController.delete);

export default router;
