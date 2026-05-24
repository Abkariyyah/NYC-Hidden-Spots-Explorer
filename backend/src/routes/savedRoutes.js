import { Router } from 'express';
import { getSavedSpots } from '../controllers/savedController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', requireAuth, getSavedSpots);

export default router;
