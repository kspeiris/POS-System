
import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getLowStockProducts,
    uploadProductImage,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.route('/')
    .get(protect, getProducts)
    .post(protect, authorize('admin'), createProduct);

router.get('/low-stock', protect, authorize('admin'), getLowStockProducts);

router.route('/:id')
    .get(protect, getProductById)
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

router.put('/:id/upload-image', protect, authorize('admin'), upload.single('image'), uploadProductImage);

export default router;
