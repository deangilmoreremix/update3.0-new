import React from 'react';
import { ClerkProvider as BaseClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const FRONTEND_API = import.meta.env.VITE_CLERK_FRONTEND_API;
const SIGN_IN_URL = import.meta.env.VITE_CLERK_SIGN_IN_URL;
const SIGN_UP_URL = import.meta.env.VITE_CLERK_SIGN_UP_URL;
const UNAUTHORIZED_URL = import.meta.env.VITE_CLERK_UNAUTHORIZED_URL;
const SIGN_IN_FALLBACK_REDIRECT_URL = import.meta.env.VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL;
const SIGN_UP_FALLBACK_REDIRECT_URL = import.meta.env.VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL;
const AFTER_LOGO_CLICK_URL = import.meta.env.VITE_CLERK_AFTER_LOGO_CLICK_URL;

if (!PUBLISHABLE_KEY || !FRONTEND_API) {
  throw new Error("Missing Clerk configuration - check .env file");
}

interface ClerkProviderProps {
  children: React.ReactNode;
}

export function ClerkProvider({ children }: ClerkProviderProps) {
  return (
    <BaseClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      frontendApi={FRONTEND_API}
      signInUrl={SIGN_IN_URL}
      signUpUrl={SIGN_UP_URL}
      unauthorizedUrl={UNAUTHORIZED_URL}
      signInFallbackRedirectUrl={SIGN_IN_FALLBACK_REDIRECT_URL}
      signUpFallbackRedirectUrl={SIGN_UP_FALLBACK_REDIRECT_URL}
      afterSignOutUrl={AFTER_LOGO_CLICK_URL}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700',
          card: 'shadow-xl border-0',
          headerTitle: 'text-2xl font-bold',
          headerSubtitle: 'text-gray-600',
        }
      }}
    >
      {children}
    </BaseClerkProvider>
  );
}