import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  BellRing, 
  Plane, 
  Coffee, 
  Luggage, 
  CheckCircle2, 
  Clock, 
  User, 
  BedDouble, 
  Phone,
  Search,
  Sparkles,
  Car,
  Check
} from 'lucide-react';

const ConciergeRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/extras/services');
      setRequests(res.data.requests || []);
    } catch (err) {
      console.error('Error fetching concierge requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  // Update Status to Completed
  const handleCompleteRequest = async (requestId) => {
    try {
      await API.patch(`/extras/services/${requestId}/status`, { status: 'Completed' });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    }
  };

  // Helper for icons based on service type
  const getServiceIcon = (type) => {
    switch (type) {
      case 'Wake-up Call': 
        return (
          <div style={{ background: 'rgba(251, 191, 36, 0.12)', color: '#fbbf24', padding: '9px', borderRadius: '10px', display: 'flex' }}>
            <BellRing size={18} />
          </div>
        );
      case 'Airport Transportation': 
        return (
          <div style={{ background: 'rgba(56, 189, 248, 0.12)', color: '#38bdf8', padding: '9px', borderRadius: '10px', display: 'flex' }}>
            <Car size={18} />
          </div>
        );
      case 'Room Service': 
        return (
          <div style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#34d399', padding: '9px', borderRadius: '10px', display: 'flex' }}>
            <Coffee size={18} />
          </div>
        );
      default: 
        return (
          <div style={{ background: 'rgba(212, 175, 55, 0.12)', color: '#d4af37', padding: '9px', borderRadius: '10px', display: 'flex' }}>
            <Luggage size={18} />
          </div>
        );
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = 
      r.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
      r.details?.toLowerCase().includes(search.toLowerCase()) ||
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
            <BellRing size={14} /> VIP Butler & Concierge Dispatch
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 3vw, 34px)',
            color: '#ffffff',
            margin: 0,
            fontWeight: '600'
          }}>
            Guest Service Requests
          </h1>
        </div>

        <div style={{
          background: 'rgba(212, 175, 55, 0.1)',
          border: '1px solid rgba(212, 175, 55, 0.25)',
          padding: '7px 16px',
          borderRadius: '20px',
          fontSize: '12px',
          color: '#d4af37',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Sparkles size={14} />
          <span>Live Digital Guest Stream Active</span>
        </div>
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
            placeholder="Search by request type, suite #, or notes..."
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
          {['', 'Requested', 'Completed'].map((st) => {
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
                {st === '' ? 'All Requests' : st === 'Requested' ? 'Pending Action' : 'Completed'}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= REQUESTS CARDS GRID ================= */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#d4af37', fontSize: '15px' }}>
          Retrieving live concierge requests...
        </div>
      ) : filteredRequests.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'rgba(13, 21, 39, 0.6)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <BellRing size={36} color="#94a3b8" style={{ marginBottom: '12px', opacity: 0.6 }} />
          <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 6px 0' }}>No Pending Requests</h4>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>All guest concierge requests have been fulfilled.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 360px))',
          justifyContent: 'center',
          gap: '24px'
        }}>
          {filteredRequests.map((req) => {
            const isCompleted = req.status === 'Completed';

            return (
              <div 
                key={req._id} 
                style={{
                  background: '#0d1527',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.35)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                }}
              >
                <div>
                  {/* Card Header: Icon, Type, Status Pill */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {getServiceIcon(req.serviceType)}
                      <div>
                        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '18px', margin: '0 0 3px 0' }}>
                          {req.serviceType}
                        </h3>
                        <span style={{ fontSize: '11px', color: '#d4af37', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '600' }}>
                          <BedDouble size={12} /> Suite #{req.room?.roomNumber || 'Central Desk'}
                        </span>
                      </div>
                    </div>

                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      letterSpacing: '0.4px',
                      padding: '3px 10px',
                      borderRadius: '16px',
                      background: isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                      border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                      color: isCompleted ? '#34d399' : '#fbbf24'
                    }}>
                      ● {req.status}
                    </span>
                  </div>

                  {/* Specific Request Details Memo */}
                  <div style={{
                    background: 'rgba(7, 11, 20, 0.85)',
                    padding: '14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '18px'
                  }}>
                    <div style={{ fontSize: '10.5px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: '700', marginBottom: '4px' }}>
                      Resident Instructions:
                    </div>
                    <p style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.6', margin: 0, fontStyle: req.details ? 'normal' : 'italic' }}>
                      {req.details ? `"${req.details}"` : 'No specific details specified by resident.'}
                    </p>
                  </div>
                </div>

                {/* Bottom Actions & Timestamp */}
                <div style={{
                  borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                  paddingTop: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <span style={{ fontSize: '11px', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={12} color="#d4af37" />
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>

                  {!isCompleted ? (
                    <button
                      onClick={() => handleCompleteRequest(req._id)}
                      style={{
                        background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                        color: '#070b14',
                        fontWeight: '700',
                        fontSize: '11.5px',
                        padding: '7px 14px',
                        borderRadius: '8px',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 2px 10px rgba(212, 175, 55, 0.25)',
                        transition: 'transform 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                      onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      <CheckCircle2 size={13} />
                      <span>Fulfill Request</span>
                    </button>
                  ) : (
                    <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <Check size={14} strokeWidth={2.5} /> Fulfilled
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default ConciergeRequests;