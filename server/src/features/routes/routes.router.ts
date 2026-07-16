import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  start,
  pause,
  resume,
  markVisited,
  complete,
  getAnalysis,
  updateNotes,
  updateWaypointNotes,
} from './routes.controller.js';
import { requireAuth } from '../../shared/middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

router.get('/', getAll);
router.get('/:id', getById);
router.get('/:id/analysis', getAnalysis);
router.post('/', create);
router.put('/:id/start', start);
router.put('/:id/pause', pause);
router.put('/:id/resume', resume);
router.put('/:id/complete', complete);
router.put('/:id/waypoints/:deliveryId/visit', markVisited);
router.put('/:id/waypoints/:deliveryId/notes', updateWaypointNotes);
router.put('/:id/notes', updateNotes);

export default router;
