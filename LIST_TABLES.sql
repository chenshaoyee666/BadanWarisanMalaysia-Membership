-- List all tables in the public schema
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Also check count of the specific tables we are discussing
SELECT 'memberships' as table_name, count(*) FROM public.memberships
UNION ALL
SELECT 'members_csv_export' as table_name, count(*) as count FROM public.members_csv_export;
