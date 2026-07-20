import Review from '../models/Review.js';
import Place from '../models/Place.js';

export const createReview = async (req, res) => {
  try {
    const { place, rating, comment } = req.body;
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User authorization missing" });
    }

    // Find actual place ObjectId if place string was passed
    let placeObjId = place;
    if (typeof place === 'string' && place.length !== 24) {
      const foundPlace = await Place.findOne({ 
        $or: [{ name: new RegExp(place, 'i') }, { id: Number(place) || -1 }] 
      });
      if (foundPlace) {
        placeObjId = foundPlace._id;
      }
    }

    const newReview = new Review({
      user: userId,
      place: placeObjId,
      rating: Number(rating),
      comment
    });

    const savedReview = await newReview.save();
    const populatedReview = await Review.findById(savedReview._id).populate('user', 'name');
    res.status(201).json(populatedReview);
  } catch (err) {
    res.status(500).json({ message: "Failed to create review", error: err.message });
  }
};

export const getReviewsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    let targetPlaceId = placeId;

    if (typeof placeId === 'string' && placeId.length !== 24) {
      const foundPlace = await Place.findOne({ 
        $or: [{ name: new RegExp(placeId, 'i') }, { id: Number(placeId) || -1 }] 
      });
      if (foundPlace) {
        targetPlaceId = foundPlace._id;
      }
    }

    const reviews = await Review.find({ place: targetPlaceId, status: 'approved' }).populate('user', 'name').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

export const getReviewsByUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    console.log('Fetching reviews for user:', userId);
    const reviews = await Review.find({ user: userId }).populate('place', 'name').sort({ createdAt: -1 });
    console.log('Found reviews:', reviews);
    res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ message: "Failed to fetch user reviews", error: err.message });
  }
};

export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find().populate('user', 'name').populate('place', 'name').sort({ createdAt: -1 });
    res.status(200).json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch reviews", error: err.message });
  }
};

export const updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: "Review not found" });

    review.status = status;
    const updatedReview = await review.save();
    const populated = await Review.findById(updatedReview._id).populate('user', 'name').populate('place', 'name');
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: "Failed to update review", error: err.message });
  }
};
