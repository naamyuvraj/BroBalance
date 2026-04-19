import { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware.js';
import UserController from './user.controller.js';

const router = Router();

router.get('/me', authMiddleware, UserController.getMe);
router.put('/me', authMiddleware, UserController.updateMe);

export default router;
