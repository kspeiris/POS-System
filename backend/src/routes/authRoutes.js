
import express from 'express';
import { login, getMe, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = express.Router();

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/me', protect, upload.single('profilePic'), updateProfile);

export default router;
