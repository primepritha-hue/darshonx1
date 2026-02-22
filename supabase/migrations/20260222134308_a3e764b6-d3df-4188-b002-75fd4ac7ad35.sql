
ALTER TABLE public.site_settings
  ADD COLUMN ai_prompt text NOT NULL DEFAULT 'You are a helpful portfolio AI assistant. Answer questions about the developer''s skills, projects, and experience. Be concise and friendly.';
