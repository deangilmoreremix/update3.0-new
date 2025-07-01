import { useUser } from '@clerk/clerk-react';

export type UserRole = 'super_admin' | 'reseller' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  isLoaded: boolean;
}

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

  // Get role from user's public metadata
  const role = (user?.publicMetadata?.role as UserRole) || 'user';

  const authUser: AuthUser | null = user ? {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress || '',
    firstName: user.firstName || undefined,
    lastName: user.lastName || undefined,
    role,
    isLoaded
  } : null;

  // Role checking functions
  const isSuperAdmin = () => role === 'super_admin';
  const isReseller = () => role === 'reseller' || role === 'super_admin';
  const isUser = () => ['user', 'reseller', 'super_admin'].includes(role);

  // Permission checking
  const hasPermission = (requiredRole: UserRole): boolean => {
    const roleHierarchy = {
      'user': 1,
      'reseller': 2,
      'super_admin': 3
    };
    
    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  };

  return {
    user: authUser,
    isLoaded,
    isSignedIn: isSignedIn && !!user,
    role,
    isSuperAdmin,
    isReseller,
    isUser,
    hasPermission
  };
}