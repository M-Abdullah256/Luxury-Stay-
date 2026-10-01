import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { KeyRound, Menu, X, BedDouble, Info, Search, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        zIndex: 9999,
        transition: 'all 0.35s ease',
        background: scrolled 
          ? 'rgba(7, 11, 20, 0.94)' 
          : 'linear-gradient(180deg, rgba(7, 11, 20, 0.88) 0%, rgba(7, 11, 20, 0.2) 75%, transparent 100%)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255, 255, 255, 0.05)',
        padding: scrolled ? '14px 44px' : '20px 44px',
        boxShadow: scrolled ? '0 12px 35px -10px rgba(0,0,0,0.85)' : 'none'
      }}>
        <div style={{
          maxWidth: '1350px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          
          {/* Brand Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '10px',
              overflow: 'hidden',
              background: '#0a0f1d',
              border: '1.2px solid rgba(212, 175, 55, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 18px rgba(0, 0, 0, 0.5)'
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
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: '23px',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '2.5px',
                lineHeight: '1',
                textTransform: 'uppercase'
              }}>
                LUXURY<span style={{ color: '#d4af37' }}>STAY</span>
              </span>
              <span style={{ 
                fontSize: '8.5px', 
                letterSpacing: '3.5px', 
                color: '#94a3b8', 
                textTransform: 'uppercase',
                fontWeight: '500',
                marginTop: '4px'
              }}>
                Grand Hotel & Resorts
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="luxury-desktop-nav" style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            <Link to="/" style={navLinkStyle(isActive('/'))}>
              <span>Home</span>
              {isActive('/') && <div style={goldIndicatorStyle} />}
            </Link>

            <Link to="/rooms" style={navLinkStyle(isActive('/rooms'))}>
              <BedDouble size={15} style={{ opacity: 0.8 }} />
              <span>Suites & Rooms</span>
              {isActive('/rooms') && <div style={goldIndicatorStyle} />}
            </Link>

            <Link to="/about" style={navLinkStyle(isActive('/about'))}>
              <Info size={15} style={{ opacity: 0.8 }} />
              <span>About Us</span>
              {isActive('/about') && <div style={goldIndicatorStyle} />}
            </Link>

            <Link 
              to="/my-booking" 
              style={{
                ...navLinkStyle(isActive('/my-booking')),
                color: '#d4af37',
                background: 'rgba(212, 175, 55, 0.08)',
                padding: '7px 16px',
                borderRadius: '30px',
                border: '1px solid rgba(212, 175, 55, 0.22)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Search size={13} />
              <span>Track Booking</span>
            </Link>
          </div>

          {/* Right Action: Staff Portal Only */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {user ? (
              <button
                onClick={() => navigate('/dashboard')}
                style={portalBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#cbd5e1';
                }}
              >
                <Sparkles size={14} style={{ color: '#d4af37' }} />
                <span>Portal ({user.role})</span>
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                style={portalBtnStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d4af37';
                  e.currentTarget.style.color = '#ffffff';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                  e.currentTarget.style.color = '#cbd5e1';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <KeyRound size={14} style={{ color: '#d4af37' }} />
                <span>Staff Portal</span>
              </button>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="luxury-mobile-btn"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '8px',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div style={{
            marginTop: '16px',
            padding: '22px',
            background: 'rgba(10, 15, 29, 0.98)',
            backdropFilter: 'blur(20px)',
            borderRadius: '14px',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px'
          }}>
            <Link to="/" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Home</Link>
            <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Suites & Rooms</Link>
            <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>About Us</Link>
            <Link to="/my-booking" onClick={() => setMobileMenuOpen(false)} style={{ ...mobileLinkStyle, color: '#d4af37' }}>Track My Booking</Link>
          </div>
        )}
      </nav>

      <style>{`
        @media (max-width: 900px) {
          .luxury-desktop-nav {
            display: none !important;
          }
          .luxury-mobile-btn {
            display: flex !important;
          }
        }
      `}</style>
    </>
  );
};

const navLinkStyle = (active) => ({
  color: active ? '#ffffff' : '#94a3b8',
  textDecoration: 'none',
  fontSize: '13.5px',
  fontWeight: active ? '600' : '400',
  letterSpacing: '0.5px',
  transition: 'all 0.2s ease',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '7px',
  position: 'relative',
  padding: '6px 0'
});

const goldIndicatorStyle = {
  position: 'absolute',
  bottom: '-2px',
  left: '0',
  width: '100%',
  height: '2px',
  background: 'linear-gradient(90deg, #d4af37, #fef08a)',
  borderRadius: '2px',
  boxShadow: '0 0 8px rgba(212, 175, 55, 0.8)'
};

const portalBtnStyle = {
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.15)',
  color: '#cbd5e1',
  fontSize: '12.5px',
  fontWeight: '500',
  letterSpacing: '0.4px',
  padding: '8px 18px',
  borderRadius: '24px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.25s ease'
};

const mobileLinkStyle = {
  color: '#f8fafc',
  textDecoration: 'none',
  fontSize: '15px',
  fontWeight: '500',
  padding: '8px 0',
  borderBottom: '1px solid rgba(255,255,255,0.06)'
};

export default Navbar;