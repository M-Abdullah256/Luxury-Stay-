import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, Bell, User } from 'lucide-react';
import { Link } from 'react-router-dom';

const DashboardHeader = () => {
  const { user, logout } = useAuth();

  return (
    <header style={{
      height: '70px',
      background: 'rgba(15, 23, 42, 0.75)',
      backdropFilter: 'blur(10px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '0 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      {/* Hotel Status Tag */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <Link to="/" style={{ color: 'var(--text-muted)', fontSize: '13px', textDecoration: 'none' }}>
          ← View Public Website
        </Link>
        <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
        <span style={{ fontSize: '13px', color: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
          Gateway Connected (Live)
        </span>
      </div>

      {/* User info, role & logout */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: 'rgba(255,255,255,0.04)',
          padding: '6px 14px',
          borderRadius: '30px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{
            background: 'var(--primary-gold)',
            color: '#0b1120',
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '700',
            fontSize: '13px'
          }}>
            {user?.name ? user.name[0].toUpperCase() : 'U'}
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '13px', color: '#fff', fontWeight: '600' }}>{user?.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--primary-gold)', textTransform: 'capitalize' }}>{user?.role}</div>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.3)',
            color: '#fb7185',
            padding: '8px 14px',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            fontWeight: '500'
          }}
          title="Sign Out"
        >
          <LogOut size={16} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
};

export default DashboardHeader;