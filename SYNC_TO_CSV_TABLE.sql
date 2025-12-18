-- Update the trigger function to ALSO write to members_csv_export
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
    -- 1. Generate ID
    new_member_id := 'BWM-' || nextval('member_id_seq');

    -- 2. Insert into the MAIN table (public.memberships)
    INSERT INTO public.memberships (user_id, membership_number, tier, status)
    VALUES (NEW.id, new_member_id, 'Ordinary Member', 'Active');
    
    -- 3. Insert into the LEGACY/EXPORT table (members_csv_export)
    -- We use double quotes because the column names have spaces
    INSERT INTO public.members_csv_export (
      "Member ID", 
      "Full Name", 
      "Email", 
      "Phone Number"
    )
    VALUES (
      new_member_id,
      NEW.raw_user_meta_data->>'full_name',
      NEW.email,
      NEW.raw_user_meta_data->>'phone_number'
    );
    
  EXCEPTION WHEN OTHERS THEN
    -- Log warning but don't break signup
    RAISE WARNING 'Trigger failed: %', SQLERRM;
  END;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- No need to recreate the trigger, updating the function is enough.
-- But we can verify the backfill logic if you want to sync OLD users too.
-- (This block below syncs existing users who are in memberships but NOT in csv_export)
DO $$
DECLARE
  mem_rec RECORD;
  user_email TEXT;
  user_name TEXT;
  user_phone TEXT;
BEGIN
  -- Loop through existing memberships
  FOR mem_rec IN SELECT * FROM public.memberships LOOP
    
    -- Check if missing from csv_export
    IF NOT EXISTS (SELECT 1 FROM public.members_csv_export WHERE "Member ID" = mem_rec.membership_number) THEN
      
      -- Fetch user details from auth.users
      SELECT email, raw_user_meta_data->>'full_name', raw_user_meta_data->>'phone_number'
      INTO user_email, user_name, user_phone
      FROM auth.users
      WHERE id = mem_rec.user_id;

      -- Insert into csv_export
      INSERT INTO public.members_csv_export (
        "Member ID", "Full Name", "Email", "Phone Number"
      )
      VALUES (
        mem_rec.membership_number, user_name, user_email, user_phone
      );
      
    END IF;
  END LOOP;
END;
$$;
