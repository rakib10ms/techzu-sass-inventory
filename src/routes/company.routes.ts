import { Router } from 'express';
import { companyController } from '../controllers/company.controller';

const router = Router();

// Resource: Companies
router.post('/', companyController.create);
router.get('/', companyController.getAll);
// router.get("/:id", companyController.getOne);
// router.patch("/:id", companyController.update);
// router.delete("/:id", companyController.delete);

export default router;
