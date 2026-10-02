import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  CalendarCheck, 
  Plus, 
  Search, 
  Key, 
  LogOut, 
  X, 
  CheckCircle2,
  Sparkles,
  Users,
  BedDouble,
  Clock,
  ChevronRight,
  ShieldCheck,
  Calendar
} from 'lucide-react';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');
  
  // Today's date string
  const todayStr = new Date().toISOString().split('T')[0];

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Booking Form State with Today Default
  const [formData, setFormData] = useState({
    guestMode: 'existing',
    guestId: '',
    newGuestName: '',
    newGuestEmail: '',
    newGuestPhone: '',
    newGuestIdNumber: '',
    roomId: '',
    checkInDate: todayStr,
    checkOutDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
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
      setReservations(resRes.data.reservations || []);
      setRooms(roomsRes.data.rooms || []);
      setGuests(guestsRes.data.guests || []);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Automated Check-In
  const handleCheckIn = async (reservationId, roomNumber) => {
    if (!window.confirm(`Issue room key card and Check-In guest for Suite #${roomNumber}?`)) return;
    try {
      await API.patch(`/reservations/${reservationId}/check-in`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-in failed');
    }
  };

  // Automated Check-Out
  const handleCheckOut = async (reservationId, roomNumber) => {
    if (!window.confirm(`Finalize stay and Check-Out Suite #${roomNumber}? Room will be automatically transferred to Housekeeping.`)) return;
    try {
      await API.patch(`/reservations/${reservationId}/check-out`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Check-out failed');
    }
  };

  // Create Reservation Handler
  const handleCreateReservation = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      let finalGuestId = formData.guestId;

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
      fetchData();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Failed to create reservation');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredReservations = reservations.filter((r) => {
    const matchesSearch = 
      r.bookingReference?.toLowerCase().includes(search.toLowerCase()) ||
      r.guest?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      r.room?.roomNumber?.toString().includes(search);
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#f8fafc', paddingBottom: '60px' }}>
      
      {/* ================= TOP ACTION HEADER ================= */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '16px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        paddingBottom: '20px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#d4af37', fontSize: '11px', fontWeight: '700', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>
            <CalendarCheck size={14} /> Front Desk Ledger
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 3vw, 34px)',
            color: '#ffffff',
            margin: 0,
            fontWeight: '600'
          }}>
            Reservations & Check-In Desk
          </h1>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)} 
          style={{
            background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
            color: '#070b14',
            fontWeight: '700',
            fontSize: '12.5px',
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            padding: '11px 22px',
            borderRadius: '25px',
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
          <Plus size={16} />
          <span>New Reservation</span>
        </button>
      </div>

      {/* ================= SEARCH & STATUS FILTER BAR ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '18px',
        padding: '18px 24px',
        display: 'flex',
        gap: '18px',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Search Input */}
        <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
          <Search size={16} color="#d4af37" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search by reference, resident name, or room #..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(7, 11, 20, 0.85)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              padding: '11px 16px 11px 42px',
              borderRadius: '10px',
              color: '#ffffff',
              fontSize: '13px',
              outline: 'none',
              boxSizing: 'border-box'
            }}
          />
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['', 'Confirmed', 'Checked-In', 'Checked-Out', 'Cancelled'].map((st) => {
            const isSelected = statusFilter === st;
            return (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  background: isSelected ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : 'rgba(255, 255, 255, 0.04)',
                  color: isSelected ? '#070b14' : '#cbd5e1',
                  border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                  padding: '7px 16px',
                  borderRadius: '20px',
                  fontSize: '11.5px',
                  fontWeight: isSelected ? '700' : '500',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {st === '' ? 'All Bookings' : st}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= RESERVATIONS EXECUTIVE TABLE ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ overflowX: 'auto', padding: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                <th style={thStyle}>Reference</th>
                <th style={thStyle}>Resident Details</th>
                <th style={thStyle}>Assigned Suite</th>
                <th style={thStyle}>Stay Duration</th>
                <th style={thStyle}>Total Tariff</th>
                <th style={thStyle}>Operational State</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Front Desk Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '50px', color: '#d4af37' }}>
                    Loading active reservation ledger...
                  </td>
                </tr>
              ) : filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                    No bookings found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const statusBadgeStyle = 
                    res.status === 'Checked-In' ? { bg: 'rgba(56, 189, 248, 0.12)', border: 'rgba(56, 189, 248, 0.35)', color: '#38bdf8' } :
                    res.status === 'Confirmed' ? { bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)', color: '#34d399' } :
                    res.status === 'Checked-Out' ? { bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.35)', color: '#cbd5e1' } :
                    { bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.35)', color: '#fb7185' };

                  return (
                    <tr 
                      key={res._id} 
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Reference Code */}
                      <td style={tdStyle}>
                        <span style={{
                          fontFamily: 'monospace',
                          fontWeight: '700',
                          fontSize: '13px',
                          color: '#d4af37',
                          background: 'rgba(212, 175, 55, 0.08)',
                          border: '1px solid rgba(212, 175, 55, 0.25)',
                          padding: '4px 8px',
                          borderRadius: '6px'
                        }}>
                          {res.bookingReference}
                        </span>
                      </td>

                      {/* Resident Info */}
                      <td style={tdStyle}>
                        <div style={{ color: '#ffffff', fontWeight: '600' }}>{res.guest?.fullName || 'Walk-in Resident'}</div>
                        <div style={{ color: '#94a3b8', fontSize: '11px', marginTop: '2px' }}>{res.guest?.phone || res.guest?.email}</div>
                      </td>

                      {/* Suite Assigned */}
                      <td style={tdStyle}>
                        <div style={{ color: '#ffffff', fontWeight: '600' }}>Suite #{res.room?.roomNumber}</div>
                        <div style={{ color: '#d4af37', fontSize: '11px', marginTop: '2px' }}>{res.room?.roomType} • Floor {res.room?.floor}</div>
                      </td>

                      {/* Stay Duration */}
                      <td style={tdStyle}>
                        <div style={{ color: '#cbd5e1', fontSize: '12px' }}>
                          <span style={{ color: '#94a3b8' }}>In:</span> {new Date(res.checkInDate).toLocaleDateString()}
                        </div>
                        <div style={{ color: '#cbd5e1', fontSize: '12px', marginTop: '2px' }}>
                          <span style={{ color: '#94a3b8' }}>Out:</span> {new Date(res.checkOutDate).toLocaleDateString()}
                        </div>
                      </td>

                      {/* Tariff */}
                      <td style={tdStyle}>
                        <span style={{ fontSize: '15px', fontWeight: '700', color: '#ffffff' }}>
                          ${res.roomCharges}
                        </span>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          letterSpacing: '0.4px',
                          padding: '4px 10px',
                          borderRadius: '14px',
                          background: statusBadgeStyle.bg,
                          border: `1px solid ${statusBadgeStyle.border}`,
                          color: statusBadgeStyle.color,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          ● {res.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        {res.status === 'Confirmed' && (
                          <button
                            onClick={() => handleCheckIn(res._id, res.room?.roomNumber)}
                            style={{
                              background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                              color: '#070b14',
                              fontWeight: '700',
                              padding: '7px 14px',
                              fontSize: '11.5px',
                              borderRadius: '8px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              boxShadow: '0 2px 10px rgba(212, 175, 55, 0.25)'
                            }}
                          >
                            <Key size={13} /> Check-In
                          </button>
                        )}

                        {res.status === 'Checked-In' && (
                          <button
                            onClick={() => handleCheckOut(res._id, res.room?.roomNumber)}
                            style={{
                              background: 'rgba(244, 63, 94, 0.08)',
                              border: '1px solid rgba(244, 63, 94, 0.3)',
                              color: '#fb7185',
                              padding: '7px 14px',
                              fontSize: '11.5px',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '6px',
                              fontWeight: '600',
                              transition: 'all 0.2s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)'}
                          >
                            <LogOut size={13} /> Check-Out
                          </button>
                        )}

                        {res.status === 'Checked-Out' && (
                          <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <CheckCircle2 size={14} /> Completed
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= CREATE RESERVATION MODAL ================= */}
      {isModalOpen && (
        <div style={{
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
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '22px',
            width: '100%',
            maxWidth: '580px',
            padding: '32px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '6px', borderRadius: '8px', color: '#d4af37' }}>
                  <CalendarCheck size={20} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', color: '#fff', margin: 0 }}>
                  Create Desk Reservation
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleCreateReservation} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              {/* Segmented Guest Mode Switcher */}
              <div style={{ display: 'flex', gap: '6px', background: 'rgba(7, 11, 20, 0.85)', padding: '4px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, guestMode: 'existing' })}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: formData.guestMode === 'existing' ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : 'transparent',
                    color: formData.guestMode === 'existing' ? '#070b14' : '#cbd5e1',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Existing Resident Directory
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, guestMode: 'new' })}
                  style={{
                    flex: 1,
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: formData.guestMode === 'new' ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : 'transparent',
                    color: formData.guestMode === 'new' ? '#070b14' : '#cbd5e1',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontSize: '12px',
                    transition: 'all 0.2s ease'
                  }}
                >
                  + New Walk-In Resident
                </button>
              </div>

              {/* Guest Selection */}
              {formData.guestMode === 'existing' ? (
                <div>
                  <label style={fieldLabelStyle}>Select Registered Resident *</label>
                  <select
                    required={formData.guestMode === 'existing'}
                    value={formData.guestId}
                    onChange={(e) => setFormData({ ...formData, guestId: e.target.value })}
                    style={fieldInputStyle}
                  >
                    <option value="">-- Choose Resident Profile --</option>
                    {guests.map((g) => (
                      <option key={g._id} value={g._id} style={{ background: '#0d1527', color: '#fff' }}>
                        {g.fullName} ({g.phone || g.email})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={fieldLabelStyle}>Full Name *</label>
                    <input
                      type="text"
                      required={formData.guestMode === 'new'}
                      placeholder="e.g. Tariq Khan"
                      value={formData.newGuestName}
                      onChange={(e) => setFormData({ ...formData, newGuestName: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Phone Number *</label>
                    <input
                      type="text"
                      required={formData.guestMode === 'new'}
                      placeholder="+92 300 1234567"
                      value={formData.newGuestPhone}
                      onChange={(e) => setFormData({ ...formData, newGuestPhone: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>Email Address *</label>
                    <input
                      type="email"
                      required={formData.guestMode === 'new'}
                      placeholder="guest@gmail.com"
                      value={formData.newGuestEmail}
                      onChange={(e) => setFormData({ ...formData, newGuestEmail: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                  <div>
                    <label style={fieldLabelStyle}>CNIC / Passport Number *</label>
                    <input
                      type="text"
                      required={formData.guestMode === 'new'}
                      placeholder="42101-1234567-1"
                      value={formData.newGuestIdNumber}
                      onChange={(e) => setFormData({ ...formData, newGuestIdNumber: e.target.value })}
                      style={fieldInputStyle}
                    />
                  </div>
                </div>
              )}

              {/* Suite Selection */}
              <div>
                <label style={fieldLabelStyle}>Assign Available Suite *</label>
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="">-- Choose Available Suite --</option>
                  {rooms.map((rm) => (
                    <option key={rm._id} value={rm._id} style={{ background: '#0d1527', color: '#fff' }}>
                      Suite #{rm.roomNumber} - {rm.roomType} (${rm.pricePerNight} / night)
                    </option>
                  ))}
                </select>
              </div>

              {/* DATES WITH BLOCKING */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Arrival Date *</label>
                  <input
                    type="date"
                    required
                    min={todayStr}
                    value={formData.checkInDate}
                    onChange={(e) => {
                      const newCheckIn = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        checkInDate: newCheckIn,
                        checkOutDate: prev.checkOutDate <= newCheckIn ? newCheckIn : prev.checkOutDate
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
                    min={formData.checkInDate || todayStr}
                    value={formData.checkOutDate}
                    onChange={(e) => setFormData({ ...formData, checkOutDate: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

              {/* Special Requests */}
              <div>
                <label style={fieldLabelStyle}>Special Arrival Requests / Notes</label>
                <input
                  type="text"
                  placeholder="e.g. VIP Airport pickup, high floor requested"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '6px' }}>
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
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
                  disabled={submitting} 
                  style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                    color: '#070b14',
                    fontWeight: '700',
                    fontSize: '13px',
                    padding: '9px 22px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
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

const thStyle = {
  padding: '14px 18px',
  fontWeight: '600',
  fontSize: '12px',
  textTransform: 'uppercase',
  letterSpacing: '0.8px'
};

const tdStyle = {
  padding: '14px 18px'
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

export default Reservations;