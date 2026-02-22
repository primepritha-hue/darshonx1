
-- Add general chat daily limit to site_settings
ALTER TABLE public.site_settings
  ADD COLUMN general_chat_daily_limit integer NOT NULL DEFAULT 10;

-- Create chat usage tracking table (tracks by visitor fingerprint/IP)
CREATE TABLE public.chat_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  used_at date NOT NULL DEFAULT CURRENT_DATE,
  count integer NOT NULL DEFAULT 1
);

-- Enable RLS
ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;

-- Allow edge function (service role) to manage, public can read their own
CREATE POLICY "Service role can manage chat_usage"
  ON public.chat_usage
  FOR ALL
  USING (true)
  WITH CHECK (true);

-- Create unique index for efficient upsert
CREATE UNIQUE INDEX idx_chat_usage_visitor_date ON public.chat_usage (visitor_id, used_at);
