import { Router } from 'express';
import { summary, evolution, insights, debt, debtTrend, revenueReal } from './metrics.controller.js';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/summary', summary);
router.get('/evolution', evolution);
router.get('/insights', insights);
router.get('/debt', debt);
router.get('/debt/trend', debtTrend);
router.get('/revenue-real', revenueReal);

export default router;
