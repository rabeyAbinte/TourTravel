import mongoose from 'mongoose';

const ItinerarySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  destinations: [{
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place'
    },
    date: Date,
    notes: String
  }],
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, { timestamps: true });

export default mongoose.model('Itinerary', ItinerarySchema);
