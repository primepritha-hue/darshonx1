
ALTER TABLE public.site_settings
  ADD COLUMN chatbot_name text NOT NULL DEFAULT 'Portfolio AI',
  ADD COLUMN chatbot_api_provider text NOT NULL DEFAULT 'lovable';
