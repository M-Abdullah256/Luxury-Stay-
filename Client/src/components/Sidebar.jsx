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
  BellRing,
  ShieldCheck
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();
  const role = user?.role || 'receptionist';

  // Grouped Navigation structure with role governance
  const navSections = [
    {
      title: 'OPERATIONS',
      items: [
        {
          name: 'Overview',
          path: '/dashboard',
          icon: <LayoutDashboard size={18} />,
          roles: ['admin', 'manager', 'receptionist', 'housekeeping']
        },
        {
          name: 'Room Inventory',
          path: '/dashboard/rooms',
          icon: <BedDouble size={18} />,
          roles: ['admin', 'manager', 'receptionist']
        },
        {
          name: 'Reservations & Desk',
          path: '/dashboard/reservations',
          icon: <CalendarCheck size={18} />,
          roles: ['admin', 'manager', 'receptionist']
        },
        {
          name: 'Concierge Requests',
          path: '/dashboard/concierge',
          icon: <BellRing size={18} />,
          roles: ['admin', 'manager', 'receptionist']
        },
        {
          name: 'Guest Directory',
          path: '/dashboard/guests',
          icon: <Users size={18} />,
          roles: ['admin', 'manager', 'receptionist']
        },
        {
          name: 'Billing & Folios',
          path: '/dashboard/billing',
          icon: <Receipt size={18} />,
          roles: ['admin', 'manager', 'receptionist']
        }
      ]
    },
    {
      title: 'FACILITIES & CREW',
      items: [
        {
          name: 'Housekeeping Tasks',
          path: '/dashboard/housekeeping',
          icon: <Sparkles size={18} />,
          roles: ['admin', 'manager', 'housekeeping']
        },
        {
          name: 'Maintenance Logs',
          path: '/dashboard/maintenance',
          icon: <Wrench size={18} />,
          roles: ['admin', 'manager', 'housekeeping']
        }
      ]
    },
    {
      title: 'GOVERNANCE',
      items: [
        {
          name: 'Staff & Governance',
          path: '/dashboard/staff',
          icon: <Shield size={18} />,
          roles: ['admin']
        },
        {
          name: 'System Settings',
          path: '/dashboard/settings',
          icon: <Settings size={18} />,
          roles: ['admin']
        }
      ]
    }
  ];

  return (
    <aside style={{
      width: '270px',
      height: '100vh',                // Fixed height to viewport
      maxHeight: '100vh',
      background: 'rgba(7, 11, 20, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(212, 175, 55, 0.18)',
      display: 'flex',
      flexDirection: 'column',
      padding: '24px 16px 20px 16px',
      position: 'sticky',
      top: 0,
      zIndex: 110,
      boxShadow: '10px 0 30px rgba(0, 0, 0, 0.5)',
      flexShrink: 0
    }}>
      
      {/* Brand Identity / Logo Header (Fixed Top) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '0 8px 20px 8px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        flexShrink: 0
      }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '10px',
          overflow: 'hidden',
          background: '#0a0f1d',
          border: '1.2px solid rgba(212, 175, 55, 0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)'
        }}>
          <img 
            src="/Images/hotel-logo.png" 
            alt="LuxuryStay Crest" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.style.display = 'none';
              e.target.parentNode.innerHTML = '<span style="color:#d4af37; font-weight:800; font-size:16px; font-family:serif;">LS</span>';
            }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </div>

        <div>
          <span style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: '18px',
            fontWeight: '700',
            color: '#ffffff',
            letterSpacing: '1.5px',
            textTransform: 'uppercase',
            display: 'block',
            lineHeight: '1.1'
          }}>
            LUXURY<span style={{ color: '#d4af37' }}>STAY</span>
          </span>
          <span style={{
            fontSize: '8.5px',
            letterSpacing: '2px',
            color: '#94a3b8',
            textTransform: 'uppercase',
            fontWeight: '600',
            marginTop: '2px',
            display: 'block'
          }}>
            Operations Console
          </span>
        </div>
      </div>

      {/* Navigation Groups (Scrollable Middle Section) */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
        marginTop: '18px',
        marginBottom: '14px',
        flex: 1,
        overflowY: 'auto',
        paddingRight: '4px'
      }}>
        {navSections.map((section, sIdx) => {
          const permittedItems = section.items.filter((item) => item.roles.includes(role));
          if (permittedItems.length === 0) return null;

          return (
            <div key={sIdx}>
              {/* Group Heading */}
              <div style={{
                fontSize: '9.5px',
                fontWeight: '700',
                letterSpacing: '2px',
                color: 'rgba(212, 175, 55, 0.75)',
                padding: '0 12px 8px 12px',
                textTransform: 'uppercase'
              }}>
                {section.title}
              </div>

              {/* Items in this group */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {permittedItems.map((item, idx) => (
                  <NavLink
                    key={idx}
                    to={item.path}
                    end={item.path === '/dashboard'}
                    style={({ isActive }) => ({
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontSize: '13px',
                      fontWeight: isActive ? '600' : '500',
                      letterSpacing: '0.3px',
                      color: isActive ? '#ffffff' : '#94a3b8',
                      background: isActive 
                        ? 'linear-gradient(90deg, rgba(212, 175, 55, 0.15) 0%, rgba(212, 175, 55, 0.04) 100%)' 
                        : 'transparent',
                      borderLeft: isActive ? '3px solid #d4af37' : '3px solid transparent',
                      borderTop: isActive ? '1px solid rgba(212, 175, 55, 0.25)' : '1px solid transparent',
                      borderRight: isActive ? '1px solid rgba(212, 175, 55, 0.1)' : '1px solid transparent',
                      borderBottom: isActive ? '1px solid rgba(212, 175, 55, 0.1)' : '1px solid transparent',
                      transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <span style={{
                            color: isActive ? '#d4af37' : '#94a3b8',
                            display: 'flex',
                            transition: 'color 0.2s ease'
                          }}>
                            {item.icon}
                          </span>
                          <span>{item.name}</span>
                        </div>

                        {isActive && (
                          <div style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            background: '#d4af37',
                            boxShadow: '0 0 8px #d4af37'
                          }} />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= FIXED BOTTOM PINNED BADGE ================= */}
      <div style={{
        marginTop: 'auto',             // Always pushed to the absolute bottom
        flexShrink: 0,                 // Never shrinks or jumps
        padding: '12px 14px',
        borderRadius: '12px',
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.07)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '9px' }}>
          <ShieldCheck size={16} color="#d4af37" />
          <div>
            <div style={{ fontSize: '9px', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Clearance Level
            </div>
            <div style={{ fontSize: '12px', color: '#ffffff', fontWeight: '700', textTransform: 'capitalize', marginTop: '1px' }}>
              {role}
            </div>
          </div>
        </div>

        <span style={{
          fontSize: '9.5px',
          color: '#10b981',
          background: 'rgba(16, 185, 129, 0.12)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          padding: '2px 8px',
          borderRadius: '10px',
          fontWeight: '700'
        }}>
          ACTIVE
        </span>
      </div>

    </aside>
  );
};

export default Sidebar;