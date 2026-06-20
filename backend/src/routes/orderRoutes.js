
import express from 'express';
import {
    createOrder,
    getOrderById,
    getOrders,
    getOrderReceipt,
} from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, getOrders)
    .post(protect, createOrder);

router.route('/:id')
    .get(protect, getOrderById);

router.get('/:id/receipt', protect, getOrderReceipt);

export default router;
