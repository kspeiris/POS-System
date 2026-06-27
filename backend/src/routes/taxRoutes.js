
import express from 'express';
import {
    getTaxRules,
    getActiveTaxRules,
    createTaxRule,
    updateTaxRule,
    deleteTaxRule,
} from '../controllers/taxController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/active', protect, getActiveTaxRules);
router.route('/')
    .get(protect, authorize('admin'), getTaxRules)
    .post(protect, authorize('admin'), createTaxRule);

router.route('/:id')
    .put(protect, authorize('admin'), updateTaxRule)
    .delete(protect, authorize('admin'), deleteTaxRule);

export default router;
