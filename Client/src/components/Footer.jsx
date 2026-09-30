import React from 'react';
import { Hotel, Mail, Phone, MapPin, ShieldCheck, Award } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      background: '#070b14',
      borderTop: '1px solid rgba(197, 168, 128, 0.15)',
      padding: '60px 32px 30px 32px',
      color: 'var(--text-muted)'
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '40px',
        marginBottom: '40px'
      }}>
        {/* Col 1: Brand Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ background: 'var(--primary-gold)', padding: '6px', borderRadius: '8px', color: '#0b1120' }}>
              <Hotel size={20} />
            </div>
            <h3 className="luxury-heading" style={{ color: '#fff', fontSize: '20px' }}>
              LUXURY<span style={{ color: 'var(--primary-gold)' }}>STAY</span>
            </h3>
          </div>
          <p style={{ fontSize: '14px', lineHeight: '1.6', marginBottom: '16px' }}>
            Redefining bespoke luxury and high-end hospitality across key international destinations. Experience world-class comfort with personalized services.
          </p>
          <div style={{ display: 'flex', gap: '12px', color: 'var(--primary-gold)', fontSize: '13px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Award size={16} /> 5-Star Rated</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><ShieldCheck size={16} /> ISO Certified</span>
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '18px', fontWeight: '600' }}>Quick Exploration</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '14px' }}>
            <li><a href="#rooms" style={{ color: 'inherit', textDecoration: 'none' }}>Presidential Suites</a></li>
            <li><a href="#experience" style={{ color: 'inherit', textDecoration: 'none' }}>Fine Dining & Lounge</a></li>
            <li><a href="#amenities" style={{ color: 'inherit', textDecoration: 'none' }}>Spa & Heated Pools</a></li>
            <li><a href="/login" style={{ color: 'inherit', textDecoration: 'none' }}>Staff Portal Login</a></li>
          </ul>
        </div>

        {/* Col 3: Contact Details */}
        <div>
          <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '18px', fontWeight: '600' }}>Concierge & Inquiries</h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <MapPin size={18} color="var(--primary-gold)" />
              <span>7th Avenue Luxury Boulevard, Downtown</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Phone size={18} color="var(--primary-gold)" />
              <span>+92 (021) 111-LUXURY (589879)</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <Mail size={18} color="var(--primary-gold)" />
              <span>reservations@luxurystay.com</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        paddingTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '12px',
        fontSize: '13px'
      }}>
        <p>© 2026 LuxuryStay Hospitality Group. All rights reserved.</p>
        <p style={{ color: 'var(--primary-gold)' }}>Enterprise Hotel Management System</p>
      </div>
    </footer>
  );
};

export default Footer;