import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Sparkles, 
  Calendar, 
  Users, 
  ArrowRight, 
  CheckCircle2,
  Utensils,
  Waves,
  HeartHandshake
} from 'lucide-react';

const LandingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Aapki local images jo Client/public/Images/ mein hain
  const getRoomImg = (type) => {
    switch(type) {
      case 'Standard': return '/Images/room-standard.jpg';
      case 'Deluxe': return '/Images/room-deluxe.jpg';
      case 'Suite': return '/Images/room-suite.jpg';
      case 'Executive Suite': return '/Images/room-suite.jpg';
      case 'Presidential Suite': return '/Images/room-deluxe.jpg';
      default: return '/Images/room-deluxe.jpg';
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        setRooms(res.data.rooms.slice(0, 3)); // Featured rooms
        setLoading(false);
      } catch (err) {
        console.error('Error loading rooms:', err);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  return (
    <div style={{ paddingTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION (Using /Images/hero-bg.jpg) */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '60px 24px',
        backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.75), rgba(11, 17, 32, 0.9)), url('/Images/hero-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      }}>
        <div style={{ maxWidth: '900px' }}>
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
            marginBottom: '24px'
          }}>
            <Sparkles size={16} /> Welcome to Ultra-Luxury Living
          </div>

          <h1 className="luxury-heading" style={{
            fontSize: 'clamp(36px, 5vw, 64px)',
            color: '#fff',
            lineHeight: '1.15',
            marginBottom: '20px'
          }}>
            Where Bespoke Grandeur Meets <span style={{ color: 'var(--primary-gold)' }}>Unrivaled Hospitality</span>
          </h1>

          <p style={{
            fontSize: 'clamp(16px, 2vw, 18px)',
            color: '#cbd5e1',
            lineHeight: '1.6',
            maxWidth: '700px',
            margin: '0 auto 40px auto'
          }}>
            Immerse yourself in timeless elegance, private butler service, and Michelin-inspired cuisine crafted exclusively for discerning travelers.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="#rooms" className="btn-gold" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '15px' }}>
              Explore Our Suites <ArrowRight size={18} />
            </a>
            <a href="#experience" className="btn-secondary" style={{ textDecoration: 'none', padding: '14px 28px', fontSize: '15px' }}>
              Discover Experience
            </a>
          </div>
        </div>
      </section>

      {/* 2. THE EXPERIENCE & STORY (Using /Images/about-hotel.jpg) */}
      <section id="experience" style={{ padding: '90px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '60px', alignItems: 'center' }}>
          <div>
            <span style={{ color: 'var(--primary-gold)', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
              The LuxuryStay Standard
            </span>
            <h2 className="luxury-heading" style={{ fontSize: '38px', color: '#fff', margin: '12px 0 20px 0' }}>
              Designed For The Most Discerning Guests
            </h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '24px' }}>
              Every touchpoint at LuxuryStay is curated to inspire. From Italian marble bathrooms and custom Egyptian cotton linens to 24/7 personalized concierge assistance, your comfort is our sacred craft.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                'Automated Smart Check-in & Keyless Digital Access',
                'Personalized In-Suite Culinary Dining Experiences',
                'World-Class Spa Therapies & Heated Infinity Pool',
                'VIP Private Chauffeur & Airport Transportation'
              ].map((item, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <CheckCircle2 size={20} color="var(--primary-gold)" />
                  <span style={{ fontSize: '15px', color: '#e2e8f0' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100%',
              height: '420px',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(197, 168, 128, 0.3)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
            }}>
              <img 
                src="/Images/about-hotel.jpg" 
                alt="Luxury Hotel Lobby" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. FEATURED ROOMS & SUITES (LIVE FROM BACKEND) */}
      <section id="rooms" style={{ padding: '80px 24px', background: '#080d19' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '50px' }}>
            <span style={{ color: 'var(--primary-gold)', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
              Accommodations
            </span>
            <h2 className="luxury-heading" style={{ fontSize: '38px', color: '#fff', marginTop: '10px' }}>
              Exquisite Suites & Residences
            </h2>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              Live real-time inventory connected directly to our Hotel Operations Gateway.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }}>
            {loading ? (
              <p style={{ textAlign: 'center', color: 'var(--text-muted)', gridColumn: '1 / -1' }}>Loading luxury rooms...</p>
            ) : rooms.map((room) => (
              <div key={room._id} className="luxury-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ height: '220px', position: 'relative', overflow: 'hidden' }}>
                  <img 
                    src={getRoomImg(room.roomType)}
                    alt={room.roomType}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  />
                  <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                    <span className={`badge badge-${room.status.toLowerCase()}`}>
                      ● {room.status}
                    </span>
                  </div>
                  <div style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    background: 'rgba(11, 17, 32, 0.85)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: 'var(--primary-gold)',
                    fontWeight: '600'
                  }}>
                    Room #{room.roomNumber} • Floor {room.floor}
                  </div>
                </div>

                <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>{room.roomType}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
                      {room.description}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                      {room.amenities.slice(0, 3).map((am, i) => (
                        <span key={i} style={{ fontSize: '11px', background: 'rgba(255,255,255,0.06)', padding: '4px 8px', borderRadius: '6px', color: '#94a3b8' }}>
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                    <div>
                      <span style={{ fontSize: '22px', fontWeight: '700', color: 'var(--primary-gold)' }}>${room.pricePerNight}</span>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}> / night</span>
                    </div>

                    <button 
                      onClick={() => alert(`Please contact front desk or staff login to book Room #${room.roomNumber}`)}
                      className="btn-gold" 
                      style={{ fontSize: '12px', padding: '8px 14px' }}
                    >
                      Reserve Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WORLD-CLASS AMENITIES (Using your Pool, Spa, Dining images) */}
      <section id="amenities" style={{ padding: '90px 24px', maxWidth: '1280px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <span style={{ color: 'var(--primary-gold)', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
            Exclusive Services
          </span>
          <h2 className="luxury-heading" style={{ fontSize: '38px', color: '#fff', marginTop: '10px' }}>
            Crafted for Unmatched Leisure
          </h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px' }}>
          {[
            { 
              img: '/Images/amenity-dining.jpg', 
              title: 'Michelin Dining', 
              desc: 'Curated 7-course culinary journeys prepared by Master Chefs.' 
            },
            { 
              img: '/Images/amenity-pool.jpg', 
              title: 'Heated Infinity Pool', 
              desc: 'Overlooking breathtaking panoramic skylines with private cabanas.' 
            },
            { 
              img: '/Images/amenity-spa.jpg', 
              title: 'Royal Wellness Spa', 
              desc: 'Ancient rejuvenating therapies, organic facials, and hot stone baths.' 
            }
          ].map((item, index) => (
            <div key={index} className="luxury-card" style={{ overflow: 'hidden' }}>
              <div style={{ height: '180px', width: '100%', overflow: 'hidden' }}>
                <img 
                  src={item.img} 
                  alt={item.title} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                />
              </div>
              <div style={{ padding: '20px' }}>
                <h4 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default LandingPage;