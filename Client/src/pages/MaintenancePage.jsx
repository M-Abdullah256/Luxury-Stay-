import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { 
  Wrench, 
  Plus, 
  CheckCircle, 
  AlertTriangle, 
  BedDouble, 
  X,
  Search,
  Sparkles,
  Clock,
  Trash2, 
  CheckCircle2,
  Check,
  AlertCircle
} from 'lucide-react';

const MaintenancePage = () => {
  const [issues, setIssues] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
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
      setIssues(issuesRes.data.issues || []);
      setRooms(roomsRes.data.rooms || []);
    } catch (err) {
      console.error('Error fetching maintenance:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Resolve Issue (Automatically restores Room to Available)
  const handleResolveIssue = async (issueId, roomNumber) => {
    if (!window.confirm(`Confirm resolution of maintenance issue for Suite #${roomNumber}? Room will be automatically restored to Available inventory.`)) return;
    try {
      await API.patch(`/operations/maintenance/${issueId}/resolve`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to resolve issue');
    }
  };
// Delete Maintenance Issue with Luxury SweetAlert
  const handleDeleteIssue = async (issueId, issueTitle, roomNumber) => {
    const result = await Swal.fire({
      title: '<span style="font-family: \'Playfair Display\', serif; font-size: 22px; color: #fff;">Purge Defect Ticket?</span>',
      html: `
        <p style="color: #94a3b8; font-size: 13.5px; margin-top: 4px; line-height: 1.6;">
          Are you sure you want to remove the resolved maintenance ticket for 
          <span style="white-space: nowrap; display: inline-block; color: #d4af37; font-family: monospace; font-weight: 700; background: rgba(212,175,55,0.1); padding: 2px 8px; border-radius: 6px; border: 1px solid rgba(212,175,55,0.25);">Suite #${roomNumber || 'Facility Area'}</span>: 
          <strong style="color: #ffffff;">"${issueTitle}"</strong>?
        </p>
      `,
      icon: 'warning',
      iconColor: '#d4af37',
      showCancelButton: true,
      confirmButtonText: 'Delete Ticket',
      cancelButtonText: 'Cancel',
      buttonsStyling: false,
      customClass: {
        popup: 'luxury-swal-modal',
        confirmButton: 'luxury-swal-confirm-btn',
        cancelButton: 'luxury-swal-cancel-btn'
      }
    });

    if (result.isConfirmed) {
      try {
        await API.delete(`/operations/maintenance/${issueId}`);
        setIssues((prev) => prev.filter((i) => i._id !== issueId));

        Swal.fire({
          title: '<span style="font-family: \'Playfair Display\', serif; font-size: 20px; color: #fff;">Ticket Purged</span>',
          html: `<p style="color: #94a3b8; font-size: 13px;">Maintenance ticket has been permanently removed.</p>`,
          icon: 'success',
          iconColor: '#10b981',
          confirmButtonText: 'Done',
          buttonsStyling: false,
          customClass: {
            popup: 'luxury-swal-modal',
            confirmButton: 'luxury-swal-gold-btn'
          }
        });
      } catch (err) {
        Swal.fire({
          title: '<span style="font-family: \'Playfair Display\', serif; font-size: 20px; color: #fff;">Error</span>',
          text: err.response?.data?.message || 'Failed to delete maintenance ticket',
          icon: 'error',
          iconColor: '#f43f5e',
          confirmButtonText: 'Dismiss',
          buttonsStyling: false,
          customClass: {
            popup: 'luxury-swal-modal',
            confirmButton: 'luxury-swal-cancel-btn'
          }
        });
      }
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

  // Search & Filter Logic
  const filteredIssues = issues.filter((item) => {
    const matchesSearch = 
      item.issueTitle?.toLowerCase().includes(search.toLowerCase()) ||
      item.description?.toLowerCase().includes(search.toLowerCase()) ||
      item.room?.roomNumber?.toString().includes(search);
    const matchesStatus = statusFilter ? item.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const openTicketsCount = issues.filter((i) => i.status !== 'Resolved').length;

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
            <Wrench size={14} /> Facility Engineering & Asset Care
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 3vw, 34px)',
            color: '#ffffff',
            margin: 0,
            fontWeight: '600'
          }}>
            Maintenance Logs & Defect Tickets
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
          <span>Report Defect Ticket</span>
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
            placeholder="Search by defect title, suite #, or description..."
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
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
          {[
            { label: 'All Tickets', val: '' },
            { label: 'Open Defects', val: 'Pending' },
            { label: 'Resolved', val: 'Resolved' }
          ].map((st) => {
            const isSelected = statusFilter === st.val;
            return (
              <button
                key={st.label}
                onClick={() => setStatusFilter(st.val)}
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
                {st.label}
              </button>
            );
          })}

          <span style={{ color: 'rgba(255,255,255,0.1)', margin: '0 4px' }}>|</span>

          <span style={{ fontSize: '12px', color: openTicketsCount > 0 ? '#fb7185' : '#34d399', fontWeight: '600' }}>
            {openTicketsCount > 0 ? `${openTicketsCount} Active Defect Tickets` : 'Zero Open Defects'}
          </span>
        </div>
      </div>

      {/* ================= MAINTENANCE TICKETS GRID ================= */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#d4af37', fontSize: '15px' }}>
          Retrieving maintenance logs...
        </div>
      ) : filteredIssues.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'rgba(13, 21, 39, 0.6)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <Wrench size={36} color="#94a3b8" style={{ marginBottom: '12px', opacity: 0.6 }} />
          <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 6px 0' }}>No Maintenance Tickets</h4>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>All equipment and property suites are operating normally.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 360px))',
          justifyContent: 'center',
          gap: '24px'
        }}>
          {filteredIssues.map((item) => {
            const isResolved = item.status === 'Resolved';
            
            const priorityColor = 
              item.priority === 'Critical' ? '#f43f5e' :
              item.priority === 'High' ? '#fb923c' :
              item.priority === 'Medium' ? '#d4af37' : '#94a3b8';

            return (
              <div 
                key={item._id} 
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
                  {/* Card Header: Suite Number & State Pill */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ background: 'rgba(212, 175, 55, 0.12)', color: '#d4af37', padding: '8px', borderRadius: '10px' }}>
                        <Wrench size={18} />
                      </div>
                      <span style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff' }}>
                        Suite #{item.room?.roomNumber || 'Facility Area'}
                      </span>
                    </div>

                    <span style={{
                      fontSize: '10.5px',
                      fontWeight: '700',
                      letterSpacing: '0.4px',
                      padding: '3px 10px',
                      borderRadius: '16px',
                      background: isResolved ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                      border: `1px solid ${isResolved ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
                      color: isResolved ? '#34d399' : '#fb7185'
                    }}>
                      ● {item.status || 'Pending'}
                    </span>
                  </div>

                  {/* Issue Title & Description */}
                  <h3 style={{
                    fontFamily: "'Playfair Display', serif",
                    color: '#ffffff',
                    fontSize: '18px',
                    margin: '0 0 8px 0',
                    lineHeight: '1.3'
                  }}>
                    {item.issueTitle}
                  </h3>

                  <div style={{
                    background: 'rgba(7, 11, 20, 0.85)',
                    padding: '12px 14px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    marginBottom: '16px'
                  }}>
                    <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6', margin: 0 }}>
                      {item.description}
                    </p>
                  </div>

                  {/* Priority & Reporter Meta */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '12px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.8px', color: '#64748b' }}>Priority:</span>
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: '6px',
                        fontSize: '11px',
                        fontWeight: '700',
                        color: priorityColor,
                        background: `${priorityColor}15`,
                        border: `1px solid ${priorityColor}35`
                      }}>
                        {item.priority}
                      </span>
                    </div>

                    <span style={{ fontSize: '11.5px', color: '#94a3b8' }}>
                      By: <strong style={{ color: '#e2e8f0' }}>{item.reportedBy}</strong>
                    </span>
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
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <Clock size={12} color="#d4af37" />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </span>

                {!isResolved ? (
                    <button
                      onClick={() => handleResolveIssue(item._id, item.room?.roomNumber)}
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
                      <Check size={14} strokeWidth={2.5} />
                      <span>Resolve & Restore</span>
                    </button>
                  ) : (
                    /* 👇 Resolved hone ke baad Trash/Delete button aayega */
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Resolved
                      </span>

                      <button
                        onClick={() => handleDeleteIssue(item._id, item.issueTitle, item.room?.roomNumber)}
                        style={{
                          background: 'rgba(244, 63, 94, 0.08)',
                          border: '1px solid rgba(244, 63, 94, 0.25)',
                          color: '#fb7185',
                          padding: '6px 9px',
                          borderRadius: '7px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          transition: 'all 0.15s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)'}
                        title="Delete Resolved Ticket"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= REPORT ISSUE MODAL ================= */}
      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '22px',
            width: '100%',
            maxWidth: '500px',
            padding: '32px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '6px', borderRadius: '8px', color: '#d4af37' }}>
                  <Wrench size={20} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', color: '#fff', margin: 0 }}>
                  Report Defect Ticket
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleReportIssue} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={fieldLabelStyle}>Select Defective Suite *</label>
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="">-- Choose Suite --</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id} style={{ background: '#0d1527', color: '#fff' }}>
                      Suite #{r.roomNumber} ({r.roomType} - {r.status})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Defect / Malfunction Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Master Bedroom Climate Control Inoperative"
                  value={formData.issueTitle}
                  onChange={(e) => setFormData({ ...formData, issueTitle: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Technical Defect Description *</label>
                <textarea
                  required
                  rows="3"
                  placeholder="Provide precise equipment symptoms..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  style={{ ...fieldInputStyle, resize: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Severity Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    style={fieldInputStyle}
                  >
                    <option value="Low" style={{ background: '#0d1527' }}>Low (Cosmetic)</option>
                    <option value="Medium" style={{ background: '#0d1527' }}>Medium (Appliance)</option>
                    <option value="High" style={{ background: '#0d1527' }}>High (HVAC / Power)</option>
                    <option value="Critical" style={{ background: '#0d1527' }}>Critical (Room Unusable)</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Logged By Staff</label>
                  <input
                    type="text"
                    value={formData.reportedBy}
                    onChange={(e) => setFormData({ ...formData, reportedBy: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

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
                  {submitting ? 'Transmitting...' : 'Dispatch Ticket'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
{/* Luxury SweetAlert Styling */}
      <style>{`
        .luxury-swal-modal {
          background: rgba(13, 21, 39, 0.98) !important;
          border: 1px solid rgba(212, 175, 55, 0.35) !important;
          border-radius: 20px !important;
          padding: 26px 20px !important;
          box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9) !important;
          backdrop-filter: blur(12px) !important;
        }
        .luxury-swal-confirm-btn {
          background: linear-gradient(135deg, #f43f5e 0%, #be123c 100%) !important;
          color: #ffffff !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          padding: 10px 22px !important;
          border-radius: 10px !important;
          border: none !important;
          cursor: pointer !important;
          margin: 0 6px !important;
          box-shadow: 0 4px 14px rgba(244, 63, 94, 0.35) !important;
        }
        .luxury-swal-cancel-btn {
          background: rgba(255, 255, 255, 0.06) !important;
          border: 1px solid rgba(255, 255, 255, 0.15) !important;
          color: #cbd5e1 !important;
          font-size: 12px !important;
          font-weight: 600 !important;
          padding: 10px 20px !important;
          border-radius: 10px !important;
          cursor: pointer !important;
          margin: 0 6px !important;
        }
        .luxury-swal-gold-btn {
          background: linear-gradient(135deg, #d4af37 0%, #aa7c11 100%) !important;
          color: #070b14 !important;
          font-weight: 700 !important;
          font-size: 12px !important;
          padding: 10px 24px !important;
          border-radius: 10px !important;
          border: none !important;
          cursor: pointer !important;
        }
      `}</style>
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
  zIndex: 1000,
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

export default MaintenancePage;