import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/hooks/useAuth';
import { SignIn } from '@clerk/clerk-react';

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
  const { user, isLoaded, isSignedIn, hasPermission } = useAuth();

  // Show loading while Clerk is initializing
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  // Show sign-in if not authenticated
  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-md w-full">
          <SignIn 
            redirectUrl={window.location.pathname}
            appearance={{
              elements: {
                formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
                card: 'shadow-xl border-0',
              }
            }}
          />
        </div>
      </div>
    );
  }

  // Check role permissions
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