import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BookmarkCheck, Calendar, MapPin, DollarSign, ArrowRight, Clock } from 'lucide-react';

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMyBookings = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/my-bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });

        if (!response.ok) {
          if (response.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch your bookings');
        }

        const data = await response.json();
        setBookings(data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading bookings');
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [navigate]);

  if (loading) {
    return (
      <div className="loading-spinner-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Fetching your travel reservations...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingTop: '110px', paddingBottom: '80px', minHeight: '90vh' }}>
      <div className="container">
        
        <div style={{ marginBottom: '36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <BookmarkCheck size={16} /> Verified Reservations
          </div>
          <h1 className="section-title">My Travel <span className="text-gradient">Bookings</span></h1>
          <p className="section-subtitle">Review and manage all your confirmed trip reservations across Bangladesh.</p>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', padding: '16px', borderRadius: 'var(--border-radius)', marginBottom: '24px' }}>
            {error}
          </div>
        )}

        {bookings.length === 0 ? (
          <div className="bg-neutral-50 p-12 rounded-3xl border border-dashed border-neutral-200 text-center flex flex-col items-center">
            <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mb-6">
              <BookmarkCheck size={36} className="text-teal-600" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-900 mb-3">No reservations found</h3>
            <p className="text-neutral-500 max-w-md mx-auto mb-8 leading-relaxed">
              You haven't booked any travel packages yet. Explore our top destinations and start planning your escape!
            </p>
            <Link to="/destinations" className="flex items-center gap-2 px-6 py-3 bg-teal-600 text-white font-bold rounded-xl hover:bg-teal-700 transition-colors shadow-sm">
              Explore Destinations <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', minWidth: '700px' }}>
                <thead>
                  <tr style={{ background: 'rgba(240, 240, 240, 0.5)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <th style={{ padding: '18px 24px' }}>Booking ID</th>
                    <th style={{ padding: '18px 24px' }}>Destination</th>
                    <th style={{ padding: '18px 24px' }}>Travel Dates</th>
                    <th style={{ padding: '18px 24px' }}>Total Amount</th>
                    <th style={{ padding: '18px 24px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => {
                    const placeName = booking.place?.name || 'Destination';
                    const placeId = booking.place?._id || booking.place;
                    const bookingId = booking._id ? `#${booking._id.slice(-6).toUpperCase()}` : '#BOOKING';
                    
                    return (
                      <tr key={booking._id} style={{ borderBottom: '1px solid var(--border-color)', transition: 'background 0.2s' }} className="table-row-hover">
                        <td style={{ padding: '18px 24px', fontWeight: 600, color: 'var(--text-main)', fontSize: '0.9rem' }}>
                          {bookingId}
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={16} color="var(--primary)" />
                            <Link to={`/destinations/${placeId}`} style={{ fontWeight: 600, color: 'var(--text-main)', textDecoration: 'none' }} className="hover-underline">
                              {placeName}
                            </Link>
                          </div>
                        </td>
                        <td style={{ padding: '18px 24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Calendar size={15} />
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                        </td>
                        <td style={{ padding: '18px 24px', fontWeight: 700, color: 'var(--primary)', fontSize: '1.05rem' }}>
                          ${booking.totalPrice}
                        </td>
                        <td style={{ padding: '18px 24px' }}>
                          {(() => {
                            const statusStr = (booking.status || 'Confirmed').toLowerCase();
                            const isPending = statusStr.includes('pending');
                            const badgeBg = isPending ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)';
                            const badgeColor = isPending ? '#d97706' : '#059669';
                            return (
                              <span style={{ 
                                padding: '6px 14px', 
                                borderRadius: '20px', 
                                background: badgeBg, 
                                color: badgeColor, 
                                fontSize: '0.82rem', 
                                fontWeight: 700, 
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                textTransform: 'capitalize'
                              }}>
                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: badgeColor }}></span>
                                {booking.status || 'Confirmed'}
                              </span>
                            );
                          })()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
