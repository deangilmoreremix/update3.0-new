import React from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

// Simple fallback protected route component
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export const SuperAdminRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export const ResellerRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export const UserRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;