import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';

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

// Specific role-based components
export function SuperAdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="super_admin" fallbackPath="/unauthorized">
      {children}
    </ProtectedRoute>
  );
}

export function ResellerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="reseller" fallbackPath="/unauthorized">
      {children}
    </ProtectedRoute>
  );
}

export function UserRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole="user">
      {children}
    </ProtectedRoute>
  );
}