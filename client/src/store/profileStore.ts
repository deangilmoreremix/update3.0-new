import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../services/supabaseClient';
import { UserProfile } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ProfileState {
  profile: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchProfile: () => Promise<void>;
  updateProfile: (profileData: Partial<UserProfile>) => Promise<void>;
  uploadAvatar: (file: File) => Promise<string>;
  deleteAvatar: () => Promise<void>;
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
          // Get current user
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('No authenticated user found');
          }
          
          // Fetch user profile from the users table
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userData.user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            const profile: UserProfile = {
              id: data.id,
              fullName: data.full_name,
              email: userData.user.email,
              avatarUrl: data.avatar_url,
              jobTitle: data.job_title,
              company: data.company,
              phone: data.phone,
              timezone: data.timezone,
              preferences: data.preferences || {},
              socialLinks: data.social_links || {},
              createdAt: data.created_at ? new Date(data.created_at) : undefined,
              accountStatus: data.account_status || 'active'
            };
            
            set({ profile, isLoading: false });
          } else {
            // If no profile exists, create one
            const { error: createError } = await supabase
              .from('users')
              .insert([{ 
                id: userData.user.id,
                full_name: userData.user.user_metadata?.full_name || ''
              }]);
              
            if (createError) throw createError;
            
            const defaultProfile: UserProfile = {
              id: userData.user.id,
              fullName: userData.user.user_metadata?.full_name || '',
              email: userData.user.email,
              accountStatus: 'active'
            };
            
            set({ profile: defaultProfile, isLoading: false });
          }
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
          // Get current user
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('No authenticated user found');
          }
          
          // Convert to Supabase format
          const supabaseData: Record<string, any> = {};
          
          if (profileData.fullName !== undefined) supabaseData.full_name = profileData.fullName;
          if (profileData.avatarUrl !== undefined) supabaseData.avatar_url = profileData.avatarUrl;
          if (profileData.jobTitle !== undefined) supabaseData.job_title = profileData.jobTitle;
          if (profileData.company !== undefined) supabaseData.company = profileData.company;
          if (profileData.phone !== undefined) supabaseData.phone = profileData.phone;
          if (profileData.timezone !== undefined) supabaseData.timezone = profileData.timezone;
          if (profileData.preferences !== undefined) supabaseData.preferences = profileData.preferences;
          if (profileData.socialLinks !== undefined) supabaseData.social_links = profileData.socialLinks;
          if (profileData.accountStatus !== undefined) supabaseData.account_status = profileData.accountStatus;
          
          // Update in Supabase
          const { data, error } = await supabase
            .from('users')
            .update(supabaseData)
            .eq('id', userData.user.id)
            .select()
            .single();
          
          if (error) throw error;
          
          // Update local state
          if (data) {
            const { profile } = get();
            
            const updatedProfile: UserProfile = {
              ...profile!,
              ...profileData
            };
            
            set({ profile: updatedProfile, isLoading: false });
          }
        } catch (err) {
          console.error('Error updating profile:', err);
          set({ 
            isLoading: false, 
            error: err instanceof Error ? err.message : 'Failed to update profile' 
          });
        }
      },
      
      uploadAvatar: async (file: File) => {
        set({ isLoading: true, error: null });
        
        try {
          // Get current user
          const { data: userData } = await supabase.auth.getUser();
          if (!userData.user) {
            throw new Error('No authenticated user found');
          }
          
          const userId = userData.user.id;
          
          // Create a unique file name
          const fileExt = file.name.split('.').pop();
          const fileName = `${userId}/${uuidv4()}.${fileExt}`;
          const filePath = `${fileName}`;
          
          // Upload to Supabase Storage
          const { error: uploadError, data } = await supabase
            .storage
            .from('avatars')
            .upload(filePath, file, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data: urlData } = supabase
            .storage
            .from('avatars')
            .getPublicUrl(filePath);
            
          const publicUrl = urlData.publicUrl;
          
          // Update the user profile with the avatar URL
          await get().updateProfile({ avatarUrl: publicUrl });
          
          set({ isLoading: false });
          
          return publicUrl;
        } catch (err) {
          console.error('Error uploading avatar:', err);
          set({ 
            isLoading: false, 
            error: err instanceof Error ? err.message : 'Failed to upload avatar' 
          });
          throw err;
        }
      },
      
      deleteAvatar: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { profile } = get();
          if (!profile || !profile.avatarUrl) {
            set({ isLoading: false });
            return;
          }
          
          // Extract the file path from the URL
          const url = new URL(profile.avatarUrl);
          const pathSegments = url.pathname.split('/');
          const fileName = pathSegments[pathSegments.length - 1];
          const userId = profile.id;
          const filePath = `${userId}/${fileName}`;
          
          // Delete from Supabase Storage
          const { error } = await supabase
            .storage
            .from('avatars')
            .remove([filePath]);
            
          if (error) throw error;
          
          // Update the profile
          await get().updateProfile({ avatarUrl: undefined });
          
          set({ isLoading: false });
        } catch (err) {
          console.error('Error deleting avatar:', err);
          set({ 
            isLoading: false, 
            error: err instanceof Error ? err.message : 'Failed to delete avatar' 
          });
        }
      }
    }),
    {
      name: 'profile-storage',
      partialize: (state) => ({ profile: state.profile }),
    }
  )
);