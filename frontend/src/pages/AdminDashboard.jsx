import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, MapPin, Calendar, DollarSign, TrendingUp, Settings, Plus, Edit, Trash2, BarChart3, Package, MessageSquare, CreditCard, CheckCircle, XCircle, Clock, Printer, Ban, ShieldCheck, Mail, LogOut } from 'lucide-react';

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [users, setUsers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  // Modals state
  const [showDestModal, setShowDestModal] = useState(false);
  const [destFormData, setDestFormData] = useState(null);

  useEffect(() => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
      navigate('/');
      return;
    }
    fetchAdminData();
  }, [navigate]);

  const fetchAdminData = async () => {
    const token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}`, 'x-auth-token': token };
    const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

    try {
      const [bRes, dRes, uRes, rRes, cRes] = await Promise.all([
        fetch(`${apiBase}/api/bookings`, { headers }),
        fetch(`${apiBase}/places`, { headers }),
        fetch(`${apiBase}/api/auth/users`, { headers }),
        fetch(`${apiBase}/api/reviews`, { headers }),
        fetch(`${apiBase}/api/contact`, { headers })
      ]);

      if (bRes.ok) setBookings(await bRes.json());
      if (dRes.ok) setDestinations(await dRes.json());
      if (uRes.ok) setUsers(await uRes.json());
      if (rRes.ok) setReviews(await rRes.json());
      if (cRes.ok) setContacts(await cRes.json());

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const getHeaders = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'x-auth-token': token
    };
  };

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // --- DESTINATIONS ---
  const handleSaveDestination = async (e) => {
    e.preventDefault();
    try {
      const isEdit = !!destFormData._id;
      const url = isEdit ? `${apiBase}/places/${destFormData._id}` : `${apiBase}/places`;
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: getHeaders(),
        body: JSON.stringify(destFormData)
      });

      if (res.ok) {
        const savedDest = await res.json();
        if (isEdit) {
          setDestinations(destinations.map(d => d._id === savedDest._id ? savedDest : d));
        } else {
          setDestinations([...destinations, savedDest]);
        }
        setShowDestModal(false);
      } else {
        const err = await res.json();
        alert(`Failed: ${err.message}`);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleDeleteDestination = async (id) => {
    if (!window.confirm("Delete this destination?")) return;
    try {
      const res = await fetch(`${apiBase}/places/${id}`, { method: 'DELETE', headers: getHeaders() });
      if (res.ok) setDestinations(destinations.filter(d => d._id !== id));
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // --- USERS ---
  const handleToggleBan = async (user) => {
    if (!window.confirm(`Are you sure you want to ${user.isBanned ? 'unban' : 'ban'} ${user.name}?`)) return;
    try {
      const res = await fetch(`${apiBase}/api/auth/users/${user._id}/ban`, { method: 'PUT', headers: getHeaders() });
      if (res.ok) {
        const updated = await res.json();
        setUsers(users.map(u => u._id === user._id ? updated : u));
      } else {
        alert("Failed to update user ban status.");
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  // --- BOOKINGS ---
  const handleUpdateBookingStatus = async (booking, newStatus) => {
    try {
      const res = await fetch(`${apiBase}/api/bookings/${booking._id}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(bookings.map(b => b._id === booking._id ? updated : b));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const printInvoice = (booking) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head><title>Invoice - ${booking._id}</title></head>
        <body style="font-family: sans-serif; padding: 40px;">
          <h2>Travel Guide Invoice</h2>
          <p><strong>Booking ID:</strong> ${booking._id}</p>
          <p><strong>Customer:</strong> ${booking.user?.name || 'N/A'}</p>
          <p><strong>Destination:</strong> ${booking.place?.name || 'N/A'}</p>
          <p><strong>Dates:</strong> ${new Date(booking.startDate).toLocaleDateString()} to ${new Date(booking.endDate).toLocaleDateString()}</p>
          <p><strong>Payment Method:</strong> ${booking.paymentMethod || 'Card'}</p>
          <hr />
          <h3>Total Price: BDT ${booking.totalPrice?.toLocaleString()}</h3>
          <script>window.print(); window.close();</script>
        </body>
      </html>
    `);
  };

  // --- PAYMENTS & REFUNDS ---
  const handleProcessRefund = async (booking) => {
    if (!window.confirm("Approve refund? This will cancel the booking.")) return;
    try {
      const res = await fetch(`${apiBase}/api/bookings/${booking._id}/process-refund`, {
        method: 'PUT',
        headers: getHeaders()
      });
      if (res.ok) {
        const updated = await res.json();
        setBookings(bookings.map(b => b._id === booking._id ? updated.booking : b));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  // --- REVIEWS ---
  const handleUpdateReviewStatus = async (reviewId, status) => {
    try {
      const res = await fetch(`${apiBase}/api/reviews/${reviewId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        const updated = await res.json();
        setReviews(reviews.map(r => r._id === reviewId ? updated : r));
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-neutral-50"><p className="text-xl font-medium text-neutral-500">Loading Admin Dashboard...</p></div>;
  }

  const totalRevenue = bookings.filter(b => b.status !== 'Cancelled').reduce((sum, b) => sum + (b.totalPrice || 0), 0);
  const pendingRefunds = bookings.filter(b => b.refundRequested).length;

  const tabs = [
    { id: 'overview', icon: BarChart3, label: 'Overview' },
    { id: 'destinations', icon: Package, label: 'Tour Packages' },
    { id: 'bookings', icon: Calendar, label: 'Bookings' },
    { id: 'users', icon: Users, label: 'Users' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'reviews', icon: MessageSquare, label: 'Reviews' },
    { id: 'support', icon: Mail, label: 'Support' }
  ];

  return (
    <div className="bg-neutral-50 min-h-screen flex w-full">
      
      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex-shrink-0 h-screen sticky top-0 z-40 hidden lg:flex flex-col">
        <div className="p-6 flex-1 flex flex-col">
          <div className="flex items-center gap-2 text-teal-600 font-bold mb-8">
            <Settings size={20} />
            <span className="text-lg uppercase tracking-wider">Admin Panel</span>
          </div>
          
          <nav className="space-y-2 flex-1 overflow-y-auto pr-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === tab.id 
                    ? 'bg-teal-50 text-teal-700 shadow-sm border border-teal-100' 
                    : 'text-neutral-600 hover:bg-neutral-100 border border-transparent'
                }`}
              >
                <tab.icon size={18} /> {tab.label}
              </button>
            ))}
          </nav>
        </div>
        
        <div className="p-6 border-t border-neutral-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
          >
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </aside>

      {/* RIGHT CONTENT AREA */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        
        {/* MOBILE TABS MENU (Shows only on small screens) */}
        <div className="lg:hidden w-full px-4 pt-6 mb-2 flex overflow-x-auto gap-2 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'bg-white text-neutral-600 hover:bg-neutral-100 border border-neutral-200'
              }`}
            >
              <tab.icon size={16} /> {tab.label}
            </button>
          ))}
        </div>

        {/* MAIN CONTENT AREA */}
        <main className="p-6 lg:p-8 flex-1">

        
        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fade-in">
            <div>
              <h1 className="text-3xl font-bold text-neutral-900 mb-2">Dashboard Overview</h1>
              <p className="text-neutral-500">Welcome back, Admin. Here's what's happening today.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center">
                    <DollarSign size={24} className="text-teal-600" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+12.5%</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-neutral-900">৳{totalRevenue.toLocaleString()}</h3>
                  <p className="text-neutral-500 text-sm font-medium mt-1">Total Revenue</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                    <Calendar size={24} className="text-blue-500" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+8.2%</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-neutral-900">{bookings.length}</h3>
                  <p className="text-neutral-500 text-sm font-medium mt-1">Total Bookings</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                    <Users size={24} className="text-purple-500" />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">+5.7%</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-neutral-900">{users.filter(u => !u.isBanned).length}</h3>
                  <p className="text-neutral-500 text-sm font-medium mt-1">Active Users</p>
                </div>
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Clock size={24} className="text-orange-500" />
                  </div>
                  <span className="text-xs font-bold text-neutral-600 bg-neutral-100 px-2 py-1 rounded-lg">Pending</span>
                </div>
                <div>
                  <h3 className="text-3xl font-bold text-neutral-900">{pendingRefunds}</h3>
                  <p className="text-neutral-500 text-sm font-medium mt-1">Refund Requests</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                <h3 className="font-bold text-xl flex items-center gap-2 text-neutral-900">
                  <TrendingUp size={20} className="text-teal-600"/> Recent Bookings
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[700px]">
                  <thead>
                    <tr className="bg-white text-neutral-500 text-sm border-b-2 border-neutral-100">
                      <th className="py-4 px-6 font-medium text-left">Customer Name</th>
                      <th className="py-4 px-6 font-medium text-left">Booking Date</th>
                      <th className="py-4 px-6 font-medium text-left">Payment Status</th>
                      <th className="py-4 px-6 font-medium text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="text-neutral-800">
                    {bookings.slice(0, 5).map(b => (
                      <tr key={b._id} className="border-b border-neutral-50 hover:bg-neutral-50/80 transition-colors">
                        <td className="py-4 px-6 font-medium text-left">{b.user?.name || 'Unknown'}</td>
                        <td className="py-4 px-6 text-neutral-600 text-left">{new Date(b.startDate).toLocaleDateString()}</td>
                        <td className="py-4 px-6 text-left">
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            b.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                            b.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
                            {b.status === 'Cancelled' ? 'Refunded' : b.status === 'Pending' ? 'Pending' : 'Paid'}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button onClick={() => { setActiveTab('bookings'); }} className="text-teal-600 font-medium text-sm hover:underline">
                              View Details
                            </button>
                            {b.status !== 'Cancelled' && (
                              <button 
                                onClick={() => handleUpdateBookingStatus(b, 'Cancelled')}
                                className="text-red-600 font-medium text-sm hover:underline"
                              >
                                Cancel
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                    {bookings.length === 0 && (
                      <tr>
                        <td colSpan="4" className="py-8 text-center text-neutral-500">No recent bookings found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* DESTINATIONS TAB */}
        {activeTab === 'destinations' && (
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm animate-fade-in">
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-neutral-100">
              <div>
                <h2 className="text-2xl font-bold text-neutral-900">Manage Tour Packages</h2>
                <p className="text-neutral-500 text-sm mt-1">Add, edit, or remove travel destinations.</p>
              </div>
              <button 
                onClick={() => { setDestFormData({ name: '', location: '', description: '', price: '', category: 'Domestic', seatLimit: 20 }); setShowDestModal(true); }}
                className="bg-teal-600 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 hover:bg-teal-700 shadow-sm font-medium transition-colors"
              >
                <Plus size={18} /> Add Package
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {destinations.map(dest => (
                <div key={dest._id} className="border border-neutral-200 rounded-2xl p-5 hover:shadow-lg transition-all bg-neutral-50 group flex flex-col">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-neutral-900 leading-tight">{dest.name}</h3>
                    <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-1 rounded-md ml-2 flex-shrink-0">{dest.category}</span>
                  </div>
                  <p className="text-sm text-neutral-500 mb-4 flex items-center gap-1"><MapPin size={14} className="text-teal-600"/> {dest.location}</p>
                  
                  <div className="mt-auto pt-4 border-t border-neutral-200">
                    <div className="flex justify-between text-sm text-neutral-700 mb-4 font-medium">
                      <span>৳{dest.price.toLocaleString()}</span>
                      <span className="flex items-center gap-1"><Users size={14}/> {dest.seatLimit} Max</span>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setDestFormData(dest); setShowDestModal(true); }} className="flex-1 bg-white border border-neutral-200 text-neutral-700 py-2 rounded-xl flex justify-center items-center gap-1.5 text-sm hover:bg-neutral-50 font-medium transition-colors">
                        <Edit size={16} /> Edit
                      </button>
                      <button onClick={() => handleDeleteDestination(dest._id)} className="flex-1 bg-white border border-red-200 text-red-600 py-2 rounded-xl flex justify-center items-center gap-1.5 text-sm hover:bg-red-50 font-medium transition-colors">
                        <Trash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Destination Modal */}
            {showDestModal && (
              <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl animate-fade-in">
                  <h3 className="text-2xl font-bold mb-6 text-neutral-900 border-b border-neutral-100 pb-4">{destFormData._id ? 'Edit Package' : 'Create New Package'}</h3>
                  <form onSubmit={handleSaveDestination} className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Package Name</label>
                      <input type="text" required value={destFormData.name} onChange={e => setDestFormData({...destFormData, name: e.target.value})} className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" placeholder="e.g. Sajek Valley 3 Days" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Location</label>
                        <input type="text" required value={destFormData.location} onChange={e => setDestFormData({...destFormData, location: e.target.value})} className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" placeholder="e.g. Rangamati" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Category</label>
                        <select value={destFormData.category} onChange={e => setDestFormData({...destFormData, category: e.target.value})} className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all bg-white">
                          <option value="Domestic">Domestic</option>
                          <option value="International">International</option>
                          <option value="Honeymoon">Honeymoon</option>
                          <option value="Adventure">Adventure</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Price (BDT)</label>
                        <input type="number" required value={destFormData.price} onChange={e => setDestFormData({...destFormData, price: e.target.value})} className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" placeholder="5000" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Seat Limit</label>
                        <input type="number" required value={destFormData.seatLimit} onChange={e => setDestFormData({...destFormData, seatLimit: e.target.value})} className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all" placeholder="20" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-neutral-700 mb-1.5">Description</label>
                      <textarea required value={destFormData.description} onChange={e => setDestFormData({...destFormData, description: e.target.value})} className="w-full border border-neutral-300 rounded-xl p-3 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all resize-none" rows="3" placeholder="Describe the tour package..."></textarea>
                    </div>
                    <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-neutral-100">
                      <button type="button" onClick={() => setShowDestModal(false)} className="px-5 py-2.5 border border-neutral-300 text-neutral-700 rounded-xl hover:bg-neutral-50 font-medium transition-colors">Cancel</button>
                      <button type="submit" className="px-5 py-2.5 bg-teal-600 text-white rounded-xl hover:bg-teal-700 shadow-md font-medium transition-colors">Save Package</button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="mb-6 pb-4 border-b border-neutral-100">
              <h2 className="text-2xl font-bold text-neutral-900">Booking Management</h2>
              <p className="text-neutral-500 text-sm mt-1">Track and update customer bookings.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead>
                  <tr className="bg-neutral-50 border-y border-neutral-200 text-neutral-600 text-sm uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">Customer</th>
                    <th className="py-4 px-6 font-semibold">Package</th>
                    <th className="py-4 px-6 font-semibold">Dates</th>
                    <th className="py-4 px-6 font-semibold">Amount</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Invoice</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {bookings.map(b => (
                    <tr key={b._id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-4 px-6 font-medium text-neutral-900">{b.user?.name || 'Unknown'}</td>
                      <td className="py-4 px-6 text-neutral-700">{b.place?.name}</td>
                      <td className="py-4 px-6 text-sm text-neutral-500 whitespace-nowrap">
                        {new Date(b.startDate).toLocaleDateString()} &rarr; {new Date(b.endDate).toLocaleDateString()}
                      </td>
                      <td className="py-4 px-6 font-bold text-teal-700">৳{b.totalPrice?.toLocaleString()}</td>
                      <td className="py-4 px-6">
                        <select 
                          value={b.status} 
                          onChange={(e) => handleUpdateBookingStatus(b, e.target.value)}
                          className={`text-xs font-bold rounded-lg px-3 py-1.5 outline-none cursor-pointer border ${
                            b.status === 'Confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                            b.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            b.status === 'Cancelled' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          }`}
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Completed">Completed</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button onClick={() => printInvoice(b)} className="inline-flex items-center justify-center p-2 text-teal-600 bg-teal-50 border border-teal-100 hover:bg-teal-100 rounded-lg transition-colors" title="Print Invoice">
                          <Printer size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {bookings.length === 0 && (
                    <tr><td colSpan="6" className="py-10 text-center text-neutral-500">No bookings available.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && (
          <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm overflow-hidden animate-fade-in">
            <div className="mb-6 pb-4 border-b border-neutral-100">
              <h2 className="text-2xl font-bold text-neutral-900">User Directory</h2>
              <p className="text-neutral-500 text-sm mt-1">Manage registered users and access control.</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                <thead>
                  <tr className="bg-neutral-50 border-y border-neutral-200 text-neutral-600 text-sm uppercase tracking-wider">
                    <th className="py-4 px-6 font-semibold">User Details</th>
                    <th className="py-4 px-6 font-semibold">Role</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                    <th className="py-4 px-6 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {users.map(u => (
                    <tr key={u._id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-4 px-6">
                        <div className="font-bold text-neutral-900">{u.name}</div>
                        <div className="text-sm text-neutral-500">{u.email}</div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase ${
                          u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-neutral-100 text-neutral-700'
                        }`}>
                          {u.role === 'admin' && <ShieldCheck size={14} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        {u.isBanned 
                          ? <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-bold"><Ban size={12}/> Banned</span>
                          : <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded-full text-xs font-bold"><CheckCircle size={12}/> Active</span>}
                      </td>
                      <td className="py-4 px-6 text-right">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => handleToggleBan(u)} 
                            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                              u.isBanned ? 'bg-white border-green-200 text-green-700 hover:bg-green-50' : 'bg-white border-red-200 text-red-700 hover:bg-red-50'
                            }`}
                          >
                            <Ban size={16} /> {u.isBanned ? 'Unban User' : 'Ban User'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PAYMENTS TAB */}
        {activeTab === 'payments' && (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-neutral-100 shadow-sm animate-fade-in">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 pb-4 border-b border-neutral-100">Payments & Refunds</h2>
            
            <div className="mb-10">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-orange-600">
                <Clock size={20} /> Pending Refund Requests
              </h3>
              {bookings.filter(b => b.refundRequested).length === 0 ? (
                <div className="bg-neutral-50 border border-neutral-200 rounded-2xl p-8 text-center">
                  <CheckCircle size={40} className="text-green-500 mx-auto mb-3" />
                  <p className="text-neutral-700 font-medium">All caught up! No pending refund requests.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {bookings.filter(b => b.refundRequested).map(b => (
                    <div key={b._id} className="flex flex-col sm:flex-row sm:items-center justify-between bg-orange-50/50 p-5 rounded-2xl border border-orange-200 shadow-sm gap-4">
                      <div>
                        <p className="font-bold text-neutral-900 text-lg mb-1">{b.user?.name} requested a refund</p>
                        <p className="text-sm text-neutral-600">Package: <span className="font-medium text-neutral-800">{b.place?.name}</span></p>
                        <p className="text-sm text-neutral-600">Amount Paid: <span className="font-bold text-orange-700">৳{b.totalPrice?.toLocaleString()}</span> via {b.paymentMethod || 'Card'}</p>
                      </div>
                      <button onClick={() => handleProcessRefund(b)} className="bg-orange-600 text-white px-5 py-2.5 rounded-xl hover:bg-orange-700 font-bold shadow-md transition-colors whitespace-nowrap">
                        Approve & Refund
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-neutral-800">
              <CreditCard size={20} /> Transaction History
            </h3>
            <div className="overflow-x-auto rounded-2xl border border-neutral-200">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 text-sm">
                    <th className="py-4 px-6 font-semibold">User</th>
                    <th className="py-4 px-6 font-semibold">Amount</th>
                    <th className="py-4 px-6 font-semibold">Method</th>
                    <th className="py-4 px-6 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {bookings.map(b => (
                    <tr key={b._id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-4 px-6 font-medium text-neutral-900">{b.user?.name}</td>
                      <td className="py-4 px-6 font-bold text-teal-700">৳{b.totalPrice?.toLocaleString()}</td>
                      <td className="py-4 px-6 text-neutral-600 font-medium">{b.paymentMethod || 'Card'}</td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                          b.status === 'Cancelled' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'
                        }`}>
                          {b.status === 'Cancelled' ? 'Refunded/Cancelled' : 'Paid Success'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* REVIEWS TAB */}
        {activeTab === 'reviews' && (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-neutral-100 shadow-sm animate-fade-in">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 pb-4 border-b border-neutral-100">Review Moderation</h2>
            {reviews.length === 0 ? (
              <p className="text-neutral-500 text-center py-10 bg-neutral-50 rounded-2xl border border-neutral-100">No reviews found yet.</p>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {reviews.map(r => (
                  <div key={r._id} className="border border-neutral-200 p-6 rounded-2xl bg-neutral-50 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-bold text-lg text-neutral-900">{r.user?.name}</h4>
                        <p className="text-sm text-teal-700 font-medium bg-teal-50 px-2 py-0.5 rounded-md inline-block mt-1">{r.place?.name}</p>
                      </div>
                      <div className="text-yellow-500 text-lg flex gap-0.5 bg-white px-2 py-1 rounded-lg border border-neutral-200 shadow-sm">
                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-neutral-100 flex-1">
                      <p className="text-neutral-700 text-sm italic">"{r.comment}"</p>
                    </div>
                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-neutral-500">Status:</span>
                        <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                          r.status === 'approved' ? 'bg-green-100 text-green-700' :
                          r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {r.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {r.status !== 'approved' && (
                          <button onClick={() => handleUpdateReviewStatus(r._id, 'approved')} className="flex items-center gap-1.5 bg-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-700 shadow-sm transition-colors">
                            <CheckCircle size={16} /> Approve
                          </button>
                        )}
                        {r.status !== 'rejected' && (
                          <button onClick={() => handleUpdateReviewStatus(r._id, 'rejected')} className="flex items-center gap-1.5 bg-red-50 text-red-700 border border-red-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-red-100 transition-colors">
                            <XCircle size={16} /> Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* SUPPORT TAB */}
        {activeTab === 'support' && (
          <div className="bg-white p-6 lg:p-8 rounded-3xl border border-neutral-100 shadow-sm animate-fade-in">
            <h2 className="text-2xl font-bold text-neutral-900 mb-8 pb-4 border-b border-neutral-100">Customer Support Tickets</h2>
            {contacts.length === 0 ? (
              <div className="text-center py-12 bg-neutral-50 rounded-3xl border border-neutral-200 border-dashed">
                <MessageSquare size={48} className="text-neutral-300 mx-auto mb-4" />
                <p className="text-neutral-500 font-medium text-lg">Inbox is empty. No new support tickets.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {contacts.map(c => (
                  <div key={c._id} className="border border-neutral-200 p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-xl text-neutral-900">{c.subject || 'No Subject Provided'}</h3>
                      <span className="text-xs font-bold text-neutral-500 bg-neutral-100 px-3 py-1 rounded-lg">
                        {new Date(c.createdAt).toLocaleDateString()} {new Date(c.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-sm bg-blue-50/50 p-3 rounded-xl border border-blue-100">
                      <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold uppercase">
                        {c.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-bold text-neutral-900">{c.name}</p>
                        <a href={`mailto:${c.email}`} className="text-blue-600 hover:underline">{c.email}</a>
                      </div>
                    </div>
                    <div className="bg-neutral-50 p-5 rounded-xl border border-neutral-100 text-neutral-700 text-sm whitespace-pre-wrap leading-relaxed">
                      {c.message}
                    </div>
                    <div className="mt-5 flex justify-end">
                      <a href={`mailto:${c.email}?subject=Re: ${c.subject || 'Your Support Ticket'}`} className="bg-neutral-900 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-black flex items-center gap-2 shadow-md transition-all">
                        <Mail size={16} /> Reply via Email
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        </main>
      </div>
    </div>
  );
}
