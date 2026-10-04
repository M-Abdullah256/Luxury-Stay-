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
  Server,
  Award,
  Compass,
  ArrowRight,
  Zap,
  Globe2,
  LockKeyhole
} from 'lucide-react';

const AboutUs = () => {
  return (
    <div style={{
      background: 'transparent',
      minHeight: '100vh',
      padding: '130px 24px 100px 24px',
      maxWidth: '1340px',
      margin: '0 auto',
      color: '#f8fafc'
    }}>
      
      {/* ================= 1. EDITORIAL GRAND HERO ================= */}
      <section style={{ textAlign: 'center', marginBottom: '80px', position: 'relative' }}>
        
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '8px 24px',
          borderRadius: '40px',
          color: '#d4af37',
          fontSize: '11.5px',
          fontWeight: '700',
          letterSpacing: '3px',
          textTransform: 'uppercase',
          marginBottom: '24px'
        }}>
          <Sparkles size={14} /> The Vision & Engineering
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(36px, 5.2vw, 62px)',
          color: '#ffffff',
          fontWeight: '600',
          lineHeight: '1.12',
          letterSpacing: '-0.5px',
          marginBottom: '22px'
        }}>
          Modern Hotel Comfort Meets <br />
          <span style={{
            fontStyle: 'italic',
            background: 'linear-gradient(135deg, #ffffff 0%, #fef08a 50%, #d4af37 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Smart Technology
          </span>
        </h1>

        <p style={{
          color: '#cbd5e1',
          fontSize: '16px',
          maxWidth: '780px',
          margin: '0 auto 45px auto',
          lineHeight: '1.8',
          fontWeight: '300'
        }}>
          LuxuryStay brings together five-star hotel comfort and modern web technology. Built from scratch to make online bookings, guest services, and hotel management fast and reliable.
        </p>

        {/* 4 Executive Prestige Metrics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          maxWidth: '1080px',
          margin: '0 auto',
          background: 'rgba(13, 21, 39, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '20px',
          padding: '28px 20px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
        }}>
          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: '700', color: '#d4af37' }}>
              &lt; 1.5s
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
              Gateway Response Time
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: '700', color: '#ffffff' }}>
              100%
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
              Automated Lifecycle
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: '700', color: '#d4af37' }}>
              256-Bit
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
              Cryptographic Security
            </div>
          </div>

          <div>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: '30px', fontWeight: '700', color: '#ffffff' }}>
              Zero-Friction
            </div>
            <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginTop: '4px' }}>
              Staff & Guest Experience
            </div>
          </div>
        </div>

      </section>

      {/* ================= 2. THE HERITAGE & ARCHITECTURAL STORY ================= */}
      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '60px',
        alignItems: 'center',
        marginBottom: '110px'
      }}>
        {/* Left Side: Visual Frame with Gold Glow */}
        <div style={{ position: 'relative' }}>
          <div style={{
            borderRadius: '24px',
            overflow: 'hidden',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            boxShadow: '0 30px 70px -15px rgba(0, 0, 0, 0.9)',
            height: '460px',
            position: 'relative'
          }}>
            <img 
              src="/Images/about-estate.jpg" 
              alt="LuxuryStay Architectural Estate" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/Images/about-hotel.jpg';
              }}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(5, 8, 17, 0.85) 0%, transparent 60%)'
            }} />

            <div style={{ position: 'absolute', bottom: '26px', left: '28px', right: '28px' }}>
              <div style={{ color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
                Architectural Identity
              </div>
              <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '20px', margin: '4px 0 0 0' }}>
                Classical Grandeur & Sovereign Landscapes
              </h4>
            </div>
          </div>
        </div>

        {/* Right Side: Editorial Philosophy */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <div style={{ width: '30px', height: '1px', background: '#d4af37' }} />
            <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
              The Philosophy
            </span>
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(30px, 3.8vw, 44px)',
            color: '#ffffff',
            lineHeight: '1.2',
            fontWeight: '600',
            marginBottom: '22px'
          }}>
            Where Classical Hospitality Unites With Pure Efficiency
          </h2>

          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8', marginBottom: '20px' }}>
            Traditional hotel management often stumbles under fragmented paper trails, delayed housekeeping dispatches, and billing discrepancies. LuxuryStay reimagined this paradigm: a bespoke hospitality brand driven entirely by a synchronized, event-driven central operations core.
          </p>

          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.8', marginBottom: '30px' }}>
            Every guest touchpoint—from booking inquiry to concierge requests, dining room charges, and instant checkout folios—flows seamlessly into one cohesive platform engineered with uncompromising reliability.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#d4af37" />
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>Contactless Concierge</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#d4af37" />
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>Real-time Audit Ledger</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#d4af37" />
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>Housekeeping Dispatch</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <CheckCircle2 size={18} color="#d4af37" />
              <span style={{ color: '#e2e8f0', fontSize: '14px', fontWeight: '500' }}>Role-Based Gateways</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= 3. FOUR STRATEGIC ENGINEERING PILLARS ================= */}
      <section style={{ marginBottom: '110px' }}>
        <div style={{ textAlign: 'center', marginBottom: '55px' }}>
          <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
            System Pillars
          </span>
          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(28px, 3.6vw, 42px)', color: '#ffffff', margin: '8px 0 14px 0' }}>
            The Four Foundations of LuxuryStay
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '14.5px', maxWidth: '620px', margin: '0 auto' }}>
            Architected to guarantee operational perfection across all staff tiers and guest interactions.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '26px'
        }}>
          {/* Card 01 */}
          <div className="luxury-card" style={{ padding: '34px 28px', position: 'relative' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: "'Playfair Display', serif", color: 'rgba(212, 175, 55, 0.3)', marginBottom: '14px' }}>
              01
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#d4af37', marginBottom: '10px' }}>
              <Zap size={18} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '19px', margin: 0 }}>
                Instant Lifecycle
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
              Live status transitions synchronize effortlessly across Available, Reserved, Occupied, and Cleaning without manual operator intervention.
            </p>
          </div>

          {/* Card 02 */}
          <div className="luxury-card" style={{ padding: '34px 28px', position: 'relative' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: "'Playfair Display', serif", color: 'rgba(56, 189, 248, 0.3)', marginBottom: '14px' }}>
              02
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#38bdf8', marginBottom: '10px' }}>
              <LockKeyhole size={18} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '19px', margin: 0 }}>
                Sovereign Security
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
              Enforced with salted Bcrypt cryptography and stateless JWT authentication tokens tailored to specific operational roles.
            </p>
          </div>

          {/* Card 03 */}
          <div className="luxury-card" style={{ padding: '34px 28px', position: 'relative' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: "'Playfair Display', serif", color: 'rgba(16, 185, 129, 0.3)', marginBottom: '14px' }}>
              03
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#10b981', marginBottom: '10px' }}>
              <Database size={18} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '19px', margin: 0 }}>
                Financial Precision
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
              Integrated itemized folio calculation engines accurately computing room rates, stay durations, extras, and taxes in real-time.
            </p>
          </div>

          {/* Card 04 */}
          <div className="luxury-card" style={{ padding: '34px 28px', position: 'relative' }}>
            <div style={{ fontSize: '28px', fontWeight: '800', fontFamily: "'Playfair Display', serif", color: 'rgba(245, 158, 11, 0.3)', marginBottom: '14px' }}>
              04
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f59e0b', marginBottom: '10px' }}>
              <Globe2 size={18} />
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '19px', margin: 0 }}>
                Digital Concierge
              </h3>
            </div>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.7', margin: 0 }}>
              A unified guest portal allowing direct transmission of wake-up calls, VIP limousine escorts, in-suite dining, and verified reviews.
            </p>
          </div>
        </div>
      </section>

      {/* ================= 4. LEAD SOFTWARE ARCHITECT SPOTLIGHT ================= */}
      <section style={{
        background: 'linear-gradient(135deg, rgba(13, 21, 39, 0.95) 0%, rgba(7, 11, 20, 0.98) 100%)',
        border: '1px solid rgba(212, 175, 55, 0.35)',
        borderRadius: '26px',
        padding: 'clamp(32px, 5vw, 60px)',
        boxShadow: '0 30px 80px -15px rgba(0, 0, 0, 0.95)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Soft Ambient Golden Light Pool */}
        <div style={{
          position: 'absolute',
          top: '-80px',
          right: '-80px',
          width: '300px',
          height: '300px',
          background: 'rgba(212, 175, 55, 0.12)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none'
        }} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '55px',
          alignItems: 'center'
        }}>
          
          {/* Left Column: Architect Profile */}
          <div>
            
            {/* Avatar & Badges */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '26px', flexWrap: 'wrap' }}>
              <div style={{
                width: '125px',
                height: '125px',
                borderRadius: '24px',
                overflow: 'hidden',
                border: '2.5px solid #d4af37',
                boxShadow: '0 15px 35px rgba(212, 175, 55, 0.35), 0 0 20px rgba(212, 175, 55, 0.15)',
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
                    e.target.parentNode.innerHTML = '<div style="display:flex;height:100%;align-items:center;justify-content:center;color:#d4af37;font-weight:700;font-size:26px;">MA</div>';
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
                  fontSize: '34px',
                  color: '#ffffff',
                  margin: '0 0 6px 0',
                  fontWeight: '600'
                }}>
                  Muhammad Abdullah
                </h2>
                <div style={{ color: '#cbd5e1', fontSize: '13.5px', fontWeight: '500' }}>
                  Full Stack MERN Engineer • Enterprise Systems Specialist
                </div>
              </div>
            </div>

            <p style={{ color: '#94a3b8', fontSize: '14.5px', lineHeight: '1.8', marginBottom: '30px' }}>
              Designed, architected, and engineered the complete end-to-end <strong>LuxuryStay Hotel Management System</strong>. Spearheaded the full-stack implementation encompassing responsive luxury client interfaces, RESTful micro-architectures, role-based security layers, automated room status pipelines, and dynamic billing folio generation.
            </p>

            {/* Direct Connect Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <a 
                href="tel:+923002962350"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '9px', borderRadius: '10px', color: '#d4af37', display: 'flex' }}>
                  <Phone size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Direct Telephone</div>
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
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  textDecoration: 'none',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.5)';
                  e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '9px', borderRadius: '10px', color: '#d4af37', display: 'flex' }}>
                  <Mail size={17} />
                </div>
                <div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Executive Email</div>
                  <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>muhammadabdullah41950@gmail.com</div>
                </div>
              </a>
            </div>
          </div>

          {/* Right Column: Architectural Blueprint Terminal Card */}
          <div style={{
            background: 'rgba(7, 11, 20, 0.9)',
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '22px',
            padding: '32px',
            boxShadow: '0 25px 50px rgba(0,0,0,0.7)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Terminal size={18} color="#d4af37" />
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '19px', margin: 0 }}>
                  System Architecture Blueprint
                </h4>
              </div>
              <span style={{ fontSize: '11px', color: '#10b981', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '4px 12px', borderRadius: '14px', fontWeight: '700', letterSpacing: '1px' }}>
                PRODUCTION
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '30px' }}>
              {[
                'Full MERN Stack architecture (MongoDB, Express.js, React.js, Node.js)',
                'Cryptographic salted Bcrypt password hashing & stateless JWT authorization',
                'Granular Role-Based Access Control (Admin, Manager, Reception, Housekeeping)',
                'Automated room lifecycle pipeline (Available ➔ Occupied ➔ Cleaning)',
                'Itemized dynamic billing folio engine with 13% tax calculation',
                'RESTful API Gateway structured with modular controllers and security middleware'
              ].map((highlight, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: 'rgba(212, 175, 55, 0.14)',
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

            {/* Core Tech Stack Chips */}
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px', fontWeight: '700' }}>
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
      </section>

    </div>
  );
};

export default AboutUs;