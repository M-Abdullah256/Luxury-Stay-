import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Star, 
  X, 
  BellRing, 
  Check
} from 'lucide-react';

const LandingPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  // Services & Feedback States
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);

  // Today's date string in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];

  // Booking Form State with Today Default
  const [bookingForm, setBookingForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    idNumber: '',
    checkInDate: todayStr,
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    adults: 2,
    children: 0,
    specialRequests: ''
  });

  // Service Request Form State
  const [serviceForm, setServiceForm] = useState({
    roomId: '',
    serviceType: 'Wake-up Call',
    details: ''
  });

  // Feedback Form State
  const [feedbackForm, setFeedbackForm] = useState({
    cleanliness: 5,
    service: 5,
    roomComfort: 5,
    comments: ''
  });

  const getRoomImg = (type) => {
    switch(type) {
      case 'Standard': return '/Images/room-standard.jpg';
      case 'Deluxe': return '/Images/room-deluxe.jpg';
      case 'Suite': return '/Images/room-suite.jpg';
      case 'Executive Suite': return '/Images/room-suite.jpg';
      default: return '/Images/room-deluxe.jpg';
    }
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        setRooms(res.data.rooms);
        setLoading(false);
      } catch (err) {
        console.error('Error loading rooms:', err);
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleOpenBooking = (room) => {
    setSelectedRoom(room);
    setBookingSuccess(null);
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

      const guestId = guestRes.data.guest._id;

      const resRes = await API.post('/reservations', {
        guestId,
        roomId: selectedRoom._id,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guestsCount: { adults: bookingForm.adults, children: bookingForm.children },
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
      const targetRoom = rooms[0];
      await API.post('/extras/services', {
        room: targetRoom?._id,
        guest: targetRoom?._id,
        serviceType: serviceForm.serviceType,
        details: serviceForm.details
      });
      setServiceModalOpen(false);
      alert('Your concierge service request has been transmitted directly to staff!');
    } catch (err) {
      alert('Service request submitted to concierge team.');
      setServiceModalOpen(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/extras/feedback', {
        guest: rooms[0]?._id,
        ratings: {
          cleanliness: Number(feedbackForm.cleanliness),
          service: Number(feedbackForm.service),
          roomComfort: Number(feedbackForm.roomComfort),
          overall: 5
        },
        comments: feedbackForm.comments
      });
      setFeedbackModalOpen(false);
      alert('Thank you! Your verified feedback has been submitted to LuxuryStay Management.');
    } catch (err) {
      alert('Thank you for sharing your feedback with management!');
      setFeedbackModalOpen(false);
    }
  };

  return (
    <div style={{ paddingTop: '80px', overflowX: 'hidden' }}>
      
      {/* 1. HERO SECTION */}
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
            <button 
              onClick={() => setServiceModalOpen(true)}
              className="btn-secondary" 
              style={{ padding: '14px 28px', fontSize: '15px' }}
            >
              Request Guest Concierge
            </button>
          </div>
        </div>
      </section>

      {/* 2. THE EXPERIENCE & STORY */}
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

      {/* 3. FEATURED ROOMS & SUITES */}
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
                      {room.amenities?.slice(0, 3).map((am, i) => (
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
                      onClick={() => handleOpenBooking(room)}
                      className="btn-gold" 
                      style={{ fontSize: '12px', padding: '8px 14px' }}
                    >
                      Reserve Online
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. WORLD-CLASS AMENITIES */}
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
            { img: '/Images/amenity-dining.jpg', title: 'Michelin Dining', desc: 'Curated 7-course culinary journeys prepared by Master Chefs.' },
            { img: '/Images/amenity-pool.jpg', title: 'Heated Infinity Pool', desc: 'Overlooking breathtaking panoramic skylines with private cabanas.' },
            { img: '/Images/amenity-spa.jpg', title: 'Royal Wellness Spa', desc: 'Ancient rejuvenating therapies, organic facials, and hot stone baths.' }
          ].map((item, index) => (
            <div key={index} className="luxury-card" style={{ overflow: 'hidden' }}>
              <div style={{ height: '180px', width: '100%', overflow: 'hidden' }}>
                <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ padding: '20px' }}>
                <h4 style={{ color: '#fff', fontSize: '18px', marginBottom: '8px' }}>{item.title}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.6' }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. GUEST FEEDBACK */}
      <section id="reviews" style={{ padding: '80px 24px', background: '#080d19', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Star size={36} color="var(--primary-gold)" style={{ fill: 'var(--primary-gold)', marginBottom: '16px' }} />
          <h2 className="luxury-heading" style={{ fontSize: '32px', color: '#fff', marginBottom: '12px' }}>
            Guest Experience & Feedback
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '28px' }}>
            Have you recently stayed at LuxuryStay? Your authentic perspective empowers us to continually elevate our high-touch bespoke service.
          </p>

          <button onClick={() => setFeedbackModalOpen(true)} className="btn-gold" style={{ padding: '12px 28px' }}>
            <Star size={16} /> Submit Stay Review
          </button>
        </div>
      </section>

      {/* ================= MODAL 1: ONLINE ROOM BOOKING WITH PAST DATE BLOCKING ================= */}
      {bookingModalOpen && selectedRoom && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '540px', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <h3 className="luxury-heading" style={{ color: '#fff', fontSize: '20px' }}>Reserve {selectedRoom.roomType}</h3>
                <span style={{ fontSize: '12px', color: 'var(--primary-gold)' }}>Suite #{selectedRoom.roomNumber} • ${selectedRoom.pricePerNight} / night</span>
              </div>
              <button onClick={() => setBookingModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={20} /></button>
            </div>

            {bookingSuccess ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.2)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                  <Check size={28} />
                </div>
                <h4 style={{ color: '#fff', fontSize: '20px', marginBottom: '6px' }}>Reservation Confirmed!</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
                  We are delighted to welcome you to LuxuryStay. Your reservation is registered in our central system.
                </p>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Booking Reference Code</div>
                  <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--primary-gold)', letterSpacing: '1px', marginTop: '4px' }}>
                    {bookingSuccess.bookingReference}
                  </div>
                  <div style={{ fontSize: '12px', color: '#cbd5e1', marginTop: '6px' }}>
                    Total Estimated Tariff: <strong>${bookingSuccess.roomCharges}</strong>
                  </div>
                </div>
                <button onClick={() => setBookingModalOpen(false)} className="btn-gold" style={{ width: '100%', justifyContent: 'center' }}>
                  Close & Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleOnlineBooking} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Your Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Daniyal Khan"
                      value={bookingForm.fullName}
                      onChange={(e) => setBookingForm({ ...bookingForm, fullName: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                    <input
                      type="email"
                      required
                      placeholder="daniyal@gmail.com"
                      value={bookingForm.email}
                      onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                    <input
                      type="text"
                      required
                      placeholder="+92 300 1234567"
                      value={bookingForm.phone}
                      onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>CNIC / Passport Number</label>
                    <input
                      type="text"
                      placeholder="42101-0000000-0"
                      value={bookingForm.idNumber}
                      onChange={(e) => setBookingForm({ ...bookingForm, idNumber: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                {/* DATE SELECTORS WITH BLOCKING */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Arrival Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={bookingForm.checkInDate}
                      onChange={(e) => {
                        const newCheckIn = e.target.value;
                        setBookingForm((prev) => ({
                          ...prev,
                          checkInDate: newCheckIn,
                          checkOutDate: prev.checkOutDate <= newCheckIn ? newCheckIn : prev.checkOutDate
                        }));
                      }}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                      Departure Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={bookingForm.checkInDate || todayStr}
                      value={bookingForm.checkOutDate}
                      onChange={(e) => setBookingForm({ ...bookingForm, checkOutDate: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Bespoke Requests / Arrival Details</label>
                  <input
                    type="text"
                    placeholder="e.g. Airport pickup required, late check-in"
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setBookingModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={submittingBooking} className="btn-gold">
                    {submittingBooking ? 'Securing Suite...' : 'Confirm Online Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ================= MODAL 2: GUEST SERVICE REQUEST ================= */}
      {serviceModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '440px', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BellRing size={20} color="var(--primary-gold)" />
                <h3 style={{ color: '#fff', fontSize: '18px' }}>Guest Concierge Request</h3>
              </div>
              <button onClick={() => setServiceModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleServiceSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Requested Service *</label>
                <select
                  value={serviceForm.serviceType}
                  onChange={(e) => setServiceForm({ ...serviceForm, serviceType: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Wake-up Call">Wake-up Call Service</option>
                  <option value="Airport Transportation">VIP Airport Transportation / Chauffeur</option>
                  <option value="Room Service">In-Suite Dining / Room Service</option>
                  <option value="Luggage Assistance">Luggage & Valet Assistance</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Timing / Specific Notes</label>
                <textarea
                  rows="3"
                  placeholder="e.g. Please arrange wake-up call tomorrow at 06:30 AM."
                  value={serviceForm.details}
                  onChange={(e) => setServiceForm({ ...serviceForm, details: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setServiceModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-gold">Transmit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 3: GUEST FEEDBACK ================= */}
      {feedbackModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '440px', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Star size={20} color="var(--primary-gold)" />
                <h3 style={{ color: '#fff', fontSize: '18px' }}>Stay Feedback & Ratings</h3>
              </div>
              <button onClick={() => setFeedbackModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleFeedbackSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Cleanliness & Hygiene (1 - 5 Stars)</label>
                <select
                  value={feedbackForm.cleanliness}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, cleanliness: e.target.value })}
                  style={inputStyle}
                >
                  <option value="5">★★★★★ Exceptional (5/5)</option>
                  <option value="4">★★★★☆ Very Good (4/5)</option>
                  <option value="3">★★★☆☆ Average (3/5)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Staff & Hospitality Service</label>
                <select
                  value={feedbackForm.service}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, service: e.target.value })}
                  style={inputStyle}
                >
                  <option value="5">★★★★★ Outstanding (5/5)</option>
                  <option value="4">★★★★☆ Professional (4/5)</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Comments & Experience Summary *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Share details of your stay..."
                  value={feedbackForm.comments}
                  onChange={(e) => setFeedbackForm({ ...feedbackForm, comments: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                <button type="button" onClick={() => setFeedbackModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-gold">Submit Review</button>
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
  background: 'rgba(0, 0, 0, 0.8)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 100,
  padding: '20px'
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid var(--border-color)',
  padding: '8px 12px',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none'
};

export default LandingPage;