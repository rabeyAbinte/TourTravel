import React, { useState, useEffect } from 'react';
import { Mail, ArrowLeft, RefreshCw, CheckCircle } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function EmailSentConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const maskEmail = (email) => {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (username.length <= 2) {
      return username.charAt(0) + '***@' + domain;
    }
    const maskedUsername = username.charAt(0) + '***' + username.charAt(username.length - 1);
    return maskedUsername + '@' + domain;
  };

  const handleResend = async () => {
    if (!canResend || !email) return;
    
    setResending(true);
    setResendSuccess(false);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      
      if (response.ok) {
        setResendSuccess(true);
        setCountdown(60);
        setCanResend(false);
        setTimeout(() => setResendSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error resending email:', err);
    } finally {
      setResending(false);
    }
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
        zIndex: 10
      }}>
        <Link to="/login" style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          gap: '8px', 
          color: 'rgba(255,255,255,0.7)', 
          textDecoration: 'none',
          marginBottom: '24px',
          fontSize: '0.9rem'
        }}>
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            background: 'rgba(13, 148, 136, 0.2)', 
            borderRadius: '50%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 24px'
          }}>
            <Mail size={40} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '12px' }}>Check Your Email</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>
            We've sent a password reset link to your email address.
          </p>
          {email && (
            <p style={{ 
              color: 'var(--primary)', 
              fontWeight: 600, 
              marginTop: '8px',
              fontSize: '1.1rem'
            }}>
              {maskEmail(email)}
            </p>
          )}
        </div>

        <div style={{ 
          padding: '16px', 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '12px',
          marginBottom: '24px',
          border: '1px solid rgba(255,255,255,0.1)'
        }}>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', textAlign: 'center' }}>
            Didn't receive the email? Check your Spam or Junk folder.
          </p>
        </div>

        {resendSuccess && (
          <div style={{ 
            padding: '12px', 
            background: 'rgba(34, 197, 94, 0.1)', 
            borderRadius: '8px',
            marginBottom: '16px',
            border: '1px solid rgba(34, 197, 94, 0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#22c55e',
            fontSize: '0.9rem'
          }}>
            <CheckCircle size={16} />
            Email sent successfully!
          </div>
        )}

        <button
          onClick={handleResend}
          disabled={!canResend || resending}
          style={{
            width: '100%',
            padding: '14px',
            borderRadius: '8px',
            border: 'none',
            background: canResend ? 'var(--primary)' : 'rgba(255,255,255,0.1)',
            color: canResend ? 'white' : 'rgba(255,255,255,0.5)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: canResend ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.3s ease'
          }}
        >
          {resending ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              Sending...
            </>
          ) : canResend ? (
            <>
              <RefreshCw size={18} />
              Resend Email
            </>
          ) : (
            <>
              <RefreshCw size={18} />
              Resend in {countdown}s
            </>
          )}
        </button>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.95rem' }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
