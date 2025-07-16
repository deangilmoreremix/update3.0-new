import { create } from 'zustand';
import { persist } from 'zustand/middleware';


interface AuthState {
  user: unknown | null;
  session: unknown | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  initializeAuth: () => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, _get) => ({
      // Default user for development
      user: { id: 'demo-user-123', email: 'demo@example.com' },
      session: { user: { id: 'demo-user-123' } },
      isAuthenticated: true, // Auto-authenticate for development
      isLoading: false,
      error: null,
      
      initializeAuth: async () => {
        // For development, we'll skip the actual auth check and just authenticate automatically
        set({ 
          isLoading: false,
          isAuthenticated: true,
          user: { id: 'demo-user-123', email: 'demo@example.com' },
          session: { user: { id: 'demo-user-123' } }
        });
      },
      
      login: async (email, _password) => {
        set({ isLoading: true, error: null });
        try {
          // In a real app, we'd verify credentials
          // For development, we'll just authenticate
          set({
            user: { id: 'demo-user-123', email },
            session: { user: { id: 'demo-user-123' } },
            isAuthenticated: true,
          });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message });
          } else {
            set({ error: 'An unknown error occurred' });
          }
        } finally {
          set({ isLoading: false });
        }
      },
      
      register: async (email, _password) => {
        set({ isLoading: true, error: null });
        try {
          // Skip actual registration
          set({
            user: { id: 'demo-user-123', email },
            session: { user: { id: 'demo-user-123' } },
            isAuthenticated: true,
          });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message });
          } else {
            set({ error: 'An unknown error occurred' });
          }
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          // For development, we'll skip the actual logout
          // In production, we'd call supabase.auth.signOut()
          
          // Redirect to dashboard instead of logging out
          set({
            isLoading: false,
            error: null,
          });
        } catch (error) {
          if (error instanceof Error) {
            set({ error: error.message });
          } else {
            set({ error: 'An unknown error occurred' });
          }
        } finally {
          set({ isLoading: false });
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