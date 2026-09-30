import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  BedDouble, 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  RefreshCw, 
  CheckCircle, 
  X,
  Sparkles
} from 'lucide-react';

const RoomsManagement = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Form State for New Room
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Deluxe',
    pricePerNight: '',
    floor: 1,
    adults: 2,
    children: 1,
    amenities: 'High-speed WiFi, Air Conditioning, Smart TV, Mini Bar',
    description: 'Luxury accommodation designed for supreme comfort.'
  });

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await API.get('/rooms');
      setRooms(res.data.rooms);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Quick Status Switcher (SRS Real-time Status Updates)
  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await API.patch(`/rooms/${roomId}/status`, { status: newStatus });
      // Update state locally immediately
      setRooms((prev) =>
        prev.map((r) => (r._id === roomId ? { ...r, status: newStatus } : r))
      );
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room status');
    }
  };

  // Delete Room Handler
  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to remove Room #${roomNumber} from inventory?`)) return;
    try {
      await API.delete(`/rooms/${roomId}`);
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  // Add Room Submit Handler
  const handleCreateRoom = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        roomNumber: formData.roomNumber,
        roomType: formData.roomType,
        pricePerNight: Number(formData.pricePerNight),
        floor: Number(formData.floor),
        capacity: {
          adults: Number(formData.adults),
          children: Number(formData.children)
        },
        amenities: formData.amenities.split(',').map((a) => a.trim()),
        description: formData.description
      };

      await API.post('/rooms', payload);
      setIsModalOpen(false);
      // Reset form
      setFormData({
        roomNumber: '',
        roomType: 'Deluxe',
        pricePerNight: '',
        floor: 1,
        adults: 2,
        children: 1,
        amenities: 'High-speed WiFi, Air Conditioning, Smart TV, Mini Bar',
        description: 'Luxury accommodation designed for supreme comfort.'
      });
      fetchRooms(); // Refresh rooms
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  };

  // Search & Filter Logic
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? room.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '4px' }}>
            Room Inventory Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Maintain physical suites, control real-time operational statuses, and configure nightly tariffs.
          </p>
        </div>

        {/* Add Room Button (Admin & Manager Only) */}
        {['admin', 'manager'].includes(user?.role) && (
          <button onClick={() => setIsModalOpen(true)} className="btn-gold">
            <Plus size={18} />
            <span>Add New Room</span>
          </button>
        )}
      </div>

      {/* Search & Filters Bar */}
      <div className="luxury-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: '240px' }}>
          <div style={{ position: 'relative', width: '100%' }}>
            <Search size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search by room number (e.g. 101)..."
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
        </div>

        {/* Status Filter Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {['', 'Available', 'Occupied', 'Cleaning', 'Maintenance'].map((st) => (
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
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {st === '' ? 'All Statuses' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Rooms Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>Loading inventory...</div>
      ) : filteredRooms.length === 0 ? (
        <div className="luxury-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
          No rooms found matching the criteria.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '20px'
        }}>
          {filteredRooms.map((room) => (
            <div key={room._id} className="luxury-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Header: Room Number & Badge */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: 'rgba(197, 168, 128, 0.1)', color: 'var(--primary-gold)', padding: '6px', borderRadius: '6px' }}>
                      <BedDouble size={20} />
                    </div>
                    <span style={{ fontSize: '18px', fontWeight: '700', color: '#fff' }}>
                      Room #{room.roomNumber}
                    </span>
                  </div>
                  <span className={`badge badge-${room.status.toLowerCase()}`}>
                    ● {room.status}
                  </span>
                </div>

                {/* Details */}
                <div style={{ fontSize: '13px', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                  <div>Type: <strong style={{ color: '#e2e8f0' }}>{room.roomType}</strong></div>
                  <div>Floor: <strong style={{ color: '#e2e8f0' }}>{room.floor}</strong> • Capacity: <strong style={{ color: '#e2e8f0' }}>{room.capacity?.adults} Adults, {room.capacity?.children} Kids</strong></div>
                  <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--primary-gold)', marginTop: '4px' }}>
                    ${room.pricePerNight} <span style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '400' }}>/ night</span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions: Fast Status Switcher Dropdown */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flex: 1 }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Status:</span>
                  <select
                    value={room.status}
                    onChange={(e) => handleStatusChange(room._id, e.target.value)}
                    style={{
                      background: 'rgba(15, 23, 42, 0.9)',
                      border: '1px solid var(--border-color)',
                      color: '#fff',
                      fontSize: '12px',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      outline: 'none',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>

                {/* Admin Delete Action */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                    style={{
                      background: 'rgba(244, 63, 94, 0.1)',
                      border: 'none',
                      color: '#fb7185',
                      padding: '6px',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                    title="Delete Room"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE ROOM MODAL */}
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
          <div className="luxury-card" style={{ width: '100%', maxWidth: '520px', padding: '30px', border: '1px solid rgba(197, 168, 128, 0.3)' }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={20} color="var(--primary-gold)" />
                <h3 className="luxury-heading" style={{ fontSize: '20px', color: '#fff' }}>Add New Room</h3>
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

            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 401"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Room Type *</label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Price Per Night ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="250"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Floor Number *</label>
                  <input
                    type="number"
                    required
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Adults Capacity</label>
                  <input
                    type="number"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Children Capacity</label>
                  <input
                    type="number"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Amenities (comma separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-gold">
                  {submitting ? 'Creating...' : 'Save Room'}
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

export default RoomsManagement;