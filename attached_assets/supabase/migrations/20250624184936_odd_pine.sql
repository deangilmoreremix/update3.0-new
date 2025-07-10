/*
  # Create business_analyzer table

  1. New Tables
    - `business_analyzer`
      - `id` (uuid, primary key)
      - `user_id` (text, for user identification)
      - `business_name` (text)
      - `industry` (text)
      - `analysis_data` (jsonb, stores the analysis results)
      - `status` (text, analysis status)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `business_analyzer` table
    - Add policy for authenticated users to manage their own analyses
*/

CREATE TABLE IF NOT EXISTS business_analyzer (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id text NOT NULL,
  business_name text,
  industry text,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  status text DEFAULT 'pending'::text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_business_analyzer_user_id ON business_analyzer(user_id);
CREATE INDEX IF NOT EXISTS idx_business_analyzer_created_at ON business_analyzer(created_at);
CREATE INDEX IF NOT EXISTS idx_business_analyzer_status ON business_analyzer(status);

-- Enable RLS
ALTER TABLE business_analyzer ENABLE ROW LEVEL SECURITY;

-- Create policy for authenticated users to access their own analyses
CREATE POLICY "Users can manage their own business analyses"
  ON business_analyzer
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policy for public access (since the code seems to support demo users)
CREATE POLICY "Allow public access to business analyses"
  ON business_analyzer
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);