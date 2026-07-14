import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, ShieldCheck, Award, Users, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard'; 

export default function Home() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/places`);
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const enhancedData = data.map((place) => ({
          ...place,
          title: place.name,
          id: place._id
        }));
        setDestinations(enhancedData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching places:', err);
        setLoading(false);
      }
    };

    fetchPlaces();
  }, []);

  const getFilteredDestinations = () => {
    if (activeCategory === 'all') return destinations;
    if (activeCategory === 'coastal') {
      return destinations.filter(d => 
        d.title.toLowerCase().includes('cox') || 
        d.title.toLowerCase().includes('martin')
      );
    }
    if (activeCategory === 'hilly') {
      return destinations.filter(d => 
        d.title.toLowerCase().includes('sajek') || 
        d.title.toLowerCase().includes('bandarban')
      );
    }
    if (activeCategory === 'forest') {
      return destinations.filter(d => 
        d.title.toLowerCase().includes('sylhet') ||
        d.title.toLowerCase().includes('sundar')
      );
    }
    return destinations;
  };

  const filteredPlaces = getFilteredDestinations();

  return (
    <div className="animate-fade-in dashboard-page">
      {/* ১. ফিক্সড হিরো সেকশন (Dynamic Background & Contrast Overlay) */}
      <section 
        className="relative bg-cover bg-center bg-no-repeat py-24 md:py-36 min-h-[500px] flex items-center"
        style={{ backgroundImage: `url('/images/homebackground.jpg')` }}
      >
        {/* ডার্ক গ্রেডিয়েন্ট ওভারলে যা টেক্সট ফুটিয়ে তুলবে */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/50 to-transparent"></div>

        <div className="container relative z-10 px-6 mx-auto">
          <div className="max-w-2xl text-white">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 backdrop-blur-md border border-teal-500/30 text-teal-300 px-4 py-1.5 rounded-full text-sm font-medium mb-6">
              <Sparkles size={16} /> <span>Your Ultimate Bangladesh Travel Partner</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
              Explore Breathtaking <span className="text-teal-400">Bangladesh</span>
            </h1>
            <p className="text-lg md:text-xl text-neutral-200 leading-relaxed mb-8">
              From the world's longest sandy beach in Cox's Bazar to the misty tea gardens of Sylhet. Discover natural wonders and book your dream escape.
            </p>
            

          </div>
        </div>
      </section>

      {/* ২. ফিক্সড কমার্শিয়াল হাইলাইটস (Center-Aligned Icons & Balanced Spacing) */}
      <section className="section container py-16 mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-white p-10 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <ShieldCheck size={28} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Verified Reservations</h3>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">Instant booking confirmations with guaranteed hotel & tour guide access.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Award size={28} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">Handpicked Spots</h3>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">Curated natural wonders from Cox's Bazar to the hill tracts of Sajek.</p>
          </div>

          <div className="bg-white p-10 rounded-3xl border border-neutral-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
              <Users size={28} />
            </div>
            <h3 className="text-xl font-bold text-neutral-900 mb-3">24/7 Concierge</h3>
            <p className="text-neutral-500 text-sm leading-relaxed max-w-xs">Dedicated support team to assist your itinerary and travel needs.</p>
          </div>

        </div>
      </section>

      {/* ৩. ডেস্টিনেশন সেকশন */}
      <section className="section dashboard-destinations container mx-auto px-6 pb-16">
        <div className="section-header-centered text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3">Discover Featured <span className="text-teal-600">Destinations</span></h2>
          <p className="text-neutral-500">Explore premium getaway packages across geographic regions</p>
        </div>

        {/* ক্যাটাগরি সুইচ */}
        <div className="category-switcher-container flex flex-wrap justify-center gap-3 mb-10">
          <button 
            className={`category-tab px-5 py-2 rounded-full border border-neutral-200 transition-all ${activeCategory === 'all' ? 'bg-teal-600 text-white border-teal-600' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
            onClick={() => setActiveCategory('all')}
          >
            All Destinations
          </button>
          <button 
            className={`category-tab px-5 py-2 rounded-full border border-neutral-200 transition-all ${activeCategory === 'coastal' ? 'bg-teal-600 text-white border-teal-600' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
            onClick={() => setActiveCategory('coastal')}
          >
            Coastal Beaches
          </button>
          <button 
            className={`category-tab px-5 py-2 rounded-full border border-neutral-200 transition-all ${activeCategory === 'hilly' ? 'bg-teal-600 text-white border-teal-600' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
            onClick={() => setActiveCategory('hilly')}
          >
            Hills & Ridges
          </button>
          <button 
            className={`category-tab px-5 py-2 rounded-full border border-neutral-200 transition-all ${activeCategory === 'forest' ? 'bg-teal-600 text-white border-teal-600' : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'}`}
            onClick={() => setActiveCategory('forest')}
          >
            Tea Gardens & Forests
          </button>
        </div>

        {loading ? (
          <div className="loading-spinner-container text-center py-10">
            <div className="spinner mx-auto mb-4"></div>
            <p className="text-neutral-400">Fetching beautiful spots...</p>
          </div>
        ) : filteredPlaces.length === 0 ? (
          <div className="no-places-card text-center py-12 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <Compass size={48} className="mx-auto text-neutral-400 mb-4" />
            <h3 className="text-lg font-bold text-neutral-700">No matching places found</h3>
            <p className="text-neutral-500 text-sm">We couldn't find destinations under this category. Check back soon!</p>
          </div>
        ) : (
          <div className="destinations-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPlaces.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
