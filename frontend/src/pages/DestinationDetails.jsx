import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Star, Clock, Calendar, Check, ArrowLeft, Heart, Share2, MessageSquare, Send, User, Wifi, Coffee, Waves, Map as MapIcon, Plane, Shield, CreditCard, Camera, Info, Users, Flag, Navigation, Activity, X, Zap, ArrowRight, Sun, Umbrella, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DestinationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [destination, setDestination] = useState(null);
  const [loading, setLoading] = useState(true);

  // Booking states
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [guests, setGuests] = useState(1);
  const [bookingStatus, setBookingStatus] = useState('');

  // Reviews & Rating states
  const [reviewsList, setReviewsList] = useState([]);
  const [userRating, setUserRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [userComment, setUserComment] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMsg, setReviewMsg] = useState('');
  
  // UI states
  const [isLiked, setIsLiked] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState({});
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/places`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        
        const decodedId = decodeURIComponent(id).toLowerCase();
        let place = data.find(p => 
          p._id === id || 
          String(p.id) === String(id) || 
          p.name.toLowerCase() === decodedId ||
          p.name.toLowerCase().includes(decodedId) ||
          decodedId.includes(p.name.toLowerCase().split("'")[0])
        );
        
        if (place) {
          const placeName = place.name || "";
          const lowerName = placeName.toLowerCase();
          
          let mainImage = "";
          let galleryImages = [];

          if (lowerName.includes("sajek")) {
            mainImage = "/images/sajek_valley.png";
            galleryImages = [
              mainImage,
              "/images/sajek valley 2.jpg",
              "/images/sajek valley 3.jpg",
              "/images/sajek valley4.jpg",
              "/images/sajek  valley 5.jpg"
            ];
          } else if (lowerName.includes("cox")) {
            mainImage = "/images/coxs_bazar.png";
            galleryImages = [
              mainImage,
              "/images/coxbazar2.jpg",
              "/images/coxbazar3.jpg",
              "/images/coxbazar 4.jpg",
              "/images/coxbazar 5.jpg"
            ];
          } else if (lowerName.includes("sylhet")) {
            mainImage = "/images/sylhet_tea_garden.png";
            galleryImages = [
              mainImage,
              "/images/sylhet 1.jpg",
              "/images/sylhet 2.jpg",
              "/images/sylhet 3.jpg",
              "/images/sylhet 4.jpg"
            ];
          } else if (lowerName.includes("bandarban")) {
            mainImage = "/images/bandarban.png";
            galleryImages = [
              mainImage,
              "/images/bandarban 2.jpg",
              "/images/bandarban 3.jpg",
              "/images/bandarban 4.jpg",
              "/images/bandarban.png"
            ];
          } else if (lowerName.includes("saint") || lowerName.includes("st.")) {
            mainImage = "/images/saint_martins.png";
            galleryImages = [
              mainImage,
              "/images/saintmartin 2.jpg",
              "/images/saintmartin 3.jpg",
              "/images/saint martin 4.jpg",
              "/images/saint_martins.png"
            ];
          } else if (lowerName.includes("sundarban")) {
            mainImage = "/images/sundarbans.png";
            galleryImages = [
              mainImage,
              "/images/sundarban 2.jpg",
              "/images/sundarban 3.jpg",
              "/images/sundarban 4.jpg",
              "/images/sundarban 5.jpg"
            ];
          } else {
            mainImage = place.image && place.image.startsWith("http") && !place.image.includes("1476514525535") 
              ? place.image 
              : `https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80`;

            galleryImages = place.gallery && place.gallery.length >= 5 
              ? place.gallery
              : [
                  mainImage,
                  `https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
                  `https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
                  `https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`,
                  mainImage
                ];
          }

          setDestination({
            ...place,
            title: place.name,
            location: place.location || 'Bangladesh',
            country: 'Bangladesh',
            rating: place.rating || 4.8,
            reviewsCount: Math.floor(Math.random() * 200) + 50,
            visitors: Math.floor(Math.random() * 5000) + 1000,
            duration: place.duration || '3 Days, 2 Nights',
            price: 100,
            availableSeats: Math.floor(Math.random() * 20) + 2,
            image: mainImage,
            gallery: galleryImages,
            features: [
              { name: 'Free High-Speed WiFi', icon: Wifi },
              { name: 'Complimentary Breakfast', icon: Coffee },
              { name: 'Infinity Pool & Spa', icon: Waves },
              { name: 'Dedicated Tour Guide', icon: MapIcon },
              { name: 'Airport Shuttle', icon: Plane }
            ],
            amenities: [
              { name: 'Free WiFi', icon: Wifi },
              { name: 'Transport', icon: Navigation },
              { name: 'Meals Included', icon: Coffee },
              { name: 'Luxury Hotel', icon: Shield },
              { name: 'Expert Guide', icon: Users },
              { name: 'Photography', icon: Camera },
              { name: 'Travel Insurance', icon: Activity },
              { name: '24/7 Support', icon: Info }
            ],
            timeline: [
              { day: 'Day 1', title: 'Arrival & Welcome', desc: 'Arrive at the destination, check-in to your premium accommodation, and enjoy a welcome dinner.' },
              { day: 'Day 2', title: 'Explore the Wonders', desc: 'Full day guided tour covering the major highlights, scenic spots, and local culture.' },
              { day: 'Day 3', title: 'Leisure & Departure', desc: 'Free time for shopping or relaxing before checking out and transferring to the airport.' }
            ],
            longDescription: `${place.description || ''} Discover the unparalleled beauty and serene atmosphere of this magnificent location. Whether you're seeking a peaceful retreat or a thrilling adventure, this destination offers an unforgettable experience with breathtaking landscapes, rich culture, and world-class hospitality.`
          });

          fetchReviews(place._id || id);
        }
        setLoading(false);
      } catch (err) {
        console.error("Error fetching place", err);
        setLoading(false);
      }
    };

    fetchPlace();
  }, [id]);

  const fetchReviews = async (placeId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/reviews/${placeId}`);
      if (res.ok) {
        const data = await res.json();
        setReviewsList(data);
      }
    } catch (err) {
      console.error("Error fetching reviews", err);
    }
  };

  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    return diffDays > 0 ? diffDays : 1;
  };

  const handleBook = async () => {
    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to book a destination.");
      navigate('/login');
      return;
    }
    const days = calculateDays();
    const totalPrice = destination.price * days * guests;
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({ place: destination._id, startDate, endDate, totalPrice })
      });

      if (response.ok) {
        setBookingStatus('🎉 Booking Confirmed! Redirecting to My Bookings...');
        setTimeout(() => {
          navigate('/bookings');
        }, 2000);
      } else {
        const errorData = await response.json();
        if (response.status === 401) {
          localStorage.removeItem('token');
          alert("Session expired. Please log in again.");
          navigate('/login');
        } else {
          alert(errorData.msg || "Failed to book");
        }
      }
    } catch (err) {
      alert("Server error occurred while booking");
    }
  };

  const handleAddReview = async (e) => {
    e.preventDefault();
    if (!userComment.trim()) return;
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to leave a review.");
      navigate('/login');
      return;
    }
    setReviewSubmitting(true);
    setReviewMsg('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'x-auth-token': token
        },
        body: JSON.stringify({ place: destination._id, rating: userRating, comment: userComment })
      });
      if (response.ok) {
        setReviewMsg('Thanks for sharing your experience!');
        setUserComment('');
        setUserRating(5);
        fetchReviews(destination._id || id);
      } else {
        setReviewMsg('Failed to submit review');
      }
    } catch (err) {
      setReviewMsg('Server error while posting review');
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 pt-24 px-4 pb-20 max-w-7xl mx-auto">
        <div className="w-full h-[500px] bg-slate-200 rounded-3xl animate-pulse mb-8"></div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-10 bg-slate-200 rounded-xl w-3/4 animate-pulse"></div>
            <div className="h-6 bg-slate-200 rounded-lg w-1/2 animate-pulse mb-10"></div>
            <div className="space-y-4">
              <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-full animate-pulse"></div>
              <div className="h-4 bg-slate-200 rounded w-3/4 animate-pulse"></div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="w-full h-[400px] bg-slate-200 rounded-3xl animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-3xl shadow-xl max-w-md w-full text-center border border-slate-100"
        >
          <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <MapPin className="w-12 h-12 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Destination Not Found</h2>
          <p className="text-slate-500 mb-8 leading-relaxed">We couldn't find the place you're looking for. It might have been removed or the link is broken.</p>
          <Link to="/" className="inline-flex items-center justify-center w-full bg-teal-600 hover:bg-teal-700 text-white px-6 py-4 rounded-2xl font-bold transition-all hover:shadow-lg hover:shadow-teal-600/20 active:scale-95">
            <ArrowLeft className="w-5 h-5 mr-2" /> Back to Explorations
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20 font-sans text-neutral-800 selection:bg-teal-200 overflow-visible">
      
      {/* Simple Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-4">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-neutral-600 hover:text-black transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" /> Back
        </button>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 overflow-visible">
        
        {/* HERO TITLE SECTION */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black tracking-tight mb-6 leading-normal">
            {destination.title}
          </h1>
        </div>

        {/* MAIN CONTENT */}
        <div className="flex flex-col lg:flex-row gap-12 mt-12">
          
          {/* Left Column */}
          <div className="flex-1 space-y-16">

            

            {/* Overview Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="prose prose-slate max-w-none"
            >
              <h2 className="text-4xl font-light text-neutral-900 mb-8 pb-6 border-b border-neutral-100 tracking-tight">About This Destination</h2>
              <p className="text-neutral-600 leading-loose text-xl font-light">
                {destination.longDescription}
              </p>
            </motion.section>


            {/* 7. Reviews Section */}
            <motion.section 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="pt-8 border-t border-neutral-200" id="reviews"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-12 gap-6">
                <div>
                  <h2 className="text-4xl font-light text-neutral-900 flex items-center gap-3 mb-3 tracking-tight">
                    <Star className="w-7 h-7 fill-amber-400 text-amber-400" />
                    {destination.rating} · {reviewsList.length} reviews
                  </h2>
                  <p className="text-neutral-500 text-sm font-light">See what travelers are saying</p>
                </div>
                
                {/* Rating Distribution (Mock) */}
                <div className="w-full sm:w-64 space-y-2">
                  {[5, 4, 3, 2, 1].map(star => {
                    const pct = star === 5 ? 75 : star === 4 ? 15 : star === 3 ? 5 : 2;
                    return (
                      <div key={star} className="flex items-center gap-3 text-sm">
                        <span className="w-3 font-medium text-neutral-600">{star}</span>
                        <div className="flex-1 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                          <div className="h-full bg-neutral-800 rounded-full" style={{ width: `${pct}%` }}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Review List */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10 mb-12">
                {reviewsList.length === 0 ? (
                  <div className="col-span-full w-full p-12 bg-neutral-50 border border-dashed border-neutral-200 rounded-2xl text-center flex flex-col items-center">
                    <MessageSquare className="w-12 h-12 text-neutral-300 mb-4" />
                    <h3 className="text-lg font-semibold text-neutral-900 mb-1">No reviews yet</h3>
                    <p className="text-neutral-500">Be the first traveler to share your experience!</p>
                  </div>
                ) : (
                  reviewsList.map((rev) => {
                    const reviewId = rev._id || rev.id;
                    const isExpanded = expandedReviews[reviewId];
                    return (
                      <div key={reviewId} className="flex flex-col">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-teal-400 to-blue-500 flex items-center justify-center text-white font-semibold text-lg shadow-sm">
                            {rev.user?.name ? rev.user.name.charAt(0).toUpperCase() : 'T'}
                          </div>
                          <div>
                            <h4 className="font-semibold text-neutral-900">{rev.user?.name || "Traveler"}</h4>
                            <span className="text-sm text-neutral-500">October 2023</span>
                          </div>
                        </div>
                        <div className="flex text-amber-400 mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-current' : 'text-neutral-200'}`} />
                          ))}
                        </div>
                        <p className={`text-neutral-600 leading-relaxed font-light ${isExpanded ? '' : 'line-clamp-4'}`}>{rev.comment}</p>
                        {rev.comment && rev.comment.length > 150 && (
                          <button 
                            onClick={() => setExpandedReviews(prev => ({...prev, [reviewId]: !prev[reviewId]}))}
                            className="mt-3 text-sm font-medium underline text-neutral-900 self-start hover:text-teal-600 transition-colors"
                          >
                            {isExpanded ? 'Show less' : 'Show more'}
                          </button>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
              
              {reviewsList.length > 4 && (
                <button className="px-6 py-3 bg-white border border-neutral-300 text-neutral-900 rounded-lg font-medium hover:bg-neutral-50 transition-colors">
                  Show all {reviewsList.length} reviews
                </button>
              )}

              {/* 8. Professional Review Form */}
              <div className="mt-20 bg-white p-10 rounded-3xl border border-neutral-200 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-blue-500"></div>
                <h3 className="text-3xl font-light text-neutral-900 mb-2 tracking-tight">Leave a Review</h3>
                <p className="text-neutral-500 mb-8 text-sm">Share your experience to help others plan their trip.</p>
                
                <form onSubmit={handleAddReview} className="space-y-6">
                  <div>
                    <label className="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-3 block">Overall Rating</label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button 
                          key={star} 
                          type="button" 
                          onClick={() => setUserRating(star)} 
                          onMouseEnter={() => setHoverRating(star)} 
                          onMouseLeave={() => setHoverRating(0)} 
                          className="focus:outline-none transition-transform hover:scale-110 p-1"
                        >
                          <Star 
                            size={32} 
                            className={`transition-colors duration-200 ${star <= (hoverRating || userRating) ? 'text-amber-400 fill-amber-400' : 'text-neutral-200'}`} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="relative">
                    <textarea 
                      value={userComment} 
                      onChange={(e) => setUserComment(e.target.value)} 
                      id="review-text"
                      className="w-full min-h-[140px] p-5 border border-neutral-300 rounded-lg text-neutral-700 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none resize-none transition-all bg-neutral-50/80 hover:bg-neutral-50" 
                      required 
                      placeholder="Tell us about your experience..."
                    />
                  </div>
                  
                  <div className="flex items-center justify-between pt-2">
                    {reviewMsg ? (
                      <p className={`text-sm font-medium flex items-center ${reviewMsg.includes('Failed') ? 'text-red-500' : 'text-teal-600'}`}>
                        {reviewMsg.includes('Failed') ? <X className="w-4 h-4 mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                        {reviewMsg}
                      </p>
                    ) : <div></div>}
                    
                    <motion.button 
                      whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -5px rgba(0, 0, 0, 0.3)" }}
                      whileTap={{ scale: 0.98 }}
                      type="submit" 
                      disabled={reviewSubmitting || !userComment.trim()} 
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-neutral-900 to-neutral-800 hover:from-neutral-800 hover:to-neutral-700 text-white rounded-xl font-medium shadow-lg shadow-neutral-900/20 transition-all duration-300 disabled:from-neutral-200 disabled:to-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed disabled:shadow-none relative overflow-hidden"
                    >
                      {reviewSubmitting ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Posting...</>
                      ) : (
                        <><span className="relative z-10">Submit Review</span> <Send className="w-4 h-4 relative z-10" /></>
                      )}
                      <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.section>
          </div>

          {/* Right Column - Sticky Booking Card */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="sticky top-32 bg-white p-8 rounded-3xl border border-neutral-100 shadow-xl shadow-slate-200/60 backdrop-blur-sm">
              <div className="mb-6 pb-6 border-b border-neutral-100/80">
                <div className="flex items-end gap-2 mb-2">
                  <span className="text-3xl font-bold text-neutral-900">${destination.price}</span>
                  <span className="text-neutral-500 mb-1">/ person</span>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="text-neutral-900">{destination.rating}</span>
                  <span className="text-neutral-500 underline ml-1 cursor-pointer">({reviewsList.length} reviews)</span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-neutral-50/80 p-3 rounded-xl border border-neutral-200/60 hover:border-neutral-300 transition-colors duration-200">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Check-in</label>
                    <input 
                      type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                      className="w-full bg-transparent text-sm font-medium outline-none text-neutral-900"
                    />
                  </div>
                  <div className="bg-neutral-50/80 p-3 rounded-xl border border-neutral-200/60 hover:border-neutral-300 transition-colors duration-200">
                    <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider block mb-1">Check-out</label>
                    <input 
                      type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                      className="w-full bg-transparent text-sm font-medium outline-none text-neutral-900"
                    />
                  </div>
                </div>
                
                <div className="bg-neutral-50/80 p-3 rounded-xl border border-neutral-200/60 flex justify-between items-center hover:border-neutral-300 transition-colors duration-200">
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Guests</label>
                  <div className="flex items-center gap-3">
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setGuests(Math.max(1, guests - 1))} 
                      className="w-8 h-8 rounded-lg bg-white border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-200 font-semibold text-neutral-700"
                    >-</motion.button>
                    <span className="font-bold w-4 text-center">{guests}</span>
                    <motion.button 
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setGuests(guests + 1)} 
                      className="w-8 h-8 rounded-lg bg-white border border-neutral-200/60 flex items-center justify-center hover:bg-neutral-100 hover:border-neutral-300 transition-all duration-200 font-semibold text-neutral-700"
                    >+</motion.button>
                  </div>
                </div>
              </div>

              {startDate && endDate && (
                <div className="space-y-3 mb-6 pb-6 border-b border-neutral-100">
                  <div className="flex justify-between text-neutral-600">
                    <span>${destination.price} × {guests} {guests===1?'guest':'guests'}</span>
                    <span>${destination.price * guests}</span>
                  </div>
                  <div className="flex justify-between text-neutral-600">
                    <span>Service Fee</span>
                    <span>$20</span>
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-neutral-900">Total</span>
                <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-teal-500 bg-clip-text text-transparent">
                  ${startDate && endDate ? (destination.price * guests) + 20 : destination.price + 20}
                </span>
              </div>

              <motion.button 
                whileHover={{ scale: 1.02, boxShadow: "0 20px 40px -10px rgba(13, 148, 136, 0.4)" }}
                whileTap={{ scale: 0.98 }}
                onClick={handleBook} 
                className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-teal-600/25 transition-all duration-300 flex justify-center items-center gap-2 relative overflow-hidden"
              >
                <span className="relative z-10">Reserve Now</span>
                <ArrowRight className="w-5 h-5 relative z-10" />
                <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
              </motion.button>

              {bookingStatus && (
                <div className={`mt-4 p-3 rounded-xl text-sm font-medium text-center border ${bookingStatus.includes('Confirmed') ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                  {bookingStatus}
                </div>
              )}
            </div>
          </div>

        </div>
      </main>

      {/* Photo Gallery Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-4xl font-light text-neutral-900 mb-8 tracking-tight">Photo Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]">
          {destination.gallery.map((img, idx) => (
            <div 
              key={idx} 
              className={`rounded-2xl overflow-hidden cursor-pointer group relative ${idx === 0 ? 'md:col-span-2 md:row-span-2' : ''}`}
              onClick={() => setShowGallery(true)}
            >
              <img 
                src={img} 
                alt={`Gallery ${idx + 1}`} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300"></div>
            </div>
          ))}
        </div>
      </section>

      {/* Full Screen Image Gallery Modal */}
      <AnimatePresence>
        {showGallery && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex flex-col"
          >
            <div className="p-4 flex justify-between items-center bg-black/50 backdrop-blur-sm">
              <span className="text-white font-bold">{destination.gallery.length} photos</span>
              <button onClick={() => setShowGallery(false)} className="p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
              <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.gallery.map((img, idx) => (
                  <div key={idx} className={`rounded-xl overflow-hidden ${idx % 3 === 0 ? 'md:col-span-2' : ''}`}>
                    <img src={img} alt="Gallery view" className="w-full h-auto object-cover" />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-light text-neutral-900">Book Your Trip</h2>
                  <button onClick={() => setShowBookingModal(false)} className="p-2 hover:bg-neutral-100 rounded-full transition-colors">
                    <X className="w-5 h-5 text-neutral-500" />
                  </button>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-neutral-900 mb-1">{destination.title}</h3>
                  <p className="text-sm text-neutral-500 flex items-center">
                    <MapPin className="w-4 h-4 mr-1" /> {destination.location}
                  </p>
                </div>

                <div className="mb-6">
                  <p className="text-neutral-400 text-xs font-light uppercase tracking-widest mb-2">Price</p>
                  <div className="flex items-end gap-2">
                    <span className="text-3xl font-light text-neutral-900">${destination.price}</span>
                    <span className="text-neutral-500 mb-1 font-light">/ person</span>
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-light text-neutral-400 uppercase tracking-widest mb-2 block">Check-in Date</label>
                    <input 
                      type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} 
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-light outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-light text-neutral-400 uppercase tracking-widest mb-2 block">Check-out Date</label>
                    <input 
                      type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} 
                      className="w-full bg-neutral-50 border border-neutral-200 rounded-xl px-4 py-3 text-sm font-light outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-light text-neutral-400 uppercase tracking-widest mb-2 block">Number of Guests</label>
                    <div className="flex items-center gap-4">
                      <button 
                        onClick={() => setGuests(Math.max(1, guests - 1))}
                        className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors font-light"
                      >
                        -
                      </button>
                      <span className="font-light text-neutral-900 w-8 text-center">{guests}</span>
                      <button 
                        onClick={() => setGuests(guests + 1)}
                        className="w-10 h-10 rounded-xl border border-neutral-200 flex items-center justify-center text-neutral-600 hover:bg-neutral-50 transition-colors font-light"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {startDate && endDate && (
                  <div className="bg-neutral-50 rounded-xl p-4 mb-6">
                    <div className="flex justify-between text-sm text-neutral-600 font-light mb-2">
                      <span>${destination.price} × {guests} {guests===1?'guest':'guests'}</span>
                      <span className="font-light text-neutral-900">${destination.price * guests}</span>
                    </div>
                    <div className="flex justify-between text-sm text-neutral-600 font-light mb-2">
                      <span>Service Fee</span>
                      <span className="font-light text-neutral-900">$20</span>
                    </div>
                    <div className="pt-2 border-t border-neutral-200 flex justify-between items-center">
                      <span className="font-light text-neutral-900">Total</span>
                      <span className="text-xl font-light text-teal-600">${(destination.price * guests) + 20}</span>
                    </div>
                  </div>
                )}

                <motion.button 
                  whileHover={{ scale: 1.02, y: -2, boxShadow: "0 20px 40px -10px rgba(13, 148, 136, 0.4)" }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleBook} 
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-700 hover:to-teal-600 text-white font-semibold py-4 px-6 rounded-2xl shadow-xl shadow-teal-600/25 transition-all duration-300 flex justify-center items-center gap-2 relative overflow-hidden"
                >
                  <span className="relative z-10">Confirm Booking</span>
                  <ArrowRight className="w-5 h-5 relative z-10" />
                  <div className="absolute inset-0 bg-white/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                </motion.button>

                {bookingStatus && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={`mt-4 p-4 rounded-xl text-sm font-light text-center border ${bookingStatus.includes('Confirmed') ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                    {bookingStatus}
                  </motion.div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 8px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
      `}} />
    </div>
  );
}
