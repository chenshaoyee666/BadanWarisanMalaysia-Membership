-- Create a table for event registrations
CREATE TABLE IF NOT EXISTS public.event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    event_id INTEGER NOT NULL, -- Assuming event IDs are integers from your mock data
    event_title TEXT NOT NULL,
    event_date TEXT NOT NULL,
    event_location TEXT,
    event_image_url TEXT,
    registrant_name TEXT,
    registrant_email TEXT,
    registrant_phone TEXT,
    status TEXT DEFAULT 'registered',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own registrations" ON public.event_registrations
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can register themselves" ON public.event_registrations
    FOR INSERT WITH CHECK (auth.uid() = user_id);
