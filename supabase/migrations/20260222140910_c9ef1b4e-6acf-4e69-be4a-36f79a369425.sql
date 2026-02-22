
-- Tools table for admin-managed tools
CREATE TABLE public.tools (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  type text NOT NULL DEFAULT 'builtin' CHECK (type IN ('builtin', 'download')),
  slug text UNIQUE,
  icon text NOT NULL DEFAULT 'wrench',
  file_url text,
  file_name text,
  is_active boolean NOT NULL DEFAULT true,
  allow_download boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.tools ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read active tools"
  ON public.tools FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tools"
  ON public.tools FOR ALL USING (is_admin()) WITH CHECK (is_admin());

-- Insert default built-in tools
INSERT INTO public.tools (name, description, type, slug, icon, sort_order) VALUES
  ('PDF Generator', 'Create and download PDF documents', 'builtin', 'pdf', 'file-text', 0),
  ('QR Code', 'Generate QR codes from any text or URL', 'builtin', 'qr', 'qr-code', 1),
  ('Password Generator', 'Generate secure random passwords', 'builtin', 'password', 'key-round', 2),
  ('Location Tracker', 'Find your current coordinates', 'builtin', 'location', 'map-pin', 3);

-- Storage bucket for downloadable tool files
INSERT INTO storage.buckets (id, name, public) VALUES ('tool-files', 'tool-files', true);

CREATE POLICY "Anyone can read tool files"
  ON storage.objects FOR SELECT USING (bucket_id = 'tool-files');

CREATE POLICY "Admins can upload tool files"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'tool-files' AND public.is_admin());

CREATE POLICY "Admins can update tool files"
  ON storage.objects FOR UPDATE USING (bucket_id = 'tool-files' AND public.is_admin());

CREATE POLICY "Admins can delete tool files"
  ON storage.objects FOR DELETE USING (bucket_id = 'tool-files' AND public.is_admin());
