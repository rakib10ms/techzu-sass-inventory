import { Router } from 'express';
import { roleController } from '../controllers/role.controller';

const router = Router();

router.post('/', roleController.create);
router.get('/', roleController.getAll);
router.get('/:id', roleController.getOne);
router.patch('/:id', roleController.update);
router.delete('/:id', roleController.delete);

export default router;
