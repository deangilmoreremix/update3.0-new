import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabaseClient';
import { useProfileStore } from './profileStore';

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user: User;
}

interface AuthState {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setUser: (user: User | null) => void;
  setSession: (session: Session | null) => void;
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
      session: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      
      setUser: (user) => {
        set({ 
          user,
          isAuthenticated: !!user
        });
      },
      
      setSession: (session) => {
        set({ session });
      },
      
      initializeAuth: async () => {
        set({ isLoading: true });
        
        try {
          // Get the current session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }
          
          if (data.session) {
            set({
              user: data.session.user,
              session: data.session,
              isAuthenticated: true
            });
            
            // Initialize profile after successful authentication
            const profileStore = useProfileStore.getState();
            profileStore.fetchProfile();
          }
        } catch (error) {
          console.error('Error initializing auth:', error);
        } finally {
          set({ isLoading: false });
        }
        
        // Set up auth state change listener
        supabase.auth.onAuthStateChange((event, session) => {
          if (event === 'SIGNED_IN' && session) {
            set({
              user: session.user,
              session,
              isAuthenticated: true
            });
            
            // Initialize profile after sign-in
            const profileStore = useProfileStore.getState();
            profileStore.fetchProfile();
          } else if (event === 'SIGNED_OUT') {
            set({
              user: null,
              session: null,
              isAuthenticated: false
            });
          }
        });
      },
      
      login: async (email, password) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });
          
          if (error) {
            throw error;
          }
          
          if (data.user && data.session) {
            set({
              user: data.user,
              session: data.session,
              isAuthenticated: true,
              isLoading: false
            });
            
            // Initialize profile after login
            const profileStore = useProfileStore.getState();
            profileStore.fetchProfile();
          }
        } catch (error: any) {
          console.error('Error logging in:', error);
          set({ 
            error: error.message || 'An error occurred during login',
            isLoading: false
          });
          throw error;
        }
      },
      
      register: async (email, password, fullName) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
              data: {
                full_name: fullName,
              },
            },
          });
          
          if (error) {
            throw error;
          }
          
          if (data.user && data.session) {
            // Create user profile
            const { error: profileError } = await supabase
              .from('users')
              .insert([
                { 
                  id: data.user.id,
                  full_name: fullName,
                  account_status: 'active'
                }
              ]);
              
            if (profileError) {
              console.error('Error creating user profile:', profileError);
            }
            
            set({
              user: data.user,
              session: data.session,
              isAuthenticated: true,
              isLoading: false
            });
            
            // Initialize profile after registration
            const profileStore = useProfileStore.getState();
            profileStore.fetchProfile();
          } else {
            // Email confirmation might be required
            set({
              isLoading: false,
              error: 'Please check your email to confirm your account'
            });
          }
        } catch (error: any) {
          console.error('Error registering:', error);
          set({ 
            error: error.message || 'An error occurred during registration',
            isLoading: false
          });
          throw error;
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase.auth.signOut();
          
          if (error) {
            throw error;
          }
          
          set({
            user: null,
            session: null,
            isAuthenticated: false,
            isLoading: false
          });
        } catch (error: any) {
          console.error('Error logging out:', error);
          set({ 
            error: error.message || 'An error occurred during logout',
            isLoading: false
          });
        }
      },
      
      clearError: () => set({ error: null }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        session: state.session,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);