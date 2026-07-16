import { Router } from 'express';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';
import { getAll, getById, create, update, remove, getBalance } from './clients.controller.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.post('/', create);
router.get('/:id/balance', getBalance);
router.get('/:id', getById);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
