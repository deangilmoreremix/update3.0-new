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
    const loadUser = async () => {
      try {
        // Check for JWT token in localStorage
        const token = localStorage.getItem('token');
        if (!token) {
          setIsLoading(false);
          return;
        }

        // Fetch user data using the token
        const response = await fetch('/api/auth/me', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const responseData = await response.json();
          if (responseData.success && responseData.user) {
            setUser(responseData.user);
          } else {
            // Invalid response structure
            localStorage.removeItem('token');
            localStorage.removeItem('user');
          }
        } else {
          // Token is invalid, remove it
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      } catch (error) {
        console.error('Error loading user:', error);
        // Remove invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/';
  };

  return {
    user,
    isLoading,
    isLoaded: !isLoading,
    isAuthenticated: !!user,
    logout
  };
}