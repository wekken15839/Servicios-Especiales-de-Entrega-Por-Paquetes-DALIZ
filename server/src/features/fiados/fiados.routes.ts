import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import { registerPaymentHandler } from './fiados.controller.js';

const router = Router();

router.use(requireAuth);

router.post('/payment', registerPaymentHandler);

export default router;
