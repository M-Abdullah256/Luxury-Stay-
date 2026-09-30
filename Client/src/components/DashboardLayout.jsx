import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import DashboardHeader from './DashboardHeader';

const DashboardLayout = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0b1120' }}>
      {/* Dynamic Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <DashboardHeader />
        <main style={{ padding: '32px', flex: 1 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;