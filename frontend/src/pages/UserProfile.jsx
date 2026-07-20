import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { User, MapPin, Calendar, Star, Settings, LogOut, Mail, Phone, Edit, BookmarkCheck, MessageSquare, Shield } from 'lucide-react';

export default function UserProfile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState({});
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        // Fetch user profile
        const userResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });

        if (!userResponse.ok) {
          if (userResponse.status === 401) {
            localStorage.removeItem('token');
            navigate('/login');
            return;
          }
          throw new Error('Failed to fetch profile');
        }

        const userData = await userResponse.json();
        setUser(userData);
        setEditedUser(userData);

        // Fetch bookings
        const bookingsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings/my-bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        }

        // Fetch user reviews
        const reviewsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews/user/my-reviews`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });

        if (reviewsResponse.ok) {
          const reviewsData = await reviewsResponse.json();
          setReviews(reviewsData);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  const handleEdit = () => {
    setIsEditing(true);
    setSaveMessage('');
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedUser(user);
    setSaveMessage('');
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedUser)
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditedUser(updatedUser);
        setIsEditing(false);
        setSaveMessage('Profile updated successfully!');
        localStorage.setItem('userName', updatedUser.name || '');
        setTimeout(() => setSaveMessage(''), 3000);
      } else {
        setSaveMessage('Failed to update profile');
      }
    } catch (err) {
      setSaveMessage('Error updating profile');
    }
  };

  const handleInputChange = (e) => {
    setEditedUser({ ...editedUser, [e.target.name]: e.target.value });
  };

  if (loading) {
    return (
      <div className="loading-spinner-container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner"></div>
        <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingTop: '110px', paddingBottom: '80px', minHeight: '90vh' }}>
      <div className="container">
        {/* Profile Header */}
        <div style={{ marginBottom: '40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <User size={16} /> User Profile
          </div>
          <h1 className="section-title">Welcome, <span className="text-gradient">{user?.name || 'Traveler'}</span></h1>
          <p className="section-subtitle">Manage your travel profile, bookings, and preferences.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '32px' }}>
          {/* Sidebar */}
          <div style={{ background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', padding: '24px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', height: 'fit-content' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <button
                onClick={() => setActiveTab('profile')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  background: activeTab === 'profile' ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                  color: activeTab === 'profile' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'profile' ? 600 : 400,
                  transition: 'var(--transition)'
                }}
              >
                <User size={18} /> Profile Info
              </button>
              <button
                onClick={() => setActiveTab('bookings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  background: activeTab === 'bookings' ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                  color: activeTab === 'bookings' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'bookings' ? 600 : 400,
                  transition: 'var(--transition)'
                }}
              >
                <BookmarkCheck size={18} /> My Bookings
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  background: activeTab === 'reviews' ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                  color: activeTab === 'reviews' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'reviews' ? 600 : 400,
                  transition: 'var(--transition)'
                }}
              >
                <MessageSquare size={18} /> My Reviews
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  background: activeTab === 'settings' ? 'rgba(13, 148, 136, 0.1)' : 'transparent',
                  color: activeTab === 'settings' ? 'var(--primary)' : 'var(--text-muted)',
                  cursor: 'pointer',
                  fontWeight: activeTab === 'settings' ? 600 : 400,
                  transition: 'var(--transition)'
                }}
              >
                <Settings size={18} /> Settings
              </button>
            </div>

            <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid var(--border-color)' }}>
              <button
                onClick={handleLogout}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: 'var(--border-radius-sm)',
                  border: 'none',
                  background: 'rgba(239, 68, 68, 0.1)',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontWeight: 600,
                  transition: 'var(--transition)',
                  width: '100%'
                }}
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div>
            {activeTab === 'profile' && (
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Profile Information</h2>
                  {saveMessage && (
                    <span style={{ color: saveMessage.includes('success') ? '#059669' : '#dc2626', fontSize: '0.9rem', fontWeight: 600 }}>
                      {saveMessage}
                    </span>
                  )}
                  {!isEditing ? (
                    <button onClick={handleEdit} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface)', cursor: 'pointer', fontWeight: 500 }}>
                      <Edit size={16} /> Edit
                    </button>
                  ) : (
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button onClick={handleCancel} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface)', cursor: 'pointer', fontWeight: 500 }}>
                        Cancel
                      </button>
                      <button onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 16px', borderRadius: 'var(--border-radius-sm)', border: 'none', background: 'var(--primary)', color: 'white', cursor: 'pointer', fontWeight: 600 }}>
                        Save
                      </button>
                    </div>
                  )}
                </div>

                <div style={{ display: 'grid', gap: '24px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: 'rgba(13, 148, 136, 0.05)', borderRadius: 'var(--border-radius)' }}>
                    <div style={{ width: '60px', height: '60px', background: 'var(--primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '1.5rem', fontWeight: 700 }}>
                      {editedUser?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="name"
                        value={editedUser?.name || ''}
                        onChange={handleInputChange}
                        style={{ padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontSize: '1.1rem', fontWeight: 600 }}
                      />
                    ) : (
                      <div>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '4px' }}>{user?.name || 'User'}</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{user?.email || 'user@example.com'}</p>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                    <div style={{ padding: '20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                        <Mail size={16} /> Email
                      </div>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={editedUser?.email || ''}
                          onChange={handleInputChange}
                          style={{ padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontSize: '1rem', fontWeight: 600, width: '100%' }}
                        />
                      ) : (
                        <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.email || 'Not provided'}</p>
                      )}
                    </div>
                    <div style={{ padding: '20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                        <Phone size={16} /> Phone
                      </div>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={editedUser?.phone || ''}
                          onChange={handleInputChange}
                          placeholder="Enter phone number"
                          style={{ padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontSize: '1rem', fontWeight: 600, width: '100%' }}
                        />
                      ) : (
                        <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.phone || 'Not provided'}</p>
                      )}
                    </div>
                  </div>

                  <div style={{ padding: '20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '8px' }}>
                      <MapPin size={16} /> Location
                    </div>
                    {isEditing ? (
                      <input
                        type="text"
                        name="location"
                        value={editedUser?.location || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your location"
                        style={{ padding: '8px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', fontSize: '1rem', fontWeight: 600, width: '100%' }}
                      />
                    ) : (
                      <p style={{ fontWeight: 600, fontSize: '1rem' }}>{user?.location || 'Bangladesh'}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'bookings' && (
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>My Bookings</h2>
                  <Link to="/bookings" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                    View All <MapPin size={16} />
                  </Link>
                </div>

                {bookings.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)' }}>
                    <BookmarkCheck size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No bookings yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {bookings.slice(0, 3).map((booking) => (
                      <div key={booking._id} style={{ padding: '20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <h3 style={{ fontWeight: 600, marginBottom: '4px' }}>{booking.place?.name || 'Destination'}</h3>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                            <Calendar size={14} />
                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '1.1rem' }}>৳{booking.totalPrice}</p>
                          <span style={{ fontSize: '0.85rem', color: '#059669', fontWeight: 600 }}>{booking.status || 'Confirmed'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>My Reviews</h2>
                {reviews.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '60px 20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)' }}>
                    <MessageSquare size={48} color="var(--primary)" style={{ marginBottom: '16px' }} />
                    <p style={{ color: 'var(--text-muted)' }}>No reviews yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gap: '16px' }}>
                    {reviews.map((review) => (
                      <div key={review._id} style={{ padding: '20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                          <h3 style={{ fontWeight: 600 }}>{review.place?.name || 'Unknown Destination'}</h3>
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} color={i < review.rating ? '#f59e0b' : '#cbd5e1'} fill={i < review.rating ? '#f59e0b' : 'none'} />
                            ))}
                          </div>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: 1.6 }}>{review.comment}</p>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginTop: '8px' }}>
                          {new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'settings' && (
              <div style={{ background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', padding: '32px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '24px' }}>Account Settings</h2>
                <div style={{ display: 'grid', gap: '16px' }}>
                  <div style={{ padding: '20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Mail size={20} color="var(--primary)" />
                      <div>
                        <h3 style={{ fontWeight: 600 }}>Email Notifications</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Receive booking updates</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setEmailNotifications(!emailNotifications)}
                      style={{ width: '48px', height: '24px', background: emailNotifications ? 'var(--primary)' : '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
                    >
                      <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: emailNotifications ? '2px' : 'auto', left: emailNotifications ? 'auto' : '2px', top: '2px', transition: 'all 0.3s' }}></div>
                    </div>
                  </div>
                  <div style={{ padding: '20px', background: 'rgba(240, 240, 240, 0.3)', borderRadius: 'var(--border-radius)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <Shield size={20} color="var(--primary)" />
                      <div>
                        <h3 style={{ fontWeight: 600 }}>Two-Factor Authentication</h3>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Add extra security</p>
                      </div>
                    </div>
                    <div 
                      onClick={() => setTwoFactorAuth(!twoFactorAuth)}
                      style={{ width: '48px', height: '24px', background: twoFactorAuth ? 'var(--primary)' : '#cbd5e1', borderRadius: '12px', position: 'relative', cursor: 'pointer', transition: 'background 0.3s' }}
                    >
                      <div style={{ width: '20px', height: '20px', background: 'white', borderRadius: '50%', position: 'absolute', right: twoFactorAuth ? '2px' : 'auto', left: twoFactorAuth ? 'auto' : '2px', top: '2px', transition: 'all 0.3s' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
