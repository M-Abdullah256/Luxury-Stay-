import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  BedDouble, 
  Plus, 
  Search, 
  Trash2, 
  Sparkles, 
  X,
  Layers,
  Users,
  DollarSign,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  UploadCloud,
  Image as ImageIcon
} from 'lucide-react';

// ================= CUSTOM LUXURY STATUS DROPDOWN (DOWNWARD & SINGLE-OPEN) =================
const StatusDropdown = ({ currentStatus, isOpen, onToggle, onSelect }) => {
  const statuses = [
    { label: 'Available', color: '#10b981', bg: 'rgba(16, 185, 129, 0.12)', border: 'rgba(16, 185, 129, 0.35)' },
    { label: 'Reserved', color: '#818cf8', bg: 'rgba(129, 140, 248, 0.12)', border: 'rgba(129, 140, 248, 0.35)' },
    { label: 'Occupied', color: '#fb7185', bg: 'rgba(244, 63, 94, 0.12)', border: 'rgba(244, 63, 94, 0.35)' },
    { label: 'Cleaning', color: '#fbbf24', bg: 'rgba(245, 158, 11, 0.12)', border: 'rgba(245, 158, 11, 0.35)' },
    { label: 'Maintenance', color: '#cbd5e1', bg: 'rgba(148, 163, 184, 0.12)', border: 'rgba(148, 163, 184, 0.35)' }
  ];

  const active = statuses.find((s) => s.label === currentStatus) || statuses[0];

  return (
    <div className="status-dropdown-container" style={{ position: 'relative', flex: 1 }}>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        style={{
          width: '100%',
          background: active.bg,
          border: `1px solid ${active.border}`,
          color: active.color,
          fontSize: '12px',
          fontWeight: '700',
          padding: '6px 12px',
          borderRadius: '8px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transition: 'all 0.2s ease',
          boxSizing: 'border-box'
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: active.color }} />
          {active.label}
        </span>
        <ChevronDown 
          size={14} 
          style={{ 
            opacity: 0.8, 
            transform: isOpen ? 'rotate(180deg)' : 'none', 
            transition: 'transform 0.2s' 
          }} 
        />
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          top: 'calc(100% + 6px)',
          left: 0,
          width: '100%',
          background: '#0d1527',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: '10px',
          boxShadow: '0 15px 35px rgba(0, 0, 0, 0.9)',
          zIndex: 1000,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          padding: '4px'
        }}>
          {statuses.map((st) => (
            <div
              key={st.label}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(st.label);
              }}
              style={{
                padding: '7px 10px',
                borderRadius: '6px',
                fontSize: '11.5px',
                fontWeight: '600',
                color: st.color,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: currentStatus === st.label ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                transition: 'background 0.15s ease'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = currentStatus === st.label ? 'rgba(255, 255, 255, 0.08)' : 'transparent'}
            >
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: st.color }} />
              <span>{st.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RoomsManagement = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Single Active Dropdown State
  const [activeDropdownId, setActiveDropdownId] = useState(null);

  // Global Click Listener for dropdown closing
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (!e.target.closest('.status-dropdown-container')) {
        setActiveDropdownId(null);
      }
    };
    document.addEventListener('mousedown', handleGlobalClick);
    return () => document.removeEventListener('mousedown', handleGlobalClick);
  }, []);

  // Form State for New Room (Includes image and imagePreview)
  const [formData, setFormData] = useState({
    roomNumber: '',
    roomType: 'Deluxe',
    pricePerNight: '',
    floor: 1,
    adults: 2,
    children: 1,
    amenities: 'High-speed WiFi, Air Conditioning, Smart TV, Mini Bar',
    description: 'Luxury accommodation designed for supreme comfort.',
    image: '',
    imagePreview: ''
  });

 const getRoomImg = (room) => {
    // Agar database mein uploaded image moojood ho:
    if (room.images && room.images.length > 0 && room.images[0] && room.images[0].trim() !== '') {
      return room.images[0];
    }
    // Warna default tier fallback image:
    switch(room.roomType) {
      case 'Standard': return '/Images/room-standard.jpg';
      case 'Deluxe': return '/Images/room-deluxe.jpg';
      case 'Suite': return '/Images/room-suite.jpg';
      case 'Executive Suite': return '/Images/room-executive.jpg';
      case 'Presidential Suite': return '/Images/room-presidential.jpg';
      default: return '/Images/room-deluxe.jpg';
    }
  };

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const res = await API.get('/rooms');
      setRooms(res.data.rooms || []);
    } catch (err) {
      console.error('Error fetching rooms:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  // Quick Status Switcher
  const handleStatusChange = async (roomId, newStatus) => {
    try {
      await API.patch(`/rooms/${roomId}/status`, { status: newStatus });
      setRooms((prev) =>
        prev.map((r) => (r._id === roomId ? { ...r, status: newStatus } : r))
      );
      setActiveDropdownId(null);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room status');
    }
  };

  // Delete Room Handler
  const handleDeleteRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Are you sure you want to remove Suite #${roomNumber} from central inventory?`)) return;
    try {
      await API.delete(`/rooms/${roomId}`);
      setRooms((prev) => prev.filter((r) => r._id !== roomId));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete room');
    }
  };

  // Image File Upload & Base64 Converter
  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Check file size (Max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Image file size must be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData((prev) => ({
        ...prev,
        image: reader.result,
        imagePreview: reader.result
      }));
    };
    reader.readAsDataURL(file);
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
        description: formData.description,
        images: formData.image ? [formData.image] : [] // <-- Array format for MongoDB
      };

      await API.post('/rooms', payload);
      setIsModalOpen(false);
      setFormData({
        roomNumber: '',
        roomType: 'Deluxe',
        pricePerNight: '',
        floor: 1,
        adults: 2,
        children: 1,
        amenities: 'High-speed WiFi, Air Conditioning, Smart TV, Mini Bar',
        description: 'Luxury accommodation designed for supreme comfort.',
        image: '',
        imagePreview: ''
      });
      fetchRooms();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to create room');
    } finally {
      setSubmitting(false);
    }
  };

  // Search & Filter Logic
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
                          room.roomType.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? room.status === statusFilter : true;
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
            <BedDouble size={14} /> Inventory Governance
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 3vw, 34px)',
            color: '#ffffff',
            margin: 0,
            fontWeight: '600'
          }}>
            Suites & Room Inventory
          </h1>
        </div>

        {/* Add Room Button (Admin & Manager Only) */}
        {['admin', 'manager'].includes(user?.role) && (
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
            <span>Add New Suite</span>
          </button>
        )}
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
        <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
          <Search size={16} color="#d4af37" style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)' }} />
          <input
            type="text"
            placeholder="Search suite number or category (e.g. 101, Executive)..."
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
          {['', 'Available', 'Reserved','Occupied', 'Cleaning', 'Maintenance'].map((st) => {
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
                {st === '' ? 'All Statuses' : st}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= ROOMS INVENTORY GRID ================= */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#d4af37', fontSize: '15px' }}>
          Retrieving live inventory state...
        </div>
      ) : filteredRooms.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'rgba(13, 21, 39, 0.6)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <BedDouble size={36} color="#94a3b8" style={{ marginBottom: '12px', opacity: 0.6 }} />
          <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 6px 0' }}>No Suites Found</h4>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Try clearing your search query or status filter.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 360px))',
          justifyContent: 'center',
          gap: '24px'
        }}>
          {filteredRooms.map((room) => {
            const statusColor = 
              room.status === 'Available' ? '#10b981' :
              room.status === 'Reserved' ? '#818cf8' :
              room.status === 'Occupied' ? '#f43f5e' :
              room.status === 'Cleaning' ? '#f59e0b' : '#94a3b8';

            const isThisDropdownOpen = activeDropdownId === room._id;

            return (
              <div 
                key={room._id} 
                style={{
                  background: '#0d1527',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)',
                  position: 'relative',
                  zIndex: isThisDropdownOpen ? 50 : 1,
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (!isThisDropdownOpen) {
                    e.currentTarget.style.transform = 'translateY(-3px)';
                    e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                {/* Visual Thumbnail & Top Status */}
                <div style={{
                  position: 'relative',
                  height: '160px',
                  width: '100%',
                  borderTopLeftRadius: '16px',
                  borderTopRightRadius: '16px',
                  overflow: 'hidden',
                  background: '#070b14'
                }}>
                  <img 
                    src={getRoomImg(room)} 
                    alt={room.roomType}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(13, 21, 39, 0.95) 0%, transparent 60%)'
                  }} />

                  <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                    <span style={{
                      background: `${statusColor}e6`,
                      color: '#ffffff',
                      fontSize: '10.5px',
                      fontWeight: '700',
                      letterSpacing: '0.4px',
                      textTransform: 'uppercase',
                      padding: '3px 10px',
                      borderRadius: '16px',
                      backdropFilter: 'blur(6px)'
                    }}>
                      ● {room.status}
                    </span>
                  </div>

                  <div style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '14px',
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: '4px'
                  }}>
                    <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff' }}>
                      Suite #{room.roomNumber}
                    </span>
                    <span style={{ fontSize: '11.5px', color: '#d4af37', fontWeight: '600' }}>
                      • Floor {room.floor}
                    </span>
                  </div>
                </div>

                {/* Details Section */}
                <div style={{ padding: '16px 20px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '17px', color: '#ffffff', fontWeight: '600' }}>
                        {room.roomType}
                      </span>
                      <span style={{ fontSize: '16px', fontWeight: '700', color: '#d4af37' }}>
                        ${room.pricePerNight}<span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '400' }}>/nt</span>
                      </span>
                    </div>

                    <div style={{ fontSize: '12px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                      <Users size={13} color="#d4af37" />
                      <span>Capacity: {room.capacity?.adults || 2} Adults, {room.capacity?.children || 0} Kids</span>
                    </div>

                    {/* Amenities pills */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
                      {room.amenities?.slice(0, 3).map((am, i) => (
                        <span key={i} style={{
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          fontSize: '10.5px',
                          color: '#cbd5e1',
                          padding: '2px 7px',
                          borderRadius: '4px'
                        }}>
                          {am}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Actions: Downward Dropdown */}
                  <div style={{
                    borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                    paddingTop: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                      <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' }}>State:</span>
                      <StatusDropdown
                        currentStatus={room.status}
                        isOpen={isThisDropdownOpen}
                        onToggle={() => setActiveDropdownId(isThisDropdownOpen ? null : room._id)}
                        onSelect={(newStatus) => handleStatusChange(room._id, newStatus)}
                      />
                    </div>

                    {/* Admin Delete Action */}
                    {user?.role === 'admin' && (
                      <button
                        onClick={() => handleDeleteRoom(room._id, room.roomNumber)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.08)',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          color: '#fb7185',
                          padding: '7px 9px',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)'}
                        title="Remove Room from Inventory"
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= CREATE ROOM MODAL (WITH IMAGE UPLOAD BOX) ================= */}
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
            maxWidth: '560px',
            padding: '30px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '6px', borderRadius: '8px', color: '#d4af37' }}>
                  <BedDouble size={20} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', color: '#fff', margin: 0 }}>
                  Add New Suite
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

            <form onSubmit={handleCreateRoom} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              
              {/* IMAGE UPLOAD & LIVE PREVIEW BOX */}
              <div>
                <label style={fieldLabelStyle}>Suite Photograph (Optional / Computer Upload)</label>
                
                {formData.imagePreview ? (
                  <div style={{
                    position: 'relative',
                    height: '140px',
                    borderRadius: '10px',
                    overflow: 'hidden',
                    border: '1px solid rgba(212, 175, 55, 0.4)'
                  }}>
                    <img 
                      src={formData.imagePreview} 
                      alt="Room Preview" 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, image: '', imagePreview: '' }))}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0,0,0,0.7)',
                        border: 'none',
                        color: '#fb7185',
                        padding: '5px',
                        borderRadius: '6px',
                        cursor: 'pointer'
                      }}
                      title="Remove image"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ) : (
                  <label style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '20px',
                    borderRadius: '10px',
                    background: 'rgba(7, 11, 20, 0.85)',
                    border: '1.5px dashed rgba(212, 175, 55, 0.3)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease'
                  }}>
                    <UploadCloud size={24} color="#d4af37" />
                    <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
                      Click to upload suite image (PNG, JPG, WebP)
                    </span>
                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>
                      Leave empty to use automatic tier fallback image
                    </span>
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageFileChange} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                )}
              </div>

              {/* Number and Type */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Room Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 501"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Room Type / Tier *</label>
                  <select
                    value={formData.roomType}
                    onChange={(e) => setFormData({ ...formData, roomType: e.target.value })}
                    style={fieldInputStyle}
                  >
                    <option value="Standard">Standard</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Suite">Suite</option>
                    <option value="Executive Suite">Executive Suite</option>
                    <option value="Presidential Suite">Presidential Suite</option>
                  </select>
                </div>
              </div>

              {/* Price and Floor */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Price Per Night ($) *</label>
                  <input
                    type="number"
                    required
                    placeholder="350"
                    value={formData.pricePerNight}
                    onChange={(e) => setFormData({ ...formData, pricePerNight: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Floor Level *</label>
                  <input
                    type="number"
                    required
                    value={formData.floor}
                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

              {/* Capacities */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Adults Capacity</label>
                  <input
                    type="number"
                    value={formData.adults}
                    onChange={(e) => setFormData({ ...formData, adults: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Children Capacity</label>
                  <input
                    type="number"
                    value={formData.children}
                    onChange={(e) => setFormData({ ...formData, children: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

              {/* Amenities */}
              <div>
                <label style={fieldLabelStyle}>Amenities (comma separated)</label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
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
                  {submitting ? 'Registering...' : 'Save Room'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
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

export default RoomsManagement;