-- ============================================================
-- 🚀 FULL DATABASE SETUP FOR PORTFOLIO WEBSITE
-- ============================================================
-- Run this SQL in your Supabase SQL Editor to set up the entire database.
-- This includes: Enums, Tables, Functions, RLS Policies, Storage Buckets,
-- and Default Data.
-- ============================================================

-- ============================================================
-- 1. ENUMS
-- ============================================================
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'user');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ============================================================
-- 2. TABLES
-- ============================================================

-- ---- Site Settings ----
CREATE TABLE IF NOT EXISTS public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Your Name',
  title text NOT NULL DEFAULT 'Full-Stack Developer',
  bio text DEFAULT '',
  email text DEFAULT '',
  phone text DEFAULT '',
  location text DEFAULT '',
  github_url text DEFAULT '',
  linkedin_url text DEFAULT '',
  brand_name text NOT NULL DEFAULT 'Dev.folio',
  hero_tagline text NOT NULL DEFAULT '// developer.init()',
  contact_intro text NOT NULL DEFAULT 'Have a project in mind or just want to say hi? Feel free to reach out.',
  footer_text text NOT NULL DEFAULT '© 2026 — Crafted from the cosmos ✦',
  about_heading text NOT NULL DEFAULT 'Who Am I?',
  about_features jsonb NOT NULL DEFAULT '[{"desc": "Writing maintainable, scalable code", "title": "Clean Code"}, {"desc": "Optimized for speed and efficiency", "title": "Performance"}, {"desc": "Crafting beautiful user experiences", "title": "Modern UI"}]'::jsonb,
  ai_prompt text NOT NULL DEFAULT 'You are a helpful portfolio AI assistant. Answer questions about the developer''s skills, projects, and experience. Be concise and friendly.',
  general_chat_daily_limit integer NOT NULL DEFAULT 10,
  chatbot_name text NOT NULL DEFAULT 'Portfolio AI',
  chatbot_api_provider text NOT NULL DEFAULT 'lovable',
  profile_image_url text,
  show_discord_profile boolean DEFAULT true,
  discord_username text,
  discord_avatar_url text,
  discord_status text,
  discord_badges text[] DEFAULT '{}'::text[],
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---- Skills ----
CREATE TABLE IF NOT EXISTS public.skills (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  level integer NOT NULL DEFAULT 50,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---- Skill Tags ----
CREATE TABLE IF NOT EXISTS public.skill_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---- Projects ----
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text DEFAULT '',
  tags text[] DEFAULT '{}'::text[],
  github_url text DEFAULT '',
  live_url text DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---- Social Links ----
CREATE TABLE IF NOT EXISTS public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL DEFAULT 'link',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---- Tools ----
CREATE TABLE IF NOT EXISTS public.tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'wrench',
  type text NOT NULL DEFAULT 'builtin',
  slug text,
  file_url text,
  file_name text,
  allow_download boolean NOT NULL DEFAULT true,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---- Chat Usage ----
CREATE TABLE IF NOT EXISTS public.chat_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id text NOT NULL,
  used_at date NOT NULL DEFAULT CURRENT_DATE,
  count integer NOT NULL DEFAULT 1
);

-- ---- User Roles ----
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- ============================================================
-- 3. FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- ============================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- 5. RLS POLICIES
-- ============================================================

-- ---- Site Settings ----
CREATE POLICY "Anyone can read site settings" ON public.site_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can modify site settings" ON public.site_settings
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- Skills ----
CREATE POLICY "Anyone can read skills" ON public.skills
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage skills" ON public.skills
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- Skill Tags ----
CREATE POLICY "Anyone can read skill tags" ON public.skill_tags
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage skill tags" ON public.skill_tags
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- Projects ----
CREATE POLICY "Anyone can read projects" ON public.projects
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can manage projects" ON public.projects
  FOR ALL TO authenticated
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- Social Links ----
CREATE POLICY "Anyone can view active social links" ON public.social_links
  FOR SELECT TO public USING (true);

CREATE POLICY "Admins can insert social links" ON public.social_links
  FOR INSERT TO public WITH CHECK (is_admin());

CREATE POLICY "Admins can update social links" ON public.social_links
  FOR UPDATE TO public USING (is_admin());

CREATE POLICY "Admins can delete social links" ON public.social_links
  FOR DELETE TO public USING (is_admin());

-- ---- Tools ----
CREATE POLICY "Anyone can read active tools" ON public.tools
  FOR SELECT TO public USING (is_active = true);

CREATE POLICY "Admins can manage tools" ON public.tools
  FOR ALL TO public
  USING (is_admin()) WITH CHECK (is_admin());

-- ---- Chat Usage ----
CREATE POLICY "Deny all direct access to chat_usage" ON public.chat_usage
  AS RESTRICTIVE FOR SELECT TO public USING (false);

-- ---- User Roles ----
CREATE POLICY "Admins can manage roles" ON public.user_roles
  FOR ALL TO authenticated USING (is_admin());

-- ============================================================
-- 6. STORAGE BUCKETS
-- ============================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('tool-files', 'tool-files', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies (public read)
CREATE POLICY "Public read tool-files" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'tool-files');

CREATE POLICY "Admin upload tool-files" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'tool-files' AND (SELECT is_admin()));

CREATE POLICY "Admin delete tool-files" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'tool-files' AND (SELECT is_admin()));

CREATE POLICY "Public read profile-images" ON storage.objects
  FOR SELECT TO public USING (bucket_id = 'profile-images');

CREATE POLICY "Admin upload profile-images" ON storage.objects
  FOR INSERT TO authenticated WITH CHECK (bucket_id = 'profile-images' AND (SELECT is_admin()));

CREATE POLICY "Admin delete profile-images" ON storage.objects
  FOR DELETE TO authenticated USING (bucket_id = 'profile-images' AND (SELECT is_admin()));

-- ============================================================
-- 7. DEFAULT DATA
-- ============================================================

-- Default site settings (insert only if empty)
INSERT INTO public.site_settings (name, title, bio, email, location, brand_name)
SELECT 'Your Name', 'Full-Stack Developer', 'A passionate developer.', 'hello@example.com', 'Earth', 'Dev.folio'
WHERE NOT EXISTS (SELECT 1 FROM public.site_settings);

-- Default skills
INSERT INTO public.skills (name, level, sort_order) VALUES
  ('JavaScript', 90, 1),
  ('TypeScript', 85, 2),
  ('React', 88, 3),
  ('Node.js', 80, 4),
  ('Tailwind CSS', 92, 5),
  ('Python', 75, 6)
ON CONFLICT DO NOTHING;

-- Default skill tags
INSERT INTO public.skill_tags (label, sort_order) VALUES
  ('Frontend Development', 1),
  ('Backend Development', 2),
  ('UI/UX Design', 3),
  ('Database Management', 4),
  ('API Development', 5),
  ('DevOps', 6)
ON CONFLICT DO NOTHING;

-- Default project
INSERT INTO public.projects (title, description, tags, sort_order) VALUES
  ('Portfolio Website', 'A modern developer portfolio built with React and Supabase.', ARRAY['React', 'TypeScript', 'Supabase'], 1)
ON CONFLICT DO NOTHING;

-- ============================================================
-- 8. ADMIN USER SETUP (Run after creating your auth user)
-- ============================================================
-- Replace 'YOUR_USER_UUID' with your actual auth user ID:
--
-- INSERT INTO public.user_roles (user_id, role)
-- VALUES ('YOUR_USER_UUID', 'admin');
--
-- ============================================================
-- ✅ SETUP COMPLETE!
-- ============================================================
