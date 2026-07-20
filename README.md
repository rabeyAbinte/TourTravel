# TravelGO - MERN Travel Guide & Booking System 🌍✈️

A modern, full-stack travel and tourism platform built with the MERN stack (MongoDB, Express, React, Node.js). 

## 📋 Project Overview
TravelGO is an interactive travel application that allows users to:
- **Explore Destinations:** Discover beautiful places across Bangladesh (like Sajek, Cox's Bazar, Sylhet) with detailed information and stunning photo galleries.
- **Book Trips:** Select check-in/check-out dates, number of guests, and reserve your trip seamlessly.
- **Reviews & Ratings:** Share your travel experiences and read reviews from other travelers.
- **Tour Guides:** Find and connect with professional tour guides.

## 🎯 Features
### Core Features
- **Destination Catalog** - View places with descriptions, itineraries, amenities, and dynamic pricing.
- **Booking System** - Dynamic price calculation based on days and guests, integrated with a booking dashboard.
- **User Authentication** - Secure Login/Signup system using JWT.
- **Interactive UI** - Beautiful animations (Framer Motion), modern icons (Lucide React), and fully responsive design (Tailwind CSS).
- **User Dashboard** - Manage "My Bookings", "My Itineraries", and user profiles.

### Tech Stack
- **Frontend:** React, Vite, React Router, Tailwind CSS, Framer Motion
- **Backend:** Node.js, Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)

## 📁 Project Structure
```
travel-guide-system/
├── backend/                   # Backend (Node.js + Express)
│   ├── controllers/           # Request handlers (auth, booking, reviews)
│   ├── models/                # Database schemas (User, Place, Booking, Review)
│   ├── routes/                # API endpoints
│   ├── server.js              # Express server entry point
│   ├── package.json
│   └── .env                   # Environment variables (Not in repo)
│
├── frontend/                  # Frontend (React + Vite)
│   ├── public/                # Static files and images
│   ├── src/
│   │   ├── components/        # Reusable components (Navbar, DestinationCard)
│   │   ├── pages/             # Pages (Home, DestinationDetails, Login, MyBookings)
│   │   ├── App.jsx            # Main App component & Routing
│   │   ├── App.css            # Global styling
│   │   └── main.jsx           # React entry point
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md                  # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rabeyAbinte/TourTravel.git
   cd travel-guide-system
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Setup Environment Variables**
   Create a `.env` file in the `backend` directory:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

### Running the Application

**Terminal 1 - Start Backend Server:**
```bash
cd backend
npm run dev
```
*The server will run on http://localhost:5000*

**Terminal 2 - Start Frontend Server:**
```bash
cd frontend
npm run dev
```
*The client will run on http://localhost:5173*

## 🎨 UI & Design
- **Hero Section:** Engaging landing page with destination search.
- **Destination Details:** Sticky booking card, full-screen image gallery, and interactive star rating system.
- **Dashboards:** Clean and organized views for managing user itineraries and bookings.

## 🤝 Contributing
Feel free to fork this project and submit pull requests for any improvements!

## 📄 License
This project is open source and available under the MIT License.

---
*Happy Traveling!* 🧳✨
