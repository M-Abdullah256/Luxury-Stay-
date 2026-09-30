import React, { useState, useEffect } from 'react';
import API from '../api/axios';
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
  Edit2
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
      setGuests(res.data.guests);
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

  const filteredGuests = guests.filter((g) => 
    g.fullName?.toLowerCase().includes(search.toLowerCase()) ||
    g.email?.toLowerCase().includes(search.toLowerCase()) ||
    g.phone?.includes(search) ||
    g.idNumber?.includes(search)
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '4px' }}>
            Guest Profiles Directory
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
            Maintain guest identity records, document numbers, contact portfolios, and personalized stay preferences.
          </p>
        </div>

        <button onClick={() => setIsModalOpen(true)} className="btn-gold">
          <Plus size={18} />
          <span>New Guest Profile</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="luxury-card" style={{ padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: '440px' }}>
          <Search size={18} color="var(--primary-gold)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
          <input
            type="text"
            placeholder="Search by guest name, phone, CNIC/Passport..."
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
      </div>

      {/* Guests Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: '20px'
      }}>
        {loading ? (
          <div style={{ color: 'var(--text-muted)', padding: '30px' }}>Loading guests...</div>
        ) : filteredGuests.length === 0 ? (
          <div className="luxury-card" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No guest profiles found matching the search.
          </div>
        ) : (
          filteredGuests.map((guest) => (
            <div key={guest._id} className="luxury-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #c5a880 0%, #b09166 100%)',
                    color: '#0b1120',
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: '700',
                    fontSize: '16px'
                  }}>
                    {guest.fullName[0]?.toUpperCase()}
                  </div>
                  <div>
                    <h3 style={{ color: '#fff', fontSize: '17px', fontWeight: '600' }}>{guest.fullName}</h3>
                    <div style={{ color: 'var(--primary-gold)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Shield size={12} /> {guest.idType}: {guest.idNumber}
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="var(--primary-gold)" />
                    <span style={{ color: '#cbd5e1' }}>{guest.email}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="var(--primary-gold)" />
                    <span style={{ color: '#cbd5e1' }}>{guest.phone}</span>
                  </div>
                  {guest.address?.city && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <MapPin size={14} color="var(--primary-gold)" />
                      <span>{guest.address.city}, {guest.address.country}</span>
                    </div>
                  )}
                </div>

                {/* Preferences Badges (SRS Requirement) */}
                {guest.preferences?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Heart size={12} color="#fb7185" /> Bespoke Preferences:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {guest.preferences.map((pref, i) => (
                        <span key={i} style={{
                          fontSize: '11px',
                          background: 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          color: '#e2e8f0',
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

              <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px', marginTop: '16px', fontSize: '11px', color: 'var(--text-muted)' }}>
                Registered: {new Date(guest.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE GUEST MODAL */}
      {isModalOpen && (
        <div style={modalBackdropStyle}>
          <div className="luxury-card" style={{ width: '100%', maxWidth: '480px', padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <h3 style={{ color: '#fff', fontSize: '18px' }}>Register New Guest Profile</h3>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}><X size={18} /></button>
            </div>
            <form onSubmit={handleCreateGuest} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Asad Siddiqui"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="guest@gmail.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Phone Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="+92 300 1234567"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>ID Document Type</label>
                  <select
                    value={formData.idType}
                    onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="National ID">National ID (CNIC)</option>
                    <option value="Passport">International Passport</option>
                    <option value="Driving License">Driving License</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Document / ID Number *</label>
                  <input
                    type="text"
                    required
                    placeholder="42101-9876543-1"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>City</label>
                  <input
                    type="text"
                    placeholder="Karachi / Lahore"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Country</label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '4px' }}>Stay Preferences (comma separated)</label>
                <input
                  type="text"
                  placeholder="Non-smoking, High Floor, Feather Pillows"
                  value={formData.preferences}
                  onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
                  style={inputStyle}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary">Cancel</button>
                <button type="submit" disabled={submitting} className="btn-gold">
                  {submitting ? 'Registering...' : 'Save Profile'}
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

export default GuestsList;