import express from 'express';
import { createBooking, getBookingsByUser, getAllBookings, updateBookingStatus, deleteBooking } from '../controllers/bookingController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, createBooking);
router.get('/my-bookings', authMiddleware, getBookingsByUser);
router.get('/', authMiddleware, adminMiddleware, getAllBookings);
router.put('/:id/status', authMiddleware, adminMiddleware, updateBookingStatus);
router.delete('/:id', authMiddleware, adminMiddleware, deleteBooking);

export default router;
