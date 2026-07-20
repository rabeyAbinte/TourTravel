import React, { useState } from 'react';
import { MapPin, Star, Wifi, Coffee, Waves, Plane, Map as MapIcon, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Hotels() {
  const [selectedDestination, setSelectedDestination] = useState('All');
  const navigate = useNavigate();

  const destinations = ['All', 'Cox\'s Bazar', 'Sylhet', 'Sajek', 'Bandarban', 'Saint Martin', 'Sundarban'];

  const allHotels = [
    { name: "Ocean Paradise Hotel", destination: "Cox's Bazar", rating: 4.9, price: 5000, image: "https://images.unsplash.com/photo-1582719478250-c89404bb8a0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Sea View", "Swimming Pool", "Spa"] },
    { name: "Sayeman Beach Resort", destination: "Cox's Bazar", rating: 4.8, price: 6500, image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Private Beach", "Infinity Pool", "Buffet"] },
    { name: "Hotel The Cox Today", destination: "Cox's Bazar", rating: 4.6, price: 4000, image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Free Breakfast", "Gym", "Sea View"] },
    
    { name: "Grand Palace Hotel", destination: "Sylhet", rating: 4.7, price: 3500, image: "https://images.unsplash.com/photo-1551882547-ff40c0d5bf94?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["City Center", "Free Breakfast"] },
    { name: "Rose View Hotel", destination: "Sylhet", rating: 4.8, price: 4500, image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Luxury Rooms", "Swimming Pool"] },
    
    { name: "Sajek Resort", destination: "Sajek", rating: 4.8, price: 2500, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Valley View", "Breakfast Included"] },
    { name: "Ruilui Resort", destination: "Sajek", rating: 4.5, price: 2000, image: "https://images.unsplash.com/photo-1542314831-c53cd3816002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Mountain View", "Free WiFi"] },
    
    { name: "Sairu Hill Resort", destination: "Bandarban", rating: 4.9, price: 8000, image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Hill View", "Infinity Pool", "Premium"] },
    { name: "Venus Resort", destination: "Bandarban", rating: 4.5, price: 3000, image: "https://images.unsplash.com/photo-1618773928120-2c142c67b931?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Nature Walk", "Free WiFi"] },
    
    { name: "Blue Marine Resort", destination: "Saint Martin", rating: 4.6, price: 4000, image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Beachfront", "Seafood"] },
    { name: "Coral View Resort", destination: "Saint Martin", rating: 4.5, price: 3500, image: "https://images.unsplash.com/photo-1522798514-97ceb8c4f1c8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Ocean View", "Balcony"] },
    
    { name: "Sundarban Eco Resort", destination: "Sundarban", rating: 4.7, price: 5000, image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Eco-friendly", "Guided Tours"] },
    { name: "Mangrove Hotel", destination: "Sundarban", rating: 4.4, price: 2500, image: "https://images.unsplash.com/photo-1542314831-c53cd3816002?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", features: ["Forest View", "Restaurant"] }
  ];

  const handleBook = (hotel) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to book a hotel.");
      navigate('/login');
      return;
    }
    // Mock booking success
    alert(`🎉 Booking Confirmed for ${hotel.name}! We will contact you soon.`);
  };

  const filteredHotels = selectedDestination === 'All' 
    ? allHotels 
    : allHotels.filter(hotel => hotel.destination === selectedDestination);

  return (
    <div className="min-h-screen bg-slate-50 pt-32 pb-20 font-sans text-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Find the Perfect Stay
          </h1>
          <p className="text-lg text-slate-600 leading-relaxed">
            Discover top-rated hotels, resorts, and eco-lodges across the most beautiful destinations in Bangladesh.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          {destinations.map(dest => (
            <button
              key={dest}
              onClick={() => setSelectedDestination(dest)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                selectedDestination === dest 
                  ? 'bg-teal-600 text-white shadow-lg shadow-teal-600/30' 
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {dest}
            </button>
          ))}
        </div>

        {/* Hotels Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filteredHotels.map((hotel, index) => (
            <motion.div 
              key={index}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-xl transition-all group"
            >
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={hotel.image} 
                  alt={hotel.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute top-4 right-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-xl text-sm font-bold text-amber-500 flex items-center gap-1.5 shadow-sm">
                  <Star className="w-4 h-4 fill-amber-500" /> {hotel.rating}
                </div>
                <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-medium text-white flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> {hotel.destination}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-slate-900 mb-3">{hotel.name}</h3>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  {hotel.features.map((feature, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 bg-slate-50 text-slate-600 rounded-lg border border-slate-100">
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div>
                    <span className="text-2xl font-bold text-teal-600">৳{hotel.price}</span>
                    <span className="text-sm text-slate-500 font-medium"> / night</span>
                  </div>
                  <button 
                    onClick={() => handleBook(hotel)}
                    className="flex items-center gap-1 px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors text-sm font-medium"
                  >
                    Book <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
        
        {filteredHotels.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">No hotels found</h3>
            <p className="text-slate-500">Try selecting a different destination.</p>
          </div>
        )}

      </div>
    </div>
  );
}
