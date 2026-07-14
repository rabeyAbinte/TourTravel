import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Calendar, DollarSign, TrendingUp, Settings, Plus, Edit, Trash2, BarChart3, Package } from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user has admin role
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }

    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
     
      try {
        // Fetch bookings
        const bookingsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });

        if (bookingsResponse.ok) {
          const bookingsData = await bookingsResponse.json();
          setBookings(bookingsData);
        }

        // Fetch destinations
        const destinationsResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/places`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });

        if (destinationsResponse.ok) {
          const destinationsData = await destinationsResponse.json();
          setDestinations(destinationsData);
        }

        // Fetch users
        const usersResponse = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/users`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'x-auth-token': token
          }
        });

        if (usersResponse.ok) {
          const usersData = await usersResponse.json();
          setUsers(usersData);
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleAddDestination = async () => {
    const name = window.prompt("Enter destination name:");
    if (!name) return;
    const location = window.prompt("Enter location:");
    const description = window.prompt("Enter description:");
    const price = window.prompt("Enter price:");
    
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/places`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({ name, location, description, price })
      });
      if (res.ok) {
        const newDest = await res.json();
        setDestinations([...destinations, newDest]);
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to add destination: ${errData.msg || errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  };

  const handleEditDestination = async (destination) => {
    const name = window.prompt("Enter new name:", destination.name);
    if (!name) return;
    const location = window.prompt("Enter new location:", destination.location);
    const description = window.prompt("Enter new description:", destination.description);
    const price = window.prompt("Enter new price:", destination.price);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/places/${destination._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({ name, location, description, price })
      });
      if (res.ok) {
        const updatedDest = await res.json();
        setDestinations(destinations.map(d => d._id === destination._id ? updatedDest : d));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to update destination: ${errData.msg || errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm("Are you sure you want to delete this destination?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/places/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });
      if (res.ok) {
        setDestinations(destinations.filter(d => d._id !== id));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to delete destination: ${errData.msg || errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  };

  const handleEditUserRole = async (user) => {
    const role = window.prompt("Enter new role (admin/user):", user.role || 'user');
    if (!role || (role !== 'admin' && role !== 'user')) return alert("Invalid role");
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/auth/users/${user._id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({ role })
      });
      if (res.ok) {
        const updatedUser = await res.json();
        setUsers(users.map(u => u._id === user._id ? updatedUser : u));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to update user role: ${errData.msg || errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  };

  const handleUpdateBookingStatus = async (booking) => {
    const status = window.prompt("Enter new status (Confirmed/Pending/Cancelled):", booking.status);
    if (!status) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${booking._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updatedBooking = await res.json();
        setBookings(bookings.map(b => b._id === booking._id ? updatedBooking : b));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to update booking status: ${errData.msg || errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteBooking = async (id) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        }
      });
      if (res.ok) {
        setBookings(bookings.filter(b => b._id !== id));
      } else {
        const errData = await res.json().catch(() => ({}));
        alert(`Failed to delete booking: ${errData.msg || errData.message || res.statusText}`);
      }
    } catch (err) {
      console.error(err);
      alert('Error: ' + err.message);
    }
  };

  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalPrice || 0), 0);
  const totalBookings = bookings.length;
  const totalDestinations = destinations.length;
  const totalUsers = users.length;

  if (loading) {
    return <div style={{ padding: '100px', textAlign: 'center' }}>Loading Admin Dashboard...</div>;
  }

  return (
    <div className="container animate-fade-in" style={{ paddingTop: '110px', paddingBottom: '80px' }}>
      <div style={{ marginBottom: '40px' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
          <Settings size={16} /> Admin Panel
        </div>
        <h1 className="section-title">Admin <span className="text-gradient">Dashboard</span></h1>
        <p className="section-subtitle">Manage bookings, destinations, users, and platform analytics.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
              <DollarSign size={24} className="text-teal-600" />
            </div>
            <span className="text-teal-600 text-sm font-bold">+12.5%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1 text-neutral-900">${totalRevenue.toLocaleString()}</h3>
          <p className="text-neutral-500 text-sm font-medium">Total Revenue</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
              <Calendar size={24} className="text-blue-500" />
            </div>
            <span className="text-teal-600 text-sm font-bold">+8.2%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1 text-neutral-900">{totalBookings}</h3>
          <p className="text-neutral-500 text-sm font-medium">Total Bookings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
              <Package size={24} className="text-orange-500" />
            </div>
            <span className="text-teal-600 text-sm font-bold">+3.1%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1 text-neutral-900">{totalDestinations}</h3>
          <p className="text-neutral-500 text-sm font-medium">Destinations</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
              <Users size={24} className="text-purple-500" />
            </div>
            <span className="text-teal-600 text-sm font-bold">+5.7%</span>
          </div>
          <h3 className="text-3xl font-bold mb-1 text-neutral-900">{totalUsers}</h3>
          <p className="text-neutral-500 text-sm font-medium">Registered Users</p>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('overview')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--border-radius-sm)',
            border: 'none',
            background: activeTab === 'overview' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'overview' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            fontWeight: activeTab === 'overview' ? 600 : 400,
            transition: 'var(--transition)'
          }}
        >
          <BarChart3 size={18} style={{ marginRight: '8px', display: 'inline' }} /> Overview
        </button>
        <button
          onClick={() => setActiveTab('bookings')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--border-radius-sm)',
            border: 'none',
            background: activeTab === 'bookings' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'bookings' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            fontWeight: activeTab === 'bookings' ? 600 : 400,
            transition: 'var(--transition)'
          }}
        >
          <Calendar size={18} style={{ marginRight: '8px', display: 'inline' }} /> Bookings
        </button>
        <button
          onClick={() => setActiveTab('destinations')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--border-radius-sm)',
            border: 'none',
            background: activeTab === 'destinations' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'destinations' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            fontWeight: activeTab === 'destinations' ? 600 : 400,
            transition: 'var(--transition)'
          }}
        >
          <MapPin size={18} style={{ marginRight: '8px', display: 'inline' }} /> Destinations
        </button>
        <button
          onClick={() => setActiveTab('users')}
          style={{
            padding: '10px 20px',
            borderRadius: 'var(--border-radius-sm)',
            border: 'none',
            background: activeTab === 'users' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'users' ? 'white' : 'var(--text-muted)',
            cursor: 'pointer',
            fontWeight: activeTab === 'users' ? 600 : 400,
            transition: 'var(--transition)'
          }}
        >
          <Users size={18} style={{ marginRight: '8px', display: 'inline' }} /> Users
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <h2 className="text-2xl font-bold text-neutral-900 mb-6">Platform Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-start gap-4">
              <h3 className="font-bold flex items-center gap-2 text-neutral-900">
                <TrendingUp size={20} className="text-teal-600" /> Recent Activity
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Platform is performing well with increased user engagement and booking rates.</p>
            </div>
            <div className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 flex flex-col items-start gap-4">
              <h3 className="font-bold flex items-center gap-2 text-neutral-900">
                <MapPin size={20} className="text-teal-600" /> Popular Destinations
              </h3>
              <p className="text-neutral-500 text-sm leading-relaxed">Cox's Bazar and Sajek Valley are the most booked destinations this month.</p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <h2 style={{ marginBottom: '24px' }}>All Bookings</h2>
          {bookings.length === 0 ? (
            <p>No bookings found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>User</th>
                  <th style={{ padding: '12px' }}>Place</th>
                  <th style={{ padding: '12px' }}>Dates</th>
                  <th style={{ padding: '12px' }}>Total Price</th>
                  <th style={{ padding: '12px' }}>Status</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px' }}>{booking.user?.name || 'Unknown User'}</td>
                    <td style={{ padding: '12px' }}>{booking.place?.name || 'Unknown Place'}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>${booking.totalPrice}</td>
                    <td style={{ padding: '12px' }}>
                      <span 
                        onClick={() => handleUpdateBookingStatus(booking)}
                        style={{ padding: '4px 8px', borderRadius: '4px', background: 'var(--primary)', color: 'white', fontSize: '0.8rem', cursor: 'pointer' }}>
                        {booking.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleDeleteBooking(booking._id)} style={{ padding: '6px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid #ef4444', background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', cursor: 'pointer', fontSize: '0.85rem' }}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'destinations' && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-neutral-900">Manage Destinations</h2>
            <button onClick={handleAddDestination} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-600 text-white font-bold hover:bg-teal-700 transition-colors shadow-sm">
              <Plus size={18} /> Add Destination
            </button>
          </div>
          {destinations.length === 0 ? (
            <p className="text-neutral-500">No destinations found.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {destinations.map((destination) => (
                <div key={destination._id} className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between group">
                  <div>
                    <h3 className="font-bold text-neutral-900 mb-1">{destination.name}</h3>
                    <p className="text-neutral-500 text-sm">{destination.location}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button onClick={() => handleEditDestination(destination)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-neutral-200 text-neutral-600 font-medium hover:bg-neutral-50 transition-colors">
                      <Edit size={16} /> Edit
                    </button>
                    <button onClick={() => handleDeleteDestination(destination._id)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50 font-medium hover:bg-red-100 transition-colors">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'users' && (
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm">
          <h2 style={{ marginBottom: '24px' }}>Manage Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '12px' }}>Name</th>
                  <th style={{ padding: '12px' }}>Email</th>
                  <th style={{ padding: '12px' }}>Role</th>
                  <th style={{ padding: '12px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '12px' }}>{user.name}</td>
                    <td style={{ padding: '12px' }}>{user.email}</td>
                    <td style={{ padding: '12px' }}>
                      <span style={{ padding: '4px 8px', borderRadius: '4px', background: user.role === 'admin' ? 'rgba(13, 148, 136, 0.1)' : 'rgba(59, 130, 246, 0.1)', color: user.role === 'admin' ? 'var(--primary)' : '#3b82f6', fontSize: '0.8rem', fontWeight: 600 }}>
                        {user.role || 'user'}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button onClick={() => handleEditUserRole(user)} style={{ padding: '6px 12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'var(--surface)', cursor: 'pointer', fontSize: '0.85rem' }}>
                        Edit Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
