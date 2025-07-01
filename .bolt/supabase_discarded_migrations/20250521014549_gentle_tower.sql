/*
  # Contact Management System Migration

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
      - `company` (text)
      - `position` (text) 
      - `industry` (text)
      - `location` (text)
      - `score` (integer)

  2. Security
    - Enable RLS on `contacts` table
    - Create policies for authenticated users to manage their own contacts
*/

-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  favorite BOOLEAN DEFAULT false,
  last_contact TIMESTAMPTZ,
  notes TEXT,
  industry TEXT,
  location TEXT,
  score INTEGER,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS contacts_user_id_idx ON contacts(user_id);
CREATE INDEX IF NOT EXISTS contacts_email_idx ON contacts(email);
CREATE INDEX IF NOT EXISTS contacts_name_idx ON contacts(name);

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update the updated_at column
DROP TRIGGER IF EXISTS update_contacts_updated_at ON contacts;
CREATE TRIGGER update_contacts_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their contacts
CREATE POLICY "Users can view their own contacts" 
ON contacts FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own contacts
CREATE POLICY "Users can insert their own contacts" 
ON contacts FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own contacts
CREATE POLICY "Users can update their own contacts" 
ON contacts FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own contacts
CREATE POLICY "Users can delete their own contacts" 
ON contacts FOR DELETE
USING (auth.uid() = user_id);