import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, ShieldCheck, Award, Sparkles, KeyRound, Clock, ArrowRight } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: 'linear-gradient(180deg, #070b14 0%, #03060c 100%)',
      borderTop: '1px solid rgba(212, 175, 55, 0.2)',
      padding: '80px 32px 36px 32px',
      color: '#94a3b8',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Ambient Gold Glow at Top */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '500px',
        height: '1px',
        background: 'linear-gradient(90deg, transparent, #d4af37, transparent)',
        boxShadow: '0 0 15px #d4af37'
      }} />

      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '50px',
        marginBottom: '60px'
      }}>
        
        {/* Col 1: Brand & Heritage */}
        <div>
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
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
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: '22px',
                fontWeight: '700',
                color: '#ffffff',
                letterSpacing: '2px',
                lineHeight: '1',
                textTransform: 'uppercase'
              }}>
                LUXURY<span style={{ color: '#d4af37' }}>STAY</span>
              </span>
              <span style={{ 
                fontSize: '8.5px', 
                letterSpacing: '3px', 
                color: '#94a3b8', 
                textTransform: 'uppercase',
                fontWeight: '500',
                marginTop: '4px'
              }}>
                Grand Hotel & Resorts
              </span>
            </div>
          </Link>

          <p style={{ fontSize: '13.5px', lineHeight: '1.8', color: '#94a3b8', marginBottom: '24px' }}>
            Providing comfortable stays, quality rooms, and friendly service in the heart of the city. Perfect for families, tourists, and business travelers.
          </p>

          <div style={{ display: 'flex', gap: '16px', color: '#d4af37', fontSize: '12px', fontWeight: '600' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.08)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <Award size={14} /> 5-Star Rated
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'rgba(212, 175, 55, 0.08)', padding: '5px 12px', borderRadius: '20px', border: '1px solid rgba(212, 175, 55, 0.2)' }}>
              <ShieldCheck size={14} /> ISO 9001 Certified
            </span>
          </div>
        </div>

        {/* Col 2: Navigation Links */}
        <div>
          <h4 style={columnHeadingStyle}>Navigation</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link to="/" style={footerLinkStyle}>Home Overview</Link></li>
            <li><Link to="/rooms" style={footerLinkStyle}>Suites & Residences</Link></li>
            <li><Link to="/about" style={footerLinkStyle}>About Our Heritage</Link></li>
            <li><Link to="/my-booking" style={{ ...footerLinkStyle, color: '#d4af37' }}>Track Live Booking</Link></li>
            <li><Link to="/login" style={footerLinkStyle}>Staff Portal Gateway</Link></li>
          </ul>
        </div>

        {/* Col 3: Experiences & Privileges */}
        <div>
          <h4 style={columnHeadingStyle}>Hotel Privileges</h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '13.5px' }}>
            <li style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '4px', height: '4px', background: '#d4af37', borderRadius: '50%' }} />
              Restaurant & Dining
            </li>
            <li style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '4px', height: '4px', background: '#d4af37', borderRadius: '50%' }} />
              Heated Rooftop Infinity Waters
            </li>
            <li style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '4px', height: '4px', background: '#d4af37', borderRadius: '50%' }} />
              Private Airport Chauffeur Escort
            </li>
            <li style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '4px', height: '4px', background: '#d4af37', borderRadius: '50%' }} />
              24/7 Dedicated Butler Desk
            </li>
            <li style={{ color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ width: '4px', height: '4px', background: '#d4af37', borderRadius: '50%' }} />
              Keyless Smart Digital Access
            </li>
          </ul>
        </div>

        {/* Col 4: Concierge & Direct Inquiries */}
        <div>
          <h4 style={columnHeadingStyle}>Direct Concierge</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '13.5px' }}>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
              <MapPin size={18} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
              <span style={{ color: '#cbd5e1', lineHeight: '1.6' }}>7th Avenue Luxury Boulevard, Downtown Metropolis</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Phone size={17} color="#d4af37" style={{ flexShrink: 0 }} />
              <span style={{ color: '#cbd5e1' }}>+92 (021) 111-LUXURY (589879)</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Mail size={17} color="#d4af37" style={{ flexShrink: 0 }} />
              <span style={{ color: '#cbd5e1' }}>concierge@luxurystay.com</span>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <Clock size={17} color="#d4af37" style={{ flexShrink: 0 }} />
              <span style={{ color: '#94a3b8', fontSize: '12.5px' }}>24 Hours Reception & Butler Desk</span>
            </div>
          </div>
        </div>

      </div>

     {/* Bottom Sub-Footer Bar */}
      <div style={{
        maxWidth: '1300px',
        margin: '0 auto',
        paddingTop: '26px',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '14px',
        fontSize: '12.5px'
      }}>
        <p style={{ margin: 0, color: '#64748b' }}>
          © 2026 LuxuryStay Hospitality Group Ltd. All rights reserved.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <span style={{ color: '#64748b' }}>Privacy Policy & Terms</span>
          <span style={{ color: '#64748b' }}>Global Security Protocols</span>
          <span style={{ color: 'rgba(212, 175, 55, 0.8)', fontWeight: '600' }}>
            Enterprise HMS Gateway
          </span>
        </div>
      </div>
    </footer>
  );
};

const columnHeadingStyle = {
  fontFamily: "'Playfair Display', Georgia, serif",
  color: '#ffffff',
  fontSize: '16px',
  marginBottom: '20px',
  fontWeight: '600',
  letterSpacing: '0.5px'
};

const footerLinkStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '13.5px',
  transition: 'all 0.2s ease',
  display: 'inline-block'
};

export default Footer;