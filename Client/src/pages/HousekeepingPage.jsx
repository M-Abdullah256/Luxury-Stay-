import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  BedDouble, 
  AlertCircle, 
  X,
  Brush,
  Clock,
  ShieldCheck,
  Check,
  Layers
} from 'lucide-react';

const HousekeepingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal State for manual override
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    taskType: 'Deep Clean',
    priority: 'High'
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tasksRes, roomsRes] = await Promise.all([
        API.get('/operations/housekeeping'),
        API.get('/rooms')
      ]);
      setTasks(tasksRes.data.tasks || []);
      setRooms(roomsRes.data.rooms || []);
    } catch (err) {
      console.error('Error fetching housekeeping data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // AUTOMATED 1-CLICK CLEAN: Releases Room to Available AND Records in History Log!
  const handleQuickCleanRoom = async (roomId, roomNumber) => {
    if (!window.confirm(`Sanitize Suite #${roomNumber} and release back to Available inventory?`)) return;
    try {
      await API.patch(`/operations/housekeeping/quick-clean/${roomId}`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room');
    }
  };

  // Complete Scheduled Task
  const handleCompleteTask = async (taskId, roomNumber) => {
    if (!window.confirm(`Mark cleaning completed for Suite #${roomNumber}? Room will automatically become Available.`)) return;
    try {
      await API.patch(`/operations/housekeeping/${taskId}/complete`);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete task');
    }
  };

  // Manual Task Assignment
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/operations/housekeeping', formData);
      setIsModalOpen(false);
      setFormData({ roomId: '', taskType: 'Deep Clean', priority: 'High' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule task');
    } finally {
      setSubmitting(false);
    }
  };

  const roomsNeedingCleaning = rooms.filter((r) => r.status === 'Cleaning');

  const filteredTasks = tasks.filter((t) => 
    statusFilter ? t.status === statusFilter : true
  );

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
            <Sparkles size={14} /> Sanitation & Hygiene Governance
          </div>
          <h1 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 3vw, 34px)',
            color: '#ffffff',
            margin: 0,
            fontWeight: '600'
          }}>
            Housekeeping Operations
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
          <span>Manual Task Entry</span>
        </button>
      </div>

      {/* ================= LIVE IMMEDIATE SANITATION QUEUE ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        borderRadius: '20px',
        padding: '26px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', padding: '10px', borderRadius: '12px' }}>
              <Brush size={22} />
            </div>
            <div>
              <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '19px', margin: '0 0 3px 0' }}>
                Suites Requiring Immediate Sanitization ({roomsNeedingCleaning.length})
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0 }}>
                Automatic turnover queue. Mark suites sanitized to immediately release them back to active inventory.
              </p>
            </div>
          </div>

          <div style={{
            background: roomsNeedingCleaning.length === 0 ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
            border: `1px solid ${roomsNeedingCleaning.length === 0 ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
            padding: '5px 14px',
            borderRadius: '20px',
            fontSize: '11.5px',
            fontWeight: '700',
            color: roomsNeedingCleaning.length === 0 ? '#34d399' : '#fbbf24',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: roomsNeedingCleaning.length === 0 ? '#10b981' : '#f59e0b' }} />
            {roomsNeedingCleaning.length === 0 ? 'All Suites Ready' : 'Cleaning Queue Active'}
          </div>
        </div>

        {roomsNeedingCleaning.length === 0 ? (
          <div style={{
            padding: '22px',
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '14px',
            color: '#34d399',
            fontSize: '13.5px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle2 size={20} />
            <span>All property suites are fully sanitized and inspected. Zero rooms awaiting turnaround.</span>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 340px))',
            gap: '18px'
          }}>
            {roomsNeedingCleaning.map((room) => (
              <div 
                key={room._id} 
                style={{
                  background: 'rgba(7, 11, 20, 0.9)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '14px',
                  padding: '18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.6)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BedDouble size={18} color="#fbbf24" />
                    <span style={{ color: '#ffffff', fontSize: '18px', fontWeight: '800' }}>
                      Suite #{room.roomNumber}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '3px' }}>
                    {room.roomType} • Floor {room.floor}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.4px',
                    padding: '2px 8px',
                    borderRadius: '10px',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    color: '#fbbf24',
                    display: 'inline-block',
                    marginTop: '8px'
                  }}>
                    ● Turnover Pending
                  </span>
                </div>

                {/* 1-CLICK INSTANT CLEAN BUTTON */}
                <button
                  onClick={() => handleQuickCleanRoom(room._id, room.roomNumber)}
                  style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                    color: '#070b14',
                    fontWeight: '700',
                    fontSize: '11.5px',
                    padding: '9px 15px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 2px 10px rgba(212, 175, 55, 0.3)',
                    transition: 'transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  <Check size={14} strokeWidth={2.5} />
                  <span>Sanitize & Release</span>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ================= SANITATION LOG & HISTORY TABLE ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
      }}>
        {/* Table Top Controls */}
        <div style={{
          padding: '20px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <div>
            <h4 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '18px', margin: '0 0 3px 0' }}>
              Sanitation Task Ledger & Audit
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '12px', margin: 0 }}>
              Chronological log of assigned cleaning activities and completions.
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {['', 'Pending', 'Completed'].map((st) => {
              const isSelected = statusFilter === st;
              return (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  style={{
                    background: isSelected ? 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)' : 'rgba(255, 255, 255, 0.04)',
                    color: isSelected ? '#070b14' : '#cbd5e1',
                    border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontSize: '11.5px',
                    fontWeight: isSelected ? '700' : '500',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {st === '' ? 'All Logs' : st}
                </button>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div style={{ overflowX: 'auto', padding: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                <th style={thStyle}>Assigned Suite</th>
                <th style={thStyle}>Task Category</th>
                <th style={thStyle}>Priority</th>
                <th style={thStyle}>Execution State</th>
                <th style={thStyle}>Cleaned / Logged Date</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: '#d4af37' }}>
                    Loading cleaning ledger...
                  </td>
                </tr>
              ) : filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                    No historical housekeeping tasks recorded.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => {
                  const isCompleted = task.status === 'Completed';

                  return (
                    <tr 
                      key={task._id} 
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Room Details */}
                      <td style={tdStyle}>
                        <strong style={{ color: '#ffffff', fontSize: '14px' }}>Suite #{task.room?.roomNumber}</strong>
                        <div style={{ color: '#d4af37', fontSize: '11px', marginTop: '2px' }}>{task.room?.roomType}</div>
                      </td>

                      {/* Task Category */}
                      <td style={{ ...tdStyle, color: '#e2e8f0', fontWeight: '500' }}>
                        {task.taskType}
                      </td>

                      {/* Priority */}
                      <td style={tdStyle}>
                        <span style={{
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          background: task.priority === 'High' ? 'rgba(244, 63, 94, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          border: `1px solid ${task.priority === 'High' ? 'rgba(244, 63, 94, 0.3)' : 'rgba(245, 158, 11, 0.3)'}`,
                          color: task.priority === 'High' ? '#fb7185' : '#fbbf24'
                        }}>
                          {task.priority}
                        </span>
                      </td>

                      {/* Execution State */}
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          letterSpacing: '0.4px',
                          padding: '4px 10px',
                          borderRadius: '14px',
                          background: isCompleted ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                          border: `1px solid ${isCompleted ? 'rgba(16, 185, 129, 0.35)' : 'rgba(245, 158, 11, 0.35)'}`,
                          color: isCompleted ? '#34d399' : '#fbbf24',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px'
                        }}>
                          ● {task.status}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '12px' }}>
                        {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                      </td>

                      {/* Action */}
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        {!isCompleted ? (
                          <button
                            onClick={() => handleCompleteTask(task._id, task.room?.roomNumber)}
                            style={{
                              background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                              color: '#070b14',
                              fontWeight: '700',
                              fontSize: '11.5px',
                              padding: '6px 14px',
                              borderRadius: '7px',
                              border: 'none',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px'
                            }}
                          >
                            <CheckCircle2 size={13} /> Complete
                          </button>
                        ) : (
                          <span style={{ color: '#10b981', fontSize: '12px', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                            <Check size={14} strokeWidth={2.5} /> Cleaned
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

      {/* ================= MANUAL TASK ENTRY MODAL ================= */}
      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '22px',
            width: '100%',
            maxWidth: '480px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={18} color="#d4af37" />
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', margin: 0 }}>
                  Manual Task Assignment
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={fieldLabelStyle}>Select Suite *</label>
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
                <label style={fieldLabelStyle}>Task Category *</label>
                <select
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="Deep Clean" style={{ background: '#0d1527' }}>Deep Sanitation & Disinfection</option>
                  <option value="Routine Cleaning" style={{ background: '#0d1527' }}>Routine Daily Housekeeping</option>
                  <option value="Linen Change" style={{ background: '#0d1527' }}>Egyptian Cotton Linen Refresh</option>
                  <option value="Turn Down Service" style={{ background: '#0d1527' }}>Evening Turndown Service</option>
                </select>
              </div>

              <div>
                <label style={fieldLabelStyle}>Priority Level</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={fieldInputStyle}
                >
                  <option value="High" style={{ background: '#0d1527' }}>High (Immediate Arrival)</option>
                  <option value="Medium" style={{ background: '#0d1527' }}>Medium (Standard Turnover)</option>
                  <option value="Low" style={{ background: '#0d1527' }}>Low (Routine Inspection)</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-gold" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  {submitting ? 'Assigning...' : 'Assign Task'}
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

export default HousekeepingPage;