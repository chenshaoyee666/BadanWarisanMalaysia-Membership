-- FIXED: Include the 'id' column in writes to members_csv_export
-- This fixes the "null value in column id" error.

CREATE OR REPLACE FUNCTION public.handle_new_user_membership()
RETURNS TRIGGER 
SECURITY DEFINER 
SET search_path = public
AS $$
DECLARE
  new_member_id TEXT;
BEGIN
  BEGIN
    -- 1. Generate ID
    new_member_id := 'BWM-' || nextval('member_id_seq');

    -- 2. Insert into memberships
    INSERT INTO public.memberships (user_id, membership_number, tier, status)
    VALUES (NEW.id, new_member_id, 'Ordinary Member', 'Active');
    
    -- 3. Insert into members_csv_export (Now includes ID)
    INSERT INTO public.members_csv_export (
      "id", -- We assume this col exists based on the error
      "Member ID", 
      "Full Name", 
      "Email", 
      "Phone Number"
    )
    VALUES (
      NEW.id, -- Use the User ID as the Primary Key
      new_member_id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'phone_number'
    );
    
  EXCEPTION WHEN OTHERS THEN
    RAISE WARNING 'Trigger failed: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Backfill Script (Fixed)
DO $$
DECLARE
  mem_rec RECORD;
  user_email TEXT;
  user_name TEXT;
  user_phone TEXT;
BEGIN
  FOR mem_rec IN SELECT * FROM public.memberships LOOP
    
    -- Check if missing
    IF NOT EXISTS (SELECT 1 FROM public.members_csv_export WHERE "Member ID" = mem_rec.membership_number) THEN
      
      SELECT email, raw_user_meta_data->>'full_name', raw_user_meta_data->>'phone_number'
      INTO user_email, user_name, user_phone
      FROM auth.users
      WHERE id = mem_rec.user_id;

      -- Insert with ID
      INSERT INTO public.members_csv_export (
        "id", 
        "Member ID", 
        "Full Name", 
        "Email", 
        "Phone Number"
      )
      VALUES (
        mem_rec.user_id, -- Use user_id for the id column
        mem_rec.membership_number, 
        user_name, 
        user_email, 
        user_phone
      );
      
    END IF;
  END LOOP;
END;
$$;
