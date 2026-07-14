import express from 'express';
import { createReview, getReviewsByPlace, getReviewsByUser } from '../controllers/reviewController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/user/my-reviews', authMiddleware, getReviewsByUser);
router.get('/:placeId', getReviewsByPlace);

export default router;
