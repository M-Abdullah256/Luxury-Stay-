import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  BedDouble, 
  AlertCircle, 
  X,
  Brush
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
      setTasks(tasksRes.data.tasks);
      setRooms(roomsRes.data.rooms);
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
    if (!window.confirm(`Sanitize Room #${roomNumber} and release back to Available inventory?`)) return;
    try {
      await API.patch(`/operations/housekeeping/quick-clean/${roomId}`);
      fetchData(); // Refresh cards & history table instantly
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update room');
    }
  };

  // Complete Scheduled Task
  const handleCompleteTask = async (taskId, roomNumber) => {
    if (!window.confirm(`Mark cleaning completed for Room #${roomNumber}? Room will automatically become Available.`)) return;
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

  const roomsNeedingCleaning = rooms.filter(r => r.status === 'Cleaning');

  const filteredTasks = tasks.filter((t) => 
    statusFilter ? t.status === statusFilter : true
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '4px' }}>
            Housekeeping Operations
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Real-time automatic sanitation queue. Suites checked out by front desk appear here instantly.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-secondary" style={{ fontSize: '13px' }}>
          <Plus size={16} />
          <span>Manual Task Entry</span>
        </button>
      </div>

      {/* 🔴 LIVE AUTOMATIC SECTION: ROOMS CURRENTLY NEEDING CLEANING */}
      <div className="luxury-card" style={{ padding: '24px', border: '1px solid rgba(245, 158, 11, 0.3)', background: 'rgba(245, 158, 11, 0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', padding: '8px', borderRadius: '10px' }}>
              <Brush size={20} />
            </div>
            <div>
              <h3 style={{ color: '#fff', fontSize: '18px', fontWeight: '700' }}>
                Suites Requiring Immediate Sanitization ({roomsNeedingCleaning.length})
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
                These rooms are in "Cleaning" status. Mark them sanitized to automatically release them back to Available.
              </p>
            </div>
          </div>
        </div>

        {roomsNeedingCleaning.length === 0 ? (
          <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '10px', color: '#34d399', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} />
            <span>All hotel suites are fully sanitized! No rooms currently awaiting cleaning.</span>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {roomsNeedingCleaning.map((room) => (
              <div 
                key={room._id} 
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(245, 158, 11, 0.3)',
                  borderRadius: '12px',
                  padding: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BedDouble size={18} color="#fbbf24" />
                    <strong style={{ color: '#fff', fontSize: '16px' }}>Room #{room.roomNumber}</strong>
                  </div>
                  <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                    {room.roomType} • Floor {room.floor}
                  </div>
                  <span className="badge badge-cleaning" style={{ fontSize: '10px', padding: '2px 8px', marginTop: '6px' }}>
                    ● Cleaning Pending
                  </span>
                </div>

                {/* 1-CLICK INSTANT CLEAN & HISTORY LOG BUTTON */}
                <button
                  onClick={() => handleQuickCleanRoom(room._id, room.roomNumber)}
                  className="btn-gold"
                  style={{ padding: '8px 12px', fontSize: '11px', borderRadius: '8px' }}
                >
                  <CheckCircle2 size={14} /> Mark Cleaned
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Sanitation Log & History Table */}
      <div className="luxury-card" style={{ overflowX: 'auto', padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <h4 style={{ color: '#fff', fontSize: '16px' }}>Sanitation Log & History</h4>
          
          <div style={{ display: 'flex', gap: '8px' }}>
            {['', 'Pending', 'Completed'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  background: statusFilter === st ? 'var(--primary-gold)' : 'rgba(255,255,255,0.05)',
                  color: statusFilter === st ? '#0f172a' : '#cbd5e1',
                  border: '1px solid rgba(255,255,255,0.08)',
                  padding: '4px 12px',
                  borderRadius: '6px',
                  fontSize: '11px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {st === '' ? 'All Logs' : st}
              </button>
            ))}
          </div>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '12px' }}>Room</th>
              <th style={{ padding: '12px' }}>Task Category</th>
              <th style={{ padding: '12px' }}>Priority</th>
              <th style={{ padding: '12px' }}>Task Status</th>
              <th style={{ padding: '12px' }}>Cleaned / Logged Date</th>
              <th style={{ padding: '12px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading logs...
                </td>
              </tr>
            ) : filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No historical cleaning tasks recorded yet.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '12px' }}>
                    <strong style={{ color: '#fff' }}>Room #{task.room?.roomNumber}</strong>
                    <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{task.room?.roomType}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#cbd5e1' }}>{task.taskType}</td>
                  <td style={{ padding: '12px' }}>
                    <span style={{
                      padding: '2px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: task.priority === 'High' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: task.priority === 'High' ? '#fb7185' : '#fbbf24'
                    }}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge badge-${task.status === 'Completed' ? 'available' : 'cleaning'}`}>
                      ● {task.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-muted)' }}>
                    {new Date(task.updatedAt || task.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center' }}>
                    {task.status !== 'Completed' ? (
                      <button
                        onClick={() => handleCompleteTask(task._id, task.room?.roomNumber)}
                        className="btn-gold"
                        style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
                      >
                        <CheckCircle2 size={13} /> Clean
                      </button>
                    ) : (
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

      {/* MANUAL SCHEDULE MODAL */}
      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px' }}>Manual Task Assignment</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Select Room *</label>
                <select
                  required
                  value={formData.roomId}
                  onChange={(e) => setFormData({ ...formData, roomId: e.target.value })}
                  style={inputStyle}
                >
                  <option value="">-- Choose Room --</option>
                  {rooms.map((r) => (
                    <option key={r._id} value={r._id}>Room #{r.roomNumber} ({r.status})</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Task Type</label>
                <select
                  value={formData.taskType}
                  onChange={(e) => setFormData({ ...formData, taskType: e.target.value })}
                  style={inputStyle}
                >
                  <option value="Deep Clean">Deep Clean</option>
                  <option value="Routine Cleaning">Routine Cleaning</option>
                  <option value="Linen Change">Linen Change</option>
                  <option value="Turn Down Service">Turn Down Service</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  style={inputStyle}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-gold">Assign Task</button>
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

export default HousekeepingPage;