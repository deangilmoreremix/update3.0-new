import { useUser, useAuth as useClerkAuth } from '@clerk/clerk-react';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: 'super_admin' | 'reseller' | 'user';
}

export const useAuth = () => {
  const { user: clerkUser, isLoaded } = useUser();
  const { signOut } = useClerkAuth();

  // Transform Clerk user to our AuthUser format
  const user: AuthUser | null = clerkUser ? {
    id: clerkUser.id,
    email: clerkUser.emailAddresses[0]?.emailAddress || '',
    firstName: clerkUser.firstName || undefined,
    lastName: clerkUser.lastName || undefined,
    // Default to super_admin for now - this would normally come from user metadata
    role: (clerkUser.publicMetadata?.role as 'super_admin' | 'reseller' | 'user') || 'super_admin'
  } : null;

  return {
    user,
    isLoaded,
    signOut
  };
};