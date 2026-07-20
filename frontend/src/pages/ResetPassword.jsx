import React, { useState, useEffect } from 'react';
import { Lock, Eye, EyeOff, ArrowLeft, Check, X, Shield } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const token = new URLSearchParams(location.search).get('token');
  
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password requirements
  const [requirements, setRequirements] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false
  });

  useEffect(() => {
    setRequirements({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword)
    });
  }, [newPassword]);

  const isPasswordValid = Object.values(requirements).every(req => req);
  const passwordsMatch = newPassword === confirmPassword && newPassword !== '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isPasswordValid) {
      setError('Please meet all password requirements');
      return;
    }

    if (!passwordsMatch) {
      setError('Passwords do not match');
      return;
    }

    if (!token) {
      navigate('/invalid-token');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await response.json();
      
      if (response.ok) {
        navigate('/password-reset-success');
      } else {
        if (data.message.includes('Invalid') || data.message.includes('expired')) {
          navigate('/invalid-token');
        } else {
          setError(data.message || 'Failed to reset password');
        }
      }
    } catch (err) {
      setError('Server error. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const RequirementItem = ({ met, text }) => (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      fontSize: '0.85rem',
      color: met ? '#22c55e' : 'rgba(255,255,255,0.5)'
    }}>
      {met ? <Check size={16} /> : <X size={16} />}
      {text}
    </div>
  );

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
            <Lock size={40} style={{ color: 'var(--primary)' }} />
          </div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Reset Password</h2>
          <p style={{ color: 'rgba(255,255,255,0.7)' }}>
            Create a new secure password for your account
          </p>
        </div>

        {error && <div style={{ color: '#ff6b6b', textAlign: 'center', marginBottom: '16px', padding: '12px', background: 'rgba(255,107,107,0.1)', borderRadius: '8px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Enter new password"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem', fontWeight: 500 }}>Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input 
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="input-field"
                placeholder="Confirm new password"
                style={{ paddingLeft: '44px', paddingRight: '44px' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '16px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {confirmPassword && !passwordsMatch && (
              <p style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '4px' }}>Passwords do not match</p>
            )}
          </div>

          <div style={{ 
            padding: '16px', 
            background: 'rgba(255,255,255,0.05)', 
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px', 
              marginBottom: '12px',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'rgba(255,255,255,0.8)'
            }}>
              <Shield size={16} />
              Password Requirements:
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <RequirementItem met={requirements.length} text="At least 8 characters" />
              <RequirementItem met={requirements.uppercase} text="At least one uppercase letter" />
              <RequirementItem met={requirements.lowercase} text="At least one lowercase letter" />
              <RequirementItem met={requirements.number} text="At least one number" />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ marginTop: '16px', justifyContent: 'center', padding: '14px' }}
            disabled={!isPasswordValid || !passwordsMatch || loading}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', fontSize: '0.95rem' }}>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.7)', textDecoration: 'none' }}>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
