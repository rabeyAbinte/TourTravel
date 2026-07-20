import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import DestinationDetails from './pages/DestinationDetails';
import Login from './pages/Login';
import Register from './pages/Register';
import Itinerary from './pages/Itinerary';
import MyBookings from './pages/MyBookings';
import TourGuides from './pages/TourGuides';
import CustomTrip from './pages/CustomTrip';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="app-layout">
      {!isAdminRoute && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/destinations/:id" element={<DestinationDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/itinerary" element={<Itinerary />} />
          <Route path="/bookings" element={<MyBookings />} />
          <Route path="/guides" element={<TourGuides />} />
          <Route path="/custom-trip" element={<CustomTrip />} />
          <Route path="/contact" element={<Contact />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;