import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = ({ allowedRoles, onlyGuest = false, children }) => {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = !!user;
  const userRole = user?.role;

  if (onlyGuest && isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (!isAuthenticated && !onlyGuest) {
    return <Navigate to="/login" replace />;
  }

  if (!onlyGuest && allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
