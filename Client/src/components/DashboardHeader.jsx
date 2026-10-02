import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, ExternalLink, Shield } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardHeader = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Dynamic context name based on active path
  const getContextName = (pathname) => {
    switch (pathname) {
      case '/dashboard': return 'Operational Overview';
      case '/dashboard/rooms': return 'Room Inventory & Status';
      case '/dashboard/reservations': return 'Central Booking Ledger';
      case '/dashboard/housekeeping': return 'Housekeeping & Maintenance';
      case '/dashboard/billing': return 'Invoicing & Financial Folio';
      case '/dashboard/guests': return 'Guest Directory';
      case '/dashboard/staff': return 'Staff & Access Governance';
      case '/dashboard/settings': return 'System Configurations';
      default: return 'Management Console';
    }
  };

  return (
    <header style={{
      height: '68px',
      background: 'rgba(7, 11, 20, 0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.18)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      
      {/* Left: Clean Location Breadcrumb Context */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link 
          to="/" 
          style={{
            textDecoration: 'none',
            color: '#94a3b8',
            fontSize: '12px',
            fontWeight: '600',
            letterSpacing: '0.5px',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'color 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = '#d4af37'}
          onMouseLeave={(e) => e.currentTarget.style.color = '#94a3b8'}
        >
          <span>Live Site</span>
          <ExternalLink size={12} />
        </Link>

        <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '13px' }}>/</span>

        <span style={{
          fontSize: '13px',
          color: '#ffffff',
          fontWeight: '600',
          letterSpacing: '0.4px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ width: '6px', height: '6px', background: '#d4af37', borderRadius: '50%' }} />
          {getContextName(location.pathname)}
        </span>
      </div>

      {/* Right: Executive Identity & Silent Sign Out */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
        
        {/* User Card */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '4px 14px 4px 6px',
          borderRadius: '30px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          {/* Avatar Initial */}
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)',
            color: '#070b14',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '13px'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'A'}
          </div>

          {/* User Meta */}
          <div style={{ textAlign: 'left', lineHeight: '1.2' }}>
            <div style={{ fontSize: '12.5px', color: '#ffffff', fontWeight: '600' }}>
              {user?.name || 'Staff Member'}
            </div>
            <div style={{
              fontSize: '10px',
              color: '#d4af37',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              fontWeight: '700',
              marginTop: '2px'
            }}>
              {user?.role || 'Operator'}
            </div>
          </div>
        </div>

        {/* Minimalist Silent Sign Out */}
        <button
          onClick={logout}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '12.5px',
            fontWeight: '500',
            padding: '6px 10px',
            borderRadius: '6px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#fb7185';
            e.currentTarget.style.background = 'rgba(244, 63, 94, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#94a3b8';
            e.currentTarget.style.background = 'none';
          }}
          title="Sign out of management console"
        >
          <LogOut size={14} />
          <span>Sign Out</span>
        </button>

      </div>

    </header>
  );
};

export default DashboardHeader;