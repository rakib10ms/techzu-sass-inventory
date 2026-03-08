import { productRepository } from '../repositories/product.repository';
import { CreateProductDTO, UpdateProductDTO } from '../schemas/product.dto';

export const productService = {
  createProduct: async (data: CreateProductDTO, imageUrls: string[]) =>
    productRepository.create(data, imageUrls),

  getAllProducts: async (companyId?: number) =>
    productRepository.findAll(companyId),

  getProductById: async (id: number) => {
    const product = await productRepository.findById(id);
    if (!product) {
      const error: any = new Error('Product not found');
      error.statusCode = 404;
      throw error;
    }
    return product;
  },

  updateProduct: async (id: number, data: UpdateProductDTO) => {
    // ✅ আগে check করবে product আছে কিনা
    await productService.getProductById(id);
    return productRepository.update(id, data);
  },

  deleteProduct: async (id: number) => {
    await productService.getProductById(id);
    return productRepository.delete(id);
  },

  addProductImages: async (productId: number, imageUrls: string[]) => {
    await productService.getProductById(productId);
    return productRepository.addImages(productId, imageUrls);
  },

  deleteProductImage: async (imageId: number) =>
    productRepository.deleteImage(imageId),
};
