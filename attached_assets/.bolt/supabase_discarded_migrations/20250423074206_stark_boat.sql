/*
  # Create deals table

  1. New Tables
    - `deals`
      - `id` (uuid, primary key)
      - `title` (text, not null)
      - `value` (numeric, not null)
      - `stage` (text, not null)
      - `company` (text, not null)
      - `contact` (text, not null)
      - `contact_id` (uuid, nullable)
      - `probability` (numeric, default 0)
      - `notes` (text, nullable)
      - `created_at` (timestamptz, default now())
      - `updated_at` (timestamptz, default now())
      - `expected_close_date` (date, nullable)
      - `due_date` (date, nullable)
      - `lost_reason` (text, nullable)
      - `products` (text[], nullable)
      - `competitors` (text[], nullable)
      - `decision_makers` (text[], nullable)
      - `last_activity_date` (timestamptz, nullable)
      - `assigned_to` (uuid, nullable)
      - `currency` (text, default 'USD')
      - `discount_amount` (numeric, default 0)
      - `discount_percentage` (numeric, default 0)
      - `priority` (text, check constraint)
      - `next_steps` (text[], nullable)
      - `ai_insights` (jsonb, default '{}')
      - `days_in_stage` (integer, default 0)
      - `user_id` (uuid, not null)

  2. Security
    - Enable RLS on `deals` table
    - Add policy for authenticated users to perform all operations on their own deals
*/

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  value NUMERIC NOT NULL DEFAULT 0,
  stage TEXT NOT NULL CHECK (stage IN ('qualification', 'initial', 'negotiation', 'proposal', 'closed-won', 'closed-lost')),
  company TEXT NOT NULL,
  contact TEXT NOT NULL,
  contact_id UUID,
  probability NUMERIC DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  expected_close_date DATE,
  due_date DATE,
  lost_reason TEXT,
  products TEXT[],
  competitors TEXT[],
  decision_makers TEXT[],
  last_activity_date TIMESTAMPTZ,
  assigned_to UUID,
  currency TEXT DEFAULT 'USD',
  discount_amount NUMERIC DEFAULT 0,
  discount_percentage NUMERIC DEFAULT 0,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  next_steps TEXT[],
  ai_insights JSONB DEFAULT '{}',
  days_in_stage INTEGER DEFAULT 0,
  user_id UUID NOT NULL
);

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to update the updated_at column
DROP TRIGGER IF EXISTS update_deals_updated_at ON deals;
CREATE TRIGGER update_deals_updated_at
BEFORE UPDATE ON deals
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to see only their deals
CREATE POLICY "Users can view their own deals" 
ON deals FOR SELECT 
USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own deals
CREATE POLICY "Users can insert their own deals" 
ON deals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own deals
CREATE POLICY "Users can update their own deals" 
ON deals FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to delete their own deals
CREATE POLICY "Users can delete their own deals" 
ON deals FOR DELETE
USING (auth.uid() = user_id);

-- Create index for faster querying by user_id
CREATE INDEX deals_user_id_idx ON deals (user_id);

-- Create index for faster querying by stage
CREATE INDEX deals_stage_idx ON deals (stage);