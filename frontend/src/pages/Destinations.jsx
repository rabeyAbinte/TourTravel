import React, { useState, useEffect } from 'react';
import { Search, Compass, Map } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import DestinationCard from '../components/DestinationCard';

export default function Destinations() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await fetch('http://localhost:5000/places');
        if (!response.ok) throw new Error("Failed to fetch");
        const data = await response.json();
        const enhancedData = data.map((place) => ({
          ...place,
          title: place.name,
          id: place._id
        }));
        
        const cleanData = enhancedData;
        
        setDestinations(cleanData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching places:', err);
        setLoading(false);
      }
    };
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      setSearchParams({ search: searchQuery });
    } else {
      setSearchParams({});
    }
  }, [searchQuery, setSearchParams]);

  const normalizeStr = (str) => (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const searchNorm = normalizeStr(searchQuery);

  const filteredDestinations = destinations.filter(dest => {
    if (searchQuery) {
      return normalizeStr(dest.title).includes(searchNorm) || normalizeStr(dest.location).includes(searchNorm);
    }
    if (activeFilter === 'All') return true;

    const titleLower = (dest.title || dest.name || '').toLowerCase();
    const locationLower = (dest.location || '').toLowerCase();
    const filterLower = activeFilter.toLowerCase();

    if (filterLower === 'beach') {
      return titleLower.includes('cox') || titleLower.includes('martin') || titleLower.includes('beach') || locationLower.includes('beach') || locationLower.includes('coxs') || locationLower.includes('sea');
    } else if (filterLower === 'hill') {
      return titleLower.includes('sajek') || titleLower.includes('bandarban') || titleLower.includes('hill') || titleLower.includes('ridge') || titleLower.includes('mountain') || locationLower.includes('hill') || locationLower.includes('tract');
    } else if (filterLower === 'forest') {
      return titleLower.includes('sylhet') || titleLower.includes('sundar') || titleLower.includes('forest') || titleLower.includes('tea') || titleLower.includes('garden') || locationLower.includes('forest') || locationLower.includes('nature');
    } else if (filterLower === 'city') {
      return titleLower.includes('dhaka') || titleLower.includes('chittagong') || titleLower.includes('city') || locationLower.includes('city') || locationLower.includes('urban');
    }
    return true;
  });

  const filters = ['All', 'Beach', 'Hill', 'Forest', 'City'];

  return (
    <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-200 overflow-visible" style={{ paddingTop: '160px', paddingBottom: '200px' }}>

      {/* Header & Search Section */}
      <div className="max-w-7xl mx-auto px-4 mb-16 text-center overflow-visible">
        {/* ফিরিয়ে আনা হলো আপনার প্রিয় ব্যাজ */}
        <div className="inline-flex items-center justify-center bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold mb-6">
          <Map className="w-4 h-4 mr-2" /> Explore Bangladesh
        </div>

        <div className="flex flex-col gap-3 text-center mb-10 overflow-visible">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight leading-normal overflow-visible">
            Find Your Next <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Adventure</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            Discover breathtaking natural wonders, rich cultural heritage, and unforgettable vacation spots tailored just for you.
          </p>
        </div>

        {/* সার্চ এবং ফিল্টারের মাঝখানে স্পেসিং ফিক্স */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full max-w-5xl mx-auto mb-12 px-2">

          {/* Search Bar */}
          <div className="relative group w-full md:max-w-xl flex-1">
            <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-xl group-hover:bg-blue-500/20 transition-all duration-300"></div>
            <div className="relative flex items-center bg-white p-2 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100">
              <div className="pl-4 pr-1">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="flex-1 bg-transparent border-none outline-none px-3 py-3 text-slate-700 font-medium placeholder-slate-400 text-base"
                placeholder="Search destinations, beaches..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Quick Filters with padding */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => {
                  setActiveFilter(filter);
                  setSearchQuery('');
                }}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-200 ${activeFilter === filter ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'}`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Area */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-end mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {searchQuery ? `Search results for "${searchQuery}"` : 'Popular Destinations'}
          </h2>
          <span className="text-slate-500 font-medium">
            {filteredDestinations.length} {filteredDestinations.length === 1 ? 'place' : 'places'} found
          </span>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((skeleton) => (
              <div key={skeleton} className="bg-white rounded-3xl aspect-[3/4] p-4 flex flex-col animate-pulse">
                <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-slate-200 rounded-md w-3/4 mb-3"></div>
                <div className="mt-auto flex justify-between">
                  <div className="h-8 bg-slate-200 rounded-md w-1/3"></div>
                  <div className="h-8 bg-slate-200 rounded-md w-1/3"></div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredDestinations.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center shadow-sm border border-slate-100 max-w-3xl mx-auto">
            <Compass className="w-12 h-12 text-blue-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No destinations found</h3>
            <button onClick={() => { setSearchQuery(''); setActiveFilter('All'); }} className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-full">Reset</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map(dest => (
              <DestinationCard key={dest.id} destination={dest} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
