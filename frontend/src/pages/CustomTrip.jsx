import React, { useState } from 'react';
import { Compass, Calendar, Users, DollarSign, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function CustomTrip() {
  const [formData, setFormData] = useState({
    destination: 'Cox\'s Bazar',
    budget: 500,
    startDate: '',
    endDate: '',
    guests: 2,
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate) {
      alert("Please select both start and end travel dates.");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/custom-trip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitted(true);
      } else {
        alert(data.message || "Something went wrong while submitting the request.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to the backend server.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingTop: '110px', paddingBottom: '80px', minHeight: '90vh' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '650px', margin: '0 auto 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Sparkles size={16} /> Personalized Vacation Concierge
          </div>
          <h1 className="section-title">Design Your <span className="text-gradient">Custom Trip</span></h1>
          <p className="section-subtitle">Tailor every detail of your dream journey across Bangladesh. Tell us your budget, group size, and preferences and our travel architects will build your custom itinerary.</p>
        </div>

        <div style={{ maxWidth: '680px', margin: '0 auto', background: 'var(--surface)', padding: '40px', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid var(--border-color)' }}>
          
          {submitted ? (
            <div style={{ textAlign: 'center', padding: '30px 10px' }}>
              <div style={{ width: '70px', height: '70px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <CheckCircle2 size={40} />
              </div>
              <h3 style={{ fontSize: '1.6rem', marginBottom: '10px' }}>Custom Trip Request Submitted!</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px', maxWidth: '480px', margin: '0 auto 28px' }}>
                We have received your request for <strong>{formData.destination}</strong> for <strong>{formData.guests} Travelers</strong> with a budget of <strong>${formData.budget}</strong>. Our travel concierge will send a customized proposal to your email within 24 hours.
              </p>
              <button 
                onClick={() => { setSubmitted(false); setFormData({ destination: 'Cox\'s Bazar', budget: 500, startDate: '', endDate: '', guests: 2, notes: '' }); }}
                className="btn btn-secondary"
              >
                Plan Another Custom Trip
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
              <h3 style={{ fontSize: '1.35rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '14px', marginBottom: '4px' }}>Trip Preferences & Parameters</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Target Destination</label>
                  <select name="destination" value={formData.destination} onChange={handleChange} className="select-field" style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)' }}>
                    <option value="Cox's Bazar">Cox's Bazar Sea Beach</option>
                    <option value="Sylhet">Sylhet & Srimangal Tea Estates</option>
                    <option value="Sajek Valley">Sajek Cloud Valley</option>
                    <option value="Bandarban">Bandarban Hill Tracts</option>
                    <option value="Saint Martin's Island">Saint Martin Coral Island</option>
                    <option value="Sundarbans">Sundarbans Mangrove Forest</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Estimated Budget (USD $)</label>
                  <div style={{ position: 'relative' }}>
                    <DollarSign size={18} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                    <input type="number" name="budget" min="100" step="50" value={formData.budget} onChange={handleChange} required className="input-field" style={{ paddingLeft: '40px' }} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Start Travel Date</label>
                  <input type="date" name="startDate" value={formData.startDate} min={new Date().toISOString().split('T')[0]} onChange={handleChange} required className="input-field" />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>End Travel Date</label>
                  <input type="date" name="endDate" value={formData.endDate} min={formData.startDate || new Date().toISOString().split('T')[0]} onChange={handleChange} required className="input-field" />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Member Count (Guests)</label>
                  <select name="guests" value={formData.guests} onChange={handleChange} className="select-field" style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)' }}>
                    <option value={1}>1 Traveler (Solo)</option>
                    <option value={2}>2 Travelers (Couple)</option>
                    <option value={4}>4 Travelers (Small Group / Family)</option>
                    <option value={6}>6+ Travelers (Large Group)</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Accommodation Standard</label>
                  <select className="select-field" style={{ width: '100%', padding: '12px', borderRadius: 'var(--border-radius-sm)', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-main)' }}>
                    <option value="luxury">Luxury 5-Star Resort & Villa</option>
                    <option value="boutique">Boutique & Eco Resort</option>
                    <option value="standard">Standard Comfortable Hotel</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Special Requests & Activities Draft</label>
                <textarea 
                  name="notes" 
                  rows={4} 
                  value={formData.notes} 
                  onChange={handleChange} 
                  className="input-field" 
                  placeholder="e.g. Scuba diving lessons, private boat charter, local cuisine tasting tours..."
                  style={{ resize: 'vertical' }}
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '10px', justifyContent: 'center', padding: '14px', fontSize: '1rem' }}>
                <Send size={18} /> Send Message
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
