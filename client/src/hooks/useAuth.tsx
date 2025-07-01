import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';
import { useDemoAuth } from '../components/auth/DemoAuthProvider';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'reseller' | 'user';
}

export const useAuth = () => {
  try {
    // Try to use Clerk first
    const { user: clerkUser, isLoaded } = useUser();
    const { signOut } = useClerkAuth();

    // If Clerk is working, transform Clerk user to our AuthUser format
    if (clerkUser) {
      const user: AuthUser = {
        id: clerkUser.id,
        email: clerkUser.emailAddresses[0]?.emailAddress || '',
        firstName: clerkUser.firstName || undefined,
        lastName: clerkUser.lastName || undefined,
        role: (clerkUser.publicMetadata?.role as 'super_admin' | 'reseller' | 'user') || 'super_admin'
      };

      return {
        user,
        isLoaded,
        signOut
      };
    }

    // If Clerk is loaded but no user, return null user
    return {
      user: null,
      isLoaded,
      signOut
    };
  } catch (error) {
    // If Clerk hooks fail, fall back to demo auth
    console.log('Falling back to demo authentication');
    return useDemoAuth();
  }
};