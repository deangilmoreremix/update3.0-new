import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../../types/database.types';

// Singleton pattern to prevent multiple Supabase client instances
class SupabaseManager {
  private static instance: SupabaseManager;
  private client: SupabaseClient<Database> | null = null;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): SupabaseManager {
    if (!SupabaseManager.instance) {
      SupabaseManager.instance = new SupabaseManager();
    }
    return SupabaseManager.instance;
  }

  public getClient(): SupabaseClient<Database> {
    if (!this.client || !this.isInitialized) {
      this.initializeClient();
    }
    return this.client!;
  }

  private initializeClient(): void {
    if (this.isInitialized) return;

    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

    // Only warn if in development mode
    if ((!supabaseUrl || supabaseUrl === 'https://placeholder.supabase.co') && import.meta.env.DEV) {
      console.warn('Supabase environment variables not configured. Some features may not work.');
    }

    this.client = createClient<Database>(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'smart-crm-auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      },
      global: {
        headers: {
          'X-Client-Info': 'smart-crm-dashboard',
        },
      },
    });

    this.isInitialized = true;
  }

  public resetClient(): void {
    this.client = null;
    this.isInitialized = false;
  }
}

// Export the singleton instance
export const supabaseManager = SupabaseManager.getInstance();
export const supabase = supabaseManager.getClient();

// Helper to validate UUID format
export const isValidUUID = (uuid: string): boolean => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
