import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/DashboardLayout';
import DashboardOverview from './pages/DashboardOverview';
import RoomsManagement from './pages/RoomsManagement';
import Reservations from './pages/Reservations';
import BillingInvoices from './pages/BillingInvoices';
import HousekeepingPage from './pages/HousekeepingPage'; // <-- Naya import
import MaintenancePage from './pages/MaintenancePage';   // <-- Naya import

function App() {
  const location = useLocation();
  const isDashboardOrAuth = location.pathname.startsWith('/dashboard') || location.pathname === '/login';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isDashboardOrAuth && <Navbar />}

      <main style={{ flex: 1 }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected HMS Internal Dashboard Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="rooms" element={<RoomsManagement />} />
              <Route path="reservations" element={<Reservations />} />
              <Route path="billing" element={<BillingInvoices />} />
              <Route path="housekeeping" element={<HousekeepingPage />} /> {/* <-- Naya route */}
              <Route path="maintenance" element={<MaintenancePage />} />   {/* <-- Naya route */}
            </Route>
          </Route>
        </Routes>
      </main>

      {!isDashboardOrAuth && <Footer />}
    </div>
  );
}

export default App;