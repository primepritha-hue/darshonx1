
-- Social links table for admin to manage
CREATE TABLE public.social_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  url text NOT NULL,
  icon text NOT NULL DEFAULT 'link',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;

-- Anyone can view active links
CREATE POLICY "Anyone can view active social links"
ON public.social_links FOR SELECT USING (true);

-- Only admins can manage
CREATE POLICY "Admins can insert social links"
ON public.social_links FOR INSERT WITH CHECK (public.is_admin());

CREATE POLICY "Admins can update social links"
ON public.social_links FOR UPDATE USING (public.is_admin());

CREATE POLICY "Admins can delete social links"
ON public.social_links FOR DELETE USING (public.is_admin());

-- Add discord profile fields to site_settings
ALTER TABLE public.site_settings
ADD COLUMN discord_username text,
ADD COLUMN discord_avatar_url text,
ADD COLUMN discord_status text,
ADD COLUMN discord_badges text[] DEFAULT '{}',
ADD COLUMN show_discord_profile boolean DEFAULT true;

-- Insert some default social links
INSERT INTO public.social_links (name, url, icon, sort_order) VALUES
  ('Discord', 'https://discord.gg/', 'discord', 0),
  ('Telegram', 'https://t.me/', 'send', 1),
  ('Spotify', 'https://spotify.com/', 'music', 2),
  ('GitHub', 'https://github.com/', 'github', 3),
  ('Instagram', 'https://instagram.com/', 'instagram', 4);
