import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useAuthStore } from './authStore';

interface UserProfile {
  id: string;
  fullName?: string;
  email?: string;
  avatarUrl?: string;
  jobTitle?: string;
  company?: string;
  phone?: string;
  timezone?: string;
  preferences?: unknown;
  socialLinks?: unknown;
}

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      profile: null,
      isLoading: false,
      error: null,
      
      fetchProfile: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Get current user from auth store
          const authState = useAuthStore.getState();
          const currentUser = authState.user;
          
          if (!currentUser) {
            throw new Error('No authenticated user found');
          }
          
          // Create profile from current user data
          const profile: UserProfile = {
            id: currentUser.id,
            fullName: currentUser.fullName || '',
            email: currentUser.email || '',
            avatarUrl: currentUser.avatarUrl,
            jobTitle: currentUser.jobTitle,
            company: currentUser.company,
            phone: currentUser.phone,
            timezone: currentUser.timezone,
            preferences: currentUser.preferences || {},
            socialLinks: currentUser.socialLinks || {}
          };
          
          set({ profile, isLoading: false });
        } catch (err) {
          console.error('Error fetching profile:', err);
          set({ 
            isLoading: false, 
            error: err instanceof Error ? err.message : 'Failed to fetch profile' 
          });
        }
      },
      
      updateProfile: async (profileData: Partial<UserProfile>) => {
        set({ isLoading: true, error: null });
        
        try {
          // Update local state
          const { profile } = get();
          
          const updatedProfile: UserProfile = {
            ...profile!,
            ...profileData
          };
          
          set({ profile: updatedProfile, isLoading: false });
        } catch (err) {
          console.error('Error updating profile:', err);
          set({ 
            isLoading: false, 
            error: err instanceof Error ? err.message : 'Failed to update profile' 
          });
        }
      },
      
      clearProfile: () => {
        set({ profile: null, error: null });
      }
    }),
    {
      name: 'profile-store',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);