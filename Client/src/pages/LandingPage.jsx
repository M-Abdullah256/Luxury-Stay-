import React, { useState, useEffect, useRef } from 'react';
import API from '../api/axios';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  X, 
  BellRing, 
  Check, 
  Info, 
  Shield, 
  Clock, 
  Award, 
  Car, 
  Anchor, 
  GlassWater 
} from 'lucide-react';

const LandingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Twin Seamless Video Crossfade State & Refs
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRef0 = useRef(null);
  const videoRef1 = useRef(null);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomDetailModal, setRoomDetailModal] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Services & Feedback States
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Active Category Filter
  const [activeCategory, setActiveCategory] = useState('All');

  // Dates
  const todayStr = new Date().toISOString().split('T')[0];
  const defaultCheckOut = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  // Booking Form State
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    checkInDate: todayStr,
    checkOutDate: defaultCheckOut,
    adults: 2,
    children: 0,
    specialRequests: ''
  });

  const [serviceForm, setServiceForm] = useState({
    roomNumber: '',
    guestName: '',
    serviceType: 'Wake-up Call',
    details: ''
  });

  const [feedbackForm, setFeedbackForm] = useState({
    guestName: '',
    suiteStayed: '',
    cleanliness: 5,
    service: 5,
    roomComfort: 5,
    comments: ''
  });

  const getRoomImg = (type) => {
    switch (type) {
      case 'Standard': return '/Images/room-standard.jpg';
      case 'Deluxe': return '/Images/room-deluxe.jpg';
      case 'Suite': return '/Images/room-suite.jpg';
      case 'Executive Suite': return '/Images/room-executive.jpg';
      case 'Presidential Suite': return '/Images/room-presidential.jpg';
      default: return '/Images/room-deluxe.jpg';
    }
  };

  // Close modals on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setBookingModalOpen(false);
        setRoomDetailModal(null);
        setServiceModalOpen(false);
        setFeedbackModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        const list = res.data.rooms || [];
        setRooms(list);
        setFilteredRooms(list);
        setLoading(false);
      } catch (err) {
        console.error('Error loading rooms:', err);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleCategoryFilter = (category) => {
    setActiveCategory(category);
    if (category === 'All') {
      setFilteredRooms(rooms);
    } else {
      setFilteredRooms(rooms.filter(r => r.roomType?.toLowerCase().includes(category.toLowerCase())));
    }
  };

  // Seamless Video Crossfade with Pause Handling
  const handleTimeUpdate = (e) => {
    const video = e.target;
    if (!video.duration) return;

    if (video.currentTime >= video.duration - 0.8) {
      if (activeVideo === 0 && videoRef1.current) {
        videoRef1.current.currentTime = 0;
        videoRef1.current.play().catch(() => {});
        setActiveVideo(1);
        setTimeout(() => {
          if (videoRef0.current) videoRef0.current.pause();
        }, 800);
      } else if (activeVideo === 1 && videoRef0.current) {
        videoRef0.current.currentTime = 0;
        videoRef0.current.play().catch(() => {});
        setActiveVideo(0);
        setTimeout(() => {
          if (videoRef1.current) videoRef1.current.pause();
        }, 800);
      }
    }
  };

  const handleOpenBooking = (room) => {
    if (room.status !== 'Available') return;
    setSelectedRoom(room);
    setBookingSuccess(null);
    setRoomDetailModal(null);
    setBookingModalOpen(true);
  };

  const handleOnlineBooking = async (e) => {
    e.preventDefault();
    setSubmittingBooking(true);

    try {
      const guestRes = await API.post('/guests', {
        fullName: bookingForm.fullName,
        email: bookingForm.email,
        phone: bookingForm.phone,
        idNumber: bookingForm.idNumber || 'ONLINE-BOOK'
      });

      const guestId = guestRes.data?.guest?._id || guestRes.data?._id;

      const resRes = await API.post('/reservations', {
        guestId,
        roomId: selectedRoom._id,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guestsCount: { adults: Number(bookingForm.adults), children: Number(bookingForm.children) },
        notes: bookingForm.specialRequests
      });

      setBookingSuccess(resRes.data.reservation);
    } catch (err) {
      alert(err.response?.data?.message || 'Online booking failed. Please verify dates.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/extras/services', {
        roomNumber: serviceForm.roomNumber,
        guestName: serviceForm.guestName,
        serviceType: serviceForm.serviceType,
        details: serviceForm.details
      });
      setServiceModalOpen(false);
      setServiceForm({ roomNumber: '', guestName: '', serviceType: 'Wake-up Call', details: '' });
      alert('Your concierge request has been relayed to the private butler team.');
    } catch (err) {
      alert(err.response?.data?.message || 'Service request submitted to concierge team.');
      setServiceModalOpen(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/extras/feedback', {
        guestName: feedbackForm.guestName,
        suiteStayed: feedbackForm.suiteStayed,
        ratings: {
          cleanliness: Number(feedbackForm.cleanliness),
          service: Number(feedbackForm.service),
          roomComfort: Number(feedbackForm.roomComfort),
          overall: 5
        },
        comments: feedbackForm.comments
      });
      setFeedbackModalOpen(false);
      setFeedbackForm({ guestName: '', suiteStayed: '', cleanliness: 5, service: 5, roomComfort: 5, comments: '' });
      alert('Thank you! Your verified feedback has been submitted to LuxuryStay Management.');
    } catch (err) {
      alert(err.response?.data?.message || 'Thank you for sharing your feedback with management!');
      setFeedbackModalOpen(false);
    }
  };

  return (
    <div style={{ background: 'transparent', color: '#f8fafc', overflowX: 'hidden', minHeight: '100vh' }}>
      
      {/* ================= 1. HERO SECTION ================= */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        padding: '140px 24px 80px 24px',
        overflow: 'hidden'
      }}>
        {/* Layer 1 Video */}
        <video
          ref={videoRef0}
          autoPlay
          muted
          playsInline
          onTimeUpdate={activeVideo === 0 ? handleTimeUpdate : undefined}
          poster="/Images/hero-bg.jpg"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: activeVideo === 0 ? 0.95 : 0,
            transition: 'opacity 0.8s ease-in-out',
            filter: 'brightness(0.9) contrast(1.05)'
          }}
        >
          <source src="/Videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Layer 2 Video */}
        <video
          ref={videoRef1}
          muted
          playsInline
          onTimeUpdate={activeVideo === 1 ? handleTimeUpdate : undefined}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            opacity: activeVideo === 1 ? 0.95 : 0,
            transition: 'opacity 0.8s ease-in-out',
            filter: 'brightness(0.9) contrast(1.05)'
          }}
        >
          <source src="/Videos/hero-bg.mp4" type="video/mp4" />
        </video>

        {/* Radial Dark Vignette */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse at center, rgba(5, 8, 17, 0.2) 0%, rgba(5, 8, 17, 0.6) 65%, #050811 100%)',
          zIndex: 1
        }} />

        <div style={{ maxWidth: '980px', position: 'relative', zIndex: 2 }}>
          
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(5, 8, 17, 0.75)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            backdropFilter: 'blur(12px)',
            padding: '8px 24px',
            borderRadius: '50px',
            marginBottom: '30px',
            boxShadow: '0 8px 25px rgba(0,0,0,0.6)'
          }}>
            <Sparkles size={14} color="#d4af37" />
            <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', color: '#f8fafc' }}>
              A World of Pure Distinction
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(44px, 6.5vw, 84px)',
            color: '#ffffff',
            fontWeight: '600',
            lineHeight: '1.08',
            letterSpacing: '-0.5px',
            marginBottom: '24px',
            textShadow: '0 4px 35px rgba(0, 0, 0, 0.9)'
          }}>
            Where Bespoke Grandeur Meets <br />
            <span style={{
              fontStyle: 'italic',
              background: 'linear-gradient(135deg, #ffffff 0%, #fef08a 50%, #d4af37 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Unrivaled Hospitality
            </span>
          </h1>

          <p style={{
            fontSize: 'clamp(15px, 1.8vw, 19px)',
            color: '#e2e8f0',
            lineHeight: '1.75',
            maxWidth: '660px',
            margin: '0 auto 44px auto',
            fontWeight: '300',
            textShadow: '0 2px 14px rgba(0,0,0,0.9)'
          }}>
            Discover a rare sanctuary of calm elegance, private butler craftsmanship, and Michelin-inspired culinary artistry.
          </p>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            <a 
              href="#rooms" 
              style={{
                textDecoration: 'none',
                background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                color: '#070b14',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '1px',
                textTransform: 'uppercase',
                padding: '16px 36px',
                borderRadius: '40px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                boxShadow: '0 8px 30px rgba(212, 175, 55, 0.35)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span>View Residences</span>
              <ArrowRight size={16} />
            </a>

            <button 
              onClick={() => setServiceModalOpen(true)}
              style={{
                background: 'rgba(5, 8, 17, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.25)',
                color: '#ffffff',
                padding: '16px 32px',
                fontSize: '13px',
                fontWeight: '600',
                letterSpacing: '0.5px',
                borderRadius: '40px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(212, 175, 55, 0.15)';
                e.currentTarget.style.borderColor = '#d4af37';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(5, 8, 17, 0.65)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.25)';
              }}
            >
              <BellRing size={16} color="#d4af37" />
              <span>Private Concierge</span>
            </button>
          </div>

          <div style={{
            marginTop: '70px',
            display: 'flex',
            justifyContent: 'center',
            gap: '40px',
            flexWrap: 'wrap'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px' }}>
              <Award size={16} color="#d4af37" /> 5-Star International Diamond
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px' }}>
              <Clock size={16} color="#d4af37" /> 24/7 Dedicated Butler Desk
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1', fontSize: '13px' }}>
              <Shield size={16} color="#d4af37" /> 100% Discretion & Privacy
            </div>
          </div>

        </div>
      </section>

      {/* ================= 2. ROOMS & SUITES ================= */}
      <section id="rooms" style={{
        padding: '110px 24px',
        maxWidth: '1340px',
        margin: '0 auto',
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '45px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <div style={{ width: '25px', height: '1px', background: '#d4af37' }} />
            <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Accommodations
            </span>
            <div style={{ width: '25px', height: '1px', background: '#d4af37' }} />
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(30px, 4vw, 44px)',
            color: '#ffffff',
            margin: '0 0 22px 0'
          }}>
            Suites, Penthouses & Residences
          </h2>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {['All', 'Standard', 'Deluxe', 'Suite', 'Executive', 'Presidential'].map((cat) => {
              const isSelected = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => handleCategoryFilter(cat)}
                  style={{
                    background: isSelected ? '#d4af37' : 'rgba(255,255,255,0.04)',
                    color: isSelected ? '#070b14' : '#cbd5e1',
                    border: isSelected ? '1px solid #d4af37' : '1px solid rgba(255,255,255,0.08)',
                    padding: '8px 20px',
                    borderRadius: '25px',
                    fontSize: '12px',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat === 'All' ? 'All Residences' : cat}
                </button>
              );
            })}
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 380px))',
          justifyContent: 'center',
          gap: '30px'
        }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1', color: '#d4af37' }}>
              Retrieving live suite availability...
            </div>
          ) : filteredRooms.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', gridColumn: '1 / -1', color: '#94a3b8' }}>
              No suites available in this category.
            </div>
          ) : filteredRooms.map((room) => {
            const isAvailable = room.status === 'Available';
            return (
              <div 
                key={room._id}
                style={{
                  background: '#0d1527',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.25s ease',
                  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {/* Room Image with fallback */}
                <div style={{ position: 'relative', height: '220px', width: '100%', overflow: 'hidden' }}>
                  <img 
                    src={getRoomImg(room.roomType)} 
                    alt={room.roomType}
                    onError={(e) => { e.target.onerror = null; e.target.src = '/Images/room-deluxe.jpg'; }}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  
                  <div style={{ position: 'absolute', top: '12px', right: '12px' }}>
                    <span style={{
                      background: isAvailable ? 'rgba(16, 185, 129, 0.92)' : 'rgba(244, 63, 94, 0.92)',
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: '700',
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      backdropFilter: 'blur(6px)'
                    }}>
                      ● {room.status}
                    </span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    background: 'rgba(7, 11, 20, 0.85)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: '#d4af37',
                    fontWeight: '600'
                  }}>
                    Suite #{room.roomNumber} • Floor {room.floor}
                  </div>
                </div>

                <div style={{ padding: '22px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: '20px',
                      color: '#ffffff',
                      margin: '0 0 8px 0'
                    }}>
                      {room.roomType}
                    </h3>

                    <p style={{ 
                      color: '#94a3b8', 
                      fontSize: '13px', 
                      lineHeight: '1.6', 
                      marginBottom: '16px',
                      minHeight: '42px'
                    }}>
                      {room.description || 'Master-crafted suite offering expansive city views, premium Italian linens, and 24/7 dedicated room concierge.'}
                    </p>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
                      {room.amenities && room.amenities.length > 0 ? (
                        room.amenities.slice(0, 3).map((am, i) => (
                          <span key={i} style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '11px',
                            color: '#cbd5e1',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {am}
                          </span>
                        ))
                      ) : (
                        ['High-Speed Wifi', 'King Bed', 'City View'].map((item, i) => (
                          <span key={i} style={{
                            background: 'rgba(255, 255, 255, 0.04)',
                            border: '1px solid rgba(255, 255, 255, 0.08)',
                            fontSize: '11px',
                            color: '#cbd5e1',
                            padding: '3px 8px',
                            borderRadius: '4px'
                          }}>
                            {item}
                          </span>
                        ))
                      )}
                    </div>
                  </div>

                  <div style={{
                    borderTop: '1px solid rgba(255,255,255,0.06)',
                    paddingTop: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div>
                      <span style={{ fontSize: '24px', fontWeight: '700', color: '#d4af37' }}>
                        ${room.pricePerNight}
                      </span>
                      <span style={{ fontSize: '12px', color: '#94a3b8' }}> / night</span>
                    </div>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => setRoomDetailModal(room)}
                        title="Room Specs"
                        style={{
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.12)',
                          color: '#cbd5e1',
                          padding: '9px 12px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <Info size={14} />
                      </button>

                      <button 
                        onClick={() => handleOpenBooking(room)}
                        disabled={!isAvailable}
                        style={{
                          background: isAvailable ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : '#334155',
                          color: isAvailable ? '#070b14' : '#94a3b8',
                          fontWeight: '700',
                          fontSize: '12px',
                          letterSpacing: '0.4px',
                          textTransform: 'uppercase',
                          padding: '9px 18px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: isAvailable ? 'pointer' : 'not-allowed',
                          boxShadow: isAvailable ? '0 3px 12px rgba(212, 175, 55, 0.25)' : 'none',
                          transition: 'transform 0.15s ease'
                        }}
                        onMouseEnter={(e) => {
                          if (isAvailable) e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseLeave={(e) => {
                          if (isAvailable) e.currentTarget.style.transform = 'translateY(0)';
                        }}
                      >
                        {isAvailable ? 'Reserve Suite' : 'Occupied'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ================= 3. BESPOKE VIP EXPERIENCES ================= */}
      <section style={{
        padding: '100px 24px',
        background: 'transparent',
        borderTop: '1px solid rgba(255,255,255,0.05)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <div style={{ maxWidth: '1300px', margin: '0 auto' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '55px' }}>
            <span style={{ color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Beyond The Suite
            </span>
            <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(30px, 4vw, 44px)', color: '#ffffff', margin: '8px 0 14px 0' }}>
              Signature Resort Privileges
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14.5px', maxWidth: '600px', margin: '0 auto' }}>
              Exclusive experiences reserved exclusively for residents of LuxuryStay Hospitality.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '28px'
          }}>
            <div style={{
              background: '#0d1527',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7)'
            }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img 
                  src="/Images/service-chauffeur.jpg" 
                  alt="VIP Chauffeur" 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/Images/about-hotel.jpg'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', marginBottom: '8px' }}>
                  <Car size={16} />
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Private Fleet</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', marginBottom: '8px' }}>
                  Rolls-Royce Chauffeur Transfer
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                  Complimentary airport escort and city transportation with our dedicated white-glove private drivers.
                </p>
              </div>
            </div>

            <div style={{
              background: '#0d1527',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7)'
            }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img 
                  src="/Images/experience-yacht.jpg" 
                  alt="Private Yacht Charter" 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/Images/amenity-pool.jpg'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', marginBottom: '8px' }}>
                  <Anchor size={16} />
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Maritime Leisure</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', marginBottom: '8px' }}>
                  Private Sunset Yacht Charters
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                  Set sail on private waters with an on-board sommelier, fresh oyster bar, and champagne pairing.
                </p>
              </div>
            </div>

            <div style={{
              background: '#0d1527',
              borderRadius: '20px',
              overflow: 'hidden',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.7)'
            }}>
              <div style={{ height: '220px', overflow: 'hidden' }}>
                <img 
                  src="/Images/experience-lounge.jpg" 
                  alt="Sky Lounge" 
                  onError={(e) => { e.target.onerror = null; e.target.src = '/Images/amenity-dining.jpg'; }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', marginBottom: '8px' }}>
                  <GlassWater size={16} />
                  <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1.5px', textTransform: 'uppercase' }}>Nightlife & Cellar</span>
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', marginBottom: '8px' }}>
                  The 50th-Floor Cigar & Wine Club
                </h3>
                <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6' }}>
                  Members-only access to vintage cognac cellars, rare single malts, and hand-rolled private reserve cigars.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ================= 4. GUEST FEEDBACK & REVIEWS ================= */}
      <section style={{ padding: '90px 24px 110px 24px', background: 'transparent', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', gap: '6px', marginBottom: '14px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} size={20} color="#d4af37" style={{ fill: '#d4af37' }} />
            ))}
          </div>

          <h2 style={{ fontFamily: "'Playfair Display', Georgia, serif", fontSize: 'clamp(30px, 4vw, 42px)', color: '#ffffff', marginBottom: '12px' }}>
            Guest Experience & Verified Impressions
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', lineHeight: '1.7', maxWidth: '640px', margin: '0 auto 28px auto' }}>
            Authentic reflections from residents who have experienced the timeless craftsmanship of LuxuryStay Hospitality.
          </p>

          <button 
            onClick={() => setFeedbackModalOpen(true)}
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
              color: '#070b14',
              fontWeight: '700',
              fontSize: '13px',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              padding: '13px 32px',
              borderRadius: '30px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              marginBottom: '55px',
              boxShadow: '0 6px 20px rgba(212, 175, 55, 0.25)'
            }}
          >
            <Star size={15} /> Submit Stay Review
          </button>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '24px',
            textAlign: 'left'
          }}>
            {[
              {
                name: 'Daniyal Tariq',
                suite: 'Executive Suite • Floor 2',
                rating: 5,
                comment: 'The presidential hospitality is truly unrivaled. The in-suite dining and private butler service exceeded all my expectations.',
                date: 'September 2026'
              },
              {
                name: 'Dr. Sarah Ahmed',
                suite: 'Deluxe Suite • Floor 1',
                rating: 5,
                comment: 'The rooftop heated infinity pool at twilight offers the most tranquil skyline view. Impeccable cleanliness and courteous front desk staff.',
                date: 'September 2026'
              },
              {
                name: 'Hamza Farooq',
                suite: 'Penthouse Residency • Floor 3',
                rating: 5,
                comment: 'Seamless contactless check-in. The room was pristine, and my 06:30 AM wake-up call was handled right on the minute. Outstanding.',
                date: 'October 2026'
              }
            ].map((rev, idx) => (
              <div 
                key={idx}
                style={{
                  background: '#0d1527',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '28px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} size={15} color="#d4af37" style={{ fill: '#d4af37' }} />
                    ))}
                  </div>

                  <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: '1.65', fontStyle: 'italic', marginBottom: '22px' }}>
                    "{rev.comment}"
                  </p>
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: '#ffffff', fontSize: '14px', fontWeight: '700' }}>{rev.name}</div>
                    <div style={{ color: '#d4af37', fontSize: '11px', marginTop: '2px' }}>{rev.suite}</div>
                  </div>
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>{rev.date}</span>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ================= MODAL: QUICK ROOM SPECS DRAWER ================= */}
      {roomDetailModal && (
        <div style={modalBackdropStyle} onClick={() => setRoomDetailModal(null)}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ height: '220px', position: 'relative' }}>
              <img 
                src={getRoomImg(roomDetailModal.roomType)} 
                alt={roomDetailModal.roomType} 
                onError={(e) => { e.target.onerror = null; e.target.src = '/Images/room-deluxe.jpg'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button 
                onClick={() => setRoomDetailModal(null)}
                style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#fff', margin: 0 }}>
                  {roomDetailModal.roomType}
                </h3>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#d4af37' }}>
                  ${roomDetailModal.pricePerNight} <span style={{ fontSize: '12px', color: '#94a3b8' }}>/ night</span>
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '20px' }}>
                {roomDetailModal.description}
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '8px' }}>
                  Suite Features & Inclusions
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {roomDetailModal.amenities?.map((am, i) => (
                    <span key={i} style={{ fontSize: '11.5px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#cbd5e1' }}>
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setRoomDetailModal(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer' }}>Close</button>
                <button 
                  onClick={() => handleOpenBooking(roomDetailModal)} 
                  disabled={roomDetailModal.status !== 'Available'}
                  style={{ 
                    flex: 2, 
                    padding: '10px', 
                    borderRadius: '8px', 
                    background: roomDetailModal.status === 'Available' ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : '#334155', 
                    color: roomDetailModal.status === 'Available' ? '#070b14' : '#94a3b8', 
                    fontWeight: '700', 
                    border: 'none', 
                    cursor: roomDetailModal.status === 'Available' ? 'pointer' : 'not-allowed' 
                  }}
                >
                  {roomDetailModal.status === 'Available' ? 'Reserve This Room' : 'Currently Unavailable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= MODAL: ONLINE ROOM BOOKING ================= */}
      {bookingModalOpen && selectedRoom && (
        <div style={modalBackdropStyle} onClick={() => setBookingModalOpen(false)}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '540px',
              padding: '30px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '21px', margin: 0 }}>
                  Reserve {selectedRoom.roomType}
                </h3>
                <span style={{ fontSize: '12px', color: '#d4af37', fontWeight: '600' }}>
                  Suite #{selectedRoom.roomNumber} • ${selectedRoom.pricePerNight} / night
                </span>
              </div>
              <button 
                onClick={() => setBookingModalOpen(false)} 
                style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '50%', 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  color: '#10b981', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  margin: '0 auto 16px auto'
                }}>
                  <Check size={28} />
                </div>
                <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '22px', marginBottom: '6px' }}>
                  Reservation Confirmed!
                </h4>
                <p style={{ color: '#94a3b8', fontSize: '13px', marginBottom: '20px' }}>
                  Your booking has been registered in the LuxuryStay operations system.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '12px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>Reference Code</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#d4af37', letterSpacing: '1px', marginTop: '4px' }}>
                    {bookingSuccess.bookingReference}
                  </div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px' }}>
                    Estimated Tariff: <strong>${bookingSuccess.roomCharges}</strong>
                  </div>
                </div>
                <button 
                  onClick={() => setBookingModalOpen(false)} 
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                    color: '#070b14',
                    fontWeight: '700',
                    fontSize: '13px',
                    padding: '11px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleOnlineBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daniyal Khan"
                      value={bookingForm.fullName}
                      onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="daniyal@gmail.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+92 300 1234567"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>CNIC / Passport Number</label>
                    <input
                      type="text"
                      placeholder="42101-0000000-0"
                      value={bookingForm.idNumber}
                      onChange={(e) => setBookingForm({ ...bookingForm, idNumber: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Arrival Date *</label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={bookingForm.checkInDate}
                      onChange={(e) => {
                        const newIn = e.target.value;
                        setBookingForm((prev) => ({
                          ...prev,
                          checkInDate: newIn,
                          checkOutDate: prev.checkOutDate <= newIn ? newIn : prev.checkOutDate
                        }));
                      }}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Departure Date *</label>
                    <input
                      type="date"
                      required
                      min={bookingForm.checkInDate || todayStr}
                      value={bookingForm.checkOutDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                {/* Adults and Children Inputs */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Adults *</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      required
                      value={bookingForm.adults}
                      onChange={(e) => setBookingForm({ ...bookingForm, adults: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Children</label>
                    <input
                      type="number"
                      min="0"
                      max="6"
                      value={bookingForm.children}
                      onChange={(e) => setBookingForm({ ...bookingForm, children: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={fieldLabelStyle}>Special Requests / Arrival Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Airport limousine transfer, late check-in"
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                  <button 
                    type="button" 
                    onClick={() => setBookingModalOpen(false)} 
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.15)',
                      color: '#cbd5e1',
                      padding: '9px 18px',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    disabled={submittingBooking} 
                    style={{
                      background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                      color: '#070b14',
                      fontWeight: '700',
                      padding: '9px 22px',
                      borderRadius: '8px',
                      border: 'none',
                      cursor: submittingBooking ? 'not-allowed' : 'pointer',
                      fontSize: '13px'
                    }}
                  >
                    {submittingBooking ? 'Booking...' : 'Confirm Reservation'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL: GUEST CONCIERGE ================= */}
      {serviceModalOpen && (
        <div style={modalBackdropStyle} onClick={() => setServiceModalOpen(false)}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellRing size={18} color="#d4af37" />
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '18px', margin: 0 }}>
                  Guest Concierge Desk
                </h3>
              </div>
              <button onClick={() => setServiceModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleServiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={fieldLabelStyle}>Guest Name / Reservation Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daniyal Tariq"
                  value={serviceForm.guestName}
                  onChange={(e) => setServiceForm({ ...serviceForm, guestName: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Suite / Room Number *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 101 or Presidential Suite"
                  value={serviceForm.roomNumber}
                  onChange={(e) => setServiceForm({ ...serviceForm, roomNumber: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Requested Service *</label>
                <select
                  value={serviceForm.serviceType}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="Wake-up Call">Wake-up Call Service</option>
                  <option value="Airport Transportation">VIP Airport Limousine / Chauffeur</option>
                  <option value="Room Service">In-Suite Michelin Dining / Room Service</option>
                  <option value="Luggage Assistance">Luggage & Valet Assistance</option>
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Timing / Specific Details</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Please arrange wake-up call tomorrow at 06:30 AM."
                  value={serviceForm.details}
                  onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value })}
                  style={{ ...fieldInputStyle, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setServiceModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)', color: '#070b14', fontWeight: '700', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Relay Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: FEEDBACK ================= */}
      {feedbackModalOpen && (
        <div style={modalBackdropStyle} onClick={() => setFeedbackModalOpen(false)}>
          <div 
            style={{
              background: 'rgba(15, 23, 42, 0.98)',
              border: '1px solid rgba(212, 175, 55, 0.35)',
              borderRadius: '20px',
              width: '100%',
              maxWidth: '440px',
              padding: '28px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={18} color="#d4af37" />
                <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#fff', fontSize: '18px', margin: 0 }}>
                  Stay Feedback & Ratings
                </h3>
              </div>
              <button onClick={() => setFeedbackModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={fieldLabelStyle}>Your Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Daniyal Tariq"
                  value={feedbackForm.guestName}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, guestName: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Suite / Room Stayed</label>
                <input
                  type="text"
                  placeholder="e.g. Executive Suite • Floor 2"
                  value={feedbackForm.suiteStayed}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, suiteStayed: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Cleanliness & Hygiene</label>
                <select
                  value={feedbackForm.cleanliness}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, cleanliness: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="5">★★★★★ Exceptional (5/5)</option>
                  <option value="4">★★★★☆ Very Good (4/5)</option>
                  <option value="3">★★★☆☆ Average (3/5)</option>
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Hospitality & Service</label>
                <select
                  value={feedbackForm.service}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, service: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="5">★★★★★ Outstanding (5/5)</option>
                  <option value="4">★★★★☆ Professional (4/5)</option>
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Comments *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Share details of your stay..."
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  style={{ ...fieldInputStyle, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setFeedbackModalOpen(false)} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' }}>Cancel</button>
                <button type="submit" style={{ background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)', color: '#070b14', fontWeight: '700', padding: '8px 18px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Submit</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

const modalBackdropStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  background: 'rgba(0, 0, 0, 0.85)',
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10000,
  padding: '20px'
};

const fieldLabelStyle = {
  fontSize: '11.5px',
  color: '#cbd5e1',
  display: 'block',
  marginBottom: '5px'
};

const fieldInputStyle = {
  width: '100%',
  background: 'rgba(7, 11, 20, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  padding: '10px 12px',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '13px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default LandingPage;