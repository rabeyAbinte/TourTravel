import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Calendar, Users, X } from 'lucide-react';

export default function DestinationCard({ destination }) {
  if (!destination) return null;

  const [showBookingModal, setShowBookingModal] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingStatus, setBookingStatus] = useState('');

  let localImage = destination.image;
  const nameLower = (destination.name || destination.title || '').toLowerCase();

  if (nameLower.includes("cox's bazar") || nameLower.includes("coxsbazar") || nameLower.includes("cox")) {
    localImage = "/images/coxs_bazar.png";
  } else if (nameLower.includes("sajek")) {
    localImage = "/images/sajek_valley.png";
  } else if (nameLower.includes("sylhet")) {
    localImage = "/images/sylhet_tea_garden.png";
  } else if (nameLower.includes("sundarban")) {
    localImage = "/images/sundarbans.png";
  } else if (nameLower.includes("bandarban")) {
    localImage = "/images/bandarban.png";
  } else if (nameLower.includes("martin") || nameLower.includes("saint")) {
    localImage = "/images/saint_martins.png";
  }

  if (!localImage || localImage.includes("1476514525535")) {
    if (nameLower.includes("cox") || nameLower.includes("martin") || nameLower.includes("saint")) {
      localImage = `https://unsplash.com`;
    } else if (nameLower.includes("sajek") || nameLower.includes("bandarban")) {
      localImage = `https://unsplash.com`;
    } else if (nameLower.includes("sylhet") || nameLower.includes("sundarban")) {
      localImage = `https://unsplash.com`;
    } else {
      localImage = `https://unsplash.com`;
    }
  }

  const ratingVal = destination.rating || 4.5;
  const displayPrice = 1000;
  const displayLocation = destination.location || 'Bangladesh';
  const displayTitle = destination.title || destination.name || 'Beautiful Destination';
  const destinationId = destination.id || destination._id;

  const handleBook = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to book a destination.");
      setShowBookingModal(false);
      return;
    }
    const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) || 1;
    const totalPrice = displayPrice * days * guests;

    try {
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({ place: destinationId, startDate, endDate, totalPrice })
      });
      if (response.ok) {
        setBookingStatus('🎉 Booking Confirmed!');
        setTimeout(() => {
          setShowBookingModal(false);
          setBookingStatus('');
        }, 2000);
      } else {
        setBookingStatus('Failed to book. Please try again.');
      }
    } catch (err) {
      setBookingStatus('Error occurred while booking');
    }
  };

  return (
    <>
      <div className="relative min-h-[460px] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 group flex flex-col justify-end border border-slate-100/10">
        <img
          src={localImage}
          alt={displayTitle}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none"></div>
        <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center text-white z-10 border border-white/20">
          <Star size={14} className="fill-yellow-400 text-yellow-400 mr-1" />
          {Number(ratingVal).toFixed(1)}
        </div>

        {/* সেফ প্যাডিং pb-8 যুক্ত করা হলো কন্টেন্ট ভেসে থাকার জন্য */}
        <div className="p-6 pb-8 relative z-10 flex flex-col w-full h-full justify-end">
          <div className="mt-auto w-full">
            <h3 className="text-2xl font-bold text-white mb-2 line-clamp-1 group-hover:text-teal-400 transition-colors drop-shadow-md">
              {displayTitle}
            </h3>
            <div className="flex items-center gap-1.5 text-slate-200 text-sm mb-4 drop-shadow-sm">
              <MapPin size={16} className="shrink-0 text-teal-400" />
              <span className="line-clamp-1 font-medium">{displayLocation}</span>
            </div>
            <div className="pt-4 mt-2 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 w-full">
              <div className="text-slate-200">
                <span className="text-2xl font-extrabold text-white tracking-tight drop-shadow-md">৳ {displayPrice.toLocaleString()}</span>
                <span className="text-xs font-medium text-neutral-300"> / day</span>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/destinations/${destinationId}`}
                  className="flex items-center justify-center bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 backdrop-blur-sm border border-white/30 hover:shadow-lg active:scale-95"
                >
                  Details
                </Link>
                <button
                  onClick={() => setShowBookingModal(true)}
                  className="flex items-center justify-center bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 border border-teal-500/50 hover:shadow-lg hover:shadow-teal-600/30 active:scale-95"
                >
                  Book Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative animate-fade-in">
            <button onClick={() => setShowBookingModal(false)} className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors">
              <X size={20} className="text-slate-500" />
            </button>
            <div className="mb-6">
              <img src={localImage} alt={displayTitle} className="w-full h-48 object-cover rounded-2xl mb-4" />
              <h2 className="text-2xl font-bold text-slate-900 mb-1">{displayTitle}</h2>
              <p className="text-slate-500 flex items-center gap-1 text-sm">
                <MapPin size={16} className="text-teal-600" /> {displayLocation}
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Calendar size={16} /> Check-in Date</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Calendar size={16} /> Check-out Date</label>
                <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2"><Users size={16} /> Number of Guests</label>
                <input type="number" min="1" value={guests} onChange={(e) => setGuests(parseInt(e.target.value) || 1)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 outline-none transition-all" />
              </div>
              {bookingStatus && (
                <div className={`p-4 rounded-xl text-center font-bold text-sm ${bookingStatus.includes('Confirmed') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>{bookingStatus}</div>
              )}
              <button onClick={handleBook} disabled={!startDate || !endDate} className="w-full mt-4 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-200 disabled:cursor-not-allowed text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-teal-600/20 flex items-center justify-center gap-2">
                Confirm Booking (৳{(displayPrice * guests).toLocaleString()} / day)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
