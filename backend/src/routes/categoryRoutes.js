
import express from 'express';
import {
    getCategories,
    createCategory,
    deleteCategory,
} from '../controllers/categoryController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getCategories)
    .post(protect, authorize('admin'), createCategory);

router.route('/:id')
    .delete(protect, authorize('admin'), deleteCategory);

export default router;
