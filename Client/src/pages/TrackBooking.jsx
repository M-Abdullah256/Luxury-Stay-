import React, { useState } from 'react';
import API from '../api/axios';
import { 
  Search, 
  CalendarCheck, 
  BedDouble, 
  User, 
  Clock, 
  ShieldCheck, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Calendar,
  CheckCircle2,
  DollarSign
} from 'lucide-react';

const TrackBooking = () => {
  const [reference, setReference] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleLookup = async (e) => {
    e.preventDefault();
    if (!reference.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setBooking(null);

    try {
      const res = await API.get(`/reservations/lookup/${reference.trim()}`);
      setBooking(res.data.reservation);
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'No reservation record found matching this reference code.');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Checked-In':
        return { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8' };
      case 'Confirmed':
        return { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', color: '#34d399' };
      case 'Checked-Out':
        return { bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.35)', color: '#cbd5e1' };
      default:
        return { bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.35)', color: '#fb7185' };
    }
  };

  return (
    <div style={{
      background: 'transparent',
      minHeight: '100vh',
      maxWidth: '920px',
      margin: '0 auto',
      padding: '140px 24px 80px 24px',
      color: '#f8fafc'
    }}>
      
      {/* ================= 1. HEADER SECTION ================= */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.3)',
          padding: '6px 20px',
          borderRadius: '30px',
          color: '#d4af37',
          fontSize: '11.5px',
          fontWeight: '700',
          letterSpacing: '2.5px',
          textTransform: 'uppercase',
          marginBottom: '16px'
        }}>
          <Sparkles size={14} /> Guest Self-Service Console
        </div>

        <h1 style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: 'clamp(32px, 4.2vw, 48px)',
          color: '#ffffff',
          fontWeight: '600',
          lineHeight: '1.15',
          marginBottom: '14px'
        }}>
          Track Your Reservation
        </h1>

        <p style={{
          color: '#94a3b8',
          fontSize: '14.5px',
          maxWidth: '620px',
          margin: '0 auto',
          lineHeight: '1.7',
          fontWeight: '300'
        }}>
          Input your unique reservation reference code to retrieve live stay status, suite allocations, arrival itineraries, and tariff records.
        </p>
      </div>

      {/* ================= 2. SEARCH CONSOLE CARD ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(212, 175, 55, 0.28)',
        borderRadius: '22px',
        padding: '32px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.75)',
        marginBottom: '36px'
      }}>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={18} color="#d4af37" style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              required
              placeholder="e.g. LS-2613-0M6M"
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                background: 'rgba(7, 11, 20, 0.85)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '14px 16px 14px 46px',
                borderRadius: '12px',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '700',
                letterSpacing: '2px',
                fontFamily: 'monospace',
                outline: 'none',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#d4af37'}
              onBlur={(e) => e.target.style.borderColor = 'rgba(255, 255, 255, 0.12)'}
            />
          </div>

          <button 
            type="submit" 
            disabled={loading} 
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
              color: '#070b14',
              fontWeight: '700',
              fontSize: '13px',
              letterSpacing: '0.8px',
              textTransform: 'uppercase',
              padding: '14px 30px',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <span>{loading ? 'Locating Record...' : 'Find Reservation'}</span>
            <ArrowRight size={15} />
          </button>
        </form>

        {/* Error Alert */}
        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.12)',
            border: '1px solid rgba(244, 63, 94, 0.35)',
            color: '#fb7185',
            padding: '14px 18px',
            borderRadius: '12px',
            fontSize: '13px',
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={18} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* ================= 3. VIP DIGITAL BOARDING PASS / ITINERARY RESULT ================= */}
      {booking && (
        <div style={{
          background: '#0d1527',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '24px',
          padding: '36px',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Subtle Ambient Gold Corner Glow */}
          <div style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            background: 'rgba(212, 175, 55, 0.1)',
            borderRadius: '50%',
            filter: 'blur(60px)',
            pointerEvents: 'none'
          }} />

          {/* Result Header: Reference & Status Pill */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            paddingBottom: '22px',
            marginBottom: '26px',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <span style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1.5px', fontWeight: '700' }}>
                Booking Reference Identifier
              </span>
              <div style={{
                fontSize: '28px',
                fontWeight: '800',
                color: '#d4af37',
                letterSpacing: '2px',
                fontFamily: 'monospace',
                marginTop: '4px'
              }}>
                {booking.bookingReference}
              </div>
            </div>

            {(() => {
              const statusStyle = getStatusBadge(booking.status);
              return (
                <span style={{
                  fontSize: '12px',
                  fontWeight: '700',
                  letterSpacing: '0.6px',
                  textTransform: 'uppercase',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  background: statusStyle.bg,
                  border: `1px solid ${statusStyle.border}`,
                  color: statusStyle.color,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  ● {booking.status}
                </span>
              );
            })()}
          </div>

          {/* 2-Column Info Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '22px',
            marginBottom: '26px'
          }}>
            {/* Resident Details */}
            <div style={{
              background: 'rgba(7, 11, 20, 0.85)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', marginBottom: '12px' }}>
                <User size={16} />
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Primary Resident
                </span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                {booking.guest?.fullName || 'Registered Guest'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#cbd5e1' }}>{booking.guest?.phone || 'No phone registered'}</div>
              <div style={{ fontSize: '12.5px', color: '#94a3b8', marginTop: '2px' }}>{booking.guest?.email}</div>
            </div>

            {/* Suite Allocation */}
            <div style={{
              background: 'rgba(7, 11, 20, 0.85)',
              padding: '20px',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.06)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#d4af37', marginBottom: '12px' }}>
                <BedDouble size={16} />
                <span style={{ fontSize: '11px', fontWeight: '700', letterSpacing: '1px', textTransform: 'uppercase' }}>
                  Suite Allocation
                </span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', marginBottom: '4px' }}>
                Suite #{booking.room?.roomNumber || 'Pre-Assigned'}
              </div>
              <div style={{ fontSize: '12.5px', color: '#cbd5e1' }}>
                {booking.room?.roomType} • Floor Level {booking.room?.floor || 1}
              </div>
              <div style={{ fontSize: '12px', color: '#d4af37', fontWeight: '600', marginTop: '4px' }}>
                ${booking.room?.pricePerNight} / night tariff
              </div>
            </div>
          </div>

          {/* Timeline & Tariff Summary Bar */}
          <div style={{
            background: 'rgba(7, 11, 20, 0.85)',
            padding: '22px',
            borderRadius: '16px',
            border: '1px solid rgba(255, 255, 255, 0.06)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '20px'
          }}>
            <div>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                Arrival & Departure Window
              </div>
              <div style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Calendar size={15} color="#d4af37" />
                <span>{new Date(booking.checkInDate).toLocaleDateString()}</span>
                <span style={{ color: '#d4af37' }}>➔</span>
                <span>{new Date(booking.checkOutDate).toLocaleDateString()}</span>
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '11px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700' }}>
                Total Estimated Stay Tariff
              </div>
              <div style={{ fontSize: '24px', fontWeight: '800', color: '#d4af37', fontFamily: 'monospace', marginTop: '2px' }}>
                ${booking.roomCharges}
              </div>
            </div>
          </div>

          {/* Special Requests Banner */}
          {booking.notes && (
            <div style={{
              marginTop: '18px',
              padding: '12px 18px',
              borderRadius: '10px',
              background: 'rgba(212, 175, 55, 0.06)',
              border: '1px solid rgba(212, 175, 55, 0.2)',
              fontSize: '12.5px',
              color: '#cbd5e1'
            }}>
              <strong style={{ color: '#d4af37' }}>Special Requests on Record:</strong> "{booking.notes}"
            </div>
          )}

        </div>
      )}

    </div>
  );
};

export default TrackBooking;