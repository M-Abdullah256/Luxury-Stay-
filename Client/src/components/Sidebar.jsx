import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  Receipt,
  Sparkles,
  Wrench,
  Shield,
  Settings,
  Hotel,
  BellRing
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'receptionist';

  // Navigation items with role permissions
  const navItems = [
    {
      name: 'Overview',
      path: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      roles: ['admin', 'manager', 'receptionist', 'housekeeping']
    },
    {
      name: 'Room Inventory',
      path: '/dashboard/rooms',
      icon: <BedDouble size={20} />,
      roles: ['admin', 'manager', 'receptionist']
    },
    {
      name: 'Reservations & Check-In',
      path: '/dashboard/reservations',
      icon: <CalendarCheck size={20} />,
      roles: ['admin', 'manager', 'receptionist']
    },
       {
      name: 'Concierge Requests',                         // <-- NAYA ITEM
      path: '/dashboard/concierge',
      icon: <BellRing size={20} />,
      roles: ['admin', 'manager', 'receptionist']
    },
    {
      name: 'Guest Profiles',
      path: '/dashboard/guests',
      icon: <Users size={20} />,
      roles: ['admin', 'manager', 'receptionist']
    },
    {
      name: 'Billing & Invoices',
      path: '/dashboard/billing',
      icon: <Receipt size={20} />,
      roles: ['admin', 'manager', 'receptionist']
    },
    {
      name: 'Housekeeping Tasks',
      path: '/dashboard/housekeeping',
      icon: <Sparkles size={20} />,
      roles: ['admin', 'manager', 'housekeeping']
    },
    {
      name: 'Maintenance Logs',
      path: '/dashboard/maintenance',
      icon: <Wrench size={20} />,
      roles: ['admin', 'manager', 'housekeeping']
    },
    {
      name: 'Staff Management',
      path: '/dashboard/staff',
      icon: <Shield size={20} />,
      roles: ['admin'] // Admin only
    },
    {
      name: 'System Settings',
      path: '/dashboard/settings',
      icon: <Settings size={20} />,
      roles: ['admin'] // Admin only
    }
  ];

  // User role ke mutabiq filter karein
  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  return (
    <aside style={{
      width: '260px',
      background: 'var(--sidebar-bg)',
      borderRight: '1px solid rgba(255, 255, 255, 0.08)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px',
      position: 'sticky',
      top: 0
    }}>
      {/* Brand Logo in Sidebar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '0 8px 24px 8px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          background: 'linear-gradient(135deg, #c5a880 0%, #b09166 100%)',
          padding: '6px',
          borderRadius: '8px',
          color: '#0b1120',
          display: 'flex'
        }}>
          <Hotel size={22} />
        </div>
        <div>
          <span className="luxury-heading" style={{ fontSize: '18px', fontWeight: '700', color: '#fff', letterSpacing: '0.5px' }}>
            LUXURY<span style={{ color: 'var(--primary-gold)' }}>STAY</span>
          </span>
          <span style={{ fontSize: '10px', display: 'block', color: 'var(--text-muted)', letterSpacing: '1px' }}>
            HMS PORTAL
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '20px', flex: 1 }}>
        {filteredNav.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.path}
            end={item.path === '/dashboard'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 14px',
              borderRadius: '10px',
              textDecoration: 'none',
              fontSize: '14px',
              fontWeight: isActive ? '600' : '500',
              color: isActive ? '#0f172a' : '#94a3b8',
              background: isActive ? 'linear-gradient(135deg, #c5a880 0%, #b09166 100%)' : 'transparent',
              transition: 'all 0.2s ease'
            })}
          >
            {item.icon}
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Role indicator */}
      <div style={{
        padding: '12px',
        borderRadius: '10px',
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        fontSize: '12px',
        color: 'var(--text-muted)'
      }}>
        Access Level: <strong style={{ color: 'var(--primary-gold)', textTransform: 'capitalize' }}>{role}</strong>
      </div>
    </aside>
  );
};

export default Sidebar;