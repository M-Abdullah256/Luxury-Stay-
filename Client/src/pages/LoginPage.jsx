import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Lock, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  KeyRound, 
  Sparkles,
  Server
} from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
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
      setError(err.response?.data?.message || 'Invalid staff credentials. Access Denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#f8fafc',
      overflow: 'hidden'
    }}>
      
      {/* ================= FULL-SCREEN SEAMLESS BACKGROUND (NO CUTTING) ================= */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: `url('/Images/login-cover.jpg'), url('/Images/about-hotel.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.72) contrast(1.08)',
        zIndex: 0
      }} />

      {/* Cinematic Ambient Dark Vignette (Text Readability Layer) */}
      <div style={{
        position: 'fixed',
        inset: 0,
        background: 'radial-gradient(ellipse at center, rgba(5, 8, 17, 0.45) 0%, rgba(5, 8, 17, 0.85) 75%, #050811 100%)',
        zIndex: 1
      }} />

      {/* Top Floating Bar: Brand & Back Button */}
      <header style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        padding: '28px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 10
      }}>
        {/* Brand Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            overflow: 'hidden',
            background: '#0a0f1d',
            border: '1.5px solid rgba(212, 175, 55, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.6)'
          }}>
            <img 
              src="/Images/hotel-logo.png" 
              alt="LuxuryStay Crest" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
                e.target.parentNode.innerHTML = '<span style="color:#d4af37; font-weight:800; font-size:18px; font-family:serif;">LS</span>';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
          <div>
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '20px',
              fontWeight: '700',
              color: '#ffffff',
              letterSpacing: '2px',
              textTransform: 'uppercase'
            }}>
              LUXURY<span style={{ color: '#d4af37' }}>STAY</span>
            </span>
            <span style={{ display: 'block', fontSize: '8.5px', letterSpacing: '3px', color: '#cbd5e1', textTransform: 'uppercase', marginTop: '2px' }}>
              Operations Gateway
            </span>
          </div>
        </div>

        {/* Back to Website Button */}
        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            background: 'rgba(5, 8, 17, 0.75)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            color: '#f8fafc',
            fontSize: '12px',
            fontWeight: '600',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            padding: '9px 18px',
            borderRadius: '25px',
            backdropFilter: 'blur(10px)',
            transition: 'all 0.2s ease',
            boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d4af37';
            e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.3)';
            e.currentTarget.style.background = 'rgba(5, 8, 17, 0.75)';
          }}
        >
          <ArrowLeft size={14} color="#d4af37" /> Back to Website
        </button>
      </header>

      {/* ================= MAIN CONTAINER: 2-COLUMN LUXURY GLASS LAYOUT ================= */}
      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1240px',
        width: '100%',
        margin: '0 auto',
        padding: '110px 32px 50px 32px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr',
        gap: '60px',
        alignItems: 'center'
      }} className="login-content-grid">
        
        {/* Left Headline & Authority Details (Full Image Translucent View) */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(5, 8, 17, 0.7)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            backdropFilter: 'blur(12px)',
            padding: '7px 20px',
            borderRadius: '30px',
            color: '#d4af37',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '24px'
          }}>
            <Sparkles size={14} /> Mission Critical Console
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(36px, 4.5vw, 54px)',
            color: '#ffffff',
            lineHeight: '1.15',
            fontWeight: '600',
            marginBottom: '20px',
            textShadow: '0 4px 25px rgba(0, 0, 0, 0.9)'
          }}>
            Orchestrating Five-Star Excellence Across Every Department.
          </h1>

          <p style={{
            color: '#cbd5e1',
            fontSize: '15px',
            lineHeight: '1.75',
            maxWidth: '520px',
            marginBottom: '36px',
            fontWeight: '300',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.8)'
          }}>
            Secure operational console for General Managers, Front-Desk Concierges, Housekeeping Coordinators, and Accounting Audit teams.
          </p>

          {/* Three Security Trust Badges */}
          <div style={{
            display: 'flex',
            gap: '24px',
            alignItems: 'center',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9', fontSize: '12.5px' }}>
              <ShieldCheck size={16} color="#d4af37" /> 256-bit Encrypted
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9', fontSize: '12.5px' }}>
              <KeyRound size={16} color="#d4af37" /> Role-Based Access
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f1f5f9', fontSize: '12.5px' }}>
              <Server size={16} color="#d4af37" /> Production HMS Gateway
            </div>
          </div>
        </div>

        {/* Right Floating Glass Authorization Card */}
        <div style={{
          background: 'rgba(11, 17, 32, 0.82)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '24px',
          padding: '40px 36px',
          boxShadow: '0 30px 70px rgba(0, 0, 0, 0.85)',
          width: '100%',
          maxWidth: '440px',
          margin: '0 auto'
        }}>
          
          <div style={{ textAlign: 'left', marginBottom: '26px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'rgba(212, 175, 55, 0.15)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#d4af37',
              marginBottom: '16px'
            }}>
              <KeyRound size={22} />
            </div>

            <h3 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: '26px',
              color: '#ffffff',
              margin: '0 0 6px 0',
              fontWeight: '600'
            }}>
              Staff Authorization
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>
              Authenticate with your registered operational credentials.
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div style={{
              background: 'rgba(244, 63, 94, 0.15)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              padding: '12px 16px',
              borderRadius: '10px',
              color: '#fb7185',
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              marginBottom: '20px'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            
            {/* Email Field */}
            <div>
              <label style={{ display: 'block', color: '#cbd5e1', fontSize: '12.5px', marginBottom: '7px', fontWeight: '500' }}>
                Operational Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={17} color="#d4af37" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@luxurystay.com"
                  style={{
                    width: '100%',
                    background: 'rgba(7, 11, 20, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '13px 16px 13px 44px',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
              </div>
            </div>

            {/* Password Field with Eye Toggle */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                <label style={{ color: '#cbd5e1', fontSize: '12.5px', fontWeight: '500' }}>
                  Secret Password
                </label>
                <span style={{ fontSize: '11px', color: '#d4af37', opacity: 0.8 }}>Strictly Confidential</span>
              </div>
              <div style={{ position: 'relative' }}>
                <Lock size={17} color="#d4af37" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  style={{
                    width: '100%',
                    background: 'rgba(7, 11, 20, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    padding: '13px 46px 13px 44px',
                    borderRadius: '10px',
                    color: '#ffffff',
                    fontSize: '13.5px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#d4af37'}
                  onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)'}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: showPassword ? '#d4af37' : '#94a3b8',
                    display: 'flex',
                    alignItems: 'center',
                    padding: 0
                  }}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                color: '#070b14',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                padding: '14px',
                borderRadius: '10px',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 18px rgba(212, 175, 55, 0.35)',
                marginTop: '8px',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = '0 6px 24px rgba(212, 175, 55, 0.5)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 18px rgba(212, 175, 55, 0.35)';
              }}
            >
              {loading ? 'Verifying Gateway...' : <>Authenticate Access <ArrowRight size={16} /></>}
            </button>
          </form>

        </div>
      </div>

      <style>{`
        @media (max-width: 960px) {
          .login-content-grid {
            grid-template-columns: 1fr !important;
            padding-top: 100px !important;
            text-align: center;
          }
          .login-content-grid > div:first-child {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;