import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Hotel, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  // Demo Admin fast autofill helper for evaluation/testing
  const fillAdmin = () => {
    setEmail('admin@luxurystay.com');
    setPassword('admin123456');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.85), rgba(11, 17, 32, 0.95)), url('/Images/hero-bg.jpg')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center'
    }}>
      <div className="luxury-card" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px 32px',
        border: '1px solid rgba(197, 168, 128, 0.3)'
      }}>
        {/* Brand Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #c5a880 0%, #b09166 100%)',
            width: '50px',
            height: '50px',
            borderRadius: '12px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0b1120',
            marginBottom: '14px'
          }}>
            <Hotel size={28} />
          </div>
          <h2 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '6px' }}>
            LUXURY<span style={{ color: 'var(--primary-gold)' }}>STAY</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Enterprise Hotel Operations Gateway
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--danger-rose)',
            padding: '12px',
            borderRadius: '8px',
            color: '#fb7185',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            marginBottom: '20px'
          }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Email Field */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
              Staff Email Address
            </label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="staff@luxurystay.com"
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label style={{ display: 'block', color: '#cbd5e1', fontSize: '13px', marginBottom: '8px', fontWeight: '500' }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid var(--border-color)',
                  padding: '12px 14px 12px 42px',
                  borderRadius: '10px',
                  color: '#fff',
                  fontSize: '14px',
                  outline: 'none'
                }}
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '15px', marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : <>Authenticate <ArrowRight size={18} /></>}
          </button>
        </form>

        {/* Demo Fast Fill Button for Testing */}
        <div style={{
          marginTop: '24px',
          paddingTop: '20px',
          borderTop: '1px solid rgba(255,255,255,0.08)',
          textAlign: 'center'
        }}>
          <button
            type="button"
            onClick={fillAdmin}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--primary-gold)',
              fontSize: '12px',
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Click here to Auto-Fill Super Admin Credentials
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;