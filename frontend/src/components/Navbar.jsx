import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Map, User, LogIn, LogOut, ChevronDown, Menu, X, Calendar, BookmarkCheck, UserCircle, LayoutDashboard } from 'lucide-react';
import '../App.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isHome = location.pathname === '/';
  
  // Check if user is logged in and their role
  const isAuthenticated = !!localStorage.getItem('token');
  const userRole = localStorage.getItem('userRole') || 'user';
  const userName = localStorage.getItem('userName') || 'User';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
    setDropdownOpen(false);
  };

  const navbarClass = `navbar ${scrolled || !isHome ? 'scrolled' : ''}`;
  const textClass = scrolled || !isHome ? 'var(--text-main)' : 'white';

  return (
    <nav className={navbarClass}>
      <div className="container nav-container">
        <Link to="/" className="logo" style={{ color: scrolled || !isHome ? 'var(--primary)' : 'white' }}>
          <Map size={32} />
          <span>TravelGO</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-links hidden md:flex items-center gap-1">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} style={{ color: textClass }}>
            Home
          </Link>
          <Link to="/destinations" className={`nav-link ${location.pathname === '/destinations' ? 'active' : ''}`} style={{ color: textClass }}>
            Browse
          </Link>
          <Link to="/guides" className={`nav-link ${location.pathname === '/guides' ? 'active' : ''}`} style={{ color: textClass }}>
            Tour Guides
          </Link>
          <Link to="/contact" className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`} style={{ color: textClass }}>
            Contact Us
          </Link>
          
          {isAuthenticated ? (
            <div className="relative ml-4">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl transition-all hover:bg-white/10"
                style={{ color: textClass }}
              >
                <UserCircle size={20} />
                <span className="font-medium">{userName}</span>
                <ChevronDown size={16} className={`transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-neutral-100 overflow-hidden z-50">
                  <div className="p-3 border-b border-neutral-100 bg-neutral-50">
                    <p className="text-sm font-semibold text-neutral-900">{userName}</p>
                    <p className="text-xs text-neutral-500 capitalize">{userRole}</p>
                  </div>
                  <div className="p-2">
                    <Link 
                      to="/itinerary" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <Calendar size={18} />
                      <span className="font-medium">My Itineraries</span>
                    </Link>
                    <Link 
                      to="/bookings" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <BookmarkCheck size={18} />
                      <span className="font-medium">My Bookings</span>
                    </Link>
                    <Link 
                      to="/profile" 
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
                    >
                      <User size={18} />
                      <span className="font-medium">Profile</span>
                    </Link>
                    {userRole === 'admin' && (
                      <Link 
                        to="/admin" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100 transition-colors"
                      >
                        <LayoutDashboard size={18} />
                        <span className="font-medium">Admin Dashboard</span>
                      </Link>
                    )}
                  </div>
                  <div className="p-2 border-t border-neutral-100">
                    <button 
                      onClick={handleLogout}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors w-full"
                    >
                      <LogOut size={18} />
                      <span className="font-medium">Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2 ml-4">
              <Link to="/login" className="btn glass" style={{ color: textClass, borderColor: scrolled || !isHome ? 'var(--border-color)' : 'rgba(255,255,255,0.4)', background: scrolled || !isHome ? 'rgba(240,240,240,0.5)' : 'rgba(255,255,255,0.2)' }}>
                <LogIn size={18} />
                Log In
              </Link>
              <Link to="/register" className="btn btn-primary">
                <User size={18} />
                Sign Up
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg transition-colors"
          style={{ color: textClass }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-neutral-100 z-50">
          <div className="container py-4 space-y-2">
            <Link 
              to="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl ${location.pathname === '/' ? 'bg-teal-50 text-teal-700' : 'text-neutral-700 hover:bg-neutral-100'}`}
            >
              Home
            </Link>
            <Link 
              to="/destinations" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl ${location.pathname === '/destinations' ? 'bg-teal-50 text-teal-700' : 'text-neutral-700 hover:bg-neutral-100'}`}
            >
              Browse
            </Link>
            <Link 
              to="/guides" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl ${location.pathname === '/guides' ? 'bg-teal-50 text-teal-700' : 'text-neutral-700 hover:bg-neutral-100'}`}
            >
              Tour Guides
            </Link>
            <Link 
              to="/contact" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-4 py-3 rounded-xl ${location.pathname === '/contact' ? 'bg-teal-50 text-teal-700' : 'text-neutral-700 hover:bg-neutral-100'}`}
            >
              Contact Us
            </Link>
            
            {isAuthenticated ? (
              <>
                <div className="border-t border-neutral-100 pt-2 mt-2">
                  <p className="px-4 py-2 text-sm font-semibold text-neutral-900">{userName}</p>
                  <Link 
                    to="/itinerary" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100"
                  >
                    <Calendar size={18} />
                    My Itineraries
                  </Link>
                  <Link 
                    to="/bookings" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100"
                  >
                    <BookmarkCheck size={18} />
                    My Bookings
                  </Link>
                  <Link 
                    to="/profile" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100"
                  >
                    <User size={18} />
                    Profile
                  </Link>
                  {userRole === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-neutral-700 hover:bg-neutral-100"
                    >
                      <LayoutDashboard size={18} />
                      Admin Dashboard
                    </Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 w-full"
                  >
                    <LogOut size={18} />
                    Log Out
                  </button>
                </div>
              </>
            ) : (
              <div className="border-t border-neutral-100 pt-2 mt-2 flex gap-2">
                <Link 
                  to="/login" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100"
                >
                  <LogIn size={18} />
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-teal-600 text-white hover:bg-teal-700"
                >
                  <User size={18} />
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
