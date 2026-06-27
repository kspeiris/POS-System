
import express from 'express';
import {
    createOrder,
    getOrderById,
    getOrders,
    getOrderReceipt,
    voidOrder,
    refundOrder,
} from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

router.route('/:id')
    .get(protect, getOrderById);

router.get('/:id/receipt', protect, getOrderReceipt);

router.patch('/:id/void', protect, authorize('admin'), voidOrder);
router.patch('/:id/refund', protect, authorize('admin'), refundOrder);

export default router;
