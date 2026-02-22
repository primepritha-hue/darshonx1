
-- Role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- User roles table
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Convenience function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.has_role(auth.uid(), 'admin')
$$;

-- Site settings (single row)
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Your Name',
  title TEXT NOT NULL DEFAULT 'Full-Stack Developer',
  bio TEXT DEFAULT '',
  email TEXT DEFAULT '',
  phone TEXT DEFAULT '',
  location TEXT DEFAULT '',
  github_url TEXT DEFAULT '',
  linkedin_url TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Skills table
CREATE TABLE public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 50 CHECK (level >= 0 AND level <= 100),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;

-- Projects table
CREATE TABLE public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  github_url TEXT DEFAULT '',
  live_url TEXT DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- RLS: user_roles
CREATE POLICY "Admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin());

-- RLS: site_settings - public read, admin write
CREATE POLICY "Anyone can read site settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admins can modify site settings" ON public.site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS: skills - public read, admin write
CREATE POLICY "Anyone can read skills" ON public.skills FOR SELECT USING (true);
CREATE POLICY "Admins can manage skills" ON public.skills FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- RLS: projects - public read, admin write
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Admins can manage projects" ON public.projects FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Insert default site settings row
INSERT INTO public.site_settings (name, title, bio, email, phone, location, github_url, linkedin_url)
VALUES ('Your Name', 'Full-Stack Developer', 'I''m a passionate full-stack developer who loves turning ideas into beautiful, functional digital experiences.', 'hello@example.com', '+880 1234-567890', 'Dhaka, Bangladesh', '#', '#');

-- Insert default skills
INSERT INTO public.skills (name, level, sort_order) VALUES
('React', 90, 1), ('TypeScript', 85, 2), ('Node.js', 80, 3), ('Python', 75, 4),
('Next.js', 85, 5), ('Tailwind CSS', 95, 6), ('PostgreSQL', 70, 7), ('Docker', 65, 8);

-- Insert default projects
INSERT INTO public.projects (title, description, tags, github_url, live_url, sort_order) VALUES
('E-Commerce Platform', 'A full-stack e-commerce app with payment integration, real-time inventory, and admin dashboard.', ARRAY['React','Node.js','Stripe','PostgreSQL'], '#', '#', 1),
('AI Chat Application', 'Real-time chat powered by AI with natural language processing and smart responses.', ARRAY['Next.js','OpenAI','WebSocket','TypeScript'], '#', '#', 2),
('Task Management System', 'Collaborative project management tool with drag-and-drop, real-time sync, and analytics.', ARRAY['React','Firebase','Tailwind','DnD'], '#', '#', 3),
('Portfolio CMS', 'Content management system for developers to showcase their work with admin controls.', ARRAY['TypeScript','Supabase','React','MDX'], '#', '#', 4);
