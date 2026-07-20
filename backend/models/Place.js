import mongoose from 'mongoose';

const PlaceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Bangladesh'
  },
  description: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  gallery: [{
    type: String
  }],
  rating: {
    type: Number,
    default: 0
  },
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    enum: ['International', 'Domestic', 'Honeymoon', 'Adventure'],
    default: 'Domestic'
  },
  seatLimit: {
    type: Number,
    default: 20
  }
}, { timestamps: true });

export default mongoose.model("Place", PlaceSchema);
