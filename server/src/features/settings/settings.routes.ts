import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import { getPricesHandler, updatePricesHandler } from './settings.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/prices', getPricesHandler);
router.put('/prices', updatePricesHandler);

export default router;
