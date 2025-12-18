-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. SEQUENCE
-- Restart at 5000 to avoid conflicts with any existing IDs (e.g. BWM-1001)
CREATE SEQUENCE IF NOT EXISTS member_id_seq;
ALTER SEQUENCE member_id_seq RESTART WITH 5000;
GRANT USAGE, SELECT ON SEQUENCE member_id_seq TO postgres, authenticated, service_role, anon;

-- 3. TABLE
CREATE TABLE IF NOT EXISTS public.memberships (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  membership_number TEXT UNIQUE NOT NULL,
  tier TEXT DEFAULT 'Ordinary Member',
  status TEXT DEFAULT 'Active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  CONSTRAINT unique_user_membership UNIQUE (user_id)
);

-- Fix default value just in case it was broken before
ALTER TABLE public.memberships ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- Perms
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
GRANT ALL ON TABLE public.memberships TO postgres, authenticated, service_role, anon;

-- Policies (Re-create)
DROP POLICY IF EXISTS "Users can view their own membership" ON public.memberships;
CREATE POLICY "Users can view their own membership" ON public.memberships
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own membership" ON public.memberships;
CREATE POLICY "Users can update their own membership" ON public.memberships
  FOR UPDATE USING (auth.uid() = user_id);

-- 4. FUNCTION (With search_path safety)
CREATE OR REPLACE FUNCTION public.handle_new_user_membership()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  new_member_id TEXT;
BEGIN
  -- Safe block for TRIGGER execution
  BEGIN
    new_member_id := 'BWM-' || nextval('member_id_seq');

    INSERT INTO public.memberships (user_id, membership_number, tier, status)
    VALUES (NEW.id, new_member_id, 'Ordinary Member', 'Active');
    
  EXCEPTION WHEN OTHERS THEN
    -- Log warning but don't break signup
    RAISE WARNING 'Trigger failed: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. TRIGGER
DROP TRIGGER IF EXISTS on_auth_user_created_membership ON auth.users;
CREATE TRIGGER on_auth_user_created_membership
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_membership();

-- 6. BACKFILL & TEST (NO ERROR INSTANTLY VISIBLE)
-- This block will run immediately when you click "RUN".
-- If this fails, IT WILL SHOW THE ERROR MESSAGE in the dashboard.
DO $$
DECLARE
  user_rec RECORD;
  new_member_id TEXT;
  count_processed INT := 0;
BEGIN
  FOR user_rec IN SELECT id FROM auth.users WHERE id NOT IN (SELECT user_id FROM public.memberships) LOOP
    new_member_id := 'BWM-' || nextval('member_id_seq');
    
    -- We removed the EXCEPTION block here so you can SEE the error if it fails!
    INSERT INTO public.memberships (user_id, membership_number, tier, status)
    VALUES (user_rec.id, new_member_id, 'Ordinary Member', 'Active');
    
    count_processed := count_processed + 1;
  END LOOP;
  
  RAISE NOTICE 'Successfully backfilled % users.', count_processed;
END;
$$;
