import { Router } from 'express';
import { getAll, getById, create, remove, updateStatus } from './deliveries.controller.js';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.post('/', create);
router.get('/:id', getById);
router.put('/:id/status', updateStatus);
router.delete('/:id', remove);

export default router;
