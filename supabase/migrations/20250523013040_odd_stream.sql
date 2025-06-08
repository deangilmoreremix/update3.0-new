/*
  # Fix Authentication Schema

  This migration ensures proper authentication configuration for the Supabase project.

  1. Changes
    - Ensures users table has correct foreign key relationship with auth.users
    - Adds proper RLS policies for authentication
    - Ensures all tables have proper user_id foreign key references
    - Fixes any missing or incorrect schema elements for auth

  2. Security
    - Properly configures Row Level Security policies
    - Ensures authenticated users can only access their own data
*/

-- First, ensure users profile table exists and has correct structure
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT,
  account_status TEXT DEFAULT 'active'
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Ensure proper RLS policies for users table
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
  FOR ALL
  USING (auth.uid() = id);

-- Make sure contacts table has proper foreign key
ALTER TABLE contacts 
  DROP CONSTRAINT IF EXISTS contacts_user_id_fkey,
  ADD CONSTRAINT contacts_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Ensure deals table has proper user_id reference
ALTER TABLE deals
  DROP CONSTRAINT IF EXISTS deals_user_id_fkey,
  ADD CONSTRAINT deals_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically create user profile when a new auth user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Ensure existing auth users have corresponding profiles
INSERT INTO public.users (id, full_name)
SELECT id, raw_user_meta_data->>'full_name'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.users)
ON CONFLICT (id) DO NOTHING;