import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import Swal from 'sweetalert2';
import { 
  Users, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  MapPin, 
  Shield, 
  X, 
  Heart,
  Sparkles,
  ShieldCheck,
  Calendar,
  Award,
  Crown,
  Trash2,
  CheckCircle2
} from 'lucide-react';

const GuestsList = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    idType: 'National ID',
    idNumber: '',
    city: '',
    country: 'Pakistan',
    preferences: 'Non-smoking, High Floor, Extra Pillows'
  });

  const fetchGuests = async () => {
    try {
      setLoading(true);
      const res = await API.get('/guests');
      setGuests(res.data.guests || []);
    } catch (err) {
      console.error('Error fetching guests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuests();
  }, []);

  const handleCreateGuest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        address: { city: formData.city, country: formData.country },
        preferences: formData.preferences.split(',').map((p) => p.trim())
      };
      await API.post('/guests', payload);
      setIsModalOpen(false);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        idType: 'National ID',
        idNumber: '',
        city: '',
        country: 'Pakistan',
        preferences: 'Non-smoking, High Floor'
      });
      fetchGuests();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create guest profile');
    } finally {
      setSubmitting(false);
    }
  };
// Delete Guest Dossier with Luxury SweetAlert
  const handleDeleteGuest = async (guestId, guestName) => {
    const result = await Swal.fire({
      title: '<span style="font-family: \'Playfair Display\', serif; font-size: 22px; color: #fff;">Purge Resident Profile?</span>',
      html: `
        <p style="color: #94a3b8; font-size: 13.5px; margin-top: 4px; line-height: 1.6;">
          Are you sure you want to permanently delete the profile dossier for 
          <span style="white-space: nowrap; display: inline-block; color: #d4af37; font-weight: 700;">${guestName}</span> 
          from the directory?
        </p>
      `,
      icon: 'warning',
      iconColor: '#d4af37',
      showCancelButton: true,
      confirmButtonText: 'Delete Profile',
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
        await API.delete(`/guests/${guestId}`);
        setGuests((prev) => prev.filter((g) => g._id !== guestId));

        Swal.fire({
          title: '<span style="font-family: \'Playfair Display\', serif; font-size: 20px; color: #fff;">Profile Deleted</span>',
          html: `<p style="color: #94a3b8; font-size: 13px;">Resident profile for ${guestName} has been removed.</p>`,
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
          title: '<span style="font-family: \'Playfair Display\', serif; font-size: 20px; color: #fff;">Deletion Error</span>',
          text: err.response?.data?.message || 'Failed to delete guest profile',
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
  const filteredGuests = guests.filter((g) => 
    g.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    g.email?.toLowerCase().includes(search.toLowerCase()) ||
    g.phone?.includes(search) ||
    g.idNumber?.includes(search)
  );

  // Total preferences count across all residents
  const totalTrackedPreferences = guests.reduce((acc, g) => acc + (g.preferences?.length || 0), 0);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#f8fafc', paddingBottom: '60px' }}>
      
      {/* ================= 1. EXECUTIVE VIP PANORAMIC BANNER ================= */}
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
        {/* Background Visual Image with Fallback */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url('/Images/guests-banner.jpg'), url('/Images/about-hotel.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.55) contrast(1.1)',
          zIndex: 0
        }} />

        {/* Ambient Dark Gradient Vignette */}
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
            <Crown size={13} /> Resident Portfolio & Relations
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 2.8vw, 34px)',
            color: '#ffffff',
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            Guest Directory & VIP Dossiers
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.6', margin: 0, fontWeight: '300' }}>
            Central repository of resident identities, verified government documentation, bespoke room preferences, and direct contact dossiers.
          </p>
        </div>

        {/* Action Button: Register New Guest inside Banner */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          marginLeft: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px'
        }} className="guests-banner-actions">
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
            <span>Register Resident</span>
          </button>

          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {guests.length} Profiles Synchronized
          </span>
        </div>
      </div>

      {/* ================= 2. LIVE METRICS RIBBON & SEARCH BAR ================= */}
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '18px',
        padding: '18px 24px',
        display: 'flex',
        gap: '20px',
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
            placeholder="Search by resident name, phone number, CNIC, or email..."
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

        {/* 3 Real-time Status Badges */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1' }}>
            <Users size={14} color="#d4af37" />
            <span>Verified: <strong style={{ color: '#d4af37' }}>{filteredGuests.length}</strong></span>
          </div>

          <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#cbd5e1' }}>
            <Heart size={14} color="#fb7185" />
            <span>Preferences: <strong style={{ color: '#fff' }}>{totalTrackedPreferences} Logged</strong></span>
          </div>

          <span style={{ color: 'rgba(255,255,255,0.1)' }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#10b981' }}>
            <ShieldCheck size={14} />
            <span>Encrypted Dossiers</span>
          </div>
        </div>
      </div>

      {/* ================= 3. GUESTS VIP DOSSIER CARDS GRID ================= */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#d4af37', fontSize: '15px' }}>
          Retrieving resident directory...
        </div>
      ) : filteredGuests.length === 0 ? (
        <div style={{
          padding: '60px 20px',
          textAlign: 'center',
          background: 'rgba(13, 21, 39, 0.6)',
          borderRadius: '18px',
          border: '1px solid rgba(255, 255, 255, 0.06)'
        }}>
          <Users size={36} color="#94a3b8" style={{ marginBottom: '12px', opacity: 0.6 }} />
          <h4 style={{ color: '#fff', fontSize: '18px', margin: '0 0 6px 0' }}>No Profiles Located</h4>
          <p style={{ color: '#94a3b8', fontSize: '13px', margin: 0 }}>Try clearing your search query or registering a new resident profile.</p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 380px))',
          justifyContent: 'center',
          gap: '24px'
        }}>
          {filteredGuests.map((guest) => (
            <div 
              key={guest._id} 
              style={{
                background: '#0d1527',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '18px',
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
                {/* Header: Initial Avatar & VIP Status Tag */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '18px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                    color: '#070b14',
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '800',
                    fontSize: '18px',
                    boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
                    flexShrink: 0
                  }}>
                    {guest.fullName[0]?.toUpperCase() || 'G'}
                  </div>

                  <div style={{ flex: 1 }}>
                  
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h3 style={{
                        fontFamily: "'Playfair Display', serif",
                        color: '#ffffff',
                        fontSize: '19px',
                        margin: '0 0 3px 0'
                      }}>
                        {guest.fullName}
                      </h3>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '10px', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '10px', fontWeight: '700' }}>
                          ACTIVE
                        </span>
                        
                        {/* Delete Guest Button */}
                        <button
                          onClick={() => handleDeleteGuest(guest._id, guest.fullName)}
                          style={{
                            background: 'rgba(244, 63, 94, 0.08)',
                            border: '1px solid rgba(244, 63, 94, 0.25)',
                            color: '#fb7185',
                            padding: '4px 7px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            transition: 'all 0.15s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)'}
                          title="Delete Resident Profile"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>

                    <div style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      color: '#d4af37',
                      fontSize: '11px',
                      background: 'rgba(212, 175, 55, 0.08)',
                      padding: '2px 8px',
                      borderRadius: '6px',
                      border: '1px solid rgba(212, 175, 55, 0.25)',
                      fontWeight: '600'
                    }}>
                      <ShieldCheck size={12} /> {guest.idType || 'Document'}: {guest.idNumber}
                    </div>
                  </div>
                </div>

                {/* Contact Information Dossier */}
                <div style={{
                  background: 'rgba(7, 11, 20, 0.85)',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  fontSize: '12.5px',
                  marginBottom: '16px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={13} color="#d4af37" style={{ flexShrink: 0 }} />
                    <span style={{ color: '#e2e8f0', wordBreak: 'break-all' }}>{guest.email || 'No email registered'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={13} color="#d4af37" style={{ flexShrink: 0 }} />
                    <span style={{ color: '#e2e8f0' }}>{guest.phone || 'No phone registered'}</span>
                  </div>
                  {guest.address?.city && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={13} color="#d4af37" style={{ flexShrink: 0 }} />
                      <span style={{ color: '#94a3b8' }}>{guest.address.city}, {guest.address.country || 'Pakistan'}</span>
                    </div>
                  )}
                </div>

                {/* Bespoke Stay Preferences */}
                {guest.preferences?.length > 0 && (
                  <div>
                    <div style={{
                      fontSize: '11px',
                      color: '#94a3b8',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.8px'
                    }}>
                      <Heart size={12} color="#fb7185" /> Bespoke Preferences:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {guest.preferences.map((pref, i) => (
                        <span key={i} style={{
                          fontSize: '11px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#cbd5e1',
                          padding: '3px 8px',
                          borderRadius: '6px'
                        }}>
                          {pref}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Registration Timestamp */}
              <div style={{
                borderTop: '1px solid rgba(255, 255, 255, 0.06)',
                paddingTop: '12px',
                marginTop: '16px',
                fontSize: '11px',
                color: '#64748b',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <Calendar size={12} color="#d4af37" />
                <span>Profile Registered: {new Date(guest.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= REGISTER GUEST MODAL ================= */}
      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div style={{
            background: 'rgba(15, 23, 42, 0.98)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            borderRadius: '22px',
            width: '100%',
            maxWidth: '520px',
            padding: '32px',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9)'
          }}>
            
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ background: 'rgba(212, 175, 55, 0.15)', padding: '6px', borderRadius: '8px', color: '#d4af37' }}>
                  <Users size={20} />
                </div>
                <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: '21px', color: '#fff', margin: 0 }}>
                  Register Resident Profile
                </h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)} 
                style={{ background: 'rgba(255,255,255,0.06)', border: 'none', color: '#cbd5e1', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateGuest} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div>
                <label style={fieldLabelStyle}>Full Legal Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Siddiqui"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="guest@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Contact Phone *</label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>Identification Document</label>
                  <select
                    value={formData.idType}
                    onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                    style={fieldInputStyle}
                  >
                    <option value="National ID">National ID (CNIC)</option>
                    <option value="Passport">International Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
                <div>
                  <label style={fieldLabelStyle}>Document / ID Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="42101-9876543-1"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                <div>
                  <label style={fieldLabelStyle}>City of Residence</label>
                  <input
                    type="text"
                    placeholder="Karachi / Islamabad"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
                <div>
                  <label style={fieldLabelStyle}>Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={fieldInputStyle}
                  />
                </div>
              </div>

              <div>
                <label style={fieldLabelStyle}>Stay Preferences & Requests (comma separated)</label>
                <input
                  type="text"
                  placeholder="Non-smoking, High Floor, Feather Pillows"
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
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
                  {submitting ? 'Registering...' : 'Save Profile'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) {
          .guests-banner-actions {
            display: none !important;
          }
        }
          /* Luxury SweetAlert Styling */
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

export default GuestsList;