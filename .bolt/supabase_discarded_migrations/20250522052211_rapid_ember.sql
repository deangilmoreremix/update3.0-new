/*
  # Enhanced User Profiles with Avatar Support

  1. Changes
    - Add avatar_url field to users table
    - Add additional profile fields (job_title, company, phone, timezone, etc.)
    - Create storage bucket for user avatars
    - Set up RLS policies for avatar storage

  2. Security
    - Enable appropriate RLS policies for avatar storage
    - Only allow users to access their own avatars
*/

-- Add additional fields to the users profile table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS job_title TEXT,
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS timezone TEXT,
ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS social_links JSONB DEFAULT '{}';

-- Create a storage bucket for user avatars if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'User Avatars', false)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload avatar images
CREATE POLICY "Users can upload their own avatars"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update/delete their own avatar images
CREATE POLICY "Users can update/delete their own avatars"
ON storage.objects
FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to select/view their own avatar images
CREATE POLICY "Users can view their own avatars"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own avatar images
CREATE POLICY "Users can delete their own avatars"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars' AND 
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Update the handle_new_user function to include default values for new fields
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (
    id, 
    full_name, 
    avatar_url,
    job_title,
    company,
    phone,
    timezone,
    preferences,
    social_links
  )
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data->>'full_name',
    NULL,
    NEW.raw_user_meta_data->>'job_title',
    NEW.raw_user_meta_data->>'company',
    NEW.raw_user_meta_data->>'phone',
    NULL,
    '{}',
    '{}'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;