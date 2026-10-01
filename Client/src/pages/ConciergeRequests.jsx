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
  Filter
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
      setRequests(res.data.requests);
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
      fetchRequests(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update request');
    }
  };

  // Helper for icons based on service type
  const getServiceIcon = (type) => {
    switch (type) {
      case 'Wake-up Call': return <BellRing size={20} color="#fbbf24" />;
      case 'Airport Transportation': return <Plane size={20} color="#38bdf8" />;
      case 'Room Service': return <Coffee size={20} color="#34d399" />;
      default: return <Luggage size={20} color="var(--primary-gold)" />;
    }
  };

  const filteredRequests = requests.filter((r) => {
    const matchesSearch = 
      r.serviceType?.toLowerCase().includes(search.toLowerCase()) ||
      r.details?.toLowerCase().includes(search.toLowerCase()) ||
      r.room?.roomNumber?.includes(search);
    const matchesStatus = statusFilter ? r.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div>
        <h1 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '4px' }}>
          Guest Concierge & Service Requests
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Live feed of digital requests transmitted from the guest website (Wake-up calls, Airport transport, Room service).
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="luxury-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search by service type, room #, or details..."
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
        <div style={{ display: 'flex', gap: '8px' }}>
          {['', 'Requested', 'Completed'].map((st) => (
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
              {st === '' ? 'All Requests' : st}
            </button>
          ))}
        </div>
      </div>

      {/* Requests Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '30px' }}>Loading concierge requests...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="luxury-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No guest service requests pending in queue.
          </div>
        ) : (
          filteredRequests.map((req) => (
            <div key={req._id} className="luxury-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '8px', borderRadius: '10px' }}>
                      {getServiceIcon(req.serviceType)}
                    </div>
                    <div>
                      <h3 style={{ color: '#fff', fontSize: '16px', fontWeight: '700' }}>{req.serviceType}</h3>
                      <span style={{ fontSize: '11px', color: 'var(--primary-gold)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <BedDouble size={12} /> Room #{req.room?.roomNumber || 'Concierge Desk'}
                      </span>
                    </div>
                  </div>

                  <span className={`badge badge-${req.status === 'Completed' ? 'available' : 'cleaning'}`}>
                    ● {req.status}
                  </span>
                </div>

                {/* Details / Guest notes */}
                <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.04)', marginBottom: '16px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '4px' }}>Specific Request Details:</div>
                  <p style={{ color: '#e2e8f0', fontSize: '13px', lineHeight: '1.5' }}>
                    {req.details || 'No additional details specified by guest.'}
                  </p>
                </div>
              </div>

              {/* Bottom Action */}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Logged: {new Date(req.createdAt).toLocaleDateString()}
                </span>

                {req.status !== 'Completed' ? (
                  <button
                    onClick={() => handleCompleteRequest(req._id)}
                    className="btn-gold"
                    style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
                  >
                    <CheckCircle2 size={13} /> Mark Completed
                  </button>
                ) : (
                  <span style={{ color: '#10b981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={14} /> Completed
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
};

export default ConciergeRequests;