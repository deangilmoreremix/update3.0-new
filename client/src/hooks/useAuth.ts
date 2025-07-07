import { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'super_admin' | 'admin' | 'user';
  subscriptionPlan: 'free' | 'basic' | 'professional' | 'enterprise';
  isActive: boolean;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, simulate a super admin user
    const loadUser = async () => {
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Set demo super admin user
        setUser({
          id: 'demo-user-123',
          email: 'demo@smartcrm.com',
          firstName: 'Demo',
          lastName: 'User',
          role: 'super_admin',
          subscriptionPlan: 'enterprise',
          isActive: true
        });
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user
  };
}