import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { upload } from '../utils/upload';

const router = Router();

// ✅ images[] → multer field name হবে "images", max 5 টি ছবি
router.post('/', upload.array('images', 5), productController.create);

router.get('/', productController.getAll); // ?company_id=1 optional filter
router.get('/:id', productController.getOne);
router.patch('/:id', productController.update); // শুধু text fields
router.delete('/:id', productController.delete);

// ✅ Image-specific routes
router.post(
  '/:id/images',
  upload.array('images', 5),
  productController.addImages // existing product-এ image add
);
router.delete('/images/:imageId', productController.deleteImage); // single image delete

export default router;
