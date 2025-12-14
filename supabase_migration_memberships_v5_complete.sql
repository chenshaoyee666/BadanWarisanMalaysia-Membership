-- Run this if your 'memberships' table is missing or incomplete

-- 1. Create Table (if not exists)
CREATE TABLE IF NOT EXISTS memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  tier TEXT NOT NULL, -- e.g. 'Ordinary Member', 'Student Member', 'Corporate Member'
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Enable RLS
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;

-- 3. Add Policy (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memberships' AND policyname = 'Users can view their own membership') THEN
        CREATE POLICY "Users can view their own membership" ON memberships FOR SELECT USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'memberships' AND policyname = 'Users can insert their own membership') THEN
        CREATE POLICY "Users can insert their own membership" ON memberships FOR INSERT WITH CHECK (auth.uid() = user_id);
    END IF;
END $$;

-- ========================================
-- Migration: Add Custom Membership Numbers
-- Format: BWM-0001, BWM-0002, etc.
-- ========================================

-- a. Add the membership_number column
ALTER TABLE memberships 
ADD COLUMN IF NOT EXISTS membership_number TEXT UNIQUE;

-- b. Create a sequence for generating sequential numbers
-- START WITH 1 means the first number will be 1
CREATE SEQUENCE IF NOT EXISTS membership_number_seq START WITH 1 INCREMENT BY 1;

-- c. Create a function to generate the membership number
-- This runs automatically before each insert
CREATE OR REPLACE FUNCTION generate_membership_number()
RETURNS TRIGGER AS $$
BEGIN
  -- Only generate if membership_number is not already set
  IF NEW.membership_number IS NULL THEN
    NEW.membership_number := 'BWM-' || LPAD(nextval('membership_number_seq')::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 4. Drop trigger if it exists (for re-running migration)
DROP TRIGGER IF EXISTS set_membership_number ON memberships;

-- 5. Create the trigger that auto-generates membership numbers
CREATE TRIGGER set_membership_number
BEFORE INSERT ON memberships
FOR EACH ROW
EXECUTE FUNCTION generate_membership_number();

-- 6. OPTIONAL: Backfill existing memberships that don't have a number
-- This generates numbers for any existing rows
UPDATE memberships
SET membership_number = 'BWM-' || LPAD(nextval('membership_number_seq')::TEXT, 4, '0')
WHERE membership_number IS NULL;

-- ========================================
-- VERIFICATION
-- After running this migration, test with:
-- 
-- INSERT INTO memberships (user_id, full_name, tier, status)
-- VALUES ('test-uuid', 'Test User', 'Ordinary Member', 'active');
--
-- SELECT membership_number FROM memberships ORDER BY created_at DESC LIMIT 5;
-- Should show: BWM-0001, BWM-0002, etc.
-- ========================================


-- 4. Add Columns (Idempotent - checks if they exist first)
DO $$ 
BEGIN 
    -- V2 Columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'ic_number') THEN
        ALTER TABLE memberships ADD COLUMN ic_number TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'payment_reference') THEN
        ALTER TABLE memberships ADD COLUMN payment_reference TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'full_name') THEN
        ALTER TABLE memberships ADD COLUMN full_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'email') THEN
        ALTER TABLE memberships ADD COLUMN email TEXT;
    END IF;

    -- V3 Columns (Survey)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'date_of_birth') THEN
        ALTER TABLE memberships ADD COLUMN date_of_birth DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'profession') THEN
        ALTER TABLE memberships ADD COLUMN profession TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'student_email') THEN
        ALTER TABLE memberships ADD COLUMN student_email TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'education_level') THEN
        ALTER TABLE memberships ADD COLUMN education_level TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'interests') THEN
        ALTER TABLE memberships ADD COLUMN interests TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'other_interest') THEN
        ALTER TABLE memberships ADD COLUMN other_interest TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'referral_sources') THEN
        ALTER TABLE memberships ADD COLUMN referral_sources TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'other_referral_source') THEN
        ALTER TABLE memberships ADD COLUMN other_referral_source TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'volunteer_interest') THEN
        ALTER TABLE memberships ADD COLUMN volunteer_interest BOOLEAN;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'volunteer_areas') THEN
        ALTER TABLE memberships ADD COLUMN volunteer_areas TEXT[];
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'other_volunteer_area') THEN
        ALTER TABLE memberships ADD COLUMN other_volunteer_area TEXT;
    END IF;

    -- V4 Columns (Corporate)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'company_name') THEN
        ALTER TABLE memberships ADD COLUMN company_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'company_roc') THEN
        ALTER TABLE memberships ADD COLUMN company_roc TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'company_phone') THEN
        ALTER TABLE memberships ADD COLUMN company_phone TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'company_fax') THEN
        ALTER TABLE memberships ADD COLUMN company_fax TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'representative_name') THEN
        ALTER TABLE memberships ADD COLUMN representative_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'memberships' AND column_name = 'representative_designation') THEN
        ALTER TABLE memberships ADD COLUMN representative_designation TEXT;
    END IF;

END $$;
