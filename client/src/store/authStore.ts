import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '../lib/api';
import type { User } from '@shared/schema';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUser: (user) => {
        set({ 
          user,
          isAuthenticated: !!user
        });
        
        // Set the user ID in the API client
        if (user) {
          api.setUserId(user.id);
        }
      },
      
      initializeAuth: async () => {
        set({ isLoading: true });
        
        try {
          // For Replit environment, we'll create a demo user if none exists
          const storedUser = get().user;
          if (storedUser) {
            api.setUserId(storedUser.id);
            set({ isAuthenticated: true });
          } else {
            // Auto-login as demo user for simplicity in Replit
            const demoUser: User = {
              id: '550e8400-e29b-41d4-a716-446655440000',
              email: 'demo@smartcrm.com',
              fullName: 'Demo User',
              accountStatus: 'active',
              createdAt: new Date(),
              updatedAt: new Date(),
              avatarUrl: null,
              jobTitle: null,
              company: null,
              phone: null,
              timezone: null,
              preferences: {},
              socialLinks: {}
            };
            
            set({
              user: demoUser,
              isAuthenticated: true
            });
            
            api.setUserId(demoUser.id);
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
          set({ error: 'Failed to initialize authentication' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          // For demo purposes, accept any email/password combination
          const demoUser: User = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            email: email,
            fullName: email.split('@')[0],
            accountStatus: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            avatarUrl: null,
            jobTitle: null,
            company: null,
            phone: null,
            timezone: null,
            preferences: {},
            socialLinks: {}
          };
          
          set({
            user: demoUser,
            isAuthenticated: true
          });
          
          api.setUserId(demoUser.id);
        } catch (error: any) {
          set({ error: error.message || 'Login failed' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      register: async (email, password, fullName) => {
        set({ isLoading: true, error: null });
        
        try {
          const newUser: User = {
            id: `user-${Date.now()}`,
            email: email,
            fullName: fullName || email.split('@')[0],
            accountStatus: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            avatarUrl: null,
            jobTitle: null,
            company: null,
            phone: null,
            timezone: null,
            preferences: {},
            socialLinks: {}
          };
          
          set({
            user: newUser,
            isAuthenticated: true
          });
          
          api.setUserId(newUser.id);
        } catch (error: any) {
          set({ error: error.message || 'Registration failed' });
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: async () => {
        set({
          user: null,
          isAuthenticated: false
        });
      },
      
      clearError: () => {
        set({ error: null });
      },
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ 
        user: state.user,
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);