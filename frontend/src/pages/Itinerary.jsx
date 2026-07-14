import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Users, User, Phone, Check, ArrowRight, XCircle, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Itinerary() {
  const [trips, setTrips] = useState([
    {
      id: 'trip-101',
      title: "Cox's Bazar Beach & Marine Drive Retreat",
      destination: "Cox's Bazar, Bangladesh",
      placeQuery: "Cox's Bazar",
      startDate: "2026-08-15",
      endDate: "2026-08-18",
      duration: "4 Days, 3 Nights",
      groupSize: "4 Travelers (Family)",
      status: "upcoming",
      image: "/images/coxs_bazar.png",
      guide: {
        name: "Sharmin Sultana",
        contact: "+880 1644-556677",
        role: "Certified Coastal Guide"
      },
      schedule: [
        "Day 1: Arrival, luxury check-in, and golden hour walk along Laboni beach shore.",
        "Day 2: Morning scenic drive down Marine Drive to Himchari Waterfalls & Inani Coral Beach.",
        "Day 3: Speedboat ride to Moheshkhali Island & Adinath Temple visit.",
        "Day 4: Seafood breakfast, local souvenir shopping, and evening flight departure."
      ]
    },
    {
      id: 'trip-102',
      title: "Misty Sylhet Tea Garden & Swamp Forest Expedition",
      destination: "Sylhet, Bangladesh",
      placeQuery: "Sylhet",
      startDate: "2026-11-10",
      endDate: "2026-11-12",
      duration: "3 Days, 2 Nights",
      groupSize: "2 Travelers (Couple)",
      status: "planned",
      image: "/images/sylhet_tea_garden.png",
      guide: {
        name: "Nusrat Jahan",
        contact: "+880 1822-334455",
        role: "Eco-Tours & Nature Specialist"
      },
      schedule: [
        "Day 1: Morning arrival, estate check-in, and trek through Srimangal rolling tea gardens.",
        "Day 2: Guided wooden boat safari into Ratargul Freshwater Swamp Forest & Lalakhal river.",
        "Day 3: Traditional 7-layer tea tasting, Jaflong stone collection viewpoint, and return transfer."
      ]
    }
  ]);

  const isAuthenticated = !!localStorage.getItem('token');

  const handleCancelTrip = (tripId, title) => {
    if (window.confirm(`Are you sure you want to cancel your reservation for "${title}"?`)) {
      setTrips(trips.filter(t => t.id !== tripId));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="animate-fade-in container" style={{ paddingTop: '120px', paddingBottom: '80px', textAlign: 'center', minHeight: '70vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <Calendar size={64} color="var(--text-muted)" style={{ marginBottom: '24px' }} />
        <h2 className="section-title">Sign In to View Your Itineraries</h2>
        <p className="section-subtitle" style={{ maxWidth: '500px', margin: '0 auto 32px' }}>
          Create an account or log in to access your personal trip dashboard, tour guide contacts, and day-by-day travel schedules.
        </p>
        <Link to="/login" className="btn btn-primary">
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <div className="animate-fade-in" style={{ paddingTop: '110px', paddingBottom: '80px', minHeight: '90vh' }}>
      <div className="container">
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
              <Calendar size={16} /> Personal Trip Planner Dashboard
            </div>
            <h1 className="section-title">My Travel <span className="text-gradient">Itineraries</span></h1>
            <p className="section-subtitle">Manage your upcoming vacations, view assigned tour guides, and track day-by-day schedules.</p>
          </div>
          <Link to="/destinations" className="btn btn-primary" style={{ borderRadius: '40px' }}>
            + Book Another Destination
          </Link>
        </div>

        {trips.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '70px 20px', background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', border: '1px dashed var(--border-color)', boxShadow: '0 10px 30px rgba(0,0,0,0.03)' }}>
            <div style={{ width: '80px', height: '80px', background: 'rgba(13, 148, 136, 0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px' }}>
              <Calendar size={36} color="var(--primary)" />
            </div>
            <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>No Active Itineraries</h3>
            <p style={{ color: 'var(--text-muted)', maxWidth: '450px', margin: '0 auto 28px', lineHeight: 1.6 }}>
              You don't have any active trip schedules planned right now. Browse our featured destinations and reserve your escape!
            </p>
            <Link to="/destinations" className="btn btn-secondary">
              Explore Destinations
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {trips.map(trip => {
              const isUpcoming = trip.status === 'upcoming';
              const badgeStyle = isUpcoming 
                ? { background: 'rgba(16, 185, 129, 0.18)', color: '#059669', border: '1px solid rgba(16, 185, 129, 0.3)' }
                : { background: 'rgba(245, 158, 11, 0.18)', color: '#d97706', border: '1px solid rgba(245, 158, 11, 0.3)' };

              return (
                <div key={trip.id} style={{ background: 'var(--surface)', borderRadius: 'var(--border-radius-lg)', overflow: 'hidden', boxShadow: '0 12px 35px rgba(0,0,0,0.05)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                  
                  {/* Top Header Card Banner */}
                  <div style={{ padding: '28px 32px', background: 'rgba(240, 240, 240, 0.4)', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>{trip.title}</h2>
                        <span style={{ 
                          padding: '4px 12px', 
                          borderRadius: '20px', 
                          fontSize: '0.8rem', 
                          fontWeight: 700, 
                          textTransform: 'capitalize',
                          ...badgeStyle 
                        }}>
                          {trip.status}
                        </span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--text-muted)', fontSize: '0.9rem', flexWrap: 'wrap' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <MapPin size={15} color="var(--primary)" /> {trip.destination}
                        </span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Calendar size={15} /> {trip.startDate} to {trip.endDate} ({trip.duration})
                        </span>
                        <span>•</span>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                          <Users size={15} /> {trip.groupSize}
                        </span>
                      </div>
                    </div>

                    <button 
                      onClick={() => handleCancelTrip(trip.id, trip.title)}
                      className="btn btn-secondary" 
                      style={{ color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.3)', padding: '10px 20px', fontSize: '0.9rem' }}
                    >
                      <XCircle size={16} /> Cancel Trip
                    </button>
                  </div>

                  {/* Card Main Content Grid */}
                  <div style={{ padding: '32px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px' }}>
                    
                    {/* Left Column: Day-by-Day Bulleted Summary */}
                    <div>
                      <h3 style={{ fontSize: '1.15rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Clock size={18} color="var(--primary)" /> Day-by-Day Travel Schedule
                      </h3>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {trip.schedule.map((item, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', fontSize: '0.95rem', lineHeight: 1.6, color: 'var(--text-main)' }}>
                            <div style={{ background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', minWidth: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}>
                              {idx + 1}
                            </div>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Right Column: Assigned Tour Guide Info & Image */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      <div style={{ height: '160px', borderRadius: 'var(--border-radius)', overflow: 'hidden' }}>
                        <img src={trip.image} alt={trip.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </div>

                      <div style={{ background: 'rgba(240, 240, 240, 0.4)', padding: '20px', borderRadius: 'var(--border-radius)', border: '1px solid var(--border-color)' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Assigned Tour Escort</span>
                        <h4 style={{ fontSize: '1.1rem', marginTop: '4px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <User size={18} color="var(--primary)" /> {trip.guide.name}
                        </h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>{trip.guide.role}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          <Phone size={15} color="var(--primary)" /> {trip.guide.contact}
                        </div>
                      </div>

                      <Link to={`/destinations/${encodeURIComponent(trip.placeQuery)}`} className="btn btn-secondary" style={{ textAlign: 'center', justifyContent: 'center', padding: '12px' }}>
                        View Full Destination Overview <ArrowRight size={16} />
                      </Link>
                    </div>

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
