import express from 'express';
import { getPlaces, createPlace, updatePlace, deletePlace } from '../controllers/placeController.js';
import { authMiddleware, adminMiddleware } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route   GET /places
// @desc    Get all travel destinations
// @access  Public
router.get("/", getPlaces);

// @route   POST /places
// @desc    Create a new place
// @access  Private/Admin
router.post("/", authMiddleware, adminMiddleware, createPlace);

// @route   PUT /places/:id
// @desc    Update a place
// @access  Private/Admin
router.put("/:id", authMiddleware, adminMiddleware, updatePlace);

// @route   DELETE /places/:id
// @desc    Delete a place
// @access  Private/Admin
router.delete("/:id", authMiddleware, adminMiddleware, deletePlace);

export default router;
