/*
  # Contact Management System

  1. New Tables
    - `contacts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `name` (text, not null)
      - `email` (text, with email format validation)
      - `phone` (text)
      - `notes` (text)
      - `favorite` (boolean, default false)
      - `last_contacted` (timestamp)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    - `users` (optional profile table)
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp)
      - `full_name` (text)
      - `account_status` (text, default 'active')

  2. Security
    - Enable RLS on `contacts` table
    - Enable RLS on `users` table
    - Create policies for authenticated users to manage their own contacts
    - Create policies for users to view their own profile
    - Set up storage configuration with RLS
*/

-- Create users table (optional)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP DEFAULT now(),
  full_name TEXT,
  account_status TEXT DEFAULT 'active'
);

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
  phone TEXT,
  notes TEXT,
  favorite BOOLEAN DEFAULT false,
  last_contacted TIMESTAMP,
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- Add index for faster user-specific queries
CREATE INDEX contacts_user_id_idx ON contacts(user_id);

-- Create updated_at trigger function if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update the updated_at column when contacts are updated
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Configure row-level security for contacts
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy for contacts
CREATE POLICY "Users can manage their own contacts"
ON contacts
FOR ALL
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Configure row-level security for users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policy for users
CREATE POLICY "Users can view their own profile"
ON users
FOR ALL
USING (auth.uid() = id);

-- Create storage bucket for contact attachments
INSERT INTO storage.buckets (id, name)
VALUES ('contact_attachments', 'Contact Attachments')
ON CONFLICT (id) DO NOTHING;

-- Set up storage RLS
CREATE POLICY "Users can manage their contact attachments"
ON storage.objects
FOR ALL
USING (auth.uid()::text = (storage.foldername(name))[1]);