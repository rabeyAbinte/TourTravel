import React from 'react';
import { Search, MapPin, Star, Filter } from 'lucide-react';

const DESTINATIONS = [
  { id: 1, title: 'Santorini', location: 'Greece', rating: 4.9, price: 120, image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?auto=format&fit=crop&w=800&q=80' },
  { id: 2, title: 'Bali', location: 'Indonesia', rating: 4.8, price: 85, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80' },
  { id: 3, title: 'Machu Picchu', location: 'Peru', rating: 4.9, price: 150, image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?auto=format&fit=crop&w=800&q=80' },
  { id: 4, title: 'Kyoto', location: 'Japan', rating: 4.7, price: 110, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80' },
  { id: 5, title: 'Amalfi Coast', location: 'Italy', rating: 4.9, price: 180, image: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?auto=format&fit=crop&w=800&q=80' },
  { id: 6, title: 'Banff National Park', location: 'Canada', rating: 4.8, price: 95, image: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?auto=format&fit=crop&w=800&q=80' },
  { id: 7, title: 'Phuket', location: 'Thailand', rating: 4.6, price: 60, image: 'https://images.unsplash.com/photo-1589394815804-964ce0ff96c7?auto=format&fit=crop&w=800&q=80' },
  { id: 8, title: 'Paris', location: 'France', rating: 4.7, price: 140, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=800&q=80' }
];

export default function Destinations() {
  return (
    <div className="animate-fade-in" style={{ paddingTop: '100px', paddingBottom: '80px' }}>
      <div className="container">

        <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.05)', marginBottom: '40px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px', position: 'relative' }}>
            <Search size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" className="input-field" placeholder="Search destinations, attractions..." style={{ paddingLeft: '48px', borderRadius: '40px' }} />
          </div>

          <button className="btn btn-secondary" style={{ borderRadius: '40px' }}>
            <Filter size={18} /> Filters
          </button>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h1 className="section-title">Explore Endless <span className="text-gradient">Possibilities</span></h1>
          <p className="section-subtitle">Find exactly what you are looking for based on popularity, ratings and budgets.</p>
        </div>

        <div className="destinations-grid">
          {DESTINATIONS.map(dest => (
            <div key={dest.id} className="destination-card">
              <div className="destination-image">
                <img src={dest.image} alt={dest.title} className="destination-img" />
                <div className="destination-rating shadow">
                  <Star size={16} fill="var(--secondary)" color="var(--secondary)" />
                  {dest.rating}
                </div>
              </div>
              <div className="destination-content">
                <h3 className="destination-title">
                  {dest.title}
                </h3>
                <div className="destination-location">
                  <MapPin size={16} />
                  {dest.location}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                  <div className="destination-price">
                    ${dest.price} <span>/ day</span>
                  </div>
                  <button className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    View & Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
