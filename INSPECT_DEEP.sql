-- Check if it is a View or Table
SELECT table_name, table_type 
FROM information_schema.tables 
WHERE table_name = 'members_csv_export';

-- Check for Triggers on this table
SELECT trigger_name, event_manipulation, action_statement
FROM information_schema.triggers
WHERE event_object_table = 'members_csv_export';

-- Check constraints (Foreign Keys check)
SELECT conname, contype, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'public.members_csv_export'::regclass;
