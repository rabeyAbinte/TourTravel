import React from 'react';
import { Search, MapPin, Star, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const DESTINATIONS = [
  {
    id: 1,
    title: 'Santorini',
    location: 'Greece',
    rating: 4.9,
    reviews: 1240,
    price: 120,
    image: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 2,
    title: 'Bali',
    location: 'Indonesia',
    rating: 4.8,
    reviews: 843,
    price: 85,
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 3,
    title: 'Machu Picchu',
    location: 'Peru',
    rating: 4.9,
    reviews: 3200,
    price: 150,
    image: 'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 4,
    title: 'Kyoto',
    location: 'Japan',
    rating: 4.7,
    reviews: 560,
    price: 110,
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 5,
    title: 'Amalfi Coast',
    location: 'Italy',
    rating: 4.9,
    reviews: 890,
    price: 180,
    image: 'https://images.unsplash.com/photo-1611003228941-98852ba62227?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 6,
    title: 'Banff National Park',
    location: 'Canada',
    rating: 4.8,
    reviews: 420,
    price: 95,
    image: 'https://images.unsplash.com/photo-1544365558-35aa4afcf11f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
  }
];

export default function Home() {
  return (
    <div className="animate-fade-in">
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">Discover Your Next <span className="text-gradient">Great Adventure</span></h1>
            <p className="hero-subtitle">
              Explore the world's most breathtaking destinations. Plan your itinerary, book your stay, and create unforgettable memories.
            </p>

            <div className="search-box">
              <div className="search-input-wrapper">
                <MapPin size={24} color="var(--primary)" />
                <input type="text" placeholder="Where do you want to go?" />
              </div>
              <button className="btn btn-primary" style={{ padding: '16px 32px' }}>
                <Search size={20} />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="section container">
        <div className="section-header">
          <div>
            <h2 className="section-title">Popular Destinations</h2>
            <p className="section-subtitle">Handpicked locations for your next journey</p>
          </div>
          <Link to="/destinations" className="btn btn-secondary">
            View All <ChevronRight size={20} />
          </Link>
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
                  <button className="btn btn-secondary" style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
