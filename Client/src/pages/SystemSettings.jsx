import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  Save, 
  Percent, 
  Clock, 
  FileText, 
  Building2, 
  ShieldAlert,
  CheckCircle2,
  Sparkles,
  Sliders,
  ShieldCheck,
  LockKeyhole
} from 'lucide-react';

const SystemSettings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [settings, setSettings] = useState({
    hotelName: 'LuxuryStay Hospitality',
    taxPercentage: 13,
    checkInTime: '14:00',
    checkOutTime: '11:00',
    cancellationPolicy: 'Free cancellation up to 24 hours prior to scheduled arrival date.'
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await API.get('/extras/settings');
        if (res.data.settings) {
          setSettings(res.data.settings);
        }
      } catch (err) {
        console.error('Error fetching settings:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');

    try {
      await API.put('/extras/settings', {
        ...settings,
        taxPercentage: Number(settings.taxPercentage)
      });
      setSuccessMsg('System configuration and global fiscal parameters updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  // Restricted Access Screen for Non-Admins
  if (user?.role !== 'admin') {
    return (
      <div style={{
        background: '#0d1527',
        border: '1px solid rgba(244, 63, 94, 0.3)',
        borderRadius: '20px',
        padding: '60px 24px',
        textAlign: 'center',
        maxWidth: '560px',
        margin: '60px auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.85)'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          borderRadius: '50%',
          background: 'rgba(244, 63, 94, 0.15)',
          color: '#fb7185',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 18px auto',
          border: '1px solid rgba(244, 63, 94, 0.3)'
        }}>
          <ShieldAlert size={30} />
        </div>
        <h3 style={{ fontFamily: "'Playfair Display', serif", color: '#ffffff', fontSize: '22px', marginBottom: '8px' }}>
          Restricted Security Clearance
        </h3>
        <p style={{ color: '#94a3b8', fontSize: '13.5px', lineHeight: '1.6', margin: 0 }}>
          Only the Master System Administrator is authorized to modify core enterprise parameters, fiscal taxation rules, and global hotel operational policies.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#f8fafc', paddingBottom: '60px' }}>
      
      {/* ================= 1. EXECUTIVE CONFIGURATION BANNER ================= */}
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
          backgroundImage: `url('/Images/settings-banner.jpg'), url('/Images/staff-banner.jpg'), url('/Images/about-hotel.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.52) contrast(1.1)',
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
            <LockKeyhole size={13} /> Master Systems Governance
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 2.8vw, 34px)',
            color: '#ffffff',
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            System Configuration & Parameters
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.6', margin: 0, fontWeight: '300' }}>
            Configure global property identity, automated billing taxation rates, standardized check-in windows, and legally binding guest cancellation frameworks.
          </p>
        </div>

        {/* Right Status Pill */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          marginLeft: 'auto',
          display: 'none',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }} className="settings-banner-status">
          <div style={{
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.35)',
            padding: '8px 16px',
            borderRadius: '25px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '12px',
            color: '#34d399',
            fontWeight: '600'
          }}>
            <ShieldCheck size={14} /> Master Node: Authenticated
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Super Administrator Clearance</span>
        </div>
      </div>

      {/* Success Alert Banner */}
      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          color: '#34d399',
          padding: '14px 20px',
          borderRadius: '12px',
          fontSize: '13px',
          fontWeight: '600',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.5)'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* ================= 2. CONFIGURATION FORMS ================= */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#d4af37', fontSize: '15px' }}>
          Loading master configuration parameters...
        </div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Enterprise Brand Identity */}
          <div style={configCardStyle}>
            <div style={cardHeaderStyle}>
              <div style={iconBoxStyle}>
                <Building2 size={18} color="#d4af37" />
              </div>
              <div>
                <h3 style={cardTitleStyle}>Operating Enterprise Brand Identity</h3>
                <p style={cardSubStyle}>Visible across client portals, staff consoles, and official folios.</p>
              </div>
            </div>

            <div>
              <label style={fieldLabelStyle}>
                Registered Property Brand Name *
              </label>
              <input
                type="text"
                required
                value={settings.hotelName}
                onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                style={fieldInputStyle}
              />
            </div>
          </div>

          {/* Card 2: Fiscal & Taxation Engine */}
          <div style={configCardStyle}>
            <div style={cardHeaderStyle}>
              <div style={iconBoxStyle}>
                <Percent size={18} color="#d4af37" />
              </div>
              <div>
                <h3 style={cardTitleStyle}>Fiscal & Taxation Calculation Engine</h3>
                <p style={cardSubStyle}>Automatically applied across room tariffs, in-suite dining, and services.</p>
              </div>
            </div>

            <div>
              <label style={fieldLabelStyle}>
                Standard Luxury Hospitality Tax Rate (%) *
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', maxWidth: '300px' }}>
                <input
                  type="number"
                  required
                  step="0.5"
                  min="0"
                  max="50"
                  value={settings.taxPercentage}
                  onChange={(e) => setSettings({ ...settings, taxPercentage: e.target.value })}
                  style={fieldInputStyle}
                />
                <span style={{ fontSize: '16px', fontWeight: '700', color: '#d4af37' }}>%</span>
              </div>
              <span style={{ fontSize: '11px', color: '#94a3b8', marginTop: '6px', display: 'block' }}>
                Applied dynamically across all finalized billing invoices (Benchmark: 13.0% – 16.0%)
              </span>
            </div>
          </div>

          {/* Card 3: Operational Schedule Windows */}
          <div style={configCardStyle}>
            <div style={cardHeaderStyle}>
              <div style={iconBoxStyle}>
                <Clock size={18} color="#d4af37" />
              </div>
              <div>
                <h3 style={cardTitleStyle}>Standardized Front Desk Operating Windows</h3>
                <p style={cardSubStyle}>Governs check-in/out schedules and automated housekeeping turnover dispatches.</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
              <div>
                <label style={fieldLabelStyle}>
                  Official Check-In Time Window (24h Military Format) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="14:00"
                  value={settings.checkInTime}
                  onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>

              <div>
                <label style={fieldLabelStyle}>
                  Official Check-Out Time Window (24h Military Format) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="11:00"
                  value={settings.checkOutTime}
                  onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                  style={fieldInputStyle}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Operating Terms & Cancellation Policy */}
          <div style={configCardStyle}>
            <div style={cardHeaderStyle}>
              <div style={iconBoxStyle}>
                <FileText size={18} color="#d4af37" />
              </div>
              <div>
                <h3 style={cardTitleStyle}>Terms, Governance & Cancellation Policy</h3>
                <p style={cardSubStyle}>Displayed on public guest booking confirmations and legal disclosures.</p>
              </div>
            </div>

            <div>
              <label style={fieldLabelStyle}>
                Guest Cancellation & Refund Terms *
              </label>
              <textarea
                rows="4"
                required
                value={settings.cancellationPolicy}
                onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })}
                style={{ ...fieldInputStyle, resize: 'none' }}
              />
            </div>
          </div>

          {/* Master Save Trigger Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <button
              type="submit"
              disabled={saving}
              style={{
                background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
                color: '#070b14',
                fontWeight: '700',
                fontSize: '13px',
                letterSpacing: '0.8px',
                textTransform: 'uppercase',
                padding: '14px 34px',
                borderRadius: '30px',
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
              <Save size={16} />
              <span>{saving ? 'Transmitting Parameters...' : 'Save Configuration'}</span>
            </button>
          </div>

        </form>
      )}

      <style>{`
        @media (min-width: 900px) {
          .settings-banner-status {
            display: flex !important;
          }
        }
      `}</style>

    </div>
  );
};

const configCardStyle = {
  background: '#0d1527',
  border: '1px solid rgba(212, 175, 55, 0.22)',
  borderRadius: '20px',
  padding: '28px',
  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)'
};

const cardHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px',
  marginBottom: '20px',
  borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
  paddingBottom: '14px'
};

const iconBoxStyle = {
  background: 'rgba(212, 175, 55, 0.12)',
  padding: '10px',
  borderRadius: '12px',
  display: 'flex'
};

const cardTitleStyle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: '18px',
  color: '#ffffff',
  margin: '0 0 3px 0'
};

const cardSubStyle = {
  fontSize: '11.5px',
  color: '#94a3b8',
  margin: 0
};

const fieldLabelStyle = {
  fontSize: '12px',
  color: '#cbd5e1',
  display: 'block',
  marginBottom: '6px',
  fontWeight: '600'
};

const fieldInputStyle = {
  width: '100%',
  background: 'rgba(7, 11, 20, 0.85)',
  border: '1px solid rgba(255, 255, 255, 0.12)',
  padding: '12px 14px',
  borderRadius: '10px',
  color: '#ffffff',
  fontSize: '13.5px',
  outline: 'none',
  boxSizing: 'border-box'
};

export default SystemSettings;