/*
  # Add missing columns to contacts table

  1. New Columns
    - `company` (text, nullable) - Company name for the contact
    - `position` (text, nullable) - Job position/title for the contact

  2. Changes
    - Adds company and position columns to support the application's contact management features
    - These columns are nullable to maintain compatibility with existing data

  3. Security
    - No changes to RLS policies needed as these are just additional data fields
*/

-- Add company column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'company'
  ) THEN
    ALTER TABLE contacts ADD COLUMN company text;
  END IF;
END $$;

-- Add position column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contacts' AND column_name = 'position'
  ) THEN
    ALTER TABLE contacts ADD COLUMN position text;
  END IF;
END $$;

-- Create index on company for faster filtering
CREATE INDEX IF NOT EXISTS contacts_company_idx ON contacts (company);

-- Create index on position for faster filtering
CREATE INDEX IF NOT EXISTS contacts_position_idx ON contacts (position);