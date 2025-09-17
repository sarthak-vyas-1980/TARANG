import React from 'react';
import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from './LoadingSpinner';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRoles?: Role[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRoles = [],
  redirectTo = '/login'
}) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading..." />
      </div>
    );
  }
  
  if (!user) {
    // Redirect to login with return url
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }
  
  // Check role-based access
  if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">
            You don't have permission to access this page.
          </p>
          <Navigate to="/dashboard" replace />
        </div>
      </div>
    );
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
