import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, User, LogIn } from 'lucide-react';
import '../App.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navbarClass = `navbar ${scrolled || !isHome ? 'scrolled' : ''}`;
  const textClass = scrolled || !isHome ? 'var(--text-main)' : 'white';

  return (
    <nav className={navbarClass}>
      <div className="container nav-container">
        <Link to="/" className="logo" style={{ color: scrolled || !isHome ? 'var(--primary)' : 'white' }}>
          <Map size={32} />
          <span>TravelGO</span>
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link" style={{ color: textClass }}>Browse</Link>
          <Link to="/itinerary" className="nav-link" style={{ color: textClass }}>Itineraries</Link>
          <Link to="/login" className="btn glass" style={{ color: textClass, borderColor: scrolled || !isHome ? 'var(--border-color)' : 'rgba(255,255,255,0.4)', background: scrolled || !isHome ? 'rgba(240,240,240,0.5)' : 'rgba(255,255,255,0.2)' }}>
            <LogIn size={20} />
            Log In
          </Link>
          <Link to="/register" className="btn btn-primary">
            <User size={20} />
            Sign Up
          </Link>
        </div>
      </div>
    </nav>
  );
}
