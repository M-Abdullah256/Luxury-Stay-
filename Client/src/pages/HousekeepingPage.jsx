import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { 
  Sparkles, 
  Plus, 
  CheckCircle2, 
  Clock, 
  BedDouble, 
  AlertCircle, 
  X,
  Filter
} from 'lucide-react';

const HousekeepingPage = () => {
  const [tasks, setTasks] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    roomId: '',
    taskType: 'Routine Cleaning',
    priority: 'Medium'
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

  // Complete Task (SRS Requirement: Automatically marks room as Available!)
  const handleCompleteTask = async (taskId, roomNumber) => {
    if (!window.confirm(`Mark cleaning completed for Room #${roomNumber}? Room will automatically become Available.`)) return;
    try {
      await API.patch(`/operations/housekeeping/${taskId}/complete`);
      fetchData(); // Refresh list
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to complete task');
    }
  };

  // Create New Cleaning Task
  const handleCreateTask = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/operations/housekeeping', formData);
      setIsModalOpen(false);
      setFormData({ roomId: '', taskType: 'Routine Cleaning', priority: 'Medium' });
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to schedule task');
    } finally {
      setSubmitting(false);
    }
  };

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
            Schedule sanitation, monitor deep-cleaning velocity, and release sanitized suites back to inventory.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-gold">
          <Plus size={18} />
          <span>Schedule Cleaning Task</span>
        </button>
      </div>

      {/* Filter Chips */}
      <div className="luxury-card" style={{ padding: '16px 20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Status:</span>
        {['', 'Pending', 'Completed'].map((st) => (
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
            {st === '' ? 'All Tasks' : st}
          </button>
        ))}
      </div>

      {/* Housekeeping Tasks Table */}
      <div className="luxury-card" style={{ overflowX: 'auto', padding: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px' }}>Room</th>
              <th style={{ padding: '14px' }}>Task Type</th>
              <th style={{ padding: '14px' }}>Priority</th>
              <th style={{ padding: '14px' }}>Current Room Status</th>
              <th style={{ padding: '14px' }}>Task Status</th>
              <th style={{ padding: '14px' }}>Scheduled Date</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading housekeeping logs...
                </td>
              </tr>
            ) : filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  No cleaning tasks recorded.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ background: 'rgba(197, 168, 128, 0.1)', color: 'var(--primary-gold)', padding: '6px', borderRadius: '6px' }}>
                        <BedDouble size={16} />
                      </div>
                      <div>
                        <strong style={{ color: '#fff' }}>Room #{task.room?.roomNumber}</strong>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{task.room?.roomType} (Floor {task.room?.floor})</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px', color: '#cbd5e1', fontWeight: '500' }}>{task.taskType}</td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '600',
                      background: task.priority === 'High' ? 'rgba(244, 63, 94, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: task.priority === 'High' ? '#fb7185' : '#fbbf24'
                    }}>
                      {task.priority}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${task.room?.status?.toLowerCase()}`}>
                      ● {task.room?.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${task.status === 'Completed' ? 'available' : 'cleaning'}`}>
                      ● {task.status}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                    {new Date(task.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {task.status !== 'Completed' ? (
                      <button
                        onClick={() => handleCompleteTask(task._id, task.room?.roomNumber)}
                        className="btn-gold"
                        style={{ padding: '6px 12px', fontSize: '11px', borderRadius: '6px' }}
                      >
                        <CheckCircle2 size={14} /> Mark Cleaned
                      </button>
                    ) : (
                      <span style={{ color: '#10b981', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle2 size={14} /> Done
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* SCHEDULE TASK MODAL */}
      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '440px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px' }}>Schedule Cleaning Task</h3>
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
                  <option value="Routine Cleaning">Routine Cleaning</option>
                  <option value="Deep Clean">Deep Clean</option>
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
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-gold">
                  {submitting ? 'Scheduling...' : 'Assign Task'}
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

export default HousekeepingPage;