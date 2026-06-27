
import express from 'express';
import {
    getUsers,
    createUser,
    updateUserStatus,
    deleteUser,
} from '../controllers/userController.js';
import { protect, authorize } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
    .get(protect, authorize('admin'), getUsers)
    .post(protect, authorize('admin'), createUser);

router.route('/:id')
    .patch(protect, authorize('admin'), updateUserStatus)
    .delete(protect, authorize('admin'), deleteUser);

export default router;
