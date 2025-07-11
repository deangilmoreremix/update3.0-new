import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export type UserRole = 'super_admin' | 'reseller' | 'user';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  fallbackPath?: string;
}

export function ProtectedRoute({ 
  children, 
  requiredRole = 'user', 
  fallbackPath = '/unauthorized' 
}: ProtectedRouteProps) {
  const { user, isLoaded } = useAuth();

  // Show loading while auth is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show sign-in if not authenticated (redirect to login page)
  if (!user) {
    return <Navigate to="/login" state={{ from: window.location.pathname }} replace />;
  }

  // Check role permissions
  const hasPermission = (role: UserRole) => {
    if (!user) return false;
    
    // Super admin has access to everything
    if (user.role === 'super_admin') return true;
    
    // Reseller can access reseller and user level
    if (user.role === 'reseller' && (role === 'reseller' || role === 'user')) return true;
    
    // Users can only access user level
    if (user.role === 'user' && role === 'user') return true;
    
    return false;
  };

  if (!hasPermission(requiredRole)) {
    return <Navigate to={fallbackPath} replace />;
  }

  return <>{children}</>;
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="user">
      {children}
    </ProtectedRoute>
  );
}

export function ResellerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="reseller">
      {children}
    </ProtectedRoute>
  );
}

export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="super_admin">
      {children}
    </ProtectedRoute>
  );
}

const superAdminUser: AuthUser = {
  id: 'super-admin-1',
  email: 'superadmin@smart-crm.com',
  firstName: 'Super',
  lastName: 'Admin',
  role: 'super_admin'
};