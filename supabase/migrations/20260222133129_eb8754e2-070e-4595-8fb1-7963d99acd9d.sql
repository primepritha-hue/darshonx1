
ALTER TABLE public.site_settings
  ADD COLUMN brand_name text NOT NULL DEFAULT 'Dev.folio',
  ADD COLUMN hero_tagline text NOT NULL DEFAULT '// developer.init()',
  ADD COLUMN contact_intro text NOT NULL DEFAULT 'Have a project in mind or just want to say hi? Feel free to reach out.',
  ADD COLUMN footer_text text NOT NULL DEFAULT '© 2026 — Crafted from the cosmos ✦',
  ADD COLUMN about_heading text NOT NULL DEFAULT 'Who Am I?',
  ADD COLUMN about_features jsonb NOT NULL DEFAULT '[{"title":"Clean Code","desc":"Writing maintainable, scalable code"},{"title":"Performance","desc":"Optimized for speed and efficiency"},{"title":"Modern UI","desc":"Crafting beautiful user experiences"}]';
