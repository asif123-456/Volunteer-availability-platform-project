import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-semibold text-slate-500">Loading platform...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // If logged in but unauthorized for this role, redirect to their home dashboard
    if (user?.role === 'ngo') {
      return <Navigate to="/ngo/dashboard" replace />;
    } else if (user?.role === 'superadmin') {
      return <Navigate to="/admin/panel" replace />;
    } else {
      return <Navigate to="/volunteer/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
