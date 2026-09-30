import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  Key, 
  LogOut, 
  UserCheck, 
  Clock, 
  X, 
  CheckCircle2, 
  AlertCircle,
  BedDouble
} from 'lucide-react';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Booking Form State
  const [formData, setFormData] = useState({
    guestMode: 'existing', // 'existing' or 'new'
    guestId: '',
    newGuestName: '',
    newGuestEmail: '',
    newGuestPhone: '',
    newGuestIdNumber: '',
    roomId: '',
    checkInDate: new Date().toISOString().split('T')[0],
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0], // 2 days ahead
    adults: 2,
    children: 0,
    notes: 'Airport pickup requested'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resRes, roomsRes, guestsRes] = await Promise.all([
        API.get('/reservations'),
        API.get('/rooms?status=Available'),
        API.get('/guests')
      ]);
      setReservations(resRes.data.reservations);
      setRooms(roomsRes.data.rooms);
      setGuests(guestsRes.data.guests);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // AUTOMATED CHECK-IN (Room becomes Occupied)
  const handleCheckIn = async (reservationId, roomNumber) => {
    if (!window.confirm(`Issue room key and Check-In guest for Room #${roomNumber}?`)) return;
    try {
      await API.patch(`/reservations/${reservationId}/check-in`);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    }
  };

  // AUTOMATED CHECK-OUT (Room automatically becomes Cleaning)
  const handleCheckOut = async (reservationId, roomNumber) => {
    if (!window.confirm(`Finalize stay and Check-Out Room #${roomNumber}? Room will be sent to Cleaning.`)) return;
    try {
      await API.patch(`/reservations/${reservationId}/check-out`);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    }
  };

  // CREATE RESERVATION HANDLER
  const handleCreateReservation = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      let finalGuestId = formData.guestId;

      // Agar new guest select kiya hai to pehle guest profile create karo
      if (formData.guestMode === 'new') {
        const guestRes = await API.post('/guests', {
          fullName: formData.newGuestName,
          email: formData.newGuestEmail,
          phone: formData.newGuestPhone,
          idNumber: formData.newGuestIdNumber || 'CNIC-AUTO'
        });
        finalGuestId = guestRes.data.guest._id;
      }

      if (!finalGuestId) {
        throw new Error('Please select or create a guest profile.');
      }

      await API.post('/reservations', {
        guestId: finalGuestId,
        roomId: formData.roomId,
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        guestsCount: { adults: formData.adults, children: formData.children },
        notes: formData.notes
      });

      setIsModalOpen(false);
      fetchData(); // Refresh
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  // Filtered Reservations
  const filteredReservations = reservations.filter((r) => {
    const matchesSearch = 
      r.bookingReference?.toLowerCase().includes(search.toLowerCase()) ||
      r.guest?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.room?.roomNumber?.includes(search);
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '4px' }}>
            Reservations & Front Desk
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Manage room reservations, execute automated check-in with key card issuance, and complete check-outs.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-gold">
          <Plus size={18} />
          <span>New Reservation</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="luxury-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search by reference, guest name or room #..."
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

        {/* Status Filters */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                background: statusFilter === st ? 'var(--primary-gold)' : 'rgba(255,255,255,0.05)',
                color: statusFilter === st ? '#0f172a' : '#cbd5e1',
                border: '1px solid rgba(255,255,255,0.08)',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              {st === '' ? 'All Bookings' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Reservations Table */}
      <div className="luxury-card" style={{ overflowX: 'auto', padding: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px' }}>Reference</th>
              <th style={{ padding: '14px' }}>Guest Details</th>
              <th style={{ padding: '14px' }}>Assigned Suite</th>
              <th style={{ padding: '14px' }}>Stay Duration</th>
              <th style={{ padding: '14px' }}>Total Tariffs</th>
              <th style={{ padding: '14px' }}>Status</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Front Desk Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading reservations...
                </td>
              </tr>
            ) : filteredReservations.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No reservations found matching the filters.
                </td>
              </tr>
            ) : (
              filteredReservations.map((res) => (
                <tr key={res._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  {/* Reference */}
                  <td style={{ padding: '14px', fontWeight: '600', color: 'var(--primary-gold)' }}>
                    {res.bookingReference}
                  </td>

                  {/* Guest */}
                  <td style={{ padding: '14px' }}>
                    <div style={{ color: '#fff', fontWeight: '600' }}>{res.guest?.fullName || 'Walk-in Guest'}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{res.guest?.phone}</div>
                  </td>

                  {/* Room */}
                  <td style={{ padding: '14px' }}>
                    <div style={{ color: '#fff', fontWeight: '500' }}>Room #{res.room?.roomNumber}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{res.room?.roomType}</div>
                  </td>

                  {/* Stay Dates */}
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>
                    <div>In: {new Date(res.checkInDate).toLocaleDateString()}</div>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>
                      Out: {new Date(res.checkOutDate).toLocaleDateString()}
                    </div>
                  </td>

                  {/* Charges */}
                  <td style={{ padding: '14px', fontWeight: '700', color: '#fff' }}>
                    ${res.roomCharges}
                  </td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${res.status === 'Checked-In' ? 'occupied' : res.status === 'Confirmed' ? 'available' : 'reserved'}`}>
                      ● {res.status}
                    </span>
                  </td>

                  {/* Actions (SRS Smooth Check-in & Check-out) */}
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {res.status === 'Confirmed' && (
                      <button
                        onClick={() => handleCheckIn(res._id, res.room?.roomNumber)}
                        className="btn-gold"
                        style={{ padding: '6px 12px', fontSize: '12px', borderRadius: '6px' }}
                      >
                        <Key size={14} /> Check-In
                      </button>
                    )}

                    {res.status === 'Checked-In' && (
                      <button
                        onClick={() => handleCheckOut(res._id, res.room?.roomNumber)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.15)',
                          border: '1px solid var(--danger-rose)',
                          color: '#fb7185',
                          padding: '6px 12px',
                          fontSize: '12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <LogOut size={14} /> Check-Out
                      </button>
                    )}

                    {res.status === 'Checked-Out' && (
                      <span style={{ color: '#10b981', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE RESERVATION MODAL */}
      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '20px'
        }}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '580px', padding: '30px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid rgba(197, 168, 128, 0.3)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CalendarCheck size={20} color="var(--primary-gold)" />
                <h3 className="luxury-heading" style={{ fontSize: '20px', color: '#fff' }}>Create Reservation</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--danger-rose)', color: '#fb7185', padding: '10px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateReservation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Guest Mode Switcher */}
              <div style={{ display: 'flex', gap: '10px', background: 'rgba(15,23,42,0.8)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, guestMode: 'existing' })}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: formData.guestMode === 'existing' ? 'var(--primary-gold)' : 'transparent',
                    color: formData.guestMode === 'existing' ? '#0f172a' : '#cbd5e1',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  Existing Guest Profile
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, guestMode: 'new' })}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '6px',
                    border: 'none',
                    background: formData.guestMode === 'new' ? 'var(--primary-gold)' : 'transparent',
                    color: formData.guestMode === 'new' ? '#0f172a' : '#cbd5e1',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontSize: '12px'
                  }}
                >
                  + New Guest
                </button>
              </div>

              {/* Guest Profile Selection */}
              {formData.guestMode === 'existing' ? (
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Select Guest *</label>
                  <select
                    required={formData.guestMode === 'existing'}
                    value={formData.guestId}
                    onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">-- Choose Guest Profile --</option>
                    {guests.map((g) => (
                      <option key={g._id} value={g._id}>{g.fullName} ({g.phone || g.email})</option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                    <input
                      type="text"
                      required={formData.guestMode === 'new'}
                      placeholder="e.g. Tariq Khan"
                      value={formData.newGuestName}
                      onChange={(e) => setFormData({ ...formData, newGuestName: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                    <input
                      type="text"
                      required={formData.guestMode === 'new'}
                      placeholder="+92 300 1234567"
                      value={formData.newGuestPhone}
                      onChange={(e) => setFormData({ ...formData, newGuestPhone: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                    <input
                      type="email"
                      required={formData.guestMode === 'new'}
                      placeholder="guest@gmail.com"
                      value={formData.newGuestEmail}
                      onChange={(e) => setFormData({ ...formData, newGuestEmail: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>ID / Passport # *</label>
                    <input
                      type="text"
                      required={formData.guestMode === 'new'}
                      placeholder="42101-1234567-1"
                      value={formData.newGuestIdNumber}
                      onChange={(e) => setFormData({ ...formData, newGuestIdNumber: e.target.value })}
                      style={inputStyle}
                    />
                  </div>
                </div>
              )}

              {/* Room Selection */}
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Assign Available Room *</label>
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">-- Choose Available Suite --</option>
                  {rooms.map((rm) => (
                    <option key={rm._id} value={rm._id}>
                      Room #{rm.roomNumber} - {rm.roomType} (${rm.pricePerNight}/night)
                    </option>
                  ))}
                </select>
              </div>

              {/* Dates */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Check-In Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.checkInDate}
                    onChange={(e) => setFormData({ ...formData, checkInDate: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Check-Out Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* Special Requests / Notes */}
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Special Requests / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. Non-smoking room, High floor"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-gold">
                  {submitting ? 'Confirming...' : 'Create Reservation'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
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

export default Reservations;