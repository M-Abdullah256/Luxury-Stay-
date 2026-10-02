import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { BedDouble, Search, Sparkles, Check, X, Info } from 'lucide-react';

const PublicRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  // Modals State
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomSpecsModal, setRoomSpecsModal] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [submittingBooking, setSubmittingBooking] = useState(false);

  const todayStr = new Date().toISOString().split('T')[0];
  const defaultCheckOut = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

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
        setRoomSpecsModal(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const res = await API.get('/rooms');
        setRooms(res.data.rooms || []);
      } catch (err) {
        console.error('Error fetching rooms:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, []);

  const handleOpenBooking = (room) => {
    if (room.status !== 'Available') return;
    setSelectedRoom(room);
    setBookingSuccess(null);
    setRoomSpecsModal(null);
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
        guestsCount: { 
          adults: Number(bookingForm.adults), 
          children: Number(bookingForm.children) 
        },
        notes: bookingForm.specialRequests
      });

      setBookingSuccess(resRes.data.reservation);
    } catch (err) {
      alert(err.response?.data?.message || 'Booking failed. Please verify dates and details.');
    } finally {
      setSubmittingBooking(false);
    }
  };

  const filteredRooms = rooms.filter((r) => {
    const matchesSearch = r.roomNumber?.toString().includes(search) || 
                          r.roomType?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter ? r.roomType === typeFilter : true;
    return matchesSearch && matchesType;
  });

  return (
    <div style={{ background: 'transparent', minHeight: '100vh', color: '#f8fafc', padding: '130px 24px 80px 24px' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto' }}>
        
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: '50px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles size={14} /> The Accommodations Portfolio
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(34px, 4.5vw, 52px)',
            color: '#ffffff',
            margin: '0 0 14px 0',
            fontWeight: '600'
          }}>
            Suites & Private Residences
          </h1>
          <p style={{ color: '#94a3b8', maxWidth: '640px', margin: '0 auto', fontSize: '14.5px', lineHeight: '1.7' }}>
            Explore our real-time availability of master-crafted suites. Reserve directly through our secure operations portal with instant confirmation.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          borderRadius: '20px',
          padding: '18px 24px',
          boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          gap: '20px',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '40px'
        }}>
          {/* Search Input */}
          <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
            <Search size={17} color="#d4af37" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              placeholder="Search by suite tier or room number (e.g. 101, Deluxe)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                width: '100%',
                background: 'rgba(7, 11, 20, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '12px 16px 12px 46px',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '13.5px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
            {[
              { label: 'All Suites', val: '' },
              { label: 'Standard', val: 'Standard' },
              { label: 'Deluxe', val: 'Deluxe' },
              { label: 'Suite', val: 'Suite' },
              { label: 'Executive', val: 'Executive Suite' },
              { label: 'Presidential', val: 'Presidential Suite' }
            ].map((item) => {
              const isSelected = typeFilter === item.val;
              return (
                <button
                  key={item.label}
                  onClick={() => setTypeFilter(item.val)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : 'rgba(255,255,255,0.04)',
                    color: isSelected ? '#070b14' : '#cbd5e1',
                    border: isSelected ? 'none' : '1px solid rgba(255,255,255,0.08)',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Live Count Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 6px' }}>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Displaying <strong style={{ color: '#d4af37' }}>{filteredRooms.length}</strong> residences
          </span>
          {typeFilter || search ? (
            <button 
              onClick={() => { setTypeFilter(''); setSearch(''); }}
              style={{ background: 'none', border: 'none', color: '#d4af37', fontSize: '12.5px', cursor: 'pointer', textDecoration: 'underline' }}
            >
              Reset Filters
            </button>
          ) : null}
        </div>

        {/* Rooms Grid */}
        {loading ? (
          <div style={{ textAlign: 'center', color: '#d4af37', padding: '80px 0', fontSize: '15px' }}>
            Retrieving live suite catalog...
          </div>
        ) : filteredRooms.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '70px 20px',
            background: 'rgba(15, 23, 42, 0.5)',
            borderRadius: '20px',
            border: '1px solid rgba(255,255,255,0.06)'
          }}>
            <BedDouble size={40} color="#94a3b8" style={{ marginBottom: '14px', opacity: 0.6 }} />
            <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#ffffff', marginBottom: '8px' }}>
              No Residences Found
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '13.5px', maxWidth: '400px', margin: '0 auto 20px auto' }}>
              We could not find any suites matching "{search || typeFilter}". Try resetting your search filters.
            </p>
            <button
              onClick={() => { setSearch(''); setTypeFilter(''); }}
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                color: '#070b14',
                padding: '10px 22px',
                borderRadius: '20px',
                border: 'none',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Show All Suites
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 380px))',
            justifyContent: 'center',
            gap: '32px'
          }}>
            {filteredRooms.map((room) => {
              const isAvailable = room.status === 'Available';
              return (
                <div 
                  key={room._id} 
                  style={{
                    background: '#0d1527',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '18px',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.25s ease',
                    boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.7)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                  }}
                >
                  {/* Room Image */}
                  <div style={{ height: '230px', position: 'relative', overflow: 'hidden' }}>
                    <img 
                      src={getRoomImg(room.roomType)} 
                      alt={room.roomType}
                      onError={(e) => { e.target.onerror = null; e.target.src = '/Images/room-deluxe.jpg'; }}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    
                    {/* Status Indicator */}
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

                    {/* Room Meta Tag */}
                    <div style={{
                      position: 'absolute',
                      bottom: '12px',
                      left: '12px',
                      background: 'rgba(7, 11, 20, 0.88)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      padding: '5px 12px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      color: '#d4af37',
                      fontWeight: '600'
                    }}>
                      Suite #{room.roomNumber} • Floor {room.floor}
                    </div>
                  </div>

                  {/* Details Body */}
                  <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{
                        fontFamily: "'Playfair Display', Georgia, serif",
                        fontSize: '21px',
                        color: '#ffffff',
                        margin: '0 0 8px 0'
                      }}>
                        {room.roomType}
                      </h3>

                      <p style={{ color: '#94a3b8', fontSize: '13px', lineHeight: '1.6', marginBottom: '16px', minHeight: '42px' }}>
                        {room.description || 'Master-crafted suite offering expansive city views, premium Italian linens, and 24/7 dedicated room concierge.'}
                      </p>

                      {/* Amenities Badges */}
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
                          ['High-Speed Wifi', 'King Bed', 'Skyline View'].map((item, i) => (
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

                    {/* Price & Action Buttons */}
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      paddingTop: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <div>
                        <span style={{ fontSize: '24px', fontWeight: '700', color: '#d4af37' }}>${room.pricePerNight}</span>
                        <span style={{ fontSize: '12px', color: '#94a3b8' }}> / night</span>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => setRoomSpecsModal(room)}
                          title="Suite Details"
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
                          {isAvailable ? 'Book Suite' : 'Occupied'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* MODAL 1: QUICK SPECS DRAWER */}
      {roomSpecsModal && (
        <div style={modalBackdropStyle} onClick={() => setRoomSpecsModal(null)}>
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
                src={getRoomImg(roomSpecsModal.roomType)} 
                alt={roomSpecsModal.roomType} 
                onError={(e) => { e.target.onerror = null; e.target.src = '/Images/room-deluxe.jpg'; }}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button 
                onClick={() => setRoomSpecsModal(null)}
                style={{ position: 'absolute', top: '14px', right: '14px', background: 'rgba(0,0,0,0.6)', border: 'none', color: '#fff', padding: '6px', borderRadius: '50%', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '22px', color: '#fff', margin: 0 }}>
                  {roomSpecsModal.roomType}
                </h3>
                <span style={{ fontSize: '20px', fontWeight: '700', color: '#d4af37' }}>
                  ${roomSpecsModal.pricePerNight} <span style={{ fontSize: '12px', color: '#94a3b8' }}>/ night</span>
                </span>
              </div>
              <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6', marginBottom: '20px' }}>
                {roomSpecsModal.description}
              </p>

              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '10px', marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '8px' }}>
                  Suite Features & Inclusions
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {roomSpecsModal.amenities?.map((am, i) => (
                    <span key={i} style={{ fontSize: '11.5px', background: 'rgba(255,255,255,0.06)', padding: '4px 10px', borderRadius: '6px', color: '#cbd5e1' }}>
                      ✓ {am}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => setRoomSpecsModal(null)} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', cursor: 'pointer' }}>Close</button>
                <button 
                  onClick={() => handleOpenBooking(roomSpecsModal)} 
                  disabled={roomSpecsModal.status !== 'Available'}
                  style={{ 
                    flex: 2, 
                    padding: '10px', 
                    borderRadius: '8px', 
                    background: roomSpecsModal.status === 'Available' ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : '#334155', 
                    color: roomSpecsModal.status === 'Available' ? '#070b14' : '#94a3b8', 
                    fontWeight: '700', 
                    border: 'none', 
                    cursor: roomSpecsModal.status === 'Available' ? 'pointer' : 'not-allowed' 
                  }}
                >
                  {roomSpecsModal.status === 'Available' ? 'Reserve Suite' : 'Currently Unavailable'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: ONLINE ROOM BOOKING */}
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
                          checkOutDate: prev.checkOutDate <= newIn 
                            ? new Date(new Date(newIn).getTime() + 86400000).toISOString().split('T')[0]
                            : prev.checkOutDate
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

export default PublicRooms;