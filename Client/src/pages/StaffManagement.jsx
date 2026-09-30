import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  ShieldCheck, 
  Plus, 
  UserCheck, 
  UserX, 
  Mail, 
  Phone, 
  X, 
  Lock,
  Edit2
} from 'lucide-react';

const StaffManagement = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New Staff Form
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'receptionist',
    phone: ''
  });

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await API.get('/auth/staff');
      setStaffList(res.data.staff);
    } catch (err) {
      console.error('Error fetching staff list:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  // Toggle Activate / Deactivate (SRS Requirement)
  const handleToggleStatus = async (staffId, currentStatus, staffName) => {
    const action = currentStatus ? 'Deactivate' : 'Activate';
    if (!window.confirm(`Are you sure you want to ${action} ${staffName}'s account?`)) return;

    try {
      await API.patch(`/auth/staff/${staffId}/toggle-status`);
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update account status');
    }
  };

  // Create Staff Handler
  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await API.post('/auth/create-staff', formData);
      setIsModalOpen(false);
      setFormData({ name: '', email: '', password: '', role: 'receptionist', phone: '' });
      fetchStaff();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create staff account');
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
            Staff & Access Control Management
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Provision employee access levels, configure managerial permissions, and toggle account activation.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-gold">
          <Plus size={18} />
          <span>Provision New Staff</span>
        </button>
      </div>

      {/* Staff Table */}
      <div className="luxury-card" style={{ overflowX: 'auto', padding: '12px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', color: 'var(--text-muted)' }}>
              <th style={{ padding: '14px' }}>Staff Member</th>
              <th style={{ padding: '14px' }}>Assigned Role</th>
              <th style={{ padding: '14px' }}>Contact Phone</th>
              <th style={{ padding: '14px' }}>Account Status</th>
              <th style={{ padding: '14px' }}>Created Date</th>
              <th style={{ padding: '14px', textAlign: 'center' }}>Admin Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                  Loading staff accounts...
                </td>
              </tr>
            ) : (
              staffList.map((st) => (
                <tr key={st._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        background: st.isActive ? 'rgba(16, 185, 129, 0.15)' : 'rgba(244, 63, 94, 0.15)',
                        color: st.isActive ? '#10b981' : '#fb7185',
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: '700'
                      }}>
                        {st.name[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div style={{ color: '#fff', fontWeight: '600' }}>{st.name}</div>
                        <div style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{st.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px' }}>
                    <span style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      background: st.role === 'admin' ? 'rgba(197, 168, 128, 0.2)' : 'rgba(56, 189, 248, 0.15)',
                      color: st.role === 'admin' ? 'var(--primary-gold)' : '#38bdf8'
                    }}>
                      {st.role}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>{st.phone || 'N/A'}</td>
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${st.isActive ? 'available' : 'occupied'}`}>
                      ● {st.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                    {new Date(st.createdAt).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    {st._id !== user?.id && (
                      <button
                        onClick={() => handleToggleStatus(st._id, st.isActive, st.name)}
                        style={{
                          background: st.isActive ? 'rgba(244, 63, 94, 0.1)' : 'rgba(16, 185, 129, 0.1)',
                          border: `1px solid ${st.isActive ? '#fb7185' : '#34d399'}`,
                          color: st.isActive ? '#fb7185' : '#34d399',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        {st.isActive ? <><UserX size={14} /> Deactivate</> : <><UserCheck size={14} /> Activate</>}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* CREATE STAFF MODAL */}
      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '460px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px' }}>Provision New Staff Account</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Staff Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faisal Qureshi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Work Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="faisal@luxurystay.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Temporary Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Assign Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="receptionist">Receptionist</option>
                    <option value="manager">Manager</option>
                    <option value="housekeeping">Housekeeping</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                <input
                  type="text"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-gold">
                  {submitting ? 'Creating...' : 'Create Account'}
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

export default StaffManagement;