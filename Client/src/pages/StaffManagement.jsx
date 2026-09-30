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
  Edit2,
  KeyRound,
  Eye,
  EyeOff
} from 'lucide-react';

const StaffManagement = () => {
  const { user } = useAuth();
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modals State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEditPassword, setShowEditPassword] = useState(false);

  // New Staff Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'receptionist',
    phone: ''
  });

  // Edit Staff Form State (With Editable Email & Password)
  const [editFormData, setEditFormData] = useState({
    id: '',
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

  // Toggle Activate / Deactivate
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

  // Open Edit Modal with Pre-filled Info
  const handleOpenEditModal = (staff) => {
    setErrorMsg('');
    setShowEditPassword(false);
    setEditFormData({
      id: staff._id,
      name: staff.name,
      email: staff.email,
      password: '', // Blank initially (leave blank to keep unchanged)
      role: staff.role,
      phone: staff.phone || ''
    });
    setIsEditModalOpen(true);
  };

  // Submit Profile & Credentials Modifications
  const handleUpdateStaff = async (e) => {
    e.preventDefault();
    setUpdating(true);
    setErrorMsg('');

    try {
      const payload = {
        name: editFormData.name,
        email: editFormData.email,
        role: editFormData.role,
        phone: editFormData.phone
      };

      // Only include password if user typed a new one
      if (editFormData.password.trim() !== '') {
        payload.password = editFormData.password;
      }

      await API.put(`/auth/staff/${editFormData.id}`, payload);

      setIsEditModalOpen(false);
      fetchStaff(); // Refresh table
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to update staff profile');
    } finally {
      setUpdating(false);
    }
  };

  // Create New Staff
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
            Provision employee access levels, modify staff credentials, emails & passwords, and control account activation.
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
                  {/* Name & Email */}
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

                  {/* Role Badge */}
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

                  {/* Phone */}
                  <td style={{ padding: '14px', color: '#cbd5e1' }}>{st.phone || 'N/A'}</td>

                  {/* Status Badge */}
                  <td style={{ padding: '14px' }}>
                    <span className={`badge badge-${st.isActive ? 'available' : 'occupied'}`}>
                      ● {st.isActive ? 'Active' : 'Deactivated'}
                    </span>
                  </td>

                  {/* Date */}
                  <td style={{ padding: '14px', color: 'var(--text-muted)' }}>
                    {new Date(st.createdAt).toLocaleDateString()}
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '14px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                      
                      {/* EDIT BUTTON */}
                      <button
                        onClick={() => handleOpenEditModal(st)}
                        style={{
                          background: 'rgba(56, 189, 248, 0.1)',
                          border: '1px solid rgba(56, 189, 248, 0.3)',
                          color: '#38bdf8',
                          padding: '6px 12px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '11px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title="Modify Credentials & Role"
                      >
                        <Edit2 size={13} /> Edit
                      </button>

                      {/* DEACTIVATE / ACTIVATE BUTTON */}
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
                            gap: '4px'
                          }}
                        >
                          {st.isActive ? <><UserX size={13} /> Deactivate</> : <><UserCheck size={13} /> Activate</>}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ================= MODAL 1: EDIT STAFF PROFILE & CREDENTIALS ================= */}
      {isEditModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '460px', padding: '26px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Edit2 size={18} color="var(--primary-gold)" />
                <h3 style={{ color: '#fff', fontSize: '18px' }}>Modify Staff Credentials</h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid var(--danger-rose)', color: '#fb7185', padding: '10px', borderRadius: '8px', fontSize: '12px', marginBottom: '14px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Full Name */}
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Staff Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={inputStyle}
                />
              </div>

              {/* Editable Work Email Address */}
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Work Email Address (Login ID) *
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="var(--primary-gold)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '38px' }}
                  />
                </div>
              </div>

              {/* Editable / Reset Password Field with Eye Toggle */}
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Reset Password <span style={{ color: 'var(--text-muted)' }}>(Leave blank to keep unchanged)</span>
                </label>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="var(--primary-gold)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    placeholder="Enter new password (min 6 chars)"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    style={{ ...inputStyle, paddingLeft: '38px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '10px',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: showEditPassword ? 'var(--primary-gold)' : '#94a3b8'
                    }}
                  >
                    {showEditPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Role Dropdown */}
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Access Role Level *
                </label>
                <select
                  value={editFormData.role}
                  onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                  style={inputStyle}
                >
                  <option value="receptionist">Receptionist (Front Desk)</option>
                  <option value="manager">Manager (Reports & Ops)</option>
                  <option value="housekeeping">Housekeeping (Room Tasks)</option>
                  <option value="admin">Administrator (Full Control)</option>
                </select>
              </div>

              {/* Phone */}
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>
                  Contact Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+92 300 1234567"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn-gold">
                  {updating ? 'Updating...' : 'Save Modifications'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL 2: PROVISION NEW STAFF ================= */}
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