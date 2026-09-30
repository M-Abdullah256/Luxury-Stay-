import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import PublicRooms from './pages/PublicRooms';
import TrackBooking from './pages/TrackBooking';
import AboutUs from './pages/AboutUs';                 // <-- Naya import
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import RoomsManagement from './pages/RoomsManagement';
import Reservations from './pages/Reservations';
import BillingInvoices from './pages/BillingInvoices';
import HousekeepingPage from './pages/HousekeepingPage';
import MaintenancePage from './pages/MaintenancePage';
import GuestsList from './pages/GuestsList';
import StaffManagement from './pages/StaffManagement';
import SystemSettings from './pages/SystemSettings';

function App() {
  const location = useLocation();
  const isDashboardOrAuth = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isDashboardOrAuth && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Customer Facing Routes (Zero Login Required!) */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/rooms" element={<PublicRooms />} />
          <Route path="/about" element={<AboutUs />} />             {/* <-- Naya Route */}
          <Route path="/my-booking" element={<TrackBooking />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected HMS Internal Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="rooms" element={<RoomsManagement />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="billing" element={<BillingInvoices />} />
              <Route path="housekeeping" element={<HousekeepingPage />} />
              <Route path="maintenance" element={<MaintenancePage />} />
              <Route path="guests" element={<GuestsList />} />
              <Route path="staff" element={<StaffManagement />} />
              <Route path="settings" element={<SystemSettings />} />
            </Route>
          </Route>
        </Routes>
      </main>

      {!isDashboardOrAuth && <Footer />}
    </div>
  );
}

export default App;