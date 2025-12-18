-- Add campaign_id column to donations table
ALTER TABLE public.donations 
ADD COLUMN IF NOT EXISTS campaign_id TEXT;

-- Create an index to make summing calculations faster
CREATE INDEX IF NOT EXISTS idx_donations_campaign_id ON public.donations(campaign_id);
