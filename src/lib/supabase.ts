import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create a more defensive Supabase client
let supabase: ReturnType<typeof createClient>;

try {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables. Some features may not work.');
    // Create a dummy client to prevent app crashes
    supabase = createClient('https://dummy.supabase.co', 'dummy-key');
  } else {
    // Validate URL format
    new URL(supabaseUrl);
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a dummy client to prevent app crashes
  supabase = createClient('https://dummy.supabase.co', 'dummy-key');
}

export { supabase };

// Storage bucket names
export const STORAGE_BUCKETS = {
  COMPANY_LOGOS: 'company-logos',
  PROFILE_AVATARS: 'profile-avatars',
  DOCUMENTS: 'documents'
} as const;