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
  Check,
  Terminal,
  Layers,
  Server
} from 'lucide-react';

const AboutUs = () => {
  return (
    <div style={{
      background: 'transparent',
      minHeight: '100vh',
      padding: '130px 24px 90px 24px',
      maxWidth: '1320px',
      margin: '0 auto',
      color: '#f8fafc'
    }}>
      
      {/* ================= 1. HERO HEADER ================= */}
      <div style={{ textAlign: 'center', marginBottom: '70px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '7px 22px',
          borderRadius: '30px',
          color: '#d4af37',
          fontSize: '11.5px',
          fontWeight: '700',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          marginBottom: '20px'
        }}>
          <Sparkles size={15} /> Heritage & Software Architecture
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(34px, 4.8vw, 54px)',
          color: '#ffffff',
          fontWeight: '600',
          lineHeight: '1.15',
          marginBottom: '18px'
        }}>
          Crafting Unforgettable Hospitality Through <br />
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #ffffff 0%, #fef08a 50%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Digital Precision
          </span>
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '15px',
          maxWidth: '760px',
          margin: '0 auto',
          lineHeight: '1.8',
          fontWeight: '300'
        }}>
          LuxuryStay Hospitality represents the intersection of timeless 5-star elegance and cutting-edge software engineering, designed to orchestrate friction-free operations for guests, front-desk concierges, and hotel managers.
        </p>
      </div>

      {/* ================= 2. THE THREE CORE OPERATIONAL PILLARS ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: '28px',
        marginBottom: '80px'
      }}>
        {/* Pillar 1 */}
        <div className="luxury-card" style={{ padding: '36px' }}>
          <div style={{
            background: 'rgba(212, 175, 55, 0.12)',
            color: '#d4af37',
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '22px',
            border: '1px solid rgba(212, 175, 55, 0.25)'
          }}>
            <Building2 size={26} />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '22px', marginBottom: '12px' }}>
            Bespoke Hospitality
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
            Curated for global travelers seeking absolute privacy, tranquility, and effortless luxury across private suites, rooftop infinity waters, and Michelin-inspired dining.
          </p>
        </div>

        {/* Pillar 2 */}
        <div className="luxury-card" style={{ padding: '36px' }}>
          <div style={{
            background: 'rgba(56, 189, 248, 0.12)',
            color: '#38bdf8',
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '22px',
            border: '1px solid rgba(56, 189, 248, 0.25)'
          }}>
            <Cpu size={26} />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '22px', marginBottom: '12px' }}>
            Autonomous Operations
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
            From 1-click digital check-ins to automated real-time room housekeeping transitions and itemized invoice folios, manual delays are eliminated.
          </p>
        </div>

        {/* Pillar 3 */}
        <div className="luxury-card" style={{ padding: '36px' }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.12)',
            color: '#10b981',
            width: '52px',
            height: '52px',
            borderRadius: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '22px',
            border: '1px solid rgba(16, 185, 129, 0.25)'
          }}>
            <ShieldCheck size={26} />
          </div>
          <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '22px', marginBottom: '12px' }}>
            Enterprise Security
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
            Engineered with salted Bcrypt cryptographic hashing, role-based JWT authorization tokens, and strict data confidentiality protocols.
          </p>
        </div>
      </div>

      {/* ================= 3. LEAD SOFTWARE ARCHITECT & BLUEPRINT SECTION ================= */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.92) 0%, rgba(7, 11, 20, 0.98) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '26px',
        padding: 'clamp(28px, 4.5vw, 54px)',
        boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Soft Ambient Corner Glow */}
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-60px',
          width: '260px',
          height: '260px',
          background: 'rgba(212, 175, 55, 0.1)',
          borderRadius: '50%',
          filter: 'blur(70px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '50px',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Developer Profile */}
          <div>
            
            {/* Profile Avatar + Titles */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '22px', marginBottom: '24px', flexWrap: 'wrap' }}>
              <div style={{
                width: '120px',
                height: '120px',
                borderRadius: '22px',
                overflow: 'hidden',
                border: '2.5px solid #d4af37',
                boxShadow: '0 12px 30px rgba(212, 175, 55, 0.35), 0 0 15px rgba(212, 175, 55, 0.2)',
                flexShrink: 0,
                background: '#070b14',
                position: 'relative'
              }}>
                <img 
                  src={devPhoto} 
                  alt="Muhammad Abdullah" 
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentNode.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#d4af37;font-weight:700;font-size:24px;">MA</div>';
                  }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>

              <div>
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#d4af37',
                  fontSize: '11px',
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: '1.5px',
                  marginBottom: '6px'
                }}>
                  <Code2 size={15} /> Lead Software Architect & Developer
                </div>
                <h2 style={{
                  fontFamily: "'Playfair Display', Georgia, serif",
                  fontSize: '32px',
                  color: '#ffffff',
                  margin: '0 0 6px 0'
                }}>
                  Muhammad Abdullah
                </h2>
                <div style={{ color: '#cbd5e1', fontSize: '13.5px', fontWeight: '500' }}>
                  Full Stack MERN Engineer • Enterprise Systems Architect
                </div>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.75', marginBottom: '28px' }}>
              Designed, architected, and engineered the complete end-to-end <strong>LuxuryStay Hotel Management System</strong>. Spearheaded the full-stack implementation encompassing responsive luxury client interfaces, RESTful micro-architectures, role-based security layers, automated room status pipelines, and dynamic billing folio generation.
            </p>

            {/* Direct Contact Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a 
                href="tel:+923002962350"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '8px', borderRadius: '8px', color: '#d4af37', display: 'flex' }}>
                  <Phone size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Direct Phone</div>
                  <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>+92 300 2962350</div>
                </div>
              </a>

              <a 
                href="mailto:muhammadabdullah41950@gmail.com"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '8px', borderRadius: '8px', color: '#d4af37', display: 'flex' }}>
                  <Mail size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Email Inquiries</div>
                  <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>muhammadabdullah41950@gmail.com</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Blueprint Terminal Card */}
          <div style={{
            background: 'rgba(7, 11, 20, 0.85)',
            border: '1px solid rgba(212, 175, 55, 0.25)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 45px rgba(0,0,0,0.6)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal size={18} color="#d4af37" />
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '18px', margin: 0 }}>
                  System Architecture Blueprint
                </h4>
              </div>
              <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
                PRODUCTION
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '28px' }}>
              {[
                'Full MERN Stack architecture (MongoDB, Express.js, React.js, Node.js)',
                'Cryptographic salted Bcrypt password hashing & stateless JWT auth',
                'Granular Role-Based Access Control (Admin, Manager, Reception, Housekeeping)',
                'Automated room lifecycle pipeline (Available ➔ Occupied ➔ Cleaning)',
                'Automated itemized billing engine with tax calculation',
                'Secure REST API Gateway with structured middleware layers'
              ].map((highlight, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <Check size={12} color="#d4af37" strokeWidth={3} />
                  </div>
                  <span style={{ fontSize: '13px', color: '#cbd5e1', lineHeight: '1.6' }}>{highlight}</span>
                </div>
              ))}
            </div>

            {/* Tech Stack Pills */}
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', fontWeight: '600' }}>
                Core Technologies Deployed:
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT Auth', 'REST APIs', 'Vite', 'Bcrypt.js'].map((tech, i) => (
                  <span key={i} style={{
                    fontSize: '11px',
                    background: 'rgba(212, 175, 55, 0.08)',
                    color: '#d4af37',
                    border: '1px solid rgba(212, 175, 55, 0.25)',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontWeight: '600',
                    letterSpacing: '0.4px'
                  }}>
                    {tech}
                  </span>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default AboutUs;