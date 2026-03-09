import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { upload } from '../utils/upload';

const router = Router();

router.post('/', upload.array('images', 5), productController.create);

router.get('/', productController.getAll);
router.get('/:id', productController.getOne);
router.patch('/:id', productController.update);
router.delete('/:id', productController.delete);

router.post(
  '/:id/images',
  upload.array('images', 5),
  productController.addImages
);
router.delete('/images/:imageId', productController.deleteImage);

export default router;
