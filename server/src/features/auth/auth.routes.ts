import { Router } from 'express';
import { register, login, logout, getMe } from './auth.controller.js';
import { requireAuth, requireAdmin } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.post('/register', requireAuth, requireAdmin, register);
router.post('/sign-up', requireAuth, requireAdmin, register);
router.post('/sign-in', login);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
