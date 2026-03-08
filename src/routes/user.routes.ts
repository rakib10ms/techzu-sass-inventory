import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.post('/', userController.create);
router.get('/', userController.getAll);
// router.get('/:id', userController.getOne);
// router.patch('/:id', userController.update);
// router.delete('/:id', userController.delete);

export default router;
