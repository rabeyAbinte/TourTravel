import Booking from '../models/Booking.js';

export const createBooking = async (req, res) => {
  try {
    const { place, startDate, endDate, totalPrice } = req.body;
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ msg: "User ID missing from token payload", message: "User ID missing from token payload" });
    }
    
    console.log('Creating booking with:', { userId, place, startDate, endDate, totalPrice });
    
    const newBooking = new Booking({
      user: userId,
      place,
      startDate,
      endDate,
      totalPrice,
      paymentMethod: req.body.paymentMethod || 'Card',
      status: 'Confirmed'
    });
    const savedBooking = await newBooking.save();
    console.log('Booking saved:', savedBooking);
    res.status(201).json(savedBooking);
  } catch (err) {
    console.error('Booking creation error:', err);
    res.status(500).json({ message: "Failed to create booking", error: err.message, msg: err.message });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    console.log('Fetching bookings for user:', userId);
    const bookings = await Booking.find({ user: userId }).populate('place');
    console.log('Found bookings:', bookings);
    res.status(200).json(bookings);
  } catch (err) {
    console.error('Error fetching bookings:', err);
    res.status(500).json({ message: "Failed to fetch bookings", error: err.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('user', 'name email').populate('place', 'name');
    res.status(200).json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch all bookings", error: err.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    booking.status = status;
    await booking.save();
    res.status(200).json(booking);
  } catch (err) {
    res.status(500).json({ message: "Failed to update booking status", error: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    await Booking.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete booking", error: err.message });
  }
};

export const requestRefund = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    
    // Ensure the booking belongs to the user
    const userId = req.user?._id || req.user?.id;
    if (booking.user.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    booking.refundRequested = true;
    await booking.save();
    res.status(200).json({ message: "Refund requested successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to request refund", error: err.message });
  }
};

export const processRefund = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    booking.refundRequested = false;
    booking.status = 'Cancelled';
    await booking.save();
    res.status(200).json({ message: "Refund processed successfully", booking });
  } catch (err) {
    res.status(500).json({ message: "Failed to process refund", error: err.message });
  }
};
