import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  Settings, 
  Save, 
  Percent, 
  Clock, 
  FileText, 
  Building, 
  ShieldAlert,
  CheckCircle2
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
      setSuccessMsg('System configuration and fiscal policies updated successfully.');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="luxury-card" style={{ padding: '40px', textAlign: 'center' }}>
        <ShieldAlert size={36} color="var(--danger-rose)" style={{ marginBottom: '12px' }} />
        <h3 style={{ color: '#fff', fontSize: '18px' }}>Restricted Access</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Only the Super Administrator is authorized to modify core system configurations.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '860px' }}>
      
      {/* Header */}
      <div>
        <h1 className="luxury-heading" style={{ fontSize: '26px', color: '#fff', marginBottom: '4px' }}>
          System Configuration & Administration
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '13px' }}>
          Global parameters controlling fiscal taxes, standard hospitality check-in windows, and operating policies.
        </p>
      </div>

      {successMsg && (
        <div style={{
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid #10b981',
          color: '#34d399',
          padding: '12px 16px',
          borderRadius: '8px',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CheckCircle2 size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {loading ? (
        <div style={{ color: 'var(--text-muted)', padding: '30px' }}>Loading configuration parameters...</div>
      ) : (
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Card 1: Brand & Identity */}
          <div className="luxury-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <Building size={18} color="var(--primary-gold)" />
              <h3 style={{ color: '#fff', fontSize: '16px' }}>Hotel Identity</h3>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Operating Enterprise Brand Name
              </label>
              <input
                type="text"
                required
                value={settings.hotelName}
                onChange={(e) => setSettings({ ...settings, hotelName: e.target.value })}
                style={inputStyle}
              />
            </div>
          </div>

          {/* Card 2: Fiscal & Taxation Parameters */}
          <div className="luxury-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <Percent size={18} color="var(--primary-gold)" />
              <h3 style={{ color: '#fff', fontSize: '16px' }}>Fiscal & Taxation Parameters</h3>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Luxury / Sales Tax Rate (%) — Applied automatically across all guest billing folios
              </label>
              <input
                type="number"
                required
                step="0.5"
                value={settings.taxPercentage}
                onChange={(e) => setSettings({ ...settings, taxPercentage: e.target.value })}
                style={{ ...inputStyle, maxWidth: '240px' }}
              />
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Standard international hospitality benchmark: 13% – 16%
              </span>
            </div>
          </div>

          {/* Card 3: Check-in / Check-out Operational Windows */}
          <div className="luxury-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <Clock size={18} color="var(--primary-gold)" />
              <h3 style={{ color: '#fff', fontSize: '16px' }}>Operational Schedule Windows</h3>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Standard Check-in Time (24h)
                </label>
                <input
                  type="text"
                  required
                  placeholder="14:00"
                  value={settings.checkInTime}
                  onChange={(e) => setSettings({ ...settings, checkInTime: e.target.value })}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                  Standard Check-out Time (24h)
                </label>
                <input
                  type="text"
                  required
                  placeholder="11:00"
                  value={settings.checkOutTime}
                  onChange={(e) => setSettings({ ...settings, checkOutTime: e.target.value })}
                  style={inputStyle}
                />
              </div>
            </div>
          </div>

          {/* Card 4: Operating Policies */}
          <div className="luxury-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '12px' }}>
              <FileText size={18} color="var(--primary-gold)" />
              <h3 style={{ color: '#fff', fontSize: '16px' }}>Terms & Cancellation Policies</h3>
            </div>

            <div>
              <label style={{ fontSize: '12px', color: '#cbd5e1', display: 'block', marginBottom: '6px' }}>
                Guest Cancellation & Refund Policy
              </label>
              <textarea
                rows="3"
                value={settings.cancellationPolicy}
                onChange={(e) => setSettings({ ...settings, cancellationPolicy: e.target.value })}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>
          </div>

          {/* Save Action Button */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={saving}
              className="btn-gold"
              style={{ padding: '12px 28px', fontSize: '14px' }}
            >
              <Save size={18} />
              <span>{saving ? 'Saving Changes...' : 'Save Configuration'}</span>
            </button>
          </div>

        </form>
      )}

    </div>
  );
};

const inputStyle = {
  width: '100%',
  background: 'rgba(15, 23, 42, 0.8)',
  border: '1px solid var(--border-color)',
  padding: '10px 14px',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none'
};

export default SystemSettings;