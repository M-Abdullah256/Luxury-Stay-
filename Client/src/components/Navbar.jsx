import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hotel, KeyRound, Menu, X, Search } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      zIndex: 100,
      background: 'rgba(11, 17, 32, 0.85)',
      backdropFilter: 'blur(15px)',
      borderBottom: '1px solid rgba(197, 168, 128, 0.2)',
      padding: '16px 32px'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'linear-gradient(135deg, #c5a880 0%, #b09166 100%)',
            padding: '8px',
            borderRadius: '10px',
            color: '#0b1120',
            display: 'flex'
          }}>
            <Hotel size={24} />
          </div>
          <div>
            <span className="luxury-heading" style={{
              fontSize: '22px',
              fontWeight: '700',
              color: '#f8fafc',
              letterSpacing: '1px',
              display: 'block'
            }}>
              LUXURY<span style={{ color: 'var(--primary-gold)' }}>STAY</span>
            </span>
            <span style={{ fontSize: '10px', letterSpacing: '2px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Hospitality & Suites
            </span>
          </div>
        </Link>

        {/* Desktop Guest Links */}
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }} className="nav-desktop-links">
          <Link to="/" style={linkStyle}>Home</Link>
          <Link to="/rooms" style={linkStyle}>Suites & Rooms</Link>
          <Link to="/about" style={linkStyle}>About Us</Link>
          <Link to="/my-booking" style={{ ...linkStyle, color: 'var(--primary-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Search size={14} /> Track Booking
          </Link>
        </div>

        {/* Action Button: Staff Portal Login */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {user ? (
            <button
              onClick={() => navigate('/dashboard')}
              className="btn-gold"
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              <KeyRound size={16} />
              Open Portal ({user.role})
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-gold"
              style={{ fontSize: '13px', padding: '8px 16px' }}
            >
              <KeyRound size={16} />
              Staff Login
            </button>
          )}

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex' }}
            className="mobile-toggle-btn"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div style={{
          marginTop: '16px',
          padding: '20px',
          background: '#0f172a',
          borderRadius: '12px',
          border: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={linkStyle}>Home</Link>
          <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} style={linkStyle}>Suites & Rooms</Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)} style={linkStyle}>About Us</Link>
          <Link to="/my-booking" onClick={() => setMobileMenuOpen(false)} style={{ ...linkStyle, color: 'var(--primary-gold)' }}>Track My Booking</Link>
        </div>
      )}
    </nav>
  );
};

const linkStyle = {
  color: '#cbd5e1',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '500',
  transition: 'color 0.2s ease',
  cursor: 'pointer'
};

export default Navbar;