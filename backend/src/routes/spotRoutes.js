import { Router } from 'express';
import {
  getAllSpots,
  getTrendingSpots,
  getSpotById,
  createSpot,
  updateSpot,
  deleteSpot,
} from '../controllers/spotController.js';
import { createReview } from '../controllers/reviewController.js';
import { saveSpot, unsaveSpot } from '../controllers/savedController.js';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

// Trending must come before /:id so "trending" is not treated as an id
router.get('/trending', getTrendingSpots);
router.get('/', getAllSpots);
router.get('/:id', optionalAuth, getSpotById);
router.post('/', requireAuth, createSpot);
router.put('/:id', requireAuth, updateSpot);
router.delete('/:id', requireAuth, deleteSpot);

router.post('/:id/reviews', requireAuth, createReview);
router.post('/:id/save', requireAuth, saveSpot);
router.delete('/:id/save', requireAuth, unsaveSpot);

export default router;
