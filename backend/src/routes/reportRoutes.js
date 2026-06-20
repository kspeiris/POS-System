
import express from 'express';
import { getDailyReport } from '../controllers/orderController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.get('/daily', protect, authorize('admin'), getDailyReport);

export default router;
