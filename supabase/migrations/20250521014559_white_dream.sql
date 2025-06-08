/*
  # Add Status Column to Contacts Table

  This migration adds the status column to the contacts table and sets a default value.
  
  1. Changes
     - Add `status` column with default value 'lead'
     - Create index on status column for better query performance
*/

-- Add status column
ALTER TABLE contacts ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'lead';

-- Create index for status column
CREATE INDEX IF NOT EXISTS contacts_status_idx ON contacts(status);