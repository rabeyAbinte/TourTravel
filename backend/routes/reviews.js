import express from 'express';
import { createReview, getReviewsByPlace, getReviewsByUser, getAllReviews, updateReviewStatus } from '../controllers/reviewController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createReview);
router.get('/user/my-reviews', authMiddleware, getReviewsByUser);
router.get('/:placeId', getReviewsByPlace);
router.get('/', authMiddleware, adminMiddleware, getAllReviews);
router.put('/:id/status', authMiddleware, adminMiddleware, updateReviewStatus);

export default router;
