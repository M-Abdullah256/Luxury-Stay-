import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Agar user ka role allowed list mein nahi hai
  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    return (
      <div style={{ padding: '60px', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--danger-rose)', marginBottom: '10px' }}>403 - Access Denied</h2>
        <p style={{ color: 'var(--text-muted)' }}>
          Your role [{user?.role}] does not have permission to view this section.
        </p>
      </div>
    );
  }

  return <Outlet />;
};

export default ProtectedRoute;