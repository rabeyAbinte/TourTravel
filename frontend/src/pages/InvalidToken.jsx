import React from 'react';
import { XCircle, ArrowRight, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function InvalidToken() {
  const navigate = useNavigate();

  const handleRequestNewReset = () => {
    navigate('/forgot-password');
  };

  return (
    <div className="animate-fade-in" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '120px 24px 40px',
      background: 'url("https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80") center/cover fixed',
      position: 'relative'
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15,23,42,0.7)' }}></div>

      <div className="glass-dark" style={{
        maxWidth: '450px',
        width: '100%',
        padding: '48px',
        borderRadius: 'var(--border-radius-lg)',
        position: 'relative',
        zIndex: 10,
        textAlign: 'center'
      }}>
        <div style={{ 
          width: '100px', 
          height: '100px', 
          background: 'rgba(239, 68, 68, 0.2)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 32px',
          border: '3px solid rgba(239, 68, 68, 0.3)'
        }}>
          <XCircle size={50} style={{ color: '#ef4444' }} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'white' }}>
          Invalid or Expired Link
        </h2>

        <p style={{ 
          color: 'rgba(255,255,255,0.7)', 
          lineHeight: '1.6',
          marginBottom: '32px',
          fontSize: '1rem'
        }}>
          This password reset link is invalid or has expired. Please request a new password reset link.
        </p>

        <div style={{ 
          padding: '24px', 
          background: 'rgba(239, 68, 68, 0.1)', 
          borderRadius: '12px',
          marginBottom: '32px',
          border: '1px solid rgba(239, 68, 68, 0.2)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '12px'
          }}>
            <AlertTriangle size={20} style={{ color: '#ef4444' }} />
            <span style={{ color: 'white', fontWeight: 600 }}>Possible Reasons</span>
          </div>
          <ul style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: '0.9rem',
            textAlign: 'left',
            lineHeight: '1.8',
            paddingLeft: '20px'
          }}>
            <li>The reset link has expired (30 minutes)</li>
            <li>The link has already been used</li>
            <li>The link is malformed or corrupted</li>
            <li>You already reset your password</li>
          </ul>
        </div>

        <button
          onClick={handleRequestNewReset}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--primary)',
            color: 'white',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 12px rgba(13, 148, 136, 0.3)'
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#0d9488';
            e.target.style.transform = 'translateY(-2px)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'var(--primary)';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          Request New Reset Link
          <ArrowRight size={20} />
        </button>

        <div style={{ marginTop: '24px', fontSize: '0.95rem' }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
