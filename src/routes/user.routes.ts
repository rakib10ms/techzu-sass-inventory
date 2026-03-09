import { Router } from 'express';
import { userController } from '../controllers/user.controller';

const router = Router();

router.post('/', userController.create);
router.get('/', userController.getAll);
router.post('/login', userController.login);

export default router;
