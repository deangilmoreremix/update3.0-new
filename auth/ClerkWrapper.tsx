import React, { useState, useEffect } from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { AuthProvider as DemoAuthProvider } from './DemoAuthProvider';

interface ClerkWrapperProps {
  children: React.ReactNode;
}

export const ClerkWrapper: React.FC<ClerkWrapperProps> = ({ children }) => {
  const [clerkError, setClerkError] = useState(false);
  const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

  useEffect(() => {
    // Listen for Clerk initialization errors
    const handleError = (event: ErrorEvent) => {
      if (event.error?.message?.includes('ClerkJS: Something went wrong initializing Clerk')) {
        console.warn('Clerk initialization failed, falling back to demo authentication');
        setClerkError(true);
      }
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  // If Clerk fails to initialize or we don't have proper keys, use demo auth
  if (clerkError || !publishableKey) {
    console.log('Using demo authentication system');
    return <DemoAuthProvider>{children}</DemoAuthProvider>;
  }

  return (
    <ClerkProvider 
      publishableKey={publishableKey}
      navigate={(to) => window.location.href = to}
    >
      {children}
    </ClerkProvider>
  );
};