import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { BedDouble, Search, Sparkles, Filter, Check, X } from 'lucide-react';

const PublicRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Booking Modal
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];

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

const getRoomImg = (type) => {
  switch(type) {
    case 'Standard': return '/Images/room-standard.jpg';
    case 'Deluxe': return '/Images/room-deluxe.jpg';
    case 'Suite': return '/Images/room-suite.jpg';
    case 'Executive Suite': return '/Images/room-executive.jpg';       // <-- Nayi image
    case 'Presidential Suite': return '/Images/room-presidential.jpg'; // <-- Nayi image
    default: return '/Images/room-deluxe.jpg';
  }
};

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        setRooms(res.data.rooms);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
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

      const resRes = await API.post('/reservations', {
        guestId: guestRes.data.guest._id,
        roomId: selectedRoom._id,
        checkInDate: bookingForm.checkInDate,
        checkOutDate: bookingForm.checkOutDate,
        guestsCount: { adults: bookingForm.adults, children: bookingForm.children },
        notes: bookingForm.specialRequests
      });

      setBookingSuccess(resRes.data.reservation);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch = r.roomNumber.includes(search) || r.roomType.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? r.roomType === typeFilter : true;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', maxWidth: '1280px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span style={{ color: 'var(--primary-gold)', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Accommodations Portfolio
        </span>
        <h1 className="luxury-heading" style={{ fontSize: '38px', color: '#fff', marginTop: '10px' }}>
          Suites & Private Sanctuaries
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '8px auto 0 auto', fontSize: '14px' }}>
          Browse our complete real-time inventory of bespoke suites with direct instant confirmation.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="luxury-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search suite category or number..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '1px solid var(--border-color)',
              padding: '10px 14px 10px 38px',
              borderRadius: '8px',
              color: '#fff',
              fontSize: '13px',
              outline: 'none'
            }}
          />
        </div>

        {/* Category Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['', 'Standard', 'Deluxe', 'Suite', 'Executive Suite'].map((tp) => (
            <button
              key={tp}
              onClick={() => setTypeFilter(tp)}
              style={{
                background: typeFilter === tp ? 'var(--primary-gold)' : 'rgba(255,255,255,0.05)',
                color: typeFilter === tp ? '#0f172a' : '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {tp === '' ? 'All Suites' : tp}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>Loading suite catalog...</div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '28px'
        }}>
          {filteredRooms.map((room) => (
            <div key={room._id} className="luxury-card" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '220px', position: 'relative' }}>
                <img 
                  src={getRoomImg(room.roomType)} 
                  alt={room.roomType}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
                  Suite #{room.roomNumber} • Floor {room.floor}
                </div>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ color: '#fff', fontSize: '20px', marginBottom: '8px' }}>{room.roomType}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '16px' }}>
                    {room.description}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                    {room.amenities?.map((am, i) => (
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
                    style={{ fontSize: '12px', padding: '8px 16px' }}
                  >
                    Book Suite
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOOKING MODAL */}
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
                  Your suite reservation is confirmed with LuxuryStay Hospitality.
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
                  Done
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

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Arrival Date *</label>
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
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Departure Date *</label>
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
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Special Arrival Notes</label>
                  <input
                    type="text"
                    placeholder="e.g. Late check-in"
                    value={bookingForm.specialRequests}
                    onChange={(e) => setBookingForm({ ...bookingForm, specialRequests: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                  <button type="button" onClick={() => setBookingModalOpen(false)} className="btn-secondary">Cancel</button>
                  <button type="submit" disabled={submittingBooking} className="btn-gold">
                    {submittingBooking ? 'Securing Suite...' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
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

export default PublicRooms;