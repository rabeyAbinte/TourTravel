import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { authMiddleware, adminMiddleware } from './middleware/authMiddleware.js';

import authRoutes from './routes/auth.js';
import placeRoutes from './routes/places.js';
import bookingRoutes from './routes/bookings.js';
import reviewRoutes from './routes/reviews.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Dynamic Inline Schemas and Routes for Contact and Custom Trip
const ContactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  subject: { type: String },
  message: { type: String, required: true }
}, { timestamps: true });

const Contact = mongoose.model('Contact', ContactSchema);

const CustomTripSchema = new mongoose.Schema({
  destination: { type: String, required: true },
  budget: { type: Number, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  guests: { type: Number, required: true },
  notes: { type: String }
}, { timestamps: true });

const CustomTrip = mongoose.model('CustomTrip', CustomTripSchema);

// Routes
app.use("/api/auth", authRoutes);
app.use("/places", placeRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

// Contact API Route
app.post("/api/contact", async (req, res) => {
  try {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json({ success: true, message: "Contact message saved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get all contacts (Admin only)
app.get("/api/contact", authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Custom Trip API Route
app.post("/api/custom-trip", async (req, res) => {
  try {
    const newTrip = new CustomTrip(req.body);
    await newTrip.save();
    res.status(201).json({ success: true, message: "Custom trip request saved successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Root API
app.get("/", (req, res) => {
  res.send("Backend is running...");
});

console.log("Attempting to connect to MongoDB...");
mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/tour-travel")
  .then(async () => {
    console.log('MongoDB connected successfully');
    
    // Create default admin user if not exists
    const adminEmail = 'myadmin@travel.com';
    const adminPassword = 'admin123';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(adminPassword, salt);
      
      const adminUser = new User({
        name: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin'
      });
      
      await adminUser.save();
      console.log('Default admin user created:');
      console.log('Email: admin@travel.com');
      console.log('Password: admin123');
    } else {
      console.log('Admin user already exists');
    }
    
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });
