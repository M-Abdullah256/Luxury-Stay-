import React from 'react';
// Aapki picture import
import devPhoto from '../assets/about/Muhammad Abdullah.jpg';

import { 
  Building2, 
  ShieldCheck, 
  Mail, 
  Phone, 
  Code2, 
  Cpu, 
  Database, 
  Sparkles, 
  CheckCircle2,
  UserCheck
} from 'lucide-react';

const AboutUs = () => {
  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', padding: '100px 24px 80px 24px', maxWidth: '1280px', margin: '0 auto' }}>
      
      {/* 1. HERO SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(197, 168, 128, 0.15)',
          border: '1px solid rgba(197, 168, 128, 0.3)',
          padding: '6px 18px',
          borderRadius: '30px',
          color: 'var(--primary-gold)',
          fontSize: '13px',
          fontWeight: '600',
          marginBottom: '20px'
        }}>
          <Sparkles size={16} /> Heritage & Digital Innovation
        </div>

        <h1 className="luxury-heading" style={{ fontSize: 'clamp(32px, 5vw, 48px)', color: '#fff', marginBottom: '16px' }}>
          Crafting Unforgettable Stays Through <span style={{ color: 'var(--primary-gold)' }}>Digital Precision</span>
        </h1>

        <p style={{ color: 'var(--text-muted)', fontSize: '15px', maxWidth: '750px', margin: '0 auto', lineHeight: '1.7' }}>
          LuxuryStay Hospitality represents the intersection of timeless 5-star elegance and cutting-edge software architecture, designed to orchestrate seamless experiences for both guests and hotel operators.
        </p>
      </div>

      {/* 2. THE BRAND VISION (3 Pillars) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '24px',
        marginBottom: '70px'
      }}>
        <div className="luxury-card" style={{ padding: '32px' }}>
          <div style={{ background: 'rgba(197, 168, 128, 0.1)', color: 'var(--primary-gold)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Building2 size={24} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>Bespoke Hospitality</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
            Curated for global travelers seeking privacy, tranquility, and effortless luxury across private suites, infinity pools, and Michelin-starred dining.
          </p>
        </div>

        <div className="luxury-card" style={{ padding: '32px' }}>
          <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <Cpu size={24} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>Autonomous Operations</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
            From 1-click contactless check-ins to automated housekeeping synchronization and live folio generation, manual friction is eradicated.
          </p>
        </div>

        <div className="luxury-card" style={{ padding: '32px' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
            <ShieldCheck size={24} />
          </div>
          <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '10px' }}>Enterprise Security</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>
            Engineered with industry-standard cryptographic password hashing, role-based access tokens, and zero-compromise data privacy compliance.
          </p>
        </div>
      </div>

      {/* 3. DEDICATED LEAD DEVELOPER / ARCHITECT SECTION */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.9) 0%, rgba(15, 23, 42, 0.95) 100%)',
        border: '1px solid rgba(197, 168, 128, 0.35)',
        borderRadius: '24px',
        padding: 'clamp(24px, 4vw, 48px)',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '60px'
      }}>
        {/* Subtle background glow */}
        <div style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'rgba(197, 168, 128, 0.12)',
          borderRadius: '50%',
          filter: 'blur(50px)'
        }}></div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px', alignItems: 'center' }}>
          
          {/* Left Column: Developer Profile with Picture */}
          <div>
            
            {/* Developer Picture & Main Title */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{
                width: '110px',
                height: '110px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '3px solid var(--primary-gold)',
                boxShadow: '0 10px 25px rgba(197, 168, 128, 0.35)',
                flexShrink: 0,
                background: '#0f172a'
              }}>
                <img 
                  src={devPhoto} 
                  alt="Muhammad Abdullah" 
                  onError={(e) => {
                    // Fallback agar file name ya path mein typo ho
                    e.target.style.display = 'none';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: 'var(--primary-gold)',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '6px'
                }}>
                  <Code2 size={15} /> Lead Software Architect & Developer
                </div>
                <h2 className="luxury-heading" style={{ fontSize: '32px', color: '#fff', marginBottom: '4px' }}>
                  Muhammad Abdullah
                </h2>
                <div style={{ color: 'var(--primary-gold)', fontSize: '13px', fontWeight: '600' }}>
                  Full Stack MERN Engineer • Enterprise Systems Specialist
                </div>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '14px', lineHeight: '1.7', marginBottom: '24px' }}>
              Designed, architected, and engineered the complete end-to-end <strong>LuxuryStay Hotel Management System</strong>. Spearheaded the full-stack implementation encompassing responsive luxury client interfaces, RESTful micro-architectures, role-based security layers, automated room status pipelines, and dynamic billing folio generation.
            </p>

            {/* Direct Contact Pills */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Phone size={18} color="var(--primary-gold)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Direct Contact</div>
                  <a href="tel:+923002962350" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                    +92 300 2962350
                  </a>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.04)', padding: '10px 16px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Mail size={18} color="var(--primary-gold)" />
                <div>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Professional Inquiries</div>
                  <a href="mailto:muhammadabdullah41950@gmail.com" style={{ color: '#fff', textDecoration: 'none', fontSize: '14px', fontWeight: '600' }}>
                    muhammadabdullah41950@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Architectural Highlights Card */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '28px'
          }}>
            <h4 style={{ color: '#fff', fontSize: '16px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Database size={18} color="var(--primary-gold)" /> Architectural Blueprint
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              {[
                'Full MERN Stack implementation (MongoDB, Express, React, Node.js)',
                'Cryptographic authentication with salted Bcrypt & JWT tokens',
                'Multi-role RBAC (Admin, Manager, Receptionist, Housekeeping)',
                'Real-time automated status transitions (Available ➔ Occupied ➔ Cleaning)',
                'Itemized Folio Generation with dynamic subtotal & 13% tax engine',
                'Comprehensive RESTful API Gateway with cross-origin security'
              ].map((highlight, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <CheckCircle2 size={16} color="var(--primary-gold)" style={{ flexShrink: 0, marginTop: '3px' }} />
                  <span style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.5' }}>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Tech Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {['React.js', 'Node.js', 'Express.js', 'MongoDB ODM', 'JWT Auth', 'REST APIs', 'Vite', 'Bcrypt.js'].map((tech, i) => (
                <span key={i} style={{
                  fontSize: '11px',
                  background: 'rgba(197, 168, 128, 0.1)',
                  color: 'var(--primary-gold)',
                  border: '1px solid rgba(197, 168, 128, 0.25)',
                  padding: '4px 10px',
                  borderRadius: '20px',
                  fontWeight: '600'
                }}>
                  {tech}
                </span>
              ))}
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default AboutUs;