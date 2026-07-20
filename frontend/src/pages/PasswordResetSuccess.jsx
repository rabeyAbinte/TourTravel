import React from 'react';
import { CheckCircle, ArrowRight, Lock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function PasswordResetSuccess() {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    navigate('/login');
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
          background: 'rgba(34, 197, 94, 0.2)', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          margin: '0 auto 32px',
          border: '3px solid rgba(34, 197, 94, 0.3)'
        }}>
          <CheckCircle size={50} style={{ color: '#22c55e' }} />
        </div>

        <h2 style={{ fontSize: '2rem', marginBottom: '16px', color: 'white' }}>
          Password Reset Successfully
        </h2>

        <p style={{ 
          color: 'rgba(255,255,255,0.7)', 
          lineHeight: '1.6',
          marginBottom: '40px',
          fontSize: '1rem'
        }}>
          Your password has been updated successfully. You can now log in with your new password.
        </p>

        <div style={{ 
          padding: '24px', 
          background: 'rgba(34, 197, 94, 0.1)', 
          borderRadius: '12px',
          marginBottom: '32px',
          border: '1px solid rgba(34, 197, 94, 0.2)'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '12px'
          }}>
            <Lock size={20} style={{ color: '#22c55e' }} />
            <span style={{ color: 'white', fontWeight: 600 }}>Security Tip</span>
          </div>
          <p style={{ 
            color: 'rgba(255,255,255,0.6)', 
            fontSize: '0.9rem',
            textAlign: 'left',
            lineHeight: '1.5'
          }}>
            For your security, please don't share your password with anyone. If you didn't request this change, please contact support immediately.
          </p>
        </div>

        <button
          onClick={handleGoToLogin}
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
          Go to Login
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
