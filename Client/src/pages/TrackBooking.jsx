import React, { useState } from 'react';
import API from '../api/axios';
import { Search, CalendarCheck, BedDouble, User, Clock, ShieldCheck, AlertCircle } from 'lucide-react';

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
      setErrorMsg(err.response?.data?.message || 'No reservation found matching this reference code.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: '100px', minHeight: '100vh', maxWidth: '800px', margin: '0 auto', padding: '100px 24px 60px 24px' }}>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '36px' }}>
        <span style={{ color: 'var(--primary-gold)', fontSize: '13px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Guest Self-Service Portal
        </span>
        <h1 className="luxury-heading" style={{ fontSize: '36px', color: '#fff', marginTop: '10px' }}>
          Track Your Reservation
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px', marginTop: '8px' }}>
          Enter your unique booking reference code to view live stay status, suite assignments, and tariff records.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="luxury-card" style={{ padding: '28px', border: '1px solid rgba(197, 168, 128, 0.3)', marginBottom: '32px' }}>
        <form onSubmit={handleLookup} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '14px', top: '13px' }} />
            <input
              type="text"
              required
              placeholder="e.g. LS-2613-0M6M"
              value={reference}
              onChange={(e) => setReference(e.target.value.toUpperCase())}
              style={{
                width: '100%',
                background: 'rgba(15, 23, 42, 0.8)',
                border: '1px solid var(--border-color)',
                padding: '12px 14px 12px 42px',
                borderRadius: '10px',
                color: '#fff',
                fontSize: '15px',
                fontWeight: '600',
                letterSpacing: '1px',
                outline: 'none'
              }}
            />
          </div>
          <button type="submit" disabled={loading} className="btn-gold" style={{ padding: '12px 24px', fontSize: '14px' }}>
            {loading ? 'Searching...' : 'Find Reservation'}
          </button>
        </form>

        {errorMsg && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.15)',
            border: '1px solid var(--danger-rose)',
            color: '#fb7185',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            marginTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <AlertCircle size={16} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Display Booking Result */}
      {booking && (
        <div className="luxury-card" style={{ padding: '32px', border: '1px solid rgba(197, 168, 128, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '20px', marginBottom: '20px' }}>
            <div>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Booking Reference</span>
              <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--primary-gold)', letterSpacing: '1px' }}>
                {booking.bookingReference}
              </div>
            </div>

            <span className={`badge badge-${booking.status === 'Checked-In' ? 'occupied' : booking.status === 'Confirmed' ? 'available' : 'reserved'}`} style={{ padding: '6px 14px', fontSize: '13px' }}>
              ● {booking.status}
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginBottom: '24px' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-gold)', marginBottom: '8px' }}>
                <User size={18} /> <strong style={{ fontSize: '13px', color: '#fff' }}>Guest Information</strong>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>{booking.guest?.fullName}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{booking.guest?.phone}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{booking.guest?.email}</div>
            </div>

            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary-gold)', marginBottom: '8px' }}>
                <BedDouble size={18} /> <strong style={{ fontSize: '13px', color: '#fff' }}>Suite Allocation</strong>
              </div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#fff' }}>Room #{booking.room?.roomNumber}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{booking.room?.roomType} • Floor {booking.room?.floor}</div>
              <div style={{ fontSize: '12px', color: 'var(--primary-gold)', fontWeight: '600', marginTop: '2px' }}>
                ${booking.room?.pricePerNight} / night
              </div>
            </div>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '10px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Check-in & Check-out Window</div>
              <div style={{ color: '#fff', fontSize: '14px', fontWeight: '600', marginTop: '2px' }}>
                {new Date(booking.checkInDate).toLocaleDateString()} ➔ {new Date(booking.checkOutDate).toLocaleDateString()}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Total Stay Tariffs</div>
              <div style={{ fontSize: '20px', fontWeight: '700', color: 'var(--primary-gold)' }}>
                ${booking.roomCharges}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default TrackBooking;