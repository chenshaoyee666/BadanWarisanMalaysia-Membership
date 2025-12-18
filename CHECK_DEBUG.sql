-- 1. Check total count of memberships
SELECT count(*) as total_memberships FROM public.memberships;

-- 2. Show the most recent 5 memberships
SELECT * FROM public.memberships ORDER BY created_at DESC LIMIT 5;

-- 3. Check if the Sequence is working (should be > 5000)
SELECT last_value FROM member_id_seq;
