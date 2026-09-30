import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import {
  BedDouble,
  DollarSign,
  Users,
  CalendarCheck,
  TrendingUp,
  Sparkles,
  Wrench,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const DashboardOverview = () => {
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, roomsRes] = await Promise.all([
          API.get('/dashboard/stats'),
          API.get('/rooms')
        ]);
        setStats(statsRes.data.data);
        setRooms(roomsRes.data.rooms);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div style={{ color: 'var(--text-muted)', padding: '40px', textAlign: 'center' }}>Loading live operational data...</div>;
  }

  const roomStats = stats?.rooms || {};

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Welcome Title */}
      <div>
        <h1 className="luxury-heading" style={{ fontSize: '28px', color: '#fff', marginBottom: '6px' }}>
          Operations & Performance Cockpit
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
          Live metrics reflecting inventory status, occupancy velocity, and financial collections.
        </p>
      </div>

      {/* Top 4 KPI Metrics */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        {/* Metric 1: Occupancy Rate */}
        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Occupancy Rate</span>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '8px', borderRadius: '10px' }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>
            {roomStats.occupancyRate || '0%'}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            {roomStats.occupied || 0} of {roomStats.total || 0} suites occupied
          </span>
        </div>

        {/* Metric 2: Total Revenue */}
        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Total Revenue</span>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px', borderRadius: '10px' }}>
              <DollarSign size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: 'var(--primary-gold)' }}>
            ${stats?.totalRevenue?.toLocaleString() || 0}
          </div>
          <span style={{ fontSize: '12px', color: '#10b981' }}>
            Paid bills & finalized folios
          </span>
        </div>

        {/* Metric 3: Active Bookings */}
        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Active Reservations</span>
            <div style={{ background: 'rgba(197, 168, 128, 0.1)', color: 'var(--primary-gold)', padding: '8px', borderRadius: '10px' }}>
              <CalendarCheck size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>
            {stats?.activeReservations || 0}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Confirmed or Checked-In
          </span>
        </div>

        {/* Metric 4: Registered Guests */}
        <div className="luxury-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '13px', fontWeight: '500' }}>Guest Directory</span>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '8px', borderRadius: '10px' }}>
              <Users size={20} />
            </div>
          </div>
          <div style={{ fontSize: '28px', fontWeight: '700', color: '#fff' }}>
            {stats?.guestsCount || 0}
          </div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Profiles in PMS database
          </span>
        </div>
      </div>

      {/* Room Status Breakdown Bar (SRS Module 5 & 13) */}
      <div className="luxury-card" style={{ padding: '24px' }}>
        <h3 style={{ color: '#fff', fontSize: '18px', marginBottom: '16px' }}>
          Room Inventory Status Overview
        </h3>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
          gap: '16px',
          marginBottom: '24px'
        }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ color: '#34d399', fontSize: '12px', fontWeight: '600' }}>AVAILABLE</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{roomStats.available || 0} Rooms</div>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.2)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ color: '#fb7185', fontSize: '12px', fontWeight: '600' }}>OCCUPIED</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{roomStats.occupied || 0} Rooms</div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ color: '#fbbf24', fontSize: '12px', fontWeight: '600' }}>CLEANING</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{roomStats.cleaning || 0} Rooms</div>
          </div>

          <div style={{ background: 'rgba(148, 163, 184, 0.1)', border: '1px solid rgba(148, 163, 184, 0.2)', padding: '14px', borderRadius: '10px' }}>
            <div style={{ color: '#cbd5e1', fontSize: '12px', fontWeight: '600' }}>MAINTENANCE</div>
            <div style={{ fontSize: '22px', fontWeight: '700', color: '#fff', marginTop: '4px' }}>{roomStats.maintenance || 0} Rooms</div>
          </div>
        </div>

        {/* Live Rooms Quick Grid */}
        <h4 style={{ color: '#cbd5e1', fontSize: '15px', marginBottom: '12px', fontWeight: '600' }}>
          Live Rooms Matrix
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))',
          gap: '12px'
        }}>
          {rooms.map((room) => (
            <div
              key={room._id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '8px',
                padding: '12px',
                textAlign: 'center'
              }}
            >
              <div style={{ fontSize: '16px', fontWeight: '700', color: '#fff' }}>#{room.roomNumber}</div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>{room.roomType}</div>
              <span className={`badge badge-${room.status.toLowerCase()}`} style={{ fontSize: '10px', padding: '2px 8px' }}>
                {room.status}
              </span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default DashboardOverview;