/**
 * Protected Route Component
 * 
 * This component protects routes that require authentication.
 * Redirects to login if user is not authenticated.
 * 
 * @module components/ProtectedRoute
 */

import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context';

/**
 * ProtectedRoute component props
 */
interface ProtectedRouteProps {
  /** Whether authentication is required */
  requireAuth?: boolean;
  /** Whether admin role is required */
  requireAdmin?: boolean;
}

/**
 * Protected Route Component
 * Guards routes based on authentication and role requirements
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requireAuth = false,
  requireAdmin = false,
}) => {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check authentication requirement
  // FIXED: Pass the current location as state so we can redirect back after login
  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Check admin requirement
  if (requireAdmin && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  // Render child routes
  return <Outlet />;
};

export default ProtectedRoute;
