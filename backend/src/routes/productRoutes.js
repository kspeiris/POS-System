
import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductByBarcode,
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getProducts)
    .post(protect, authorize('admin'), createProduct);

router.get('/barcode/:code', protect, getProductByBarcode);

router.route('/:id')
    .get(protect, getProductById)
    .put(protect, authorize('admin'), updateProduct)
    .delete(protect, authorize('admin'), deleteProduct);

export default router;
