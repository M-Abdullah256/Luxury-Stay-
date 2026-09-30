import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Wrench, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  BedDouble, 
  X 
} from 'lucide-react';

const MaintenancePage = () => {
  const [issues, setIssues] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    roomId: '',
    issueTitle: '',
    description: '',
    priority: 'Medium',
    reportedBy: 'Housekeeping / Staff'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [issuesRes, roomsRes] = await Promise.all([
        API.get('/operations/maintenance'),
        API.get('/rooms')
      ]);
      setIssues(issuesRes.data.issues);
      setRooms(roomsRes.data.rooms);
    } catch (err) {
      console.error('Error fetching maintenance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Resolve Issue (SRS Requirement: Automatically restores Room to Available)
  const handleResolveIssue = async (issueId, roomNumber) => {
    if (!window.confirm(`Confirm resolution of maintenance issue for Room #${roomNumber}? Room will be marked Available.`)) return;
    try {
      await API.patch(`/operations/maintenance/${issueId}/resolve`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve issue');
    }
  };

  // Report Issue
  const handleReportIssue = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/operations/maintenance', formData);
      setIsModalOpen(false);
      setFormData({ roomId: '', issueTitle: '', description: '', priority: 'Medium', reportedBy: 'Staff' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to report issue');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '4px' }}>
            Facility Maintenance Logs
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Track mechanical, HVAC, electrical tickets, and restore suites to pristine condition.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-gold">
          <Plus size={18} />
          <span>Report Maintenance Issue</span>
        </button>
      </div>

      {/* Maintenance Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '30px' }}>Loading issues...</div>
        ) : issues.length === 0 ? (
          <div className="luxury-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No open facility or equipment tickets reported.
          </div>
        ) : (
          issues.map((item) => (
            <div key={item._id} className="luxury-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#fb7185', padding: '6px', borderRadius: '6px' }}>
                      <Wrench size={18} />
                    </div>
                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>
                      Room #{item.room?.roomNumber}
                    </span>
                  </div>
                  <span className={`badge badge-${item.status === 'Resolved' ? 'available' : 'occupied'}`}>
                    ● {item.status}
                  </span>
                </div>

                <h4 style={{ color: '#fff', fontSize: '15px', marginBottom: '6px' }}>{item.issueTitle}</h4>
                <p style={{ color: 'var(--text-muted)', fontSize: '13px', lineHeight: '1.5', marginBottom: '14px' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', gap: '8px', fontSize: '12px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <span>Priority: <strong style={{ color: item.priority === 'Critical' ? '#fb7185' : 'var(--primary-gold)' }}>{item.priority}</strong></span>
                  <span>•</span>
                  <span>Reported by: {item.reportedBy}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  Logged: {new Date(item.createdAt).toLocaleDateString()}
                </span>

                {item.status !== 'Resolved' ? (
                  <button
                    onClick={() => handleResolveIssue(item._id, item.room?.roomNumber)}
                    className="btn-gold"
                    style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
                  >
                    <CheckCircle size={14} /> Resolve Issue
                  </button>
                ) : (
                  <span style={{ color: '#10b981', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle size={14} /> Resolved
                  </span>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* REPORT ISSUE MODAL */}
      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '460px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px' }}>Report Equipment / Room Defect</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleReportIssue} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Room Number *</label>
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">-- Choose Room --</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>Room #{r.roomNumber} ({r.roomType})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Issue Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom AC Not Cooling"
                  value={formData.issueTitle}
                  onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Provide defect details..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Reported By</label>
                  <input
                    type="text"
                    value={formData.reportedBy}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-gold">
                  {submitting ? 'Filing...' : 'Submit Ticket'}
                </button>
              </div>
            </form>
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
  background: 'rgba(0, 0, 0, 0.75)',
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

export default MaintenancePage;