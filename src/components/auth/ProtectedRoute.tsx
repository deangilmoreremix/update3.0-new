import React, { FC } from 'react';

// Simple fallback protected route component
export const ProtectedRoute: FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export const SuperAdminRoute: FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export const ResellerRoute: FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export const UserRoute: FC<ProtectedRouteProps> = ({ children }) => {
  return <>{children}</>;
};

export default ProtectedRoute;