import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Destinations from './pages/Destinations';
import Login from './pages/Login';
import Register from './pages/Register';
import './App.css';

function App() {
  return (
    <div className="app-layout">
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/itinerary" element={<div className="container" style={{paddingTop: '120px', paddingBottom: '80px', textAlign: 'center'}}><h2>Itinerary System Coming Soon</h2><p>Here you will be able to manage your trips!</p></div>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;