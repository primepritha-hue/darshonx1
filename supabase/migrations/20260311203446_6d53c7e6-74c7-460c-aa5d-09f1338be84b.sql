
CREATE TABLE public.skill_tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  label TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.skill_tags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active skill tags" ON public.skill_tags
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage skill tags" ON public.skill_tags
  FOR ALL TO authenticated USING (is_admin()) WITH CHECK (is_admin());

-- Insert default tags
INSERT INTO public.skill_tags (label, sort_order) VALUES
  ('🌐 Web Developer', 1),
  ('🎮 Gamer', 2),
  ('🎤 Voice Artist', 3),
  ('🎬 Video Editor', 4),
  ('🎨 UI/UX Designer', 5),
  ('🛒 Reselling Expert', 6),
  ('🚀 Digital Income Strategist', 7),
  ('💻 Frontend Specialist', 8);
