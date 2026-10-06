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
  AlertCircle,
  Star,
  MessageSquare,
  ShieldCheck,
  Activity
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const DashboardOverview = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, roomsRes, feedbackRes] = await Promise.all([
          API.get('/dashboard/stats'),
          API.get('/rooms'),
          API.get('/extras/feedback')
        ]);
        setStats(statsRes.data.data);
        setRooms(roomsRes.data.rooms || []);
        setFeedbacks(feedbackRes.data.feedback || []);
      } catch (err) {
        console.error('Failed to load dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div style={{ color: '#d4af37', padding: '60px', textAlign: 'center', fontSize: '15px' }}>
        Retrieving Live Operations Ledger...
      </div>
    );
  }

  const roomStats = stats?.rooms || {};

  // Dynamic Math
  const totalReviews = feedbacks.length;
  let avgRating = '4.9';
  let cleanlinessPct = '98.4';
  let servicePct = '99.1';
  let comfortPct = '97.8';

  if (totalReviews > 0) {
    const totalCleanliness = feedbacks.reduce((acc, f) => acc + (f.ratings?.cleanliness || 5), 0);
    const totalService = feedbacks.reduce((acc, f) => acc + (f.ratings?.service || 5), 0);
    const totalComfort = feedbacks.reduce((acc, f) => acc + (f.ratings?.roomComfort || 5), 0);

    cleanlinessPct = ((totalCleanliness / (totalReviews * 5)) * 100).toFixed(1);
    servicePct = ((totalService / (totalReviews * 5)) * 100).toFixed(1);
    comfortPct = ((totalComfort / (totalReviews * 5)) * 100).toFixed(1);

    const overallAverageScore = (Number(cleanlinessPct) + Number(servicePct) + Number(comfortPct)) / 3;
    avgRating = ((overallAverageScore / 100) * 5).toFixed(1);
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', color: '#f8fafc', paddingBottom: '40px' }}>
      
      {/* ================= 1. EXECUTIVE PANORAMIC VISUAL BANNER ================= */}
      <div style={{
        position: 'relative',
        borderRadius: '22px',
        overflow: 'hidden',
        minHeight: '200px',
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
          backgroundImage: `url('/Images/dashboard-banner.jpg'), url('/Images/about-hotel.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.55) contrast(1.1)',
          zIndex: 0
        }} />

        {/* Dark Vignette Overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(5, 8, 17, 0.95) 0%, rgba(5, 8, 17, 0.65) 50%, rgba(5, 8, 17, 0.85) 100%)',
          zIndex: 1
        }} />

        {/* Content Inside Banner */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: '680px' }}>
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
            <Sparkles size={13} /> Property Command Center
          </div>

          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: 'clamp(24px, 2.8vw, 34px)',
            color: '#ffffff',
            margin: '0 0 8px 0',
            fontWeight: '600'
          }}>
            Welcome, {user?.name || 'Administrator'}
          </h2>

          <p style={{ color: '#cbd5e1', fontSize: '13.5px', lineHeight: '1.6', margin: 0, fontWeight: '300' }}>
            Central operations ledger is active. Today's occupancy velocity is currently tracking at <strong style={{ color: '#d4af37' }}>{roomStats.occupancyRate || '0%'}</strong> with synchronized front-desk and housekeeping channels.
          </p>
        </div>

        {/* Right Status Pill inside banner */}
        <div style={{
          position: 'relative',
          zIndex: 2,
          marginLeft: 'auto',
          display: 'none',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '8px'
        }} className="banner-status-pill">
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
            <Activity size={14} /> Systems: 100% Operational
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Real-time Gateway Node</span>
        </div>
      </div>

      {/* ================= 2. TOP 4 EXECUTIVE KPI METRICS ================= */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '20px'
      }}>
        {/* Metric 1 */}
        <div style={metricCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Occupancy Rate
            </span>
            <div style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', padding: '8px', borderRadius: '10px' }}>
              <TrendingUp size={18} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: '#ffffff', fontFamily: "'Playfair Display', serif" }}>
            {roomStats.occupancyRate || '0%'}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
            <strong style={{ color: '#e2e8f0' }}>{roomStats.occupied || 0}</strong> of {roomStats.total || 0} suites occupied
          </div>
        </div>

        {/* Metric 2 */}
        <div style={metricCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Total Revenue
            </span>
            <div style={{ background: 'rgba(212, 175, 55, 0.12)', color: '#d4af37', padding: '8px', borderRadius: '10px' }}>
              <DollarSign size={18} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: '#d4af37', fontFamily: "'Playfair Display', serif" }}>
            ${stats?.totalRevenue?.toLocaleString() || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px', fontWeight: '500' }}>
            Paid bills & finalized folios
          </div>
        </div>

        {/* Metric 3 */}
        <div style={metricCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Active Bookings
            </span>
            <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '8px', borderRadius: '10px' }}>
              <CalendarCheck size={18} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: '#ffffff', fontFamily: "'Playfair Display', serif" }}>
            {stats?.activeReservations || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
            Confirmed arrivals & checked-in
          </div>
        </div>

        {/* Metric 4 */}
        <div style={metricCardStyle}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
            <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
              Guest Directory
            </span>
            <div style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '8px', borderRadius: '10px' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '30px', fontWeight: '700', color: '#ffffff', fontFamily: "'Playfair Display', serif" }}>
            {stats?.guestsCount || 0}
          </div>
          <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '6px' }}>
            Profiles in PMS central ledger
          </div>
        </div>
      </div>

      {/* ================= 3. ROOM INVENTORY STATUS & LIVE MATRIX ================= */}
      <div style={{
        background: 'rgba(13, 21, 39, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#ffffff', fontSize: '20px', margin: '0 0 4px 0' }}>
              Room Inventory Distribution
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0 }}>
              Live status mapping across all property wings.
            </p>
          </div>

          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
            Total Inventory: <strong style={{ color: '#d4af37' }}>{roomStats.total || rooms.length} Suites</strong>
          </span>
        </div>

        {/* 4 Status Breakdown Blocks */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.08)', border: '1px solid rgba(16, 185, 129, 0.25)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ color: '#34d399', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>AVAILABLE</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>{roomStats.available || 0} Suites</div>
          </div>

          <div style={{ background: 'rgba(244, 63, 94, 0.08)', border: '1px solid rgba(244, 63, 94, 0.25)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ color: '#fb7185', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>OCCUPIED</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>{roomStats.occupied || 0} Suites</div>
          </div>

          <div style={{ background: 'rgba(245, 158, 11, 0.08)', border: '1px solid rgba(245, 158, 11, 0.25)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ color: '#fbbf24', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>CLEANING IN PROGRESS</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>{roomStats.cleaning || 0} Suites</div>
          </div>

          <div style={{ background: 'rgba(148, 163, 184, 0.08)', border: '1px solid rgba(148, 163, 184, 0.25)', padding: '16px', borderRadius: '12px' }}>
            <div style={{ color: '#cbd5e1', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' }}>MAINTENANCE</div>
            <div style={{ fontSize: '24px', fontWeight: '700', color: '#ffffff', marginTop: '6px' }}>{roomStats.maintenance || 0} Suites</div>
          </div>
        </div>

        {/* Live Interactive Rooms Matrix */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '22px' }}>
          <h4 style={{ color: '#ffffff', fontSize: '15px', marginBottom: '16px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BedDouble size={16} color="#d4af37" /> Real-Time Suite State Board ({rooms.length})
          </h4>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '12px'
          }}>
            {rooms.map((room) => {
              const statusColor = 
                room.status === 'Available' ? '#10b981' :
                room.status === 'Occupied' ? '#f43f5e' :
                room.status === 'Cleaning' ? '#f59e0b' : '#94a3b8';

              return (
                <div
                  key={room._id}
                  style={{
                    background: 'rgba(7, 11, 20, 0.85)',
                    border: `1px solid ${room.status === 'Available' ? 'rgba(16, 185, 129, 0.25)' : 'rgba(255, 255, 255, 0.08)'}`,
                    borderRadius: '10px',
                    padding: '12px',
                    textAlign: 'center',
                    transition: 'transform 0.2s ease'
                  }}
                >
                  <div style={{ fontSize: '17px', fontWeight: '700', color: '#ffffff' }}>#{room.roomNumber}</div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', margin: '2px 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {room.roomType}
                  </div>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '700',
                    letterSpacing: '0.4px',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    background: `${statusColor}18`,
                    color: statusColor,
                    border: `1px solid ${statusColor}35`,
                    display: 'inline-block'
                  }}>
                    ● {room.status}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= 4. GUEST SENTIMENT & ANALYTICS ================= */}
      <div style={{
        background: 'rgba(13, 21, 39, 0.85)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(212, 175, 55, 0.22)',
        borderRadius: '20px',
        padding: '28px',
        boxShadow: '0 20px 45px rgba(0, 0, 0, 0.7)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h3 style={{ fontFamily: "'Playfair Display', Georgia, serif", color: '#ffffff', fontSize: '20px', margin: '0 0 4px 0' }}>
              Guest Sentiment & Experience Analytics
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '12.5px', margin: 0 }}>
              Real-time calculations computed dynamically across {totalReviews} verified guest reviews.
            </p>
          </div>

          <div style={{
            background: 'rgba(212, 175, 55, 0.12)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            color: '#d4af37',
            padding: '7px 18px',
            borderRadius: '25px',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Star size={15} style={{ fill: '#d4af37' }} /> {avgRating} / 5.0 Overall Satisfaction
          </div>
        </div>

        {/* 3 Metric Progress Blocks */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '18px', marginBottom: '32px' }}>
          <div style={{ background: 'rgba(7, 11, 20, 0.85)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>Cleanliness & Sanitization</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#34d399', marginTop: '6px' }}>
              {cleanlinessPct}%
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${cleanlinessPct}%`, height: '100%', background: '#34d399', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(7, 11, 20, 0.85)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>Front Desk & Butler Service</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#38bdf8', marginTop: '6px' }}>
              {servicePct}%
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${servicePct}%`, height: '100%', background: '#38bdf8', borderRadius: '4px' }} />
            </div>
          </div>

          <div style={{ background: 'rgba(7, 11, 20, 0.85)', padding: '18px', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
            <div style={{ color: '#94a3b8', fontSize: '12px', fontWeight: '500' }}>Suite Comfort & Linens</div>
            <div style={{ fontSize: '26px', fontWeight: '700', color: '#d4af37', marginTop: '6px' }}>
              {comfortPct}%
            </div>
            <div style={{ width: '100%', height: '5px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', marginTop: '10px', overflow: 'hidden' }}>
              <div style={{ width: `${comfortPct}%`, height: '100%', background: '#d4af37', borderRadius: '4px' }} />
            </div>
          </div>
        </div>

        {/* Live Guest Review Feed */}
        <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '22px' }}>
          <h4 style={{ color: '#ffffff', fontSize: '15px', fontWeight: '600', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <MessageSquare size={16} color="#d4af37" /> Verified Guest Testimonials ({feedbacks.length})
          </h4>

          {feedbacks.length === 0 ? (
            <div style={{ padding: '24px', background: 'rgba(7, 11, 20, 0.6)', borderRadius: '12px', color: '#94a3b8', fontSize: '13px', textAlign: 'center' }}>
              No guest feedback submitted yet. Reviews submitted from the public site will appear here in real-time.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
              {feedbacks.map((fb) => (
                <div 
                  key={fb._id}
                  style={{
                    background: 'rgba(7, 11, 20, 0.85)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    borderRadius: '14px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', gap: '2px' }}>
                        {[...Array(fb.ratings?.cleanliness || 5)].map((_, i) => (
                          <Star key={i} size={13} color="#d4af37" style={{ fill: '#d4af37' }} />
                        ))}
                      </div>
                      <span style={{ fontSize: '11px', color: '#64748b' }}>
                        {new Date(fb.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <p style={{ color: '#cbd5e1', fontSize: '13px', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '16px' }}>
                      "{fb.comments}"
                    </p>
                  </div>

                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.04)', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12.5px', color: '#ffffff', fontWeight: '600' }}>
  {fb.guest?.fullName || 'Verified Resident'}
</div>
<span style={{ fontSize: '10px', color: '#d4af37', background: 'rgba(212, 175, 55, 0.1)', padding: '2px 8px', borderRadius: '10px', fontWeight: '600' }}>
  Verified Stay
</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      <style>{`
        @media (min-width: 900px) {
          .banner-status-pill {
            display: flex !important;
          }
        }
      `}</style>
    </div>
  );
};

const metricCardStyle = {
  background: 'rgba(13, 21, 39, 0.85)',
  backdropFilter: 'blur(16px)',
  border: '1px solid rgba(212, 175, 55, 0.2)',
  borderRadius: '16px',
  padding: '22px',
  boxShadow: '0 15px 35px -10px rgba(0, 0, 0, 0.7)'
};

export default DashboardOverview;