import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/contact', {
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
        alert(data.message || "Something went wrong while sending the message.");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Could not connect to the backend server.");
    }
  };

  return (
    <div className="animate-fade-in" style={{ paddingTop: '110px', paddingBottom: '80px', minHeight: '90vh' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto 50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '6px 16px', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
            <Mail size={16} /> Get In Touch
          </div>
          <h1 className="section-title">We'd Love to <span className="text-gradient">Hear From You</span></h1>
          <p className="section-subtitle">Have questions about packages, custom itineraries, or reservations? Send us a message and our travel concierges will reply within hours.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '32px', alignItems: 'start' }}>
          
          {/* Contact Info Column */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            <div style={{ background: 'var(--surface)', padding: '28px', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'flex-start', gap: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '14px', borderRadius: '14px' }}>
                <MapPin size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Headquarters</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  Gulshan 2 Avenue, Suite 402<br />
                  Dhaka - 1212, Bangladesh
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', padding: '28px', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'flex-start', gap: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '14px', borderRadius: '14px' }}>
                <Mail size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Email Concierge</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  support@travelgo.com<br />
                  bookings@travelgo.com
                </p>
              </div>
            </div>

            <div style={{ background: 'var(--surface)', padding: '28px', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'flex-start', gap: '20px', border: '1px solid var(--border-color)' }}>
              <div style={{ background: 'rgba(13, 148, 136, 0.1)', color: 'var(--primary)', padding: '14px', borderRadius: '14px' }}>
                <Phone size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.15rem', marginBottom: '6px' }}>Direct Phone</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, fontSize: '0.95rem' }}>
                  +880 1700-000000<br />
                  Mon - Sat, 9am - 8pm GMT+6
                </p>
              </div>
            </div>

          </div>

          {/* Contact Form Column */}
          <div style={{ background: 'var(--surface)', padding: '36px', borderRadius: 'var(--border-radius-lg)', boxShadow: '0 15px 35px rgba(0,0,0,0.06)', border: '1px solid var(--border-color)' }}>
            
            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div style={{ width: '70px', height: '70px', background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <CheckCircle2 size={40} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Message Received!</h3>
                <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '28px' }}>
                  Thank you, <strong>{formData.name}</strong>. Our team will review your inquiry and reach out to <strong>{formData.email}</strong> shortly.
                </p>
                <button 
                  onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', subject: '', message: '' }); }}
                  className="btn btn-secondary"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h3 style={{ fontSize: '1.4rem', marginBottom: '8px' }}>Send us a message</h3>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Full Name *</label>
                  <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                    className="input-field" 
                    placeholder="e.g. Sarah Ahmed" 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Email Address *</label>
                  <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                    className="input-field" 
                    placeholder="sarah@example.com" 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Subject</label>
                  <input 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                    className="input-field" 
                    placeholder="e.g. Custom Cox's Bazar Tour Inquiry" 
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Message *</label>
                  <textarea 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                    rows={5} 
                    className="input-field" 
                    placeholder="Tell us about your travel plans or questions..."
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
    </div>
  );
}
