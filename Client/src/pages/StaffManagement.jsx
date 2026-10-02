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
  EyeOff,
  Shield,
  Sparkles,
  UserCog,
  Check,
  LockKeyhole,
  Users
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
      setStaffList(res.data.staff || []);
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
    if (!window.confirm(`Are you sure you want to ${action} ${staffName}'s administrative access?`)) return;

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
      password: '',
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

      if (editFormData.password.trim() !== '') {
        payload.password = editFormData.password;
      }

      await API.put(`/auth/staff/${editFormData.id}`, payload);

      setIsEditModalOpen(false);
      fetchStaff();
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

  // Role Badge Styling
  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return {
          bg: 'rgba(212, 175, 55, 0.15)',
          border: 'rgba(212, 175, 55, 0.4)',
          color: '#d4af37'
        };
      case 'manager':
        return {
          bg: 'rgba(56, 189, 248, 0.15)',
          border: 'rgba(56, 189, 248, 0.4)',
          color: '#38bdf8'
        };
      case 'housekeeping':
        return {
          bg: 'rgba(16, 185, 129, 0.15)',
          border: 'rgba(16, 185, 129, 0.4)',
          color: '#34d399'
        };
      default:
        return {
          bg: 'rgba(168, 85, 247, 0.15)',
          border: 'rgba(168, 85, 247, 0.4)',
          color: '#c084fc'
        };
    }
  };

  const activeStaffCount = staffList.filter((s) => s.isActive).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#f8fafc', paddingBottom: '60px' }}>
      
      {/* ================= 1. EXECUTIVE OPERATIONS & SECURITY BANNER ================= */}
      <div style={{
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        minHeight: '210px',
        display: 'flex',
        alignItems: 'center',
        padding: '36px 40px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 25px 50px -10px rgba(0, 0, 0, 0.8)'
      }}>
        {/* Visual Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/Images/staff-banner.jpg'), url('/Images/about-hotel.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.55) contrast(1.1)',
          zIndex: 0
        }} />

        {/* Ambient Dark Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(5, 8, 17, 0.95) 0%, rgba(5, 8, 17, 0.65) 50%, rgba(5, 8, 17, 0.85) 100%)',
          zIndex: 1
        }} />

        {/* Banner Content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '640px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            padding: '5px 14px',
            borderRadius: '20px',
            color: '#d4af37',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            marginBottom: '12px'
          }}>
            <LockKeyhole size={13} /> Role-Based Access Control (RBAC)
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 2.8vw, 34px)',
            color: '#ffffff',
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            Staff Access Governance
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.6', margin: 0, fontWeight: '300' }}>
            Multi-tiered administrative control governing Front Desk, Operations Managers, Housekeeping Controllers, and Central System Administrators.
          </p>
        </div>

        {/* Action Button inside Banner */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          marginLeft: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px'
        }} className="staff-banner-actions">
          <button 
            onClick={() => setIsModalOpen(true)} 
            style={{
              background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
              color: '#070b14',
              fontWeight: '700',
              fontSize: '12.5px',
              letterSpacing: '0.6px',
              textTransform: 'uppercase',
              padding: '12px 24px',
              borderRadius: '25px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 4px 18px rgba(212, 175, 55, 0.35)',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Plus size={16} />
            <span>Provision Staff</span>
          </button>

          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {activeStaffCount} of {staffList.length} Accounts Active
          </span>
        </div>
      </div>

      {/* ================= 2. STAFF ROSTER TABLE ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '18px',
        overflow: 'hidden',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ overflowX: 'auto', padding: '8px' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                <th style={thStyle}>Staff Identity</th>
                <th style={thStyle}>Security Role Level</th>
                <th style={thStyle}>Contact Telephone</th>
                <th style={thStyle}>Access State</th>
                <th style={thStyle}>Provisioned Date</th>
                <th style={{ ...thStyle, textAlign: 'center' }}>Governance Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: '#d4af37' }}>
                    Loading security credentials...
                  </td>
                </tr>
              ) : staffList.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '50px', color: '#94a3b8' }}>
                    No staff records found.
                  </td>
                </tr>
              ) : (
                staffList.map((st) => {
                  const roleStyle = getRoleBadge(st.role);

                  return (
                    <tr 
                      key={st._id} 
                      style={{
                        borderBottom: '1px solid rgba(255, 255, 255, 0.04)',
                        transition: 'background 0.2s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      {/* Name & Avatar */}
                      <td style={tdStyle}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            background: st.isActive 
                              ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.05) 100%)' 
                              : 'linear-gradient(135deg, rgba(244, 63, 94, 0.2) 0%, rgba(244, 63, 94, 0.05) 100%)',
                            color: st.isActive ? '#34d399' : '#fb7185',
                            border: `1.5px solid ${st.isActive ? 'rgba(16, 185, 129, 0.4)' : 'rgba(244, 63, 94, 0.4)'}`,
                            width: '38px',
                            height: '38px',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: '700',
                            fontSize: '14px',
                            flexShrink: 0
                          }}>
                            {st.name[0]?.toUpperCase() || 'S'}
                          </div>
                          <div>
                            <div style={{ color: '#ffffff', fontWeight: '600' }}>{st.name}</div>
                            <div style={{ color: '#94a3b8', fontSize: '11.5px', marginTop: '2px' }}>{st.email}</div>
                          </div>
                        </div>
                      </td>

                      {/* Role Badge */}
                      <td style={tdStyle}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontSize: '11px',
                          fontWeight: '700',
                          textTransform: 'uppercase',
                          letterSpacing: '0.6px',
                          background: roleStyle.bg,
                          border: `1px solid ${roleStyle.border}`,
                          color: roleStyle.color
                        }}>
                          {st.role}
                        </span>
                      </td>

                      {/* Phone */}
                      <td style={{ ...tdStyle, color: '#cbd5e1' }}>
                        {st.phone || 'N/A'}
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <span style={{
                          fontSize: '11px',
                          fontWeight: '700',
                          letterSpacing: '0.4px',
                          padding: '4px 10px',
                          borderRadius: '14px',
                          background: st.isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(244, 63, 94, 0.12)',
                          border: `1px solid ${st.isActive ? 'rgba(16, 185, 129, 0.35)' : 'rgba(244, 63, 94, 0.35)'}`,
                          color: st.isActive ? '#34d399' : '#fb7185',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}>
                          ● {st.isActive ? 'Active Clearance' : 'Deactivated'}
                        </span>
                      </td>

                      {/* Date */}
                      <td style={{ ...tdStyle, color: '#94a3b8', fontSize: '12px' }}>
                        {new Date(st.createdAt).toLocaleDateString()}
                      </td>

                      {/* Actions */}
                      <td style={{ ...tdStyle, textAlign: 'center' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
                          
                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEditModal(st)}
                            style={{
                              background: 'rgba(56, 189, 248, 0.08)',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              color: '#38bdf8',
                              padding: '6px 12px',
                              borderRadius: '7px',
                              cursor: 'pointer',
                              fontSize: '11.5px',
                              fontWeight: '600',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              transition: 'all 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(56, 189, 248, 0.08)'}
                            title="Modify Credentials & Role"
                          >
                            <Edit2 size={13} /> Edit
                          </button>

                          {/* Toggle Active/Deactivate Button */}
                          {st._id !== user?.id && (
                            <button
                              onClick={() => handleToggleStatus(st._id, st.isActive, st.name)}
                              style={{
                                background: st.isActive ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)',
                                border: `1px solid ${st.isActive ? 'rgba(244, 63, 94, 0.3)' : 'rgba(16, 185, 129, 0.3)'}`,
                                color: st.isActive ? '#fb7185' : '#34d399',
                                padding: '6px 12px',
                                borderRadius: '7px',
                                cursor: 'pointer',
                                fontSize: '11.5px',
                                fontWeight: '600',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '5px',
                                transition: 'all 0.15s ease'
                              }}
                              onMouseEnter={(e) => e.currentTarget.style.background = st.isActive ? 'rgba(244, 63, 94, 0.2)' : 'rgba(16, 185, 129, 0.2)'}
                              onMouseLeave={(e) => e.currentTarget.style.background = st.isActive ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)'}
                            >
                              {st.isActive ? <><UserX size={13} /> Revoke</> : <><UserCheck size={13} /> Restore</>}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL 1: EDIT STAFF CREDENTIALS ================= */}
      {isEditModalOpen && (
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '6px', borderRadius: '8px', color: '#d4af37' }}>
                  <Edit2 size={18} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', margin: 0 }}>
                  Modify Staff Credentials
                </h3>
              </div>
              <button onClick={() => setIsEditModalOpen(false)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            {errorMsg && (
              <div style={{ background: 'rgba(244, 63, 94, 0.15)', border: '1px solid rgba(244, 63, 94, 0.3)', color: '#fb7185', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleUpdateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={fieldLabelStyle}>Staff Full Name *</label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Work Email Address (Login ID) *</label>
                <div style={{ position: 'relative' }}>
                  <Mail size={16} color="#d4af37" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type="email"
                    required
                    value={editFormData.email}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    style={{ ...fieldInputStyle, paddingLeft: '38px' }}
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                  <label style={fieldLabelStyle}>Reset Password</label>
                  <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>Leave blank to keep current</span>
                </div>
                <div style={{ position: 'relative' }}>
                  <KeyRound size={16} color="#d4af37" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
                  <input
                    type={showEditPassword ? 'text' : 'password'}
                    placeholder="Enter new password (min 6 chars)"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData({ ...editFormData, password: e.target.value })}
                    style={{ ...fieldInputStyle, paddingLeft: '38px', paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: showEditPassword ? '#d4af37' : '#94a3b8'
                    }}
                  >
                    {showEditPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Access Role Level *</label>
                  <select
                    value={editFormData.role}
                    onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                    style={fieldInputStyle}
                  >
                    <option value="receptionist" style={{ background: '#0d1527' }}>Receptionist</option>
                    <option value="manager" style={{ background: '#0d1527' }}>Manager</option>
                    <option value="housekeeping" style={{ background: '#0d1527' }}>Housekeeping</option>
                    <option value="admin" style={{ background: '#0d1527' }}>Administrator</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Contact Phone Number</label>
                  <input
                    type="text"
                    placeholder="+92 300 1234567"
                    value={editFormData.phone}
                    onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={updating} className="btn-gold" style={{ padding: '8px 20px', fontSize: '13px' }}>
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
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '22px',
            width: '100%',
            maxWidth: '500px',
            padding: '30px',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '6px', borderRadius: '8px', color: '#d4af37' }}>
                  <UserCog size={18} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '20px', color: '#fff', margin: 0 }}>
                  Provision Staff Account
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateStaff} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={fieldLabelStyle}>Staff Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Faisal Qureshi"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>Work Email Address (Username) *</label>
                <input
                  type="email"
                  required
                  placeholder="faisal@luxurystay.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Temporary Password *</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Assigned Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    style={fieldInputStyle}
                  >
                    <option value="receptionist" style={{ background: '#0d1527' }}>Receptionist</option>
                    <option value="manager" style={{ background: '#0d1527' }}>Manager</option>
                    <option value="housekeeping" style={{ background: '#0d1527' }}>Housekeeping</option>
                    <option value="admin" style={{ background: '#0d1527' }}>Administrator</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={fieldLabelStyle}>Contact Phone Number</label>
                <input
                  type="text"
                  placeholder="+92 300 0000000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '6px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '8px 18px', fontSize: '13px' }}>
                  Cancel
                </button>
                <button type="submit" disabled={submitting} className="btn-gold" style={{ padding: '8px 20px', fontSize: '13px' }}>
                  {submitting ? 'Provisioning...' : 'Create Account'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .staff-banner-actions {
            display: none !important;
          }
        }
      `}</style>

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

export default StaffManagement;